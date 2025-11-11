import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Interface para o corpo da requisição
interface SendMessageRequest {
  to: string;
  message: string;
}

// Interface para a resposta de sucesso
interface SuccessResponse {
  success: true;
  messageSid: string;
  status: string;
}

// Interface para a resposta de erro
interface ErrorResponse {
  success: false;
  error: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Credenciais do Twilio não configuradas. Verifique as variáveis de ambiente.',
        },
        { status: 500 }
      );
    }

    // Parsear o corpo da requisição
    const body: SendMessageRequest = await request.json();
    const { to, message } = body;

    // Validar os dados recebidos
    if (!to || !message) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Os campos "to" e "message" são obrigatórios.',
        },
        { status: 400 }
      );
    }

    // Validar formato do número de telefone (básico)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Número de telefone inválido. Use o formato internacional (ex: +5511999999999).',
        },
        { status: 400 }
      );
    }

    // Inicializar cliente Twilio
    const client = twilio(accountSid, authToken);

    // Enviar mensagem via WhatsApp
    const twilioMessage = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${to}`,
    });

    // Retornar resposta de sucesso
    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        messageSid: twilioMessage.sid,
        status: twilioMessage.status,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Erro ao enviar mensagem:', error);

    // Tratar erros específicos do Twilio
    if (error && typeof error === 'object' && 'code' in error) {
      const twilioError = error as { code: string; message: string };
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: `Erro do Twilio (${twilioError.code}): ${twilioError.message}`,
        },
        { status: 400 }
      );
    }

    // Erro genérico
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Erro ao enviar mensagem. Tente novamente mais tarde.',
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar se a API está funcionando
export async function GET() {
  return NextResponse.json(
    {
      message: 'API de envio de mensagens está funcionando!',
      endpoint: '/api/sendMessage',
      method: 'POST',
      requiredFields: ['to', 'message'],
      example: {
        to: '+5511999999999',
        message: 'Sua mensagem aqui',
      },
    },
    { status: 200 }
  );
}
