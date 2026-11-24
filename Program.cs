
using Microsoft.EntityFrameworkCore;
using ApiLojaDeRoupa.Models;
using ApiLojaDeRoupa.Dtos;
using ApiLojaDeRoupa.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

var app = builder.Build();


app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Ocorreu um erro interno. Tente novamente mais tarde."
        });
    });
});


app.UseDefaultFiles();
app.UseStaticFiles();


app.MapPost("/api/produtos", async (ProdutoEntrada entrada, ApiDbContext db) =>
{
    var produto = new LojaDeRoupaEntity
    {
        Nome = entrada.Nome,
        Data = entrada.Data,
        Tipo = entrada.Tipo
    };

    db.Produtos.Add(produto);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/produtos/{produto.id}",
        produto
    );
});


app.MapGet("/api/produtos", async (ApiDbContext db) =>
{
    return await db.Produtos.ToListAsync();
});


app.MapGet("/api/produtos/{id:int}", async (int id, ApiDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(produto);
});


app.MapPut("/api/produtos/{id:int}", async (int id, ProdutoEntrada entrada, ApiDbContext db) =>
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
