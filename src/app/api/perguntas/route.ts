import { NextRequest, NextResponse } from 'next/server';
import { savePergunta, getPerguntas } from '@/lib/google-sheets';

export async function POST(req: NextRequest) {
  try {
    const { pergunta } = await req.json();

    if (!pergunta || pergunta.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pergunta não pode estar vazia',
        },
        { status: 400 }
      );
    }

    if (pergunta.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pergunta muito longa (máximo 1000 caracteres)',
        },
        { status: 400 }
      );
    }

    await savePergunta(pergunta.trim());

    return NextResponse.json({
      success: true,
      message: 'Pergunta enviada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao salvar pergunta:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao enviar pergunta. Tente novamente.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const perguntas = await getPerguntas();

    return NextResponse.json({
      success: true,
      perguntas,
    });
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar perguntas',
        perguntas: [],
      },
      { status: 500 }
    );
  }
}
