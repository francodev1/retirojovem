// PIX Configuration
export const PIX_CONFIG = {
  // Chave PIX estática (você precisa adicionar a sua)
  chave: process.env.NEXT_PUBLIC_PIX_KEY || 'seu-cpf-ou-email@pix',
  // QR Code em formato base64 ou URL
  qrCodeUrl: process.env.NEXT_PUBLIC_PIX_QR_CODE || '',
  // Ou dados para gerar o QR Code dinamicamente
  banco: 'Seu Banco',
  titular: 'Retiro Closer',
  valor: 299.90,
};

// MercadoPago Configuration
export const MERCADOPAGO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
};

// Preço padrão
export const PRECO_RETIRO = 299.90;
export const JUROS_PARCELA = 0.04; // 4% por parcela

// Calcular parcelamento
export function calcularParcelamento(numParcelas: number): {
  total: number;
  porParcela: number;
  juros: number;
} {
  if (numParcelas === 1) {
    return {
      total: PRECO_RETIRO,
      porParcela: PRECO_RETIRO,
      juros: 0,
    };
  }

  const juros = PRECO_RETIRO * JUROS_PARCELA * (numParcelas - 1);
  const total = PRECO_RETIRO + juros;
  const porParcela = total / numParcelas;

  return {
    total,
    porParcela,
    juros,
  };
}
