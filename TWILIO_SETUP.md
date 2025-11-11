# Configuração do Twilio para WhatsApp

## 📋 Pré-requisitos

1. Conta no Twilio (crie em [https://www.twilio.com/](https://www.twilio.com/))
2. Número de WhatsApp configurado no Twilio Sandbox ou número verificado
3. Credenciais do Twilio

## 🔧 Configuração

### 1. Obter Credenciais do Twilio

1. Acesse o [Console do Twilio](https://console.twilio.com/)
2. Copie seu **Account SID** e **Auth Token**
3. Configure o WhatsApp seguindo [este guia](https://www.twilio.com/docs/whatsapp/quickstart)
4. Anote seu número de WhatsApp do Twilio

### 2. Configurar Variáveis de Ambiente

#### Local (Desenvolvimento)

Crie um arquivo `.env.local` na raiz do projeto:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### Vercel (Produção)

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as três variáveis:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`

## 🚀 Uso da API

### Endpoint

```
POST /api/sendMessage
```

### Request Body

```json
{
  "to": "+5511999999999",
  "message": "Sua mensagem aqui"
}
```

### Response (Sucesso)

```json
{
  "success": true,
  "messageSid": "SM1234567890abcdef",
  "status": "queued"
}
```

### Response (Erro)

```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

## 💻 Exemplos de Código

### Usando a biblioteca auxiliar

```typescript
import { sendWhatsAppMessage, formatPhoneNumber } from '@/lib/twilio';

// Exemplo 1: Enviar mensagem simples
const result = await sendWhatsAppMessage({
  to: '+5511999999999',
  message: 'Olá! Esta é uma mensagem de teste.'
});

if (result.success) {
  console.log('Mensagem enviada com sucesso!', result.messageSid);
} else {
  console.error('Erro:', result.error);
}

// Exemplo 2: Formatar número e enviar
const phoneNumber = '11999999999';
const formattedPhone = formatPhoneNumber(phoneNumber); // +5511999999999

const result2 = await sendWhatsAppMessage({
  to: formattedPhone,
  message: 'Mensagem com número formatado'
});
```

### Usando fetch diretamente

```typescript
const response = await fetch('/api/sendMessage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+5511999999999',
    message: 'Sua mensagem aqui'
  })
});

const data = await response.json();
console.log(data);
```

### Exemplo em um componente React

```typescript
'use client';

import { useState } from 'react';
import { sendWhatsAppMessage } from '@/lib/twilio';

export default function SendMessageForm() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const result = await sendWhatsAppMessage({ to: phone, message });

    if (result.success) {
      setStatus('Mensagem enviada com sucesso!');
      setPhone('');
      setMessage('');
    } else {
      setStatus(`Erro: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        placeholder="+5511999999999"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <textarea
        placeholder="Sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
```

## 🧪 Testando Localmente

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Teste a API com curl:
```bash
curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5511999999999",
    "message": "Teste de mensagem"
  }'
```

3. Ou verifique se a API está funcionando:
```bash
curl http://localhost:3000/api/sendMessage
```

## ⚠️ Notas Importantes

1. **Sandbox do Twilio**: Se estiver usando o Twilio Sandbox, os destinatários precisam enviar uma mensagem específica para o número do Twilio antes de receber mensagens.

2. **Formato do Número**: Use sempre o formato internacional completo (ex: `+5511999999999`).

3. **Limites**: Verifique os limites de mensagens da sua conta Twilio.

4. **Custos**: Mensagens via WhatsApp têm custo. Verifique a [tabela de preços do Twilio](https://www.twilio.com/whatsapp/pricing).

5. **Segurança**: Nunca exponha suas credenciais do Twilio no código ou no frontend.

## 🔒 Segurança

- ✅ Credenciais armazenadas como variáveis de ambiente
- ✅ Validação de entrada no backend
- ✅ Rate limiting recomendado (implementar conforme necessário)
- ✅ HTTPS obrigatório em produção

## 📚 Recursos Adicionais

- [Documentação do Twilio WhatsApp](https://www.twilio.com/docs/whatsapp)
- [Twilio Node.js SDK](https://www.twilio.com/docs/libraries/node)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
