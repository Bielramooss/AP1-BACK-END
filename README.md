# API Loja de Roupas

## Sobre o projeto

Este projeto foi desenvolvido para a AP1 da disciplina.

A API representa uma loja de roupas e tem como recurso principal os produtos.  
Ela permite listar, buscar, cadastrar, atualizar e remover produtos.

O projeto foi desenvolvido utilizando C# com ASP.NET Core e .NET 10, utilizando Minimal API.

## Requisitos

Para executar o projeto é necessário ter instalado:

- .NET 10

## Como executar

Abra o terminal na pasta do projeto e execute utilizando a porta 5050:

```bash
dotnet run --urls http://localhost:5050
```

A API ficará disponível em:

`http://localhost:5050`

Para verificar se o projeto está compilando corretamente utilize o comando:

```bash
dotnet build
```

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Verifica se a API está no ar |
| GET | `/api/produtos` | Lista todos os produtos |
| GET | `/api/produtos/{id}` | Busca um produto pelo ID |
| POST | `/api/produtos` | Cadastra um novo produto |
| PUT | `/api/produtos/{id}` | Atualiza um produto |
| DELETE | `/api/produtos/{id}` | Remove um produto |

## Exemplo de POST

Para cadastrar um produto:

```json
{
  "nome": "Camisa Grêmio Third 2026 Jogador New Balance",
  "disponivel": true
}
```

## Exemplo de PUT

Para atualizar um produto:

```json
{
  "nome": "Camisa Grêmio Home 2026 Atleta Masculina New Balance",
  "disponivel": false
}
```

## Armazenamento dos dados

Os produtos ficam armazenados somente em memória utilizando uma `List<Produto>`.
Por isso, quando a aplicação é encerrada e iniciada novamente, os dados cadastrados durante a execução são perdidos.

## Testes da API

As requisições utilizadas para testar a API foram feitas utilizando o Bruno.
A Collection utilizada nos testes está disponível na pasta:

`/bruno`

Foram realizados testes de GET, GET por ID, POST, PUT e DELETE, além do teste de `404 Not Found`.

## Vídeo de demonstração

Link do vídeo:

`https://www.youtube.com/watch?v=TvApU68wjiA`