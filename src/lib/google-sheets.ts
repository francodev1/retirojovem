import { google } from 'googleapis';

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

// Inicializar autenticação
function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account' as const,
      project_id: 'retiro-closer',
      private_key_id: '74ecce919074dc8c54e3df019c1e643ced645360',
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: '107717769958195898519',
      token_uri: 'https://oauth2.googleapis.com/token',
    } as any,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

// Atualizar status de pagamento no Sheets
export async function updatePaymentStatus(email: string, status: 'Confirmado' | 'Pendente' | 'Recusado') {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID não está configurado');
    }

    // Buscar todas as linhas para encontrar o email
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A2:K',
    });

    const rows = getResponse.data.values || [];
    
    // Encontrar a linha com o email (coluna B)
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1] === email) {
        rowIndex = i + 2; // +2 porque começamos em A2 (linha 2) e Arrays começam em 0
        break;
      }
    }

    if (rowIndex === -1) {
      console.warn(`Email ${email} não encontrado na planilha`);
      return false;
    }

    // Atualizar a coluna K (Status Pagamento)
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `K${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      },
    });

    console.log(`✅ Status de pagamento atualizado para ${email}: ${status}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar status de pagamento:', error);
    throw error;
  }
}

// Enviar dados para Google Sheets com coluna de status
export async function sendToGoogleSheets(data: FormData) {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID não está configurado');
    }

    // Preparar os dados para envio (na ordem dos headers)
    const values = [
      [
        data.nome,
        data.email,
        data.telefone,
        data.idade,
        data.alergia,
        data.beliche,
        data.participouAntes,
        data.comoConheceu,
        data.tipoPagamento,
        data.precisaTransporte,
        '', // paymentId (vazio, será preenchido depois)
        'Pendente', // paymentStatus
        new Date().toLocaleString('pt-BR'), // createdAt
      ],
    ];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('✅ Dados adicionados ao Sheets:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Erro ao adicionar dados ao Sheets:', error);
    throw error;
  }
}

// Função alternativa para append
export async function appendToSheet(data: FormData) {
  return sendToGoogleSheets(data);
}

// Salvar pergunta anônima
export async function savePergunta(pergunta: string) {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_PERGUNTAS_ID || process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID não está configurado');
    }

    const values = [
      [
        new Date().toLocaleString('pt-BR'),
        pergunta,
        'Pendente', // status
        '', // resposta
      ],
    ];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Perguntas!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('✅ Pergunta adicionada ao Sheets');
    return result.data;
  } catch (error) {
    console.error('❌ Erro ao adicionar pergunta ao Sheets:', error);
    throw error;
  }
}

// Buscar perguntas
export async function getPerguntas() {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_PERGUNTAS_ID || process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID não está configurado');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Perguntas!A2:D',
    });

    const rows = response.data.values || [];
    
    return rows.map((row, index) => ({
      id: index + 1,
      data: row[0] || '',
      pergunta: row[1] || '',
      status: row[2] || 'Pendente',
      resposta: row[3] || '',
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar perguntas:', error);
    throw error;
  }
}
