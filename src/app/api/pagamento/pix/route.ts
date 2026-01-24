import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { nomeInscrito, email, telefone, valor } = await req.json();

    // Criar ordem de pagamento PIX no MercadoPago
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: valor,
        description: `Inscrição Retiro Closer - ${nomeInscrito}`,
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: nomeInscrito,
          phone: {
            area_code: '55',
            number: telefone.replace(/\D/g, ''),
          },
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notificacoes/pagamento`,
      }),
    });

    const data = await response.json();

    if (data.id) {
      // QR Code PIX foi gerado
      return NextResponse.json({
        success: true,
        qrCode: data.point_of_interaction?.qr_code?.in_store_order_id,
        qrCodeId: data.id,
        status: data.status,
        transactionId: data.id,
      });
    } else {
      return NextResponse.json(
        { error: 'Erro ao gerar PIX', details: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro na geração de PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar PIX' },
      { status: 500 }
    );
  }
}
