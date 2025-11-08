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

        return Created($"/notas/{nota.Id}", nota);
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
        var nota = _context.NotasFiscais.Include(n => n.Itens).FirstOrDefault(n => n.Id == id);
        if (nota == null) return NotFound("Nota não encontrada.");
        if (nota.Status == StatusNota.Fechada) return BadRequest("Nota já está fechada.");

        foreach (var item in nota.Itens)
        {
            try
            {
                var result = await _httpClient.PutAsJsonAsync(_estoqueServiceUrl, new
                {
                    Codigo = item.CodigoProduto,
                    Saldo = await ObterNovoSaldo(item.CodigoProduto, item.Quantidade)
                });

                if (!result.IsSuccessStatusCode)
                    return BadRequest("Erro ao atualizar estoque.");

            }
            catch
            {
                return StatusCode(503, "Serviço de estoque indisponível.");
            }
        }

        nota.Status = StatusNota.Fechada;
        _context.SaveChanges();

        return Ok(nota);
    }

    private async Task<int> ObterNovoSaldo(string codigo, int quantidade)
    {
        using var client = new HttpClient();
        var produtos = await client.GetFromJsonAsync<List<ProdutoDto>>("http://localhost:5201/produtos");
        var produto = produtos?.FirstOrDefault(p => p.Codigo == codigo);
        return (produto?.Saldo ?? 0) - quantidade;
    }
}

public class ProdutoDto
{
    public string Codigo { get; set; }
    public int Saldo { get; set; }
}
