import { User } from "../../src/domain/User.js";

/**
 * Object Mother Pattern para User
 *
 * Útil para criar instâncias de objetos simples e fixos.
 * Como User tem variações limitadas (PADRAO vs PREMIUM),
 * um Object Mother é suficiente e evita código duplicado.
 */
export class UserMother {
  /**
   * Cria um usuário padrão (não-premium)
   */
  static umUsuarioPadrao() {
    return new User(1, "João Silva", "joao@email.com", "PADRAO");
  }

  /**
   * Cria um usuário premium
   */
  static umUsuarioPremium() {
    return new User(2, "Maria Premium", "premium@email.com", "PREMIUM");
  }

  /**
   * Cria um usuário customizado
   */
  static umUsuarioCustomizado(id, nome, email, tipo = "PADRAO") {
    return new User(id, nome, email, tipo);
  }
}
