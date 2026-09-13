var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var produtos = new List<Produto>
{
    new Produto(1, "Camiseta Preta", true),
    new Produto(2, "Calça Jeans", false)
};

app.MapGet("/", () => "API da Loja está no ar!");

app.MapGet("/api/produtos", () =>
{
    return Results.Ok(produtos);
});

app.MapGet("/api/produtos/{id:int}", (int id) =>
{
    var produtoEncontrado = produtos.Find(produto => produto.id == id);

    if (produtoEncontrado is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(produtoEncontrado);
});

app.MapPost("/api/produtos", (ProdutoEntradaDTO dados) =>
{
    int proximoId = produtos.Count + 1;

    var novoProduto = new Produto(
        proximoId,
        dados.nome,
        dados.disponivel
    );

    produtos.Add(novoProduto);

    return Results.Created(
        $"/api/produtos/{novoProduto.id}",
        novoProduto
    );
});

app.MapPut("/api/produtos/{id:int}", (int id, ProdutoEntradaDTO dados) =>
{
    int indice = produtos.FindIndex(produtoDaLista => produtoDaLista.id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    var atualizado = new Produto(
        id,
        dados.nome,
        dados.disponivel
    );

    produtos[indice] = atualizado;

    return Results.Ok(atualizado);
});

app.MapDelete("/api/produtos/{id:int}", (int id) =>
{
    int indice = produtos.FindIndex(produtoDaLista => produtoDaLista.id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    produtos.RemoveAt(indice);

    return Results.NoContent();
});

app.Run();


record Produto(int id, string nome, bool disponivel);

//aqui temos o DTO completo com id
record ProdutoDTO(int id, string nome, bool disponivel);

//e aqui o DTO de entrada sem id
record ProdutoEntradaDTO(string nome, bool disponivel);