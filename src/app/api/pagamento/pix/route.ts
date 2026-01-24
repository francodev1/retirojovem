import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { nomeInscrito, email, telefone, valor } = await req.json();

    console.log('🔵 POST /api/pagamento/pix recebido:', {
      nomeInscrito,
      email,
      telefone,
      valor,
    });

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado');
    }

    const preferenceData = {
      items: [
        {
          id: '1',
          title: `Inscrição Retiro Closer 2025 - ${nomeInscrito}`,
          description: `Inscrição de ${nomeInscrito} (${telefone})`,
          picture_url: 'https://retiro-closer.vercel.app/logo.png',
          category_id: 'services',
          quantity: 1,
          unit_price: valor,
          currency_id: 'BRL',
        },
      ],
      payer: {
        name: nomeInscrito,
        email: email,
        phone: {
          area_code: '55',
          number: telefone.replace(/\D/g, ''),
        },
      },
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'bank_transfer' },
          { id: 'atm' },
          { id: 'credit_card' },
          { id: 'debit_card' },
          { id: 'prepaid_card' },
          { id: 'account_money' },
        ],
        default_payment_method_id: 'pix',
      },
      auto_return: 'approved',
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pendente`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento`,
      },
      metadata: {
        nomeInscrito,
        email,
        telefone,
      },
    };

    console.log('🟢 Enviando preferência para MercadoPago:', {
      items: preferenceData.items,
      payment_methods: preferenceData.payment_methods,
    });

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    console.log('🔵 Resposta MercadoPago PIX (status:', response.status, ')');

    const data = await response.json();

    if (data.init_point) {
      console.log('✅ Preferência criada:', data.id);
      return NextResponse.json({
        success: true,
        init_point: data.init_point,
        preferenceId: data.id,
      });
    } else {
      console.error('❌ Erro na resposta MercadoPago:', data);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao criar preferência no MercadoPago',
          details: data,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Erro ao criar PIX:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar PIX',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
      { error: 'Erro interno ao processar PIX' },
      { status: 500 }
    );
  }
}
