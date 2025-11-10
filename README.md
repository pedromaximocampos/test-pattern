# 🧪 Test Patterns - E-commerce Checkout Service

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](./__tests__/)
[![Jest](https://img.shields.io/badge/jest-29.7.0-red.svg)](https://jestjs.io/)

## ✅ Trabalho Completo - Padrões de Teste Implementados

Este repositório contém a **implementação completa** de Padrões de Teste (Test Patterns) para um serviço de checkout de e-commerce

## 🎯 Padrões Implementados

### ✅ Object Mother - `UserMother.js`

```javascript
const usuarioPadrao = UserMother.umUsuarioPadrao();
const usuarioPremium = UserMother.umUsuarioPremium();
```

### ✅ Data Builder - `CarrinhoBuilder.js`

```javascript
const carrinho = new CarrinhoBuilder()
  .comUser(usuarioPremium)
  .comValorTotal(200)
  .build();
```

### ✅ Stubs (Verificação de Estado)

```javascript
const gatewayStub = {
  cobrar: jest.fn().mockResolvedValue({ success: true }),
};
```

### ✅ Mocks (Verificação de Comportamento)

```javascript
expect(emailMock.enviarEmail).toHaveBeenCalledWith(
  "premium@email.com",
  "Seu Pedido foi Aprovado!",
  expect.stringContaining("180")
);
```

## 📊 Cenários de Teste Implementados

| #   | Cenário                            | Status |
| --- | ---------------------------------- | ------ |
| 1   | Pagamento falha - retorna null     | ✅     |
| 2   | Cliente padrão - sem desconto      | ✅     |
| 3   | Cliente premium - com desconto 10% | ✅     |
| 4   | Carrinho vazio - valor zero        | ✅     |
| 5   | Falha no e-mail - resiliência      | ✅     |

## 🚀 Como Executar

### Instalação

```bash
npm install
```

### Executar Testes

```bash
# Todos os testes
npm test

# Com detalhes
npm test -- --verbose

# Com cobertura
npm run coverage

# Modo watch
npm test -- --watch
```

## ✅ Resultados

```
PASS  __tests__/CheckoutService.test.js
  CheckoutService
    quando o pagamento falha
      ✓ deve retornar null quando o gateway retornar success=false
    quando um cliente PADRAO finaliza a compra com sucesso
      ✓ deve processar o pedido sem aplicar desconto
    quando um cliente PREMIUM finaliza a compra
      ✓ deve aplicar 10% de desconto e notificar por e-mail
    quando o carrinho está vazio
      ✓ deve processar pedido com valor zero
    quando o e-mail falha mas o pagamento foi processado
      ✓ deve retornar o pedido mesmo com falha no envio do e-mail

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

## 📖 Documentação

📄 **[RELATORIO.md](./RELATORIO.md)** - Relatório técnico completo com:

- Justificativa: Builder vs. Object Mother
- Análise: Stubs vs. Mocks
- Exemplos antes/depois
- State vs. Behavior Verification

## 🏗️ Estrutura

```
__tests__/
├── builders/
│   ├── UserMother.js          ✅ Object Mother
│   └── CarrinhoBuilder.js     ✅ Data Builder
└── CheckoutService.test.js    ✅ 5 testes
```

## 📚 Referências

1. [Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
2. [xUnit Test Patterns](http://xunitpatterns.com/)
3. [Jest Documentation](https://jestjs.io/docs/mock-functions)
