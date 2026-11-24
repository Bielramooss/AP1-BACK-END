
using Microsoft.EntityFrameworkCore;
using ApiLojaDeRoupa.Models;

namespace ApiLojaDeRoupa.Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<LojaDeRoupaEntity> Produtos => Set<LojaDeRoupaEntity>();
}
