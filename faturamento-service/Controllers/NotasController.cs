using Microsoft.AspNetCore.Mvc;
using faturamento_service.Data;
using faturamento_service.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;

namespace faturamento_service.Controllers;

[ApiController]
[Route("notas")]
public class NotasController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly string _estoqueServiceUrl = "http://localhost:5201/produtos/saldo";

    public NotasController(AppDbContext context)
    {
        _context = context;
        _httpClient = new HttpClient();
    }

    [HttpGet]
    public IActionResult GetNotas()
    {
        var notas = _context.NotasFiscais.Include(n => n.Itens).ToList();
        return Ok(notas);
    }

    [HttpPost]
    public IActionResult CriarNota()
    {
        int numero = (_context.NotasFiscais.Any() ? _context.NotasFiscais.Max(n => n.Numero) : 0) + 1;

        var nota = new NotaFiscal { Numero = numero, Status = StatusNota.Aberta };
        _context.NotasFiscais.Add(nota);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetNotas), new { id = nota.Id }, nota);
    }

    [HttpPost("{id}/itens")]
    public IActionResult AdicionarItem(int id, [FromBody] NotaItem item)
    {
        var nota = _context.NotasFiscais.Include(n => n.Itens).FirstOrDefault(n => n.Id == id);
        if (nota == null) return NotFound("Nota não encontrada.");
        if (nota.Status == StatusNota.Fechada) return BadRequest("Nota já está fechada.");

        // Liga o item à nota
        item.NotaFiscalId = nota.Id;

        // Salva o item como pertencente à nota
        _context.NotaItens.Add(item);
        _context.SaveChanges();

        return Ok(nota);
    }

    [HttpPost("{id}/imprimir")]
public async Task<IActionResult> Imprimir(int id)
{
    try
    {
        var nota = _context.NotasFiscais
            .Include(n => n.Itens)
            .FirstOrDefault(n => n.Id == id);

        if (nota == null)
            return NotFound("Nota não encontrada.");
        if (nota.Status == StatusNota.Fechada)
            return BadRequest("Nota já está fechada.");

        foreach (var item in nota.Itens)
        {
            var produto = await _httpClient.GetFromJsonAsync<ProdutoDto>(
                $"http://localhost:5201/produtos/{item.CodigoProduto}"
            );

            if (produto == null)
                return BadRequest($"Produto {item.CodigoProduto} não existe no estoque.");

            if (produto.Saldo < item.Quantidade)
                return Conflict($"Saldo insuficiente para o produto {item.CodigoProduto}. Outro processo pode ter alterado o saldo.");

            var novoSaldo = produto.Saldo - item.Quantidade;

            var response = await _httpClient.PutAsJsonAsync(
                "http://localhost:5201/produtos/saldo",
                new { Codigo = item.CodigoProduto, Saldo = novoSaldo }
            );

            if (!response.IsSuccessStatusCode)
                return StatusCode(503, "Serviço de estoque indisponível ou conflito de atualização.");

            var produtoAtualizado = await _httpClient.GetFromJsonAsync<ProdutoDto>(
                $"http://localhost:5201/produtos/{item.CodigoProduto}"
            );

            if (produtoAtualizado == null || produtoAtualizado.Saldo < 0)
                return Conflict($"Conflito detectado: o produto {item.CodigoProduto} foi alterado simultaneamente.");
        }

        nota.Status = StatusNota.Fechada;
        _context.SaveChanges();

        return Ok(nota);
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"❌ Erro de comunicação com o serviço de estoque: {ex.Message}");
        return StatusCode(503, "Serviço de estoque indisponível.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro inesperado ao imprimir nota: {ex.Message}");
        return StatusCode(500, "Erro interno ao processar a nota fiscal.");
    }
}


public class ProdutoDto
{
    public string Codigo { get; set; }
    public int Saldo { get; set; }
}


    private async Task<int> ObterNovoSaldo(string codigo, int quantidade)
    {
        using var client = new HttpClient();
        var produtos = await client.GetFromJsonAsync<List<ProdutoDto>>("http://localhost:5201/produtos");
        var produto = produtos?.FirstOrDefault(p => p.Codigo == codigo);
        return (produto?.Saldo ?? 0) - quantidade;
    }
}


