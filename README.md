# API Loja de Roupas

## Sobre o projeto

Este projeto foi desenvolvido para a AP1 e atualizado para a AP2 da disciplina.

A aplicação representa uma loja de roupas e permite cadastrar, listar, buscar, atualizar e excluir produtos.

O projeto utiliza C#, ASP.NET Core, .NET 10, Minimal API, Entity Framework Core e SQLite. Também possui uma interface web integrada à API, localizada na pasta `wwwroot`.

## Requisitos

Para executar o projeto, é necessário ter instalado:

- .NET 10 SDK
- Git (opcional, para clonar o repositório)
- Bruno (opcional, para testar os endpoints)

## Como executar

Abra o terminal na pasta do projeto e execute:

```bash
dotnet restore
dotnet build
dotnet run --urls "http://localhost:5134"
```

Depois, abra a interface da loja no navegador:

http://localhost:5134

A API utiliza o banco de dados SQLite configurado no projeto. Se o banco ainda não tiver sido criado ou estiver sem as tabelas necessárias, aplique as migrations do Entity Framework Core antes de executar a aplicação:

```bash
dotnet ef database update
```

Para executar esse último comando, é necessário ter instalado o `dotnet-ef` e as dependências do projeto.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista todos os produtos |
| GET | `/api/produtos/{id}` | Busca um produto pelo ID |
| POST | `/api/produtos` | Cadastra um produto |
| PUT | `/api/produtos/{id}` | Atualiza um produto |
| DELETE | `/api/produtos/{id}` | Exclui um produto |

## Exemplos de requisições

### POST — Cadastrar produto

Rota: `/api/produtos`

```json
{
  "nome": "Camiseta Preta",
  "data": "2026-10-26",
  "tipo": "Camiseta"
}
```

### PUT — Atualizar produto

Rota: `/api/produtos/1`

```json
{
  "id": 1,
  "nome": "Camiseta Branca",
  "data": "2026-10-26",
  "tipo": "Camiseta"
}
```

Os exemplos utilizam os campos do modelo atual. Para atualizar, substitua `1` pelo ID de um produto existente.

## Armazenamento dos dados

Os produtos são armazenados em um banco de dados SQLite e manipulados utilizando Entity Framework Core.

Os dados cadastrados, atualizados ou excluídos são persistidos no banco. Assim, os produtos não são perdidos simplesmente ao encerrar e reiniciar a aplicação.

O arquivo local do banco de dados não deve ser enviado ao GitHub.

## Interface web

A interface está localizada na pasta `wwwroot` e é servida pela própria aplicação ASP.NET Core.

Ela permite consultar os produtos e realizar operações de cadastro, edição e exclusão por meio dos endpoints da API.

## Testes da API

As requisições foram testadas utilizando o Bruno.

Foram testadas as operações de GET, GET por ID, POST, PUT e DELETE, incluindo respostas `404 Not Found` para produtos inexistentes.

Se a Collection do Bruno estiver incluída no repositório, ela poderá ser encontrada na pasta correspondente.

## Vídeo de demonstração — AP2

Link do vídeo: **https://youtu.be/DnihBNRR_0E**
