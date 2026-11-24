# API Loja de Roupas

## Sobre o projeto

Este projeto foi desenvolvido para as avaliações AP1 e AP2 da disciplina de Desenvolvimento Back-End.

A aplicação representa uma loja de roupas e permite cadastrar, listar, buscar, atualizar e excluir produtos.

O projeto utiliza C#, ASP.NET Core, .NET 10, Minimal API, Entity Framework Core e SQLite. Também possui uma interface web integrada à API, localizada na pasta `wwwroot`.

## Tecnologias utilizadas

- C#
- ASP.NET Core
- .NET 10
- Minimal API
- Entity Framework Core
- SQLite
- HTML, CSS e JavaScript
- Bruno para testes da API

## Organização do projeto

O projeto está organizado da seguinte forma:

```text
ApiLojaDeRoupa/
│
├── Data/
│   └── ApiDbContext.cs
│
├── Dtos/
│   └── ProdutoEntrada.cs
│
├── Models/
│   └── LojaDeRoupaEntity.cs
│
├── Migrations/
│
├── Properties/
│
├── bruno/
│
├── wwwroot/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── Program.cs
├── ApiLojaDeRoupa.csproj
├── appsettings.json
└── README.md
```

### Responsabilidade de cada pasta e arquivo

- **Models:** contém a classe `LojaDeRoupaEntity`, responsável por representar os produtos e suas propriedades.
- **Dtos:** contém o record `ProdutoEntrada`, responsável por receber os dados enviados nas operações de cadastro e atualização, sem incluir o identificador do produto.
- **Data:** contém a classe `ApiDbContext`, responsável pela conexão e comunicação com o banco de dados utilizando Entity Framework Core.
- **Migrations:** armazena as migrações responsáveis pelo controle da estrutura do banco de dados.
- **Properties:** contém configurações de execução do projeto.
- **bruno:** contém a Collection utilizada para testar os endpoints da API.
- **wwwroot:** contém os arquivos da interface web, desenvolvida em HTML, CSS e JavaScript.
- **Program.cs:** responsável pela inicialização da aplicação, configuração dos serviços, conexão com o banco, middleware e definição das rotas da API.

## Como executar

Para executar o projeto, é necessário ter instalado o .NET 10 SDK.

Abra o terminal na pasta do projeto e execute:

```bash
dotnet restore
dotnet build
dotnet run --urls "http://localhost:5134"
```

Depois, acesse a interface da loja pelo navegador:

http://localhost:5134

## Banco de dados

A aplicação utiliza SQLite para armazenar os produtos e Entity Framework Core para realizar as operações no banco de dados.

A conexão é configurada no arquivo `appsettings.json`, e o contexto do banco está localizado em `Data/ApiDbContext.cs`.

As migrations existentes são utilizadas para controlar a estrutura do banco de dados.

Os dados cadastrados permanecem armazenados mesmo após encerrar e reiniciar a aplicação.

## Endpoints da API

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
  "data": "17/11/2026",
  "tipo": "Camiseta"
}
```

### PUT — Atualizar produto

Rota: `/api/produtos/1`

```json
{
  "nome": "Camiseta Branca",
  "data": "17/11/2026",
  "tipo": "Camiseta"
}
```

O ID do produto é informado na rota, não no corpo da requisição.

## Tratamento de erros e exceções

A API possui um middleware de tratamento centralizado de exceções implementado através do `UseExceptionHandler`.

Quando ocorre uma falha interna, a API retorna HTTP 500 com uma mensagem genérica em formato JSON, sem expor detalhes técnicos da exceção ao cliente.

Para produtos inexistentes, as rotas retornam HTTP 404 (Not Found), evitando transformar uma situação normal em uma exceção.

## Interface web

A interface está localizada na pasta `wwwroot` e é servida pela própria aplicação ASP.NET Core.

Ela permite consultar os produtos e realizar operações de cadastro, edição e exclusão por meio dos endpoints da API.

## Testes da API

As requisições são realizadas utilizando o Bruno.

São contempladas as operações:

- GET — Listagem de produtos.
- GET por ID — Busca de produto específico.
- POST — Cadastro de produto.
- PUT — Atualização de produto.
- DELETE — Exclusão de produto.
- Verificação de respostas 404 para produtos inexistentes.

## Vídeo de demonstração — AS

Link do vídeo: https://youtu.be/0sCJ0GtdUN8
