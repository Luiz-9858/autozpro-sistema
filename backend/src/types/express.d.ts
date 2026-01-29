// ========================================
// 🌐 DECLARAÇÕES GLOBAIS DO EXPRESS
// ========================================

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
