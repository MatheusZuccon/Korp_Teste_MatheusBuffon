using Microsoft.EntityFrameworkCore;
using estoque_service.Models;

namespace estoque_service.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Produto> Produtos { get; set; }
    }
}
