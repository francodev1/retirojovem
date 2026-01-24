import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentStatus } from '@/lib/google-sheets';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log('📨 Notificação recebida do MercadoPago:', data);

    // MercadoPago envia notificações com este formato
    const { type, data: paymentData } = data;

    if (type === 'payment') {
      // Buscar detalhes do pagamento
      const paymentId = paymentData.id;

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await paymentResponse.json();

      if (payment.status === 'approved') {
        // Pagamento aprovado! Atualizar Sheets
        console.log('✅ Pagamento aprovado:', payment.id);
        
        // Obter email do pagamento (armazenado na payer info)
        const email = payment.payer?.email || payment.description;
        
        if (email) {
          try {
            await updatePaymentStatus(email, 'Confirmado');
            console.log(`✅ Status atualizado para CONFIRMADO: ${email}`);
          } catch (updateError) {
            console.error('⚠️ Erro ao atualizar Sheets:', updateError);
          }
        }

        return NextResponse.json({ 
          received: true, 
          status: 'approved',
          message: 'Pagamento confirmado' 
        });

      } else if (payment.status === 'pending') {
        console.log('⏳ Pagamento pendente:', payment.id);
        return NextResponse.json({ 
          received: true, 
          status: 'pending' 
        });

      } else {
        // Pagamento recusado ou cancelado
        console.log('❌ Pagamento rejeitado:', payment.id);
        
        const email = payment.payer?.email || payment.description;
        if (email) {
          try {
            await updatePaymentStatus(email, 'Recusado');
          } catch (updateError) {
            console.error('⚠️ Erro ao atualizar status recusado:', updateError);
          }
        }

        return NextResponse.json({ 
          received: true, 
          status: 'rejected' 
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Erro ao processar notificação:', error);
    // Sempre retornar 200 para MercadoPago não reenviar a notificação
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
