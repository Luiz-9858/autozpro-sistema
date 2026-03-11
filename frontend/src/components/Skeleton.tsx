/**
 * 💀 Componente Skeleton
 *
 * Componente de loading animado para substituir spinners genéricos.
 * Mostra a estrutura do conteúdo enquanto carrega.
 *
 * EXEMPLOS DE USO:
 *
 * // Linha simples
 * <Skeleton className="h-4 w-32" />
 *
 * // Círculo (avatar)
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // Card completo
 * <Skeleton className="h-64 w-full rounded-lg" />
 */

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-label="Carregando..."
    />
  );
}

/**
 * 📦 Skeleton de Card de Produto
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 📊 Skeleton de Linha de Tabela
 */
export function TableRowSkeleton() {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-16 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-5" />
        </div>
      </td>
    </tr>
  );
}

/**
 * 🗂️ Skeleton de Card de Categoria
 */
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-300">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-8 rounded" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 📝 Skeleton de Formulário
 */
export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Campo 1 */}
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Campo 2 */}
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Campo 3 (textarea) */}
      <div>
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>

      {/* Campos lado a lado */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4 border-t">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 w-32 rounded-lg" />
      </div>
    </div>
  );
}
