import bcrypt from "bcryptjs";

/**
 * Criptografa uma senha usando bcrypt
 * @param password - Senha em texto puro
 * @returns Senha criptografada (hash)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "10");
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compara uma senha em texto puro com o hash armazenado
 * @param password - Senha fornecida pelo usuário
 * @param hashedPassword - Hash armazenado no banco de dados
 * @returns true se a senha está correta, false caso contrário
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Valida se a senha atende aos requisitos mínimos de segurança
 * @param password - Senha a ser validada
 * @returns true se válida, false caso contrário
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
