import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

/**
 * Middleware genérico de validação usando Zod
 * @param schema - Schema Zod para validação
 */
export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Valida o body da requisição
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Erro ao validar dados",
      });
    }
  };
}

/**
 * Schemas de validação prontos para usar
 */

// Schema para registro de usuário
export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Senha deve conter pelo menos um caractere especial"
    ),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Schema para criar produto
export const createProductSchema = z.object({
  name: z.string().min(3, "Nome do produto deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  stock: z.number().int().nonnegative("Estoque não pode ser negativo"),
  categoryId: z.string().uuid("ID da categoria inválido"),
  brand: z.string().optional(),
  partNumber: z.string().optional(),
  images: z.array(z.string().url("URL de imagem inválida")).optional(),
});

// Schema para atualizar produto
export const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.string().uuid().optional(),
  brand: z.string().optional(),
  partNumber: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

// Schema para criar categoria
export const createCategorySchema = z.object({
  name: z.string().min(2, "Nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("URL de imagem inválida").optional(),
});

// Schema para adicionar ao carrinho
export const addToCartSchema = z.object({
  productId: z.string().uuid("ID do produto inválido"),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
});

// Schema para criar pedido
export const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(5, "Endereço inválido"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, "Bairro inválido"),
    city: z.string().min(3, "Cidade inválida"),
    state: z.string().length(2, "Estado deve ter 2 caracteres"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  }),
  paymentMethod: z.enum(["credit_card", "debit_card", "pix", "boleto"]),
});
