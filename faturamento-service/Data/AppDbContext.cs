using Microsoft.EntityFrameworkCore;
using faturamento_service.Models;

namespace faturamento_service.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<NotaFiscal> NotasFiscais => Set<NotaFiscal>();
    public DbSet<NotaItem> NotaItens => Set<NotaItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NotaFiscal>()
            .HasMany(n => n.Itens)
            .WithOne(i => i.NotaFiscal)
            .HasForeignKey(i => i.NotaFiscalId);

        base.OnModelCreating(modelBuilder);
    }
}
