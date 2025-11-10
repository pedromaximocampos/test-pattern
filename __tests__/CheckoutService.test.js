import { CheckoutService } from "../src/services/CheckoutService.js";
import { UserMother } from "./builders/UserMother.js";
import { CarrinhoBuilder } from "./builders/CarrinhoBuilder.js";
import { Item } from "../src/domain/Item.js";
import { Pedido } from "../src/domain/Pedido.js";

describe("CheckoutService", () => {
  describe("quando o pagamento falha", () => {
    it("deve retornar null quando o gateway retornar success=false", async () => {
      // ============ ARRANGE ============
      // 1. Criar o carrinho usando o Builder
      const carrinho = new CarrinhoBuilder().comValorTotal(100).build();

      const cartaoCredito = "1234-5678-9012-3456";

      // 2. Criar STUB para GatewayPagamento
      // Stub: Fornece resposta pré-definida (success=false)
      // Objetivo: Controlar o ESTADO de retorno
      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: false }),
      };

      // 3. Criar DUMMIES para as outras dependências
      // Dummies: Objetos vazios que não devem ser chamados
      const repositoryDummy = {
        salvar: jest.fn(),
      };

      const emailDummy = {
        enviarEmail: jest.fn(),
      };

      // 4. Instanciar o SUT (System Under Test)
      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryDummy,
        emailDummy
      );

      // ============ ACT ============
      const pedido = await checkoutService.processarPedido(
        carrinho,
        cartaoCredito
      );

      // ============ ASSERT ============
      // Verificação de ESTADO: o resultado deve ser null
      expect(pedido).toBeNull();

      // Garantir que o gateway foi chamado (mesmo falhando)
      expect(gatewayStub.cobrar).toHaveBeenCalledWith(100, cartaoCredito);

      // Garantir que repository e email NÃO foram chamados
      expect(repositoryDummy.salvar).not.toHaveBeenCalled();
      expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
    });
  });

  describe("quando um cliente PADRAO finaliza a compra com sucesso", () => {
    it("deve processar o pedido sem aplicar desconto", async () => {
      // ============ ARRANGE ============
      // 1. Criar usuário PADRAO usando Object Mother
      const usuarioPadrao = UserMother.umUsuarioPadrao();

      // 2. Criar carrinho com R$ 100,00 usando Builder
      const carrinho = new CarrinhoBuilder()
        .comUser(usuarioPadrao)
        .comValorTotal(100)
        .build();

      const cartaoCredito = "1234-5678-9012-3456";

      // 3. Criar STUB para GatewayPagamento (sucesso)
      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: true }),
      };

      // 4. Criar STUB para PedidoRepository
      const pedidoSalvo = new Pedido("PED-001", carrinho, 100, "PROCESSADO");
      const repositoryStub = {
        salvar: jest.fn().mockResolvedValue(pedidoSalvo),
      };

      // 5. Criar MOCK para EmailService
      // Mock: Queremos VERIFICAR se foi chamado corretamente
      const emailMock = {
        enviarEmail: jest.fn().mockResolvedValue(true),
      };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryStub,
        emailMock
      );

      // ============ ACT ============
      const resultado = await checkoutService.processarPedido(
        carrinho,
        cartaoCredito
      );

      // ============ ASSERT ============
      // Verificação de ESTADO
      expect(resultado).not.toBeNull();
      expect(resultado.id).toBe("PED-001");
      expect(resultado.totalFinal).toBe(100);

      // Verificação de COMPORTAMENTO
      expect(gatewayStub.cobrar).toHaveBeenCalledWith(100, cartaoCredito);
      expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);

      // Mock: Verificar interação com EmailService
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        "joao@email.com",
        "Seu Pedido foi Aprovado!",
        expect.stringContaining("PED-001")
      );
    });
  });

  describe("quando um cliente PREMIUM finaliza a compra", () => {
    it("deve aplicar 10% de desconto e notificar por e-mail", async () => {
      // ============ ARRANGE ============
      // 1. Criar usuário PREMIUM usando Object Mother
      const usuarioPremium = UserMother.umUsuarioPremium();

      // 2. Criar carrinho com R$ 200,00 usando Builder
      const carrinho = new CarrinhoBuilder()
        .comUser(usuarioPremium)
        .comItens([new Item("Notebook", 150), new Item("Mouse", 50)])
        .build();

      const cartaoCredito = "1234-5678-9012-3456";

      // 3. Criar STUB para GatewayPagamento (sucesso)
      // Stub: Controla o retorno, mas também verificaremos o valor cobrado
      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: true }),
      };

      // 4. Criar STUB para PedidoRepository
      const pedidoSalvo = new Pedido("PED-002", carrinho, 180, "PROCESSADO");
      const repositoryStub = {
        salvar: jest.fn().mockResolvedValue(pedidoSalvo),
      };

      // 5. Criar MOCK para EmailService
      // Mock: Foco principal é verificar a INTERAÇÃO
      const emailMock = {
        enviarEmail: jest.fn().mockResolvedValue(true),
      };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryStub,
        emailMock
      );

      // ============ ACT ============
      const resultado = await checkoutService.processarPedido(
        carrinho,
        cartaoCredito
      );

      // ============ ASSERT ============

      // Verificação de ESTADO: Pedido processado corretamente
      expect(resultado).not.toBeNull();
      expect(resultado.id).toBe("PED-002");
      expect(resultado.totalFinal).toBe(180); // 200 - 10% = 180
      expect(resultado.status).toBe("PROCESSADO");

      // Verificação de COMPORTAMENTO: Gateway cobrou o valor COM desconto
      expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito);
      expect(gatewayStub.cobrar).toHaveBeenCalledTimes(1);

      // Verificação de COMPORTAMENTO: Repository salvou o pedido
      expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);
      const pedidoPassado = repositoryStub.salvar.mock.calls[0][0];
      expect(pedidoPassado.totalFinal).toBe(180);

      // Verificação de COMPORTAMENTO (MOCK): Email enviado corretamente
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        "premium@email.com",
        "Seu Pedido foi Aprovado!",
        expect.stringContaining("PED-002")
      );
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        "premium@email.com",
        "Seu Pedido foi Aprovado!",
        expect.stringContaining("180")
      );
    });
  });

  describe("quando o carrinho está vazio", () => {
    it("deve processar pedido com valor zero", async () => {
      // ============ ARRANGE ============
      const usuario = UserMother.umUsuarioPadrao();

      // Usando o método fluente .vazio() do Builder
      const carrinhoVazio = new CarrinhoBuilder()
        .comUser(usuario)
        .vazio()
        .build();

      const cartaoCredito = "1234-5678-9012-3456";

      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: true }),
      };

      const pedidoSalvo = new Pedido("PED-003", carrinhoVazio, 0, "PROCESSADO");
      const repositoryStub = {
        salvar: jest.fn().mockResolvedValue(pedidoSalvo),
      };

      const emailMock = {
        enviarEmail: jest.fn().mockResolvedValue(true),
      };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryStub,
        emailMock
      );

      // ============ ACT ============
      const resultado = await checkoutService.processarPedido(
        carrinhoVazio,
        cartaoCredito
      );

      // ============ ASSERT ============
      expect(resultado).not.toBeNull();
      expect(resultado.totalFinal).toBe(0);
      expect(gatewayStub.cobrar).toHaveBeenCalledWith(0, cartaoCredito);
    });
  });

  describe("quando o e-mail falha mas o pagamento foi processado", () => {
    it("deve retornar o pedido mesmo com falha no envio do e-mail", async () => {
      // ============ ARRANGE ============
      const usuario = UserMother.umUsuarioPadrao();
      const carrinho = new CarrinhoBuilder()
        .comUser(usuario)
        .comValorTotal(100)
        .build();

      const cartaoCredito = "1234-5678-9012-3456";

      const gatewayStub = {
        cobrar: jest.fn().mockResolvedValue({ success: true }),
      };

      const pedidoSalvo = new Pedido("PED-004", carrinho, 100, "PROCESSADO");
      const repositoryStub = {
        salvar: jest.fn().mockResolvedValue(pedidoSalvo),
      };

      // Mock do Email que FALHA
      const emailMock = {
        enviarEmail: jest
          .fn()
          .mockRejectedValue(new Error("Servidor de email indisponível")),
      };

      const checkoutService = new CheckoutService(
        gatewayStub,
        repositoryStub,
        emailMock
      );

      // ============ ACT ============
      const resultado = await checkoutService.processarPedido(
        carrinho,
        cartaoCredito
      );

      // ============ ASSERT ============
      // O pedido deve ser processado mesmo com falha no e-mail
      expect(resultado).not.toBeNull();
      expect(resultado.id).toBe("PED-004");

      // Verificar que a tentativa de envio foi feita
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
    });
  });
});
