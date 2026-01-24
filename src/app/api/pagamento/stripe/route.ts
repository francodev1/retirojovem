import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Cálculo de taxa Stripe: 2,99% + R$ 0,30 por transação
const STRIPE_PERCENTAGE = 0.0299;
const STRIPE_FIXED_FEE = 0.30;

// Calcula o valor total incluindo taxa
function calculateAmountWithFee(baseAmount: number): number {
  // Se quer receber X líquido, o total é: (X + 0.30) / (1 - 0.0299)
  const totalAmount = Math.round(((baseAmount + STRIPE_FIXED_FEE) / (1 - STRIPE_PERCENTAGE)) * 100) / 100;
  return totalAmount;
}

export async function POST(req: NextRequest) {
  try {
    const { nomeInscrito, email, telefone, valor } = await req.json();
    
    console.log('🔵 POST /api/pagamento/stripe recebido:', { nomeInscrito, email, telefone, valor });
    
    // Calcula valor com taxa
    const totalAmount = calculateAmountWithFee(valor);
    const amountInCents = Math.round(totalAmount * 100);
    const baseFee = calculateAmountWithFee(valor) - valor;
    
    console.log('🟢 Criando Stripe Payment Intent...');
    console.log(`   Valor base: R$ ${valor.toFixed(2)}`);
    console.log(`   Taxa: R$ ${baseFee.toFixed(2)}`);
    console.log(`   Total: R$ ${totalAmount.toFixed(2)}`);
    console.log(`   Centavos: ${amountInCents}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'brl',
      payment_method_types: ['card'],
      description: `Inscrição Retiro Closer para ${nomeInscrito}`,
      receipt_email: email,
      metadata: {
        nomeInscrito,
        email,
        telefone,
        valorBase: valor.toString(),
        taxa: baseFee.toString(),
      },
    });

    console.log('✅ Payment Intent criado:', paymentIntent.id);
    
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      amountFormatted: `R$ ${totalAmount.toFixed(2).replace('.', ',')}`,
      baseFee: baseFee.toFixed(2),
    });
  } catch (error) {
    console.error('❌ Erro ao criar Payment Intent:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao processar pagamento',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
