import { NextRequest, NextResponse } from 'next/server';
import { sendToGoogleSheets } from '@/lib/google-sheets';
import { validateFormData } from '@/lib/validation';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  alergia: string;
  beliche: string;
  participouAntes: string;
  comoConheceu: string;
  tipoPagamento: string;
  precisaTransporte: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: FormData = await req.json();

    // Validar e sanitizar dados
    const validation = validateFormData(data);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const sanitizedData = validation.data as FormData;
    console.log('✅ Inscrição recebida e validada:', sanitizedData.nome);

    // Enviar para Google Sheets
    try {
      await sendToGoogleSheets(sanitizedData);
      console.log('✅ Dados enviados para Google Sheets');
    } catch (sheetError) {
      console.error('⚠️ Erro ao enviar para Sheets:', sheetError);
      // Continuar mesmo se Sheets falhar
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inscrição realizada com sucesso!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro na inscrição:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar inscrição',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
