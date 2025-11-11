# ✅ Migração Completa para API Twilio

## O que foi alterado?

### ❌ ANTES (API Externa)
- Dependia de `NEXT_PUBLIC_API_BASE_URL` para API externa
- Endpoint: `{NEXT_PUBLIC_API_BASE_URL}/panic`
- Necessitava servidor backend separado
- Erro: "API URL not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable."

### ✅ AGORA (API Twilio Integrada)
- Usa API Route interna do Next.js
- Endpoint: `/api/sendMessage`
- Tudo em um único projeto
- Envia mensagens diretamente via Twilio WhatsApp

## Arquivos Modificados

### 1. `/src/lib/api.ts`
**Mudança Principal**: Função `sendEmergencyAlert()` agora usa `/api/sendMessage`

```typescript
// ANTES: Chamava API externa
const response = await fetch(`${apiUrl}/panic`, { ... });

// AGORA: Usa API interna do Twilio
const response = await fetch('/api/sendMessage', {
  method: 'POST',
  body: JSON.stringify({
    to: contact,
    message: fullMessage, // Inclui localização e link do Google Maps
  }),
});
```

**Melhorias**:
- ✅ Adiciona link do Google Maps à mensagem
- ✅ Envia para múltiplos contatos em paralelo
- ✅ Melhor formatação da mensagem de emergência
- ✅ Não precisa mais de NEXT_PUBLIC_API_BASE_URL

### 2. `/src/app/page.tsx`
**Mudança**: Número de contato padrão atualizado

```typescript
// ANTES
const EMERGENCY_CONTACTS = [
  process.env.NEXT_PUBLIC_CONTACT_1 || "+15085140864",
];

// AGORA
const EMERGENCY_CONTACTS = [
  process.env.NEXT_PUBLIC_CONTACT_1 || "+5085140864",
];
```

### 3. `/.env.local.example`
**Adicionado**: Configuração do contato de emergência

```env
# Emergency Contact Number (optional - default is +5085140864)
NEXT_PUBLIC_CONTACT_1=+5085140864
```

## Formato da Mensagem Enviada

Quando você apertar o botão de EMERGÊNCIA, a mensagem será enviada assim:

```
🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: [Endereço completo da localização]

📍 Localização exata:
Latitude: -23.550520
Longitude: -46.633308

🗺️ Ver no mapa: https://www.google.com/maps?q=-23.550520,-46.633308
```

## Como Funciona Agora

1. **Usuário aperta o botão de EMERGÊNCIA**
2. **App obtém localização GPS precisa**
3. **Faz geocoding reverso** para obter endereço legível
4. **Chama `/api/sendMessage`** (API Route interna)
5. **API Route usa Twilio** para enviar WhatsApp
6. **Mensagem é enviada para +5085140864** (seu número)
7. **Você recebe no WhatsApp** com endereço e link do mapa

## Variáveis de Ambiente Necessárias

### ✅ Obrigatórias (na Vercel)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```
**Você já configurou isso! ✓**

### 🔧 Opcional (para múltiplos contatos)
```env
NEXT_PUBLIC_CONTACT_1=+5085140864
```
Se não configurar, usa `+5085140864` como padrão.

## Variáveis de Ambiente Removidas

### ❌ NÃO É MAIS NECESSÁRIO
```env
NEXT_PUBLIC_API_BASE_URL  # Removido! Não precisa mais!
```

## Verificação de Build

✅ **Linting**: Passou sem erros
✅ **Build**: Compilado com sucesso
✅ **TypeScript**: Sem erros de tipo
✅ **API Route**: Criada em `/api/sendMessage`

## Testando Localmente

### 1. Criar `.env.local`
```bash
cp .env.local.example .env.local
```

### 2. Adicionar suas credenciais
```env
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=seu_numero_twilio
NEXT_PUBLIC_CONTACT_1=+5085140864
```

### 3. Iniciar servidor
```bash
npm run dev
```

### 4. Testar a API diretamente
```bash
# Testar API
./scripts/test-twilio-api.sh +5085140864 "Teste de mensagem"

# Ou com curl
curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"to": "+5085140864", "message": "Teste"}'
```

### 5. Testar a aplicação
1. Abra http://localhost:3000
2. Permita acesso à localização
3. Clique no botão EMERGENCY
4. Você receberá a mensagem no WhatsApp!

## Deploy na Vercel

Como você já configurou as variáveis do Twilio na Vercel:

```bash
# 1. Commit das mudanças
git add .
git commit -m "Migrate to Twilio API routes, remove external API dependency"

# 2. Push para o repositório
git push origin cursor/configurar-rota-de-api-para-enviar-mensagens-com-twilio-f803

# 3. Vercel fará deploy automático
```

**Pronto!** A aplicação funcionará em produção enviando mensagens para `+5085140864`.

## Adicionando Múltiplos Contatos

Se quiser enviar para mais de um número, edite `/src/app/page.tsx`:

```typescript
const EMERGENCY_CONTACTS = [
  process.env.NEXT_PUBLIC_CONTACT_1 || "+5085140864",
  "+5511999999999", // Adicione mais números aqui
  "+5521888888888",
];
```

Ou configure mais variáveis de ambiente:

```env
NEXT_PUBLIC_CONTACT_1=+5085140864
NEXT_PUBLIC_CONTACT_2=+5511999999999
NEXT_PUBLIC_CONTACT_3=+5521888888888
```

E atualize o código:

```typescript
const EMERGENCY_CONTACTS = [
  process.env.NEXT_PUBLIC_CONTACT_1 || "+5085140864",
  process.env.NEXT_PUBLIC_CONTACT_2,
  process.env.NEXT_PUBLIC_CONTACT_3,
].filter(Boolean); // Remove valores undefined
```

## Fluxo Completo

```
┌─────────────────┐
│  Usuário        │
│  Aperta Botão   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useGeolocation │
│  Obtém GPS      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  reverseGeocode │
│  OpenStreetMap  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  sendEmergency  │
│  /api/sendMsg   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Twilio API     │
│  WhatsApp       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  +5085140864    │
│  Recebe no      │
│  WhatsApp       │
└─────────────────┘
```

## Vantagens da Nova Implementação

✅ **Mais simples**: Tudo em um único projeto
✅ **Menos configuração**: Não precisa de backend separado
✅ **Mais seguro**: Credenciais do Twilio ficam no servidor
✅ **Mais rápido**: API interna é mais rápida
✅ **Melhor mensagem**: Inclui link do Google Maps
✅ **Suporte a múltiplos contatos**: Envia para vários números
✅ **Deploy mais fácil**: Um único deploy na Vercel

## Troubleshooting

### Erro: "Número de telefone inválido"
- Use formato internacional: `+5085140864`
- Não use espaços ou caracteres especiais

### Erro: "Twilio credentials not configured"
- Verifique se as variáveis estão configuradas na Vercel
- Nomes devem ser exatos: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`

### Não recebe mensagem no WhatsApp
- Se usar Twilio Sandbox, você precisa enviar uma mensagem específica primeiro para o número do Twilio
- Veja: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

### Erro de localização
- Permita acesso à localização no navegador
- Use HTTPS (Vercel já usa automaticamente)

## Status Final

🎉 **Migração Completa!**

- ✅ API externa removida
- ✅ API Twilio integrada
- ✅ Número padrão configurado: +5085140864
- ✅ Build passando
- ✅ Linting passando
- ✅ Pronto para deploy

## Próximos Passos

1. ✅ Fazer commit das mudanças
2. ✅ Push para o repositório
3. ✅ Vercel fará deploy automático
4. ✅ Testar em produção
5. ✅ Receber mensagens de emergência no WhatsApp!

---

**🚀 Tudo pronto para uso!** Basta fazer o deploy e você receberá as mensagens de emergência no número +5085140864.
