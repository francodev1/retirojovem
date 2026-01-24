import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { nomeInscrito, email, telefone, valor, method } = await req.json();
    console.log('🔵 POST /api/pagamento recebido:', { nomeInscrito, email, telefone, valor, method });
    
    // Se for PIX, gerar link com QR code
    if (method === 'pix') {
      return handlePix(nomeInscrito, email, telefone, valor);
    }
    
    // Se for Cartão, usar Checkout Pro
    return handleCheckoutPro(nomeInscrito, email, telefone, valor);
  } catch (error) {
    console.error('❌ Erro na criação do checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar pagamento', details: String(error) },
      { status: 500 }
    );
  }
}

async function handlePix(nomeInscrito: string, email: string, telefone: string, valor: number) {
  try {
    console.log('🟢 Gerando QR Code para PIX...');
    
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    // Criar preferência de pagamento apenas com PIX
    const pixPayload = {
      items: [
        {
          title: `Inscrição Retiro Closer - ${nomeInscrito}`,
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
          number: (telefone || '').replace(/\D/g, ''),
        },
      },
      statement_descriptor: 'RETIRO CLOSER',
      payment_methods: {
        excluded_payment_types: [
          { id: 'credit_card' },
          { id: 'debit_card' },
          { id: 'ticket' },
          { id: 'atm' },
        ],
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pendente`,
      },
    };
    
    console.log('🔵 Criando preferência PIX no MercadoPago...');
    console.log('🔵 Payload enviado:', JSON.stringify(pixPayload, null, 2));
    console.log('🔵 Headers:', { Authorization: `Bearer ${accessToken?.slice(0, 20)}...`, 'Content-Type': 'application/json' });
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${Date.now()}`,
      },
      body: JSON.stringify(pixPayload),
    });

    const data = await response.json();
    console.log('🔵 Resposta MercadoPago PIX (status:', response.status, ')');
    console.log('🔵 Dados retornados:', JSON.stringify(data, null, 2));

    if (data.init_point) {
      console.log('✅ Checkout PIX criado com sucesso');
      return NextResponse.json({
        success: true,
        init_point: data.init_point,
        preferenceId: data.id,
      });
    } else {
      console.error('❌ Erro na resposta MercadoPago:', data);
      return NextResponse.json(
        { success: false, error: 'Erro ao criar checkout PIX', details: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Erro ao gerar PIX:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar PIX', details: String(error) },
      { status: 500 }
    );
  }
}

async function handleCheckoutPro(nomeInscrito: string, email: string, telefone: string, valor: number) {
  try {
    console.log('🟢 Gerando Checkout Pro para Cartão...');
    
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    // Criar preferência de pagamento apenas com Cartão
    const cartaoPayload = {
      items: [
        {
          title: `Inscrição Retiro Closer - ${nomeInscrito}`,
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
          number: (telefone || '').replace(/\D/g, ''),
        },
      },
      statement_descriptor: 'RETIRO CLOSER',
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'atm' },
        ],
        installments: 12,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pendente`,
      },
    };
    
    console.log('🔵 Criando preferência CARTÃO no MercadoPago...');
    console.log('🔵 Payload enviado:', JSON.stringify(cartaoPayload, null, 2));
    console.log('🔵 Headers:', { Authorization: `Bearer ${accessToken?.slice(0, 20)}...`, 'Content-Type': 'application/json' });
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${Date.now()}`,
      },
      body: JSON.stringify(cartaoPayload),
    });

    const data = await response.json();
    console.log('🔵 Resposta MercadoPago CARTÃO (status:', response.status, ')');
    console.log('🔵 Dados retornados:', JSON.stringify(data, null, 2));

    if (data.init_point) {
      console.log('✅ Checkout CARTÃO criado com sucesso');
      return NextResponse.json({
        success: true,
        init_point: data.init_point,
        preferenceId: data.id,
      });
    } else {
      console.error('❌ Erro na resposta MercadoPago:', data);
      return NextResponse.json(
        { success: false, error: 'Erro ao criar checkout Cartão', details: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Erro ao gerar Cartão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar Cartão', details: String(error) },
      { status: 500 }
    );
  }
}
