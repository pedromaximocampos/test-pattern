# 📦 O Que Entregar - Checklist de Submissão

## 🎯 Requisitos de Entrega

Conforme especificado no trabalho, você deve entregar:

### 1. ✅ Link do Repositório GitHub

- **Status:** ✅ Pronto
- **Repositório:** `pedromaximocampos/test-pattern`
- **Branch:** `main`
- **O que incluir:**
  - `__tests__/CheckoutService.test.js` ✅
  - `__tests__/builders/UserMother.js` ✅
  - `__tests__/builders/CarrinhoBuilder.js` ✅
  - Todos os arquivos de configuração ✅

### 2. ✅ Relatório Escrito (PDF ou MD)

- **Status:** ✅ Pronto
- **Arquivo:** `RELATORIO.md`
- **Páginas:** 2-4 páginas (conforme solicitado)
- **Formato:** Markdown (pode ser convertido para PDF se necessário)

---

## 📝 Conteúdo do Relatório (RELATORIO.md)

### ✅ Seção 1: Capa

- Nome da disciplina: Engenharia de Software / Qualidade de Software
- Nome do trabalho: Implementação de Padrões de Teste
- Seu nome completo: **[PREENCHER]**
- Matrícula: **[PREENCHER]**
- Data: 09 de Novembro de 2025

### ✅ Seção 2: Padrões de Criação de Dados (Builders)

- ✅ Explicação: Por que CarrinhoBuilder foi usado em vez de CarrinhoMother
- ✅ Exemplo "Antes" (setup manual complexo)
- ✅ Exemplo "Depois" (setup usando Data Builder)
- ✅ Justificativa: Como o Builder melhora legibilidade e manutenção

### ✅ Seção 3: Padrões de Test Doubles (Mocks vs. Stubs)

- ✅ Teste escolhido: "quando um cliente PREMIUM finaliza a compra"
- ✅ Identificação: Qual dependência foi Stub e qual foi Mock
- ✅ Explicação: Por que GatewayPagamento foi Stub
- ✅ Explicação: Por que EmailService foi Mock
- ✅ Discussão: Verificação de Estado vs. Comportamento

### ✅ Seção 4: Conclusão

- ✅ Reflexão sobre como Padrões de Teste previnem Test Smells
- ✅ Contribuição para uma suíte de testes sustentável

### ✅ Seções Extras

- ✅ Análise dos testes implementados
- ✅ Implementação dos padrões (código)
- ✅ Referências bibliográficas
- ✅ Anexos com estrutura e comandos

---

## 🗂️ Arquivos Criados para Entrega

### Arquivos Principais (Obrigatórios)

```
__tests__/
├── builders/
│   ├── UserMother.js          ✅ Object Mother implementado
│   └── CarrinhoBuilder.js     ✅ Data Builder implementado
└── CheckoutService.test.js    ✅ 5 testes implementados
```

### Arquivos de Configuração

```
babel.config.json              ✅ Babel configurado
package.json                   ✅ Jest configurado
```

### Documentação

```
RELATORIO.md                   ✅ Relatório técnico completo
README.md                      ✅ Documentação do projeto
RESUMO.md                      ✅ Resumo da implementação
ENTREGA.md                     ✅ Este arquivo (checklist)
```

---

## 🚀 Passos para Submissão

### Passo 1: Personalizar o Relatório

Edite o arquivo `RELATORIO.md` e preencha:

- **Seu nome completo** na capa
- **Sua matrícula** na capa

### Passo 2: Verificar que Tudo Funciona

```bash
# Execute os testes para confirmar
npm test

# Resultado esperado:
# Test Suites: 1 passed, 1 total
# Tests:       5 passed, 5 total
```

### Passo 3: Commit e Push

```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: Implementa padrões de teste (Object Mother, Data Builder, Stubs, Mocks)"

# Push para o GitHub
git push origin main
```

### Passo 4: Preparar Link do Repositório

- Link: `https://github.com/pedromaximocampos/test-pattern`
- Certifique-se de que o repositório está **público** ou compartilhado com o professor

### Passo 5: Preparar o PDF (Opcional)

Se o professor exigir PDF em vez de Markdown:

**Opção A: Converter Markdown para PDF**

- Use ferramentas online como: https://www.markdowntopdf.com/
- Ou use VS Code com extensão "Markdown PDF"

**Opção B: Copiar para Word e Exportar**

- Copie o conteúdo de `RELATORIO.md`
- Cole no Word (a formatação será mantida)
- Exporte como PDF

---

## 📋 Checklist Final Antes da Entrega

### Código

- [x] UserMother.js implementado com métodos estáticos
- [x] CarrinhoBuilder.js implementado com API fluente
- [x] CheckoutService.test.js com 5 testes
- [x] Todos os testes passando (npm test)
- [x] Código bem comentado e documentado

### Relatório (RELATORIO.md)

- [ ] **Capa com SEU nome e matrícula preenchidos**
- [x] Seção sobre Padrões de Criação completa
- [x] Seção sobre Test Doubles completa
- [x] Conclusão completa
- [x] Referências bibliográficas incluídas

### Repositório GitHub

- [x] Código commitado
- [ ] **Código com push para GitHub**
- [ ] **Repositório público ou compartilhado**
- [ ] README.md atualizado

### Submissão

- [ ] Link do repositório copiado
- [ ] PDF gerado (se necessário)
- [ ] Entrega realizada na plataforma do curso

---

## 📤 Formato de Submissão

### O que enviar:

1. **Link do Repositório:**

   ```
   https://github.com/pedromaximocampos/test-pattern
   ```

2. **Arquivo PDF ou MD:**

   - `RELATORIO.md` (ou convertido para PDF)

3. **Observações (opcional):**
   ```
   Implementação completa dos padrões Object Mother, Data Builder,
   Stubs e Mocks. Todos os 5 testes estão passando.
   Documentação completa disponível no README.md do repositório.
   ```

---

## ✅ Verificação Final

Antes de submeter, confirme:

1. ✅ Os testes rodam sem erros (`npm test`)
2. ✅ O código está no GitHub
3. ✅ O RELATORIO.md está completo
4. ✅ Seu nome e matrícula estão no relatório
5. ✅ O repositório está acessível
6. ✅ Todos os arquivos foram incluídos no commit

---

## 🎯 Critérios de Avaliação

Seu trabalho será avaliado com base em:

| Critério                                                  | Peso | Status      |
| --------------------------------------------------------- | ---- | ----------- |
| **Padrões de Criação** (Object Mother e Data Builder)     | 30%  | ✅ Completo |
| **Test Doubles** (Stubs e Mocks)                          | 40%  | ✅ Completo |
| **Qualidade dos Testes** (AAA, foco, cobertura)           | 10%  | ✅ Completo |
| **Qualidade do Relatório** (clareza, análise, completude) | 20%  | ✅ Completo |

**Total:** 100% ✅

---

## 📞 Dúvidas?

Se tiver alguma dúvida sobre a submissão:

1. Revise o arquivo `RELATORIO.md` para detalhes técnicos
2. Revise o arquivo `RESUMO.md` para visão geral
3. Execute `npm test` para verificar que tudo funciona
4. Consulte as referências bibliográficas citadas

---

## 🎉 Parabéns!

Você completou com sucesso a implementação de Padrões de Teste!

**O que você aprendeu:**

- ✅ Object Mother para objetos simples
- ✅ Data Builder para objetos complexos
- ✅ Stubs para verificação de estado
- ✅ Mocks para verificação de comportamento
- ✅ Padrão AAA para testes limpos
- ✅ Como prevenir Test Smells

**Próximos passos:**

1. Preencher nome e matrícula no RELATORIO.md
2. Fazer commit e push para GitHub
3. Copiar o link do repositório
4. Submeter na plataforma do curso

Boa sorte! 🚀
