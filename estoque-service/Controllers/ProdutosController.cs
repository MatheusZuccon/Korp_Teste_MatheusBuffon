using Microsoft.AspNetCore.Mvc;
using estoque_service.Data;
using estoque_service.Models;

namespace estoque_service.Controllers;

[ApiController]
[Route("produtos")]
public class ProdutosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProdutosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var produtos = _context.Produtos.ToList();
        return Ok(produtos);
    }

    [HttpPost]
    public IActionResult Create(Produto produto)
    {
        if (string.IsNullOrWhiteSpace(produto.Codigo) ||
            string.IsNullOrWhiteSpace(produto.Descricao))
        {
            return BadRequest("Código e descrição são obrigatórios.");
        }

        _context.Produtos.Add(produto);
        _context.SaveChanges();

        return Created($"/produtos/{produto.Id}", produto);
    }

    [HttpPut("saldo")]
    public IActionResult AtualizarSaldo([FromBody] Produto produtoAtualizado)
    {
        var produto = _context.Produtos.FirstOrDefault(p => p.Codigo == produtoAtualizado.Codigo);

        if (produto == null)
            return NotFound("Produto não encontrado.");

        if (produtoAtualizado.Saldo < 0)
            return BadRequest("Saldo não pode ser negativo.");

        produto.Saldo = produtoAtualizado.Saldo;
        _context.SaveChanges();

        return Ok(produto);
    }

    [HttpGet("{codigo}")]
    public IActionResult ObterPorCodigo(string codigo)
    {
        var produto = _context.Produtos.FirstOrDefault(p => p.Codigo == codigo);

        if (produto == null)
        return NotFound("Produto não encontrado.");

    return Ok(produto);
    }
}
