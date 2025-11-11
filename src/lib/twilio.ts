/**
 * Biblioteca auxiliar para enviar mensagens via Twilio
 */

interface SendMessageParams {
  to: string;
  message: string;
}

interface SendMessageResponse {
  success: boolean;
  messageSid?: string;
  status?: string;
  error?: string;
}

/**
 * Envia uma mensagem via WhatsApp usando a API do Twilio
 * @param to - Número de telefone no formato internacional (ex: +5511999999999)
 * @param message - Mensagem a ser enviada
 * @returns Promise com a resposta da API
 */
export async function sendWhatsAppMessage({
  to,
  message,
}: SendMessageParams): Promise<SendMessageResponse> {
  try {
    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return {
      success: false,
      error: 'Erro de conexão ao tentar enviar mensagem',
    };
  }
}

/**
 * Formata um número de telefone para o formato internacional
 * @param phone - Número de telefone
 * @param countryCode - Código do país (padrão: +55 para Brasil)
 * @returns Número formatado
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+55'): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se já começa com +, retorna como está
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Se começa com 0, remove o 0
  const phoneWithoutLeadingZero = cleanPhone.startsWith('0') 
    ? cleanPhone.substring(1) 
    : cleanPhone;
  
  // Adiciona o código do país
  return `${countryCode}${phoneWithoutLeadingZero}`;
}
