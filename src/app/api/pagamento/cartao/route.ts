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
          title: `Inscrição Retiro Closer`,
          quantity: 1,
          unit_price: valor,
          currency_id: 'BRL',
          description: `Inscrição para ${nomeInscrito}`,
        },
      ],
      payer: {
        name: nomeInscrito,
        email: email,
      },
      payment_methods: {
        excluded_payment_methods: [
          { id: 'bolbradesco' },
          { id: 'boletario' },
          { id: 'visa' },
          { id: 'mastercard' },
          { id: 'amex' },
          { id: 'hipercard' },
          { id: 'elo' },
        ],
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'atm' },
          { id: 'credit_card' },
          { id: 'debit_card' },
        ],
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/erro`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pendente`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notificacoes/pagamento`,
      metadata: {
        nomeInscrito,
        email,
        telefone,
        method: 'pix',
      },
    };
    
    console.log('🔵 Criando preferência PIX no MercadoPago...');
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

    // Limpar telefone: remover todos os caracteres não numéricos
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    // Se o telefone tem 11 dígitos (com DDD 55), remover o 55
    const numeroSoArabicoSemDDD = telefoneLimpo.startsWith('55') 
      ? telefoneLimpo.slice(2) 
      : telefoneLimpo;

    // Criar preferência de pagamento apenas com Cartão
    const cartaoPayload = {
      items: [
        {
          title: `Inscrição Retiro Closer`,
          quantity: 1,
          unit_price: valor,
          currency_id: 'BRL',
          description: `Inscrição para ${nomeInscrito}`,
        },
      ],
      payer: {
        name: nomeInscrito,
        email: email,
        phone: {
          area_code: '55',
          number: numeroSoArabicoSemDDD,
        },
      },
      payment_methods: {
        excluded_payment_methods: [
          { id: 'bolbradesco' },
          { id: 'boletario' },
          { id: 'pix' },
        ],
        excluded_payment_types: [
          { id: 'ticket' },
          { id: 'atm' },
        ],
        installments: 12,
        default_installments: 1,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/erro`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pendente`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notificacoes/pagamento`,
      metadata: {
        nomeInscrito,
        email,
        telefone,
        method: 'cartao',
      },
    };
    
    console.log('🔵 Criando preferência CARTÃO no MercadoPago...');
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
