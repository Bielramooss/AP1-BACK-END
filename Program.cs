using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

var app = builder.Build();


// Rota inicial
app.MapGet("/", () => "API da Loja está no ar!");


// CREATE - Cadastrar produto no banco
app.MapPost("/api/produtos", async (LojaDeRoupaEntity produto, ApiDbContext db) =>
{
    db.Produtos.Add(produto);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/produtos/{produto.id}",
        produto
    );
});


// READ - Listar produtos do banco
app.MapGet("/api/produtos", async (ApiDbContext db) =>
{
    return await db.Produtos.ToListAsync();
});


app.Run();


// Model
class LojaDeRoupaEntity
{
    public int id { get; set; }

    public string Nome { get; set; }

    public string Data { get; set; }

    public string Tipo { get; set; }
}


// Banco de dados
class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<LojaDeRoupaEntity> Produtos => Set<LojaDeRoupaEntity>();
}