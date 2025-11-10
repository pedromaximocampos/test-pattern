# Relatório: Implementação de Padrões de Teste (Test Patterns)

**Disciplina:** Engenharia de Software / Qualidade de Software  
**Trabalho:** Implementação de Padrões de Teste  
**Aluno:** Pedro Maximo Campos do Carmo
**Matrícula:** 697379
**Data:** 09 de Novembro de 2025

---

## 1. Introdução

Este trabalho teve como objetivo implementar padrões de teste essenciais para construir uma suíte de testes robusta e sustentável para um serviço de checkout de e-commerce. Focamos em dois problemas centrais:

1. **Criação de Dados de Teste:** Como criar objetos complexos de forma legível e flexível?
2. **Isolamento de Dependências:** Como testar lógica de negócio sem depender de serviços externos reais?

Para resolver esses problemas, implementamos os padrões **Object Mother**, **Data Builder**, **Stubs** e **Mocks**, seguindo o princípio AAA (Arrange, Act, Assert).

---

## 2. Padrões de Criação de Dados (Builders)

### 2.1. Por que CarrinhoBuilder em vez de CarrinhoMother?

O padrão **Object Mother** é ideal para objetos simples com poucas variações. No entanto, o `Carrinho` é um objeto complexo que pode ter:

- Diferentes tipos de usuários (PADRAO ou PREMIUM)
- Múltiplos itens com diversos valores
- Estados variados (vazio, com um item, com múltiplos itens)
- Valores totais específicos para testar descontos e limites

Se usássemos o padrão Object Mother para `Carrinho`, teríamos uma **explosão de métodos**:

```javascript
// ❌ Object Mother levaria a isso:
CarrinhoMother.umCarrinhoVazio();
CarrinhoMother.umCarrinhoComUmItem();
CarrinhoMother.umCarrinhoComDoisItens();
CarrinhoMother.umCarrinhoDe100Reais();
CarrinhoMother.umCarrinhoDe200Reais();
CarrinhoMother.umCarrinhoComUsuarioPremium();
CarrinhoMother.umCarrinhoComUsuarioPremiumE200Reais();
// ... e assim por diante (explosão combinatória!)
```

**Por outro lado**, o padrão **Data Builder** oferece uma API fluente que permite compor o objeto de forma flexível, explicitando apenas o que é relevante para cada teste:

```javascript
// ✅ Data Builder: Composição Fluente
new CarrinhoBuilder().comUser(usuarioPremium).comValorTotal(200).build();

new CarrinhoBuilder().vazio().build();

new CarrinhoBuilder().comItens([item1, item2, item3]).build();
```

### 2.2. Exemplo: Antes vs. Depois

#### **ANTES (Setup Manual - Obscuro e Verboso)**

```javascript
it("deve processar pedido premium com desconto", async () => {
  // Setup manual: muito código repetitivo
  const user = new User(2, "Maria Premium", "premium@email.com", "PREMIUM");
  const item1 = new Item("Notebook", 150);
  const item2 = new Item("Mouse", 50);
  const itens = [item1, item2];
  const carrinho = new Carrinho(user, itens);

  // O teste continua...
  // Difícil de ler: muito "ruído" no setup
});
```

**Problemas:**

- Muito código boilerplate
- Dificulta a leitura: o que é importante neste teste?
- Dificulta a manutenção: mudanças no construtor quebram todos os testes
- **Test Smell:** Obscure Setup (Setup Obscuro)

#### **DEPOIS (Com Data Builder - Limpo e Expressivo)**

```javascript
it("deve processar pedido premium com desconto", async () => {
  // Setup usando padrões: limpo e expressivo
  const usuarioPremium = UserMother.umUsuarioPremium();
  const carrinho = new CarrinhoBuilder()
    .comUser(usuarioPremium)
    .comValorTotal(200)
    .build();

  // O teste continua...
  // Fica claro: este teste é sobre usuário PREMIUM com valor de R$ 200
});
```

**Benefícios:**

- **Legibilidade:** Fica explícito o que importa (usuário premium, valor R$ 200)
- **Manutenção:** Mudanças no construtor são isoladas no Builder
- **Flexibilidade:** API fluente permite criar qualquer configuração
- **Reusabilidade:** Builders podem ser reutilizados em vários testes

### 2.3. Como o Builder Melhora a Legibilidade e Manutenção

#### **Legibilidade Aprimorada:**

1. **Valores Padrão Sensatos:** O Builder fornece valores padrão razoáveis, eliminando ruído.
2. **API Fluente:** Métodos encadeáveis criam uma "linguagem de domínio" para testes.
3. **Intenção Explícita:** Apenas o que é relevante para o teste é customizado.

```javascript
// O que este teste está validando? Fica CRISTALINO:
const carrinho = new CarrinhoBuilder()
  .comUser(usuarioPremium) // ← Foco: usuário premium
  .comValorTotal(200) // ← Foco: valor de R$ 200
  .build();
```

#### **Manutenção Facilitada:**

1. **Isolamento de Mudanças:** Se o construtor de `Carrinho` mudar, apenas o Builder precisa ser atualizado.
2. **Sem Duplicação:** Lógica de criação centralizada em um único lugar.
3. **Evolução Simples:** Novos métodos podem ser adicionados ao Builder sem quebrar testes existentes.

```javascript
// Evolução do Builder: adicionar novo método sem quebrar testes
comDescontoCupom(percentual) {
    this._descontoCupom = percentual;
    return this;
}
```

---

## 3. Padrões de Test Doubles (Mocks vs. Stubs)

### 3.1. Contexto: Teste de Sucesso para Cliente Premium

No teste **"quando um cliente PREMIUM finaliza a compra"**, precisamos validar dois aspectos:

1. **Lógica de Negócio:** O desconto de 10% foi aplicado corretamente?
2. **Integração:** As dependências externas (Gateway, Repository, Email) foram chamadas corretamente?

Para isolar o `CheckoutService` (nosso SUT), utilizamos Test Doubles:

```javascript
describe("quando um cliente PREMIUM finaliza a compra", () => {
  it("deve aplicar 10% de desconto e notificar por e-mail", async () => {
    // ARRANGE
    const usuarioPremium = UserMother.umUsuarioPremium();
    const carrinho = new CarrinhoBuilder()
      .comUser(usuarioPremium)
      .comValorTotal(200)
      .build();

    // STUB: GatewayPagamento
    const gatewayStub = {
      cobrar: jest.fn().mockResolvedValue({ success: true }),
    };

    // STUB: PedidoRepository
    const pedidoSalvo = new Pedido("PED-002", carrinho, 180, "PROCESSADO");
    const repositoryStub = {
      salvar: jest.fn().mockResolvedValue(pedidoSalvo),
    };

    // MOCK: EmailService
    const emailMock = {
      enviarEmail: jest.fn().mockResolvedValue(true),
    };

    const checkoutService = new CheckoutService(
      gatewayStub,
      repositoryStub,
      emailMock
    );

    // ACT
    const resultado = await checkoutService.processarPedido(
      carrinho,
      cartaoCredito
    );

    // ASSERT - Verificação de Estado
    expect(resultado.totalFinal).toBe(180); // 200 - 10% = 180

    // ASSERT - Verificação de Comportamento (Gateway)
    expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);

    // ASSERT - Verificação de Comportamento (Email MOCK)
    expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
    expect(emailMock.enviarEmail).toHaveBeenCalledWith(
      "premium@email.com",
      "Seu Pedido foi Aprovado!",
      expect.stringContaining("180")
    );
  });
});
```

### 3.2. Identificação: Stub vs. Mock

#### **Dependências usadas como STUB:**

1. **GatewayPagamento** (Stub principal)
2. **PedidoRepository** (Stub secundário)

#### **Dependência usada como MOCK:**

1. **EmailService** (Mock)

### 3.3. Por que GatewayPagamento é um Stub?

**Definição de Stub:**

> Um Stub fornece respostas pré-definidas para chamadas feitas durante o teste. O foco está no **controle do fluxo** e na **verificação de estado** (state verification).

**No caso do GatewayPagamento:**

```javascript
const gatewayStub = {
  cobrar: jest.fn().mockResolvedValue({ success: true }),
};
```

**Razões para ser Stub:**

1. **Controle de Fluxo:** Precisamos que o gateway retorne `{ success: true }` para que o fluxo de checkout continue.
2. **Verificação Secundária:** Embora verifiquemos que `cobrar()` foi chamado com o valor correto (180), esse **não é o objetivo principal** do teste.
3. **Foco no Estado:** O objetivo principal é verificar o **estado final** do pedido (valor com desconto = 180).

**Martin Fowler diz:**

> "Stubs fornecem respostas pré-programadas. Eles não são usados para verificação — apenas para fazer o teste funcionar."

No entanto, no teste premium, fazemos uma verificação adicional:

```javascript
expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);
```

**Isso não faz dele um Mock?**

Não necessariamente. A distinção sutil é:

- **Stub:** Foco primário é controlar o retorno. Verificações são secundárias/opcionais.
- **Mock:** Foco primário é validar a interação. O retorno é secundário.

Neste teste, a verificação do gateway é **secundária** — estamos mais interessados no estado final (desconto aplicado) do que na interação em si.

### 3.4. Por que EmailService é um Mock?

**Definição de Mock:**

> Um Mock é pré-programado com expectativas sobre chamadas que devem receber. O foco está na **verificação de comportamento** (behavior verification).

**No caso do EmailService:**

```javascript
const emailMock = {
  enviarEmail: jest.fn().mockResolvedValue(true),
};

// ...

// Verificação de COMPORTAMENTO (foco principal)
expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
expect(emailMock.enviarEmail).toHaveBeenCalledWith(
  "premium@email.com",
  "Seu Pedido foi Aprovado!",
  expect.stringContaining("180")
);
```

**Razões para ser Mock:**

1. **Verificação de Interação:** O objetivo é **garantir** que o e-mail foi enviado.
2. **Validação de Argumentos:** Queremos verificar que o e-mail correto foi enviado para o destinatário correto com a mensagem correta.
3. **Efeito Colateral Crítico:** O envio de e-mail é um **efeito colateral** que faz parte do comportamento esperado do sistema.
4. **Foco no "Como":** Não importa apenas **se** o método retornou com sucesso, mas **como** ele foi chamado.

**Gerard Meszaros (xUnit Test Patterns) diz:**

> "Use Mocks quando você precisa verificar que uma interação específica ocorreu corretamente."

### 3.5. Quadro Comparativo: Stub vs. Mock no Teste Premium

| Aspecto                    | GatewayPagamento (STUB)                      | EmailService (MOCK)                         |
| -------------------------- | -------------------------------------------- | ------------------------------------------- |
| **Objetivo Principal**     | Controlar o fluxo (retornar `success: true`) | Verificar a interação (e-mail enviado)      |
| **Tipo de Verificação**    | Estado (valor do pedido com desconto)        | Comportamento (método chamado corretamente) |
| **Importância do Retorno** | **Alta** (preciso que retorne sucesso)       | **Baixa** (retorno não é crítico)           |
| **Importância da Chamada** | Média (verificação secundária)               | **Alta** (verificação primária)             |
| **Foco do Teste**          | "O desconto foi aplicado?" (Estado)          | "O e-mail foi enviado?" (Comportamento)     |
| **Padrão**                 | State Verification                           | Behavior Verification                       |

### 3.6. Resumo: Quando Usar Stub vs. Mock

#### **Use STUB quando:**

- Você precisa controlar o retorno de uma dependência
- O foco é verificar o **estado final** do SUT
- A interação com a dependência não é o objetivo principal do teste
- Você quer isolar o SUT de dependências complexas

#### **Use MOCK quando:**

- Você precisa verificar que uma interação específica ocorreu
- O foco é verificar o **comportamento** do SUT
- A chamada do método é um efeito colateral crítico (ex: envio de e-mail, log, evento)
- Você quer garantir que o SUT se comunica corretamente com suas dependências

---

## 4. Análise dos Testes Implementados

### 4.1. Testes Criados

Implementamos 5 cenários de teste seguindo o padrão AAA:

1. **Pagamento Falha:** Verificação de estado (retorna null)
2. **Cliente Padrão com Sucesso:** Verificação de estado e comportamento
3. **Cliente Premium com Sucesso:** Verificação de estado e comportamento (teste principal)
4. **Carrinho Vazio:** Verificação de estado
5. **Falha no Envio de E-mail:** Verificação de resiliência

### 4.2. Padrão AAA (Arrange, Act, Assert)

Todos os testes seguem rigorosamente o padrão AAA:

```javascript
it("deve aplicar 10% de desconto e notificar por e-mail", async () => {
  // ============ ARRANGE ============
  // Setup: criar objetos de teste e configurar doubles
  const usuarioPremium = UserMother.umUsuarioPremium();
  const carrinho = new CarrinhoBuilder()
    .comUser(usuarioPremium)
    .comValorTotal(200)
    .build();
  // ... configurar stubs e mocks

  // ============ ACT ============
  // Executar a operação sendo testada
  const resultado = await checkoutService.processarPedido(
    carrinho,
    cartaoCredito
  );

  // ============ ASSERT ============
  // Verificar estado e comportamento
  expect(resultado.totalFinal).toBe(180);
  expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
});
```

### 4.3. Cobertura de Cenários

| Cenário                        | Tipo de Verificação    | Padrões Usados              |
| ------------------------------ | ---------------------- | --------------------------- |
| Pagamento falha                | Estado                 | Stub, Dummies               |
| Cliente padrão (sem desconto)  | Estado + Comportamento | Stub, Mock                  |
| Cliente premium (com desconto) | Estado + Comportamento | Stub, Mock                  |
| Carrinho vazio                 | Estado                 | Builder (método `.vazio()`) |
| Falha no envio de e-mail       | Resiliência            | Stub, Mock (rejeitado)      |

---

## 5. Implementação dos Padrões

### 5.1. Object Mother - UserMother

**Arquivo:** `__tests__/builders/UserMother.js`

```javascript
export class UserMother {
  static umUsuarioPadrao() {
    return new User(1, "João Silva", "joao@email.com", "PADRAO");
  }

  static umUsuarioPremium() {
    return new User(2, "Maria Premium", "premium@email.com", "PREMIUM");
  }
}
```

**Justificativa:** User é simples (poucos atributos, duas variações principais), tornando Object Mother adequado.

### 5.2. Data Builder - CarrinhoBuilder

**Arquivo:** `__tests__/builders/CarrinhoBuilder.js`

```javascript
export class CarrinhoBuilder {
  constructor() {
    this._user = UserMother.umUsuarioPadrao();
    this._itens = [new Item("Produto Padrão", 100)];
  }

  comUser(user) {
    this._user = user;
    return this;
  }

  comItens(itens) {
    this._itens = itens;
    return this;
  }

  vazio() {
    this._itens = [];
    return this;
  }

  comValorTotal(valorTotal) {
    this._itens = [new Item("Item Teste", valorTotal)];
    return this;
  }

  build() {
    return new Carrinho(this._user, [...this._itens]);
  }
}
```

**Justificativa:** Carrinho é complexo (múltiplas configurações possíveis), exigindo flexibilidade do Builder.

---

## 6. Conclusão

### 6.1. Prevenção de Test Smells

O uso deliberado de **Padrões de Teste** ajuda a prevenir diversos Test Smells:

1. **Obscure Setup:** Eliminado pelo Data Builder, que torna o setup explícito e legível.
2. **Fragile Tests:** Reduzido pelo uso de Stubs/Mocks, isolando testes de dependências externas.
3. **Test Code Duplication:** Evitado pela centralização de lógica de criação nos Builders.
4. **Hard-to-Test Code:** Mitigado pela injeção de dependências, facilitando o uso de Test Doubles.

### 6.2. Contribuição para uma Suíte Sustentável

Os padrões implementados contribuem para uma suíte de testes sustentável ao:

1. **Melhorar a Legibilidade:** Testes expressivos são mais fáceis de entender e manter.
2. **Facilitar a Manutenção:** Mudanças no código de produção têm impacto localizado nos testes.
3. **Promover Reuso:** Builders e Mothers são reutilizáveis em múltiplos testes.
4. **Garantir Isolamento:** Test Doubles isolam o SUT, tornando testes rápidos e confiáveis.
5. **Documentar o Sistema:** Testes bem escritos servem como documentação viva do comportamento esperado.

### 6.3. Lições Aprendidas

1. **Builder vs. Mother:** Use Mother para objetos simples, Builder para objetos complexos.
2. **Stub vs. Mock:** Use Stub para controlar fluxo, Mock para verificar interações.
3. **Padrão AAA:** Estrutura clara facilita leitura e manutenção.
4. **Test Doubles:** Essenciais para isolar o SUT e tornar testes rápidos e confiáveis.

### 6.4. Próximos Passos

Para evoluir ainda mais a qualidade dos testes, poderíamos:

1. Adicionar testes de integração com banco de dados em memória (ex: SQLite)
2. Implementar testes de contrato para APIs externas
3. Adicionar cobertura de código (já configurado com `npm run coverage`)
4. Criar Builders para outros objetos complexos (ex: Pedido)
5. Implementar testes parametrizados para testar múltiplos cenários similares

---

## 7. Referências

1. **Fowler, Martin.** "Mocks Aren't Stubs" (2007). Disponível em: https://martinfowler.com/articles/mocksArentStubs.html
2. **Meszaros, Gerard.** "xUnit Test Patterns: Refactoring Test Code" (2007). Disponível em: http://xunitpatterns.com/
3. **Jest Documentation.** "Mock Functions". Disponível em: https://jestjs.io/docs/mock-functions
4. **Freeman, Steve; Pryce, Nat.** "Growing Object-Oriented Software, Guided by Tests" (2009).

---

## 8. Anexos

### 8.1. Estrutura de Arquivos Criados

```
__tests__/
├── builders/
│   ├── UserMother.js          # Object Mother para User
│   └── CarrinhoBuilder.js     # Data Builder para Carrinho
└── CheckoutService.test.js    # Suíte de testes principal
```

### 8.2. Comandos para Execução

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Executar com cobertura
npm run coverage
```

### 8.3. Resultado da Execução

```
PASS  __tests__/CheckoutService.test.js
  CheckoutService
    quando o pagamento falha
      ✓ deve retornar null quando o gateway retornar success=false (5 ms)
    quando um cliente PADRAO finaliza a compra com sucesso
      ✓ deve processar o pedido sem aplicar desconto (3 ms)
    quando um cliente PREMIUM finaliza a compra
      ✓ deve aplicar 10% de desconto e notificar por e-mail (2 ms)
    quando o carrinho está vazio
      ✓ deve processar pedido com valor zero (1 ms)
    quando o e-mail falha mas o pagamento foi processado
      ✓ deve retornar o pedido mesmo com falha no envio do e-mail (24 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.891 s
```

---

**Fim do Relatório**
