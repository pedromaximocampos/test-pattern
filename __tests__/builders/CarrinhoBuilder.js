import { Carrinho } from "../../src/domain/Carrinho.js";
import { Item } from "../../src/domain/Item.js";
import { UserMother } from "./UserMother.js";

/**
 * Data Builder Pattern para Carrinho
 *
 * Objetos complexos como Carrinho (com user, múltiplos itens, etc.)
 * se beneficiam do padrão Builder. Ele oferece:
 * - API Fluente (métodos encadeáveis)
 * - Valores padrão sensatos
 * - Customização explícita apenas do necessário
 * - Evita "explosão" de métodos do Object Mother
 */
export class CarrinhoBuilder {
  constructor() {
    // Valores padrão: um carrinho típico com 1 item
    this._user = UserMother.umUsuarioPadrao();
    this._itens = [new Item("Produto Padrão", 100)];
  }

  /**
   * Define o usuário do carrinho
   */
  comUser(user) {
    this._user = user;
    return this; // Retorna this para encadear
  }

  /**
   * Define os itens do carrinho
   */
  comItens(itens) {
    this._itens = itens;
    return this;
  }

  /**
   * Adiciona um único item ao carrinho
   */
  comItem(item) {
    this._itens.push(item);
    return this;
  }

  /**
   * Cria um carrinho vazio (sem itens)
   */
  vazio() {
    this._itens = [];
    return this;
  }

  /**
   * Cria um carrinho com um valor total específico
   * (útil para testar descontos, limites de valor, etc.)
   */
  comValorTotal(valorTotal) {
    this._itens = [new Item("Item Teste", valorTotal)];
    return this;
  }

  /**
   * Constrói e retorna a instância final do Carrinho
   */
  build() {
    return new Carrinho(this._user, [...this._itens]);
  }
}
