import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { nomeInscrito, email, telefone, valor } = await req.json();

    console.log('🔵 POST /api/pagamento/stripe-session recebido:', {
      nomeInscrito,
      email,
      telefone,
      valor,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      client_reference_id: `${Date.now()}_${nomeInscrito}`,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Inscrição Retiro Closer 2025 - ${nomeInscrito}`,
              description: `Inscrição de ${nomeInscrito} (${telefone})`,
            },
            unit_amount: Math.round(valor * 100), // Converter para centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pagamento?canceled=true`,
      metadata: {
        nomeInscrito,
        email,
        telefone,
        valor: valor.toString(),
      },
    });

    console.log('✅ Checkout Session criada:', session.id);
    console.log('   URL:', session.url);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('❌ Erro ao criar Checkout Session:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar pagamento',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
