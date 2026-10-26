using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

var app = builder.Build();

// Configuração para abrir o frontend da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// CREATE - Cadastrar produto
app.MapPost("/api/produtos", async (LojaDeRoupaEntity produto, ApiDbContext db) =>
{
    db.Produtos.Add(produto);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/produtos/{produto.id}",
        produto
    );
});

// READ - Listar produtos
app.MapGet("/api/produtos", async (ApiDbContext db) =>
{
    return await db.Produtos.ToListAsync();
});

// READ - Buscar produto por ID
app.MapGet("/api/produtos/{id:int}", async (int id, ApiDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(produto);
});

// UPDATE - Atualizar produto
app.MapPut("/api/produtos/{id:int}", async (int id, LojaDeRoupaEntity entrada, ApiDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound();
    }

    produto.Nome = entrada.Nome;
    produto.Data = entrada.Data;
    produto.Tipo = entrada.Tipo;

    await db.SaveChangesAsync();

    return Results.Ok(produto);
});

// DELETE - Excluir produto
app.MapDelete("/api/produtos/{id:int}", async (int id, ApiDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound();
    }

    db.Produtos.Remove(produto);

    await db.SaveChangesAsync();

    return Results.NoContent();
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