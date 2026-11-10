# Aula 14 — Erros, exceções e middleware

## 1. Localização do middleware

O middleware `UseExceptionHandler` foi colocado no arquivo `Program.cs`, logo depois de `var app = builder.Build();` e antes dos outros middlewares e dos endpoints da API.

Sua função é tratar exceções inesperadas e retornar uma resposta genérica em JSON com status HTTP 500.

## 2. Teste temporário de exceção

Foi criada temporariamente a rota `/api/teste-erro` para simular uma falha utilizando `InvalidOperationException`.

- **Método:** GET
- **Rota:** `/api/teste-erro`
- **Resultado:** 500 Internal Server Error

**Corpo da resposta:**

```json
{
  "mensagem": "Ocorreu um erro interno. Tente novamente mais tarde."
}
```

A mensagem interna da exceção não foi exibida ao cliente.

## 3. Teste de endpoint normal

Foi realizada uma consulta para listar os produtos cadastrados.

- **Método:** GET
- **Rota:** `/api/produtos`
- **Resultado:** 200 OK

A API continuou funcionando normalmente.

## 4. Teste de ID inexistente

Foi realizada uma consulta utilizando um ID que não existe no banco de dados.

- **Método:** GET
- **Rota:** `/api/produtos/999999`
- **Resultado:** 404 Not Found

A API preservou corretamente a resposta de recurso não encontrado.

## 5. Reflexão

Não devemos enviar a mensagem bruta da exceção ao cliente porque ela pode revelar informações internas do sistema, como detalhes do código, banco de dados e configurações, comprometendo a segurança da aplicação.

## 6. Finalização

Após os testes, a rota temporária `/api/teste-erro` foi removida do `Program.cs`, mantendo apenas o middleware de tratamento de exceções.

O projeto foi compilado novamente para verificar se não havia erros após a remoção da rota.
