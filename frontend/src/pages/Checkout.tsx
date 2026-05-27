import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

interface CheckoutFormData {
  // Cliente
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;

  // Endereço
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;

  // Pagamento
  paymentMethod: "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "BOLETO" | "";

  // Observações
  notes: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [shipping, setShipping] = useState(0);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerDocument: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    paymentMethod: "",
    notes: "",
  });

  // ✅ CORRIGIDO: Verificar se carrinho está vazio APENAS na montagem
  useEffect(() => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio!");
      // Usar setTimeout para permitir que a mensagem seja exibida
      const timer = setTimeout(() => {
        navigate("/products");
      }, 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Dependência vazia INTENCIONAL = executa apenas na montagem

  // Calcular frete quando CEP for preenchido
  useEffect(() => {
    if (formData.zipCode.replace(/\D/g, "").length === 8) {
      calculateShipping(formData.zipCode);
    }
  }, [formData.zipCode]);

  // Buscar endereço por CEP (ViaCEP)
  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    try {
      setSearchingCep(true);
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));

      toast.success("Endereço encontrado!");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setSearchingCep(false);
    }
  };

  // Calcular frete simulado (você pode integrar com API real depois)
  const calculateShipping = (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    // Simulação simples baseada no CEP
    // Na produção, integrar com Correios/Melhor Envio
    const firstDigit = parseInt(cleanCep[0]);

    let shippingCost = 0;
    if (firstDigit >= 0 && firstDigit <= 2) {
      shippingCost = 15.0; // Sul/Sudeste
    } else if (firstDigit >= 3 && firstDigit <= 5) {
      shippingCost = 25.0; // Centro-Oeste/Nordeste
    } else {
      shippingCost = 35.0; // Norte
    }

    setShipping(shippingCost);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    // Formatar: 12345-678
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }

    setFormData((prev) => ({ ...prev, zipCode: value }));

    // Buscar quando tiver 8 dígitos
    if (value.replace(/\D/g, "").length === 8) {
      handleCepSearch(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    // Formatar: (11) 98765-4321
    if (value.length > 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }

    setFormData((prev) => ({ ...prev, customerPhone: value }));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);

    // Formatar CPF: 123.456.789-01 ou CNPJ: 12.345.678/0001-01
    if (value.length > 11) {
      // CNPJ
      value =
        value.slice(0, 2) +
        "." +
        value.slice(2, 5) +
        "." +
        value.slice(5, 8) +
        "/" +
        value.slice(8, 12) +
        "-" +
        value.slice(12);
    } else if (value.length > 9) {
      // CPF
      value =
        value.slice(0, 3) +
        "." +
        value.slice(3, 6) +
        "." +
        value.slice(6, 9) +
        "-" +
        value.slice(9);
    }

    setFormData((prev) => ({ ...prev, customerDocument: value }));
  };

  const validateForm = () => {
    // Cliente
    if (!formData.customerName.trim()) {
      toast.error("Nome completo é obrigatório");
      return false;
    }
    if (
      !formData.customerEmail.trim() ||
      !formData.customerEmail.includes("@")
    ) {
      toast.error("E-mail válido é obrigatório");
      return false;
    }
    if (formData.customerPhone.replace(/\D/g, "").length < 10) {
      toast.error("Telefone válido é obrigatório");
      return false;
    }
    if (formData.customerDocument.replace(/\D/g, "").length < 11) {
      toast.error("CPF/CNPJ válido é obrigatório");
      return false;
    }

    // Endereço
    if (formData.zipCode.replace(/\D/g, "").length !== 8) {
      toast.error("CEP válido é obrigatório");
      return false;
    }
    if (!formData.street.trim()) {
      toast.error("Rua é obrigatória");
      return false;
    }
    if (!formData.number.trim()) {
      toast.error("Número é obrigatório");
      return false;
    }
    if (!formData.neighborhood.trim()) {
      toast.error("Bairro é obrigatório");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Cidade é obrigatória");
      return false;
    }
    if (!formData.state.trim()) {
      toast.error("Estado é obrigatório");
      return false;
    }

    // Pagamento
    if (!formData.paymentMethod) {
      toast.error("Selecione a forma de pagamento");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const subtotal = getTotalPrice();
      const total = subtotal + shipping;

      // Preparar itens do pedido
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.salePrice || item.price,
        totalPrice: (item.salePrice || item.price) * item.quantity,
      }));

      // Criar pedido
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Cliente
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            customerDocument: formData.customerDocument,

            // Endereço
            zipCode: formData.zipCode.replace(/\D/g, ""),
            street: formData.street,
            number: formData.number,
            complement: formData.complement || null,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,

            // Valores
            subtotal,
            shipping,
            discount: 0,
            total,

            // Pagamento
            paymentMethod: formData.paymentMethod,

            // Observações
            notes: formData.notes || null,

            // Itens
            items: orderItems,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erro ao criar pedido");
      }

      // ✅ ORDEM CORRIGIDA: navigate ANTES de clearCart
      const orderNumber = data.data.orderNumber;

      // Limpar carrinho
      clearCart();

      // Sucesso!
      toast.success("Pedido criado com sucesso!");

      // Redirecionar (isso garante que não há race condition)
      navigate(`/order-success/${orderNumber}`);
    } catch (error: unknown) {
      // ✅ TIPAGEM CORRIGIDA: usar unknown e instanceof
      const message =
        error instanceof Error ? error.message : "Erro ao finalizar pedido";
      console.error("Erro ao finalizar pedido:", error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Preencha seus dados para concluir o pedido
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados do Cliente */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-user text-primary"></i>
                  Dados Pessoais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="João da Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="joao@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="text"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handlePhoneChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF/CNPJ *
                    </label>
                    <input
                      type="text"
                      name="customerDocument"
                      value={formData.customerDocument}
                      onChange={handleDocumentChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123.456.789-01"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  Endereço de Entrega
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleCepChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="12345-678"
                      />
                      {searchingCep && (
                        <i className="fas fa-spinner fa-spin absolute right-3 top-3 text-gray-400"></i>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Rua das Flores"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Apto 101"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Centro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      maxLength={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-credit-card text-primary"></i>
                  Forma de Pagamento
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PIX"
                      checked={formData.paymentMethod === "PIX"}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary"
                    />
                    <i className="fas fa-qrcode text-2xl text-gray-600"></i>
                    <div>
                      <p className="font-medium text-gray-900">PIX</p>
                      <p className="text-sm text-gray-500">
                        Aprovação imediata
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CREDIT_CARD"
                      checked={formData.paymentMethod === "CREDIT_CARD"}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary"
                    />
                    <i className="fas fa-credit-card text-2xl text-gray-600"></i>
                    <div>
                      <p className="font-medium text-gray-900">
                        Cartão de Crédito
                      </p>
                      <p className="text-sm text-gray-500">
                        Parcelamento em até 10x
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BOLETO"
                      checked={formData.paymentMethod === "BOLETO"}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary"
                    />
                    <i className="fas fa-barcode text-2xl text-gray-600"></i>
                    <div>
                      <p className="font-medium text-gray-900">
                        Boleto Bancário
                      </p>
                      <p className="text-sm text-gray-500">
                        Vencimento em 3 dias
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Observações */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-comment text-primary"></i>
                  Observações (Opcional)
                </h2>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Deixe uma observação sobre sua entrega..."
                />
              </div>
            </div>

            {/* Resumo do Pedido (1/3) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  Resumo do Pedido
                </h2>

                {/* Itens */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={
                          item.imageUrl ||
                          "https://placehold.co/60x60/F3F4F6/9CA3AF?text=Sem+Img"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity}x R${" "}
                          {(item.salePrice || item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        R${" "}
                        {(
                          (item.salePrice || item.price) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Valores */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "item" : "itens"})
                    </span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frete</span>
                    <span>
                      {shipping === 0
                        ? "A calcular"
                        : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão Finalizar */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Finalizar Pedido
                    </>
                  )}
                </button>

                <Link
                  to="/cart"
                  className="block text-center text-sm text-gray-600 hover:text-primary mt-4"
                >
                  <i className="fas fa-arrow-left mr-1"></i>
                  Voltar ao carrinho
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
