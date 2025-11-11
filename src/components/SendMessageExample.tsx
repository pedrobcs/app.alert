'use client';

import { useState } from 'react';
import { sendWhatsAppMessage, formatPhoneNumber } from '@/lib/twilio';

/**
 * Componente exemplo de como enviar mensagens via WhatsApp usando Twilio
 * 
 * Para usar:
 * 1. Configure as variáveis de ambiente (veja TWILIO_SETUP.md)
 * 2. Importe este componente em sua página
 * 3. Personalize o estilo conforme necessário
 */
export default function SendMessageExample() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Formatar o número de telefone
      const formattedPhone = formatPhoneNumber(phone);

      // Enviar mensagem
      const result = await sendWhatsAppMessage({
        to: formattedPhone,
        message: message,
      });

      if (result.success) {
        setStatus({
          type: 'success',
          message: `Mensagem enviada com sucesso! ID: ${result.messageSid}`,
        });
        // Limpar formulário
        setPhone('');
        setMessage('');
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Erro ao enviar mensagem',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Erro inesperado ao enviar mensagem',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Enviar Mensagem WhatsApp
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número de Telefone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+5511999999999 ou 11999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use o formato internacional (ex: +5511999999999) ou apenas os dígitos (11999999999)
          </p>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mensagem
          </label>
          <textarea
            id="message"
            placeholder="Digite sua mensagem aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={loading}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Máximo de 1600 caracteres
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !phone || !message}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </span>
          ) : (
            'Enviar Mensagem'
          )}
        </button>
      </form>

      {status.type && (
        <div
          className={`mt-4 p-4 rounded-md ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <p className="text-sm font-medium">
            {status.type === 'success' ? '✓ Sucesso!' : '✗ Erro'}
          </p>
          <p className="text-sm mt-1">{status.message}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>⚠️ Importante:</strong> Certifique-se de que as variáveis de
          ambiente do Twilio estão configuradas. Consulte o arquivo
          TWILIO_SETUP.md para instruções detalhadas.
        </p>
      </div>
    </div>
  );
}
