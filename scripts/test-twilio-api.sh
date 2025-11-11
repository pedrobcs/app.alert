#!/bin/bash

# Script de teste para a API de envio de mensagens do Twilio
# Uso: ./scripts/test-twilio-api.sh [telefone] [mensagem]

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuração
API_URL="${API_URL:-http://localhost:3000/api/sendMessage}"

# Função de ajuda
show_help() {
    echo "Uso: $0 [telefone] [mensagem]"
    echo ""
    echo "Exemplos:"
    echo "  $0 +5511999999999 \"Olá, teste!\""
    echo "  $0 11999999999 \"Mensagem de teste\""
    echo ""
    echo "Variáveis de ambiente:"
    echo "  API_URL - URL da API (padrão: http://localhost:3000/api/sendMessage)"
    echo ""
    echo "Para testar em produção:"
    echo "  API_URL=https://seu-dominio.vercel.app/api/sendMessage $0 +5511999999999 \"Teste\""
}

# Verificar argumentos
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Teste GET (verificar se API está funcionando)
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Testando se a API está funcionando (GET)...${NC}"
    echo ""
    response=$(curl -s "$API_URL")
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    exit 0
fi

# Verificar se tem 2 argumentos
if [ $# -ne 2 ]; then
    echo -e "${RED}Erro: Número incorreto de argumentos${NC}"
    show_help
    exit 1
fi

PHONE="$1"
MESSAGE="$2"

echo -e "${YELLOW}Enviando mensagem via Twilio...${NC}"
echo "Para: $PHONE"
echo "Mensagem: $MESSAGE"
echo ""

# Enviar requisição POST
response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"to\":\"$PHONE\",\"message\":\"$MESSAGE\"}")

# Verificar se tem jq instalado para formatar JSON
if command -v jq &> /dev/null; then
    echo "$response" | jq '.'
    
    # Verificar sucesso
    success=$(echo "$response" | jq -r '.success')
    if [ "$success" = "true" ]; then
        echo ""
        echo -e "${GREEN}✓ Mensagem enviada com sucesso!${NC}"
        message_sid=$(echo "$response" | jq -r '.messageSid')
        echo "Message SID: $message_sid"
    else
        echo ""
        echo -e "${RED}✗ Erro ao enviar mensagem${NC}"
        error=$(echo "$response" | jq -r '.error')
        echo "Erro: $error"
        exit 1
    fi
else
    echo "$response"
    echo ""
    echo -e "${YELLOW}Dica: Instale 'jq' para melhor formatação do JSON${NC}"
fi
