# 🧪 Guia Rápido de Teste

## Testar Localmente (Desenvolvimento)

### 1. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env.local
cp .env.local.example .env.local
```

Editar `.env.local` com suas credenciais:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
NEXT_PUBLIC_CONTACT_1=+5085140864
```

### 2. Iniciar Servidor

```bash
npm run dev
```

### 3. Testar API Diretamente

```bash
# Método 1: Usando o script de teste
./scripts/test-twilio-api.sh +5085140864 "Teste de emergência"

# Método 2: Usando curl
curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5085140864",
    "message": "🚨 Teste de mensagem de emergência"
  }'
```

### 4. Testar a Aplicação Completa

1. Abra: http://localhost:3000
2. Permita acesso à localização quando solicitado
3. Aguarde a localização ser obtida
4. Clique no botão **EMERGENCY**
5. Verifique seu WhatsApp para a mensagem

## Testar em Produção (Vercel)

### Pré-requisito

Certifique-se de que as variáveis de ambiente estão configuradas na Vercel:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

### Teste 1: Verificar se a API está funcionando

```bash
# Substitua pelo seu domínio Vercel
curl https://seu-app.vercel.app/api/sendMessage

# Deve retornar:
# {
#   "message": "API de envio de mensagens está funcionando!",
#   "endpoint": "/api/sendMessage",
#   ...
# }
```

### Teste 2: Enviar mensagem de teste

```bash
# Usando o script
API_URL=https://seu-app.vercel.app/api/sendMessage \
  ./scripts/test-twilio-api.sh +5085140864 "Teste em produção"

# Ou usando curl
curl -X POST https://seu-app.vercel.app/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5085140864",
    "message": "Teste de produção"
  }'
```

### Teste 3: Usar a aplicação

1. Acesse: https://seu-app.vercel.app
2. Permita localização
3. Clique no botão EMERGENCY
4. Verifique o WhatsApp

## Checklist de Testes

### ✅ Testes da API

- [ ] GET `/api/sendMessage` retorna informações da API
- [ ] POST `/api/sendMessage` com dados válidos envia mensagem
- [ ] POST com número inválido retorna erro apropriado
- [ ] POST sem campos obrigatórios retorna erro 400
- [ ] Mensagem chega no WhatsApp do destinatário

### ✅ Testes da Aplicação

- [ ] App carrega sem erros
- [ ] Solicita permissão de localização
- [ ] Mostra localização atual quando permitido
- [ ] Botão EMERGENCY fica habilitado com localização
- [ ] Clicar no botão envia mensagem
- [ ] Mostra feedback de sucesso/erro
- [ ] Mensagem inclui endereço correto
- [ ] Link do Google Maps funciona
- [ ] PWA instala corretamente

### ✅ Testes Mobile

- [ ] App funciona em Chrome Mobile
- [ ] App funciona em Safari iOS
- [ ] PWA instala no Android
- [ ] PWA instala no iOS
- [ ] Localização funciona no mobile
- [ ] Mensagem é enviada do mobile

## Exemplo de Mensagem Esperada

Quando você clicar no botão EMERGENCY, deve receber algo assim no WhatsApp:

```
🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200, Brasil

📍 Localização exata:
Latitude: -23.561414
Longitude: -46.655881

🗺️ Ver no mapa: https://www.google.com/maps?q=-23.561414,-46.655881
```

## Solução de Problemas

### ❌ Não recebe mensagem no WhatsApp

**Problema**: Usando Twilio Sandbox

**Solução**: 
1. Acesse: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Envie a mensagem de ativação para o número do Twilio
3. Exemplo: "join [seu-código]"
4. Tente enviar novamente

### ❌ Erro: "Invalid phone number"

**Problema**: Formato incorreto

**Solução**:
- Use formato internacional: `+5085140864`
- Inclua o `+` e código do país
- Sem espaços ou caracteres especiais

### ❌ Erro: "Twilio credentials not configured"

**Problema**: Variáveis de ambiente não configuradas

**Solução Local**:
```bash
# Verifique se .env.local existe
cat .env.local

# Deve conter:
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+...
```

**Solução Vercel**:
1. Vá em Settings → Environment Variables
2. Adicione as 3 variáveis
3. Faça redeploy

### ❌ Erro de localização

**Problema**: Permissão negada

**Solução**:
1. Chrome: Settings → Privacy → Location → Allow
2. Safari: Preferences → Websites → Location → Allow
3. Use HTTPS (obrigatório para geolocalização)

### ❌ Build falha

**Problema**: Erro de compilação

**Solução**:
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install

# Tente build novamente
npm run build
```

## Comandos Úteis

```bash
# Limpar tudo e reinstalar
npm run clean && npm install

# Build para produção
npm run build

# Iniciar em modo produção
npm start

# Verificar linting
npm run lint

# Ver logs do Vercel
vercel logs
```

## Monitoramento em Produção

### Ver logs na Vercel

1. Acesse dashboard da Vercel
2. Selecione seu projeto
3. Vá em "Logs"
4. Filtre por "/api/sendMessage"

### Verificar uso do Twilio

1. Acesse: https://console.twilio.com/
2. Vá em "Monitor" → "Logs" → "Messaging"
3. Veja todas as mensagens enviadas
4. Verifique status e erros

## Custos Esperados

- **Twilio WhatsApp**: ~$0.005 por mensagem
- **Vercel**: Grátis (até limites do plano gratuito)
- **OpenStreetMap Nominatim**: Grátis

## Testes Automatizados (Futuro)

Para adicionar testes automatizados:

```bash
# Instalar Jest
npm install -D jest @testing-library/react @testing-library/jest-dom

# Criar testes
# test/api/sendMessage.test.ts
# test/components/EmergencyButton.test.tsx
```

## Conclusão

✅ API funcionando: `/api/sendMessage`
✅ Mensagens chegando no WhatsApp: +5085140864
✅ Localização sendo capturada
✅ Link do Google Maps funcionando
✅ Pronto para uso em emergências!

---

**⚠️ IMPORTANTE**: Este é um sistema de alerta suplementar. Em emergências reais, sempre ligue para os serviços de emergência locais (911, 190, etc.).
