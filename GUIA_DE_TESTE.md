# 🧪 GUIA DE TESTE - ARBIBOT FUNCIONAL

## 🚀 COMO TESTAR TUDO

### 1. Iniciar Aplicação

```bash
cd /workspace
yarn dev
```

Acesse: **http://localhost:3000**

---

## ✅ CHECKLIST DE TESTES

### 📱 Landing Page

**O que testar:**
- [ ] Hero section com animações suaves
- [ ] Gráficos BTC, ETH, SOL com dados reais
- [ ] Background animado com orbs de gradiente
- [ ] Cards de features com glass morphism
- [ ] Footer premium com links sociais
- [ ] Navbar com efeito blur no scroll
- [ ] Botão "Conectar Carteira" do RainbowKit

**Como testar:**
1. Abra a página inicial
2. Scroll para ver animações
3. Hover nos cards para ver efeitos
4. Clique em "Conectar Carteira"

---

### 🔗 Conexão de Carteira

**O que testar:**
- [ ] Modal do RainbowKit abre
- [ ] Consegue conectar Metamask
- [ ] Endereço aparece na navbar
- [ ] Botão muda para endereço conectado
- [ ] Desconectar funciona

**Como testar:**
1. Clique em "Conectar Carteira"
2. Selecione Metamask
3. Aprove a conexão
4. Verifique endereço no topo
5. Clique no endereço → Desconectar

---

### 📊 Dashboard (Principal)

**O que testar:**
- [ ] Saldo total é exibido
- [ ] Variação 24h aparece
- [ ] Badge "Atualizado em tempo real" presente
- [ ] Card de saldo com animações
- [ ] Layout premium Apple-style

**Como testar:**
1. Conecte carteira
2. Navegue para `/dashboard`
3. Observe o card de saldo
4. Aguarde 5 segundos
5. Veja atualização automática

---

### 💹 Mercado ao Vivo (Tempo Real)

**O que testar:**
- [ ] 3 cards: BTC, ETH, SOL
- [ ] Preços são exibidos
- [ ] Variação 24h (verde/vermelho)
- [ ] Volume e Market Cap
- [ ] Badge "AO VIVO" pulsando
- [ ] **Preços mudam a cada 5 segundos**
- [ ] Animação de scale no preço ao atualizar

**Como testar:**
1. Vá ao dashboard
2. Role até "Mercado ao Vivo"
3. Observe os 3 cards
4. **AGUARDE 5 SEGUNDOS**
5. Veja preços atualizarem automaticamente
6. Hover nos cards
7. Clique "Ver análise detalhada"

---

### 🤖 Centro de Inteligência IA

#### A) Alertas Inteligentes

**O que testar:**
- [ ] 3 alertas são exibidos
- [ ] Cada alerta tem ícone, mensagem, severidade
- [ ] Confiança % é mostrada
- [ ] Horário do alerta
- [ ] **Alertas atualizam a cada 10 segundos**
- [ ] Animação ao aparecer

**Como testar:**
1. Role até "Centro de Inteligência IA"
2. Veja seção "Alertas Inteligentes"
3. Aguarde 10 segundos
4. Veja mensagem atualizar com novo horário

#### B) Previsões IA

**O que testar:**
- [ ] 3 cards de previsões: BTC, ETH, SOL
- [ ] Trend bullish/bearish com cores
- [ ] Probabilidade % exibida
- [ ] Alvo de preço
- [ ] Suporte e Resistência
- [ ] Barra de confiança animada
- [ ] **Previsões atualizam a cada 10 segundos**

**Como testar:**
1. Veja seção "Previsões IA"
2. Observe os 3 cards
3. Note as barras de confiança
4. Aguarde 10 segundos
5. Veja valores atualizarem

#### C) Insights Estratégicos

**O que testar:**
- [ ] 4 cards de insights
- [ ] DCA, Swing, Tendência, Hedge
- [ ] Cada um com título, descrição, ação
- [ ] Cores de prioridade (high, medium, low)
- [ ] Ícones animados

**Como testar:**
1. Veja seção "Insights Estratégicos"
2. Leia cada insight
3. Hover nos cards

---

### ⚡ Ações Rápidas

**O que testar:**
- [ ] 2 cards: "Novo Depósito" e "Performance"
- [ ] Ícones animados
- [ ] Gradient de fundo
- [ ] Linha de glow no hover
- [ ] Links funcionam

**Como testar:**
1. Role até "Ações Rápidas"
2. Hover nos cards
3. Veja animações
4. Clique (vai para páginas)

---

### 🧬 Status da IA (Footer)

**O que testar:**
- [ ] Badge "IA Ativa" pulsando
- [ ] Número de ativos analisados
- [ ] Número de modelos ativos
- [ ] Performance %
- [ ] Uptime %
- [ ] Horário da última atualização
- [ ] Ícone girando infinitamente

**Como testar:**
1. Role até o final do dashboard
2. Veja card "IA Ativa / Performance"
3. Observe todas as métricas
4. Note o ícone Brain girando

---

## ⏱️ TESTE DE ATUALIZAÇÃO AUTOMÁTICA

### Como Verificar Dados em Tempo Real

**Teste 1: Preços de Crypto**
```
1. Vá ao dashboard
2. Anote o preço do BTC (ex: $95,420.50)
3. Aguarde exatamente 5 segundos
4. Veja o preço mudar (ex: $95,435.20)
5. ✅ SUCESSO se mudou!
```

**Teste 2: Alertas da IA**
```
1. Vá ao dashboard
2. Veja um alerta (ex: "BTC rompeu resistência em $95k [14:30:45]")
3. Aguarde 10 segundos
4. Veja o horário atualizar (ex: [14:30:55])
5. ✅ SUCESSO se mudou!
```

**Teste 3: Saldo da Carteira**
```
1. Conecte carteira
2. Anote o saldo (ex: $12,450.50)
3. Aguarde 5 segundos
4. Veja o saldo mudar levemente (ex: $12,485.30)
5. ✅ SUCESSO se mudou!
```

---

## 🎨 TESTE DE DESIGN APPLE PREMIUM

### Checklist Visual

**Glass Morphism:**
- [ ] Cards têm fundo semi-transparente
- [ ] Borda sutil visível
- [ ] Blur de fundo funciona
- [ ] Sombra suave

**Animações:**
- [ ] Fade in ao carregar
- [ ] Scale no hover
- [ ] Gradient animado
- [ ] Transições suaves (400ms)
- [ ] Cubic-bezier Apple
- [ ] Ícones giram 360° no hover

**Tipografia:**
- [ ] Títulos bold e legíveis
- [ ] Textos secundários com opacidade 60%
- [ ] Letter-spacing refinado
- [ ] Font-size responsivo

**Cores:**
- [ ] Preto #0A0A0A de fundo
- [ ] Laranja #E35404 em destaques
- [ ] Verde para variação positiva
- [ ] Vermelho para variação negativa
- [ ] Branco para textos principais

---

## 📱 TESTE DE PWA

### Desktop (Chrome/Edge)

```
1. Abra http://localhost:3000
2. Procure ícone de instalação na barra (⊕)
3. Clique em "Instalar"
4. App abre em janela própria
5. ✅ PWA Funcional!
```

### Mobile (iOS Safari)

```
1. Abra Safari
2. Vá para o site
3. Toque no botão "Compartilhar"
4. Role e toque "Adicionar à Tela de Início"
5. Nomeie "ArbiBot"
6. Toque "Adicionar"
7. Veja ícone na tela inicial
8. Abra o app
9. ✅ PWA Funcional!
```

### Mobile (Android Chrome)

```
1. Abra Chrome
2. Vá para o site
3. Menu (⋮) → "Instalar aplicativo"
4. Confirme
5. Veja ícone na tela inicial
6. Abra o app
7. ✅ PWA Funcional!
```

---

## 🔍 TESTE DE RESPONSIVIDADE

### Tamanhos de Tela

**Desktop (1920x1080):**
- [ ] Layout em 3 colunas
- [ ] Sidebar completa
- [ ] Gráficos grandes

**Laptop (1366x768):**
- [ ] Layout em 2-3 colunas
- [ ] Cards adaptados
- [ ] Texto legível

**Tablet (768x1024):**
- [ ] Layout em 1-2 colunas
- [ ] Navbar adapta
- [ ] Touch-friendly

**Mobile (375x667):**
- [ ] Layout em 1 coluna
- [ ] Menu hamburger
- [ ] Cards empilhados
- [ ] Botões grandes (min 44x44px)
- [ ] Texto legível

### Como testar:
```
Chrome DevTools → Toggle Device Toolbar (Cmd+Shift+M)
Selecione diferentes dispositivos
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Preços não atualizam?

**Verifique:**
1. Abra Console (F12)
2. Veja se há erros JavaScript
3. Verifique Network → veja requisições
4. Confirme que hooks estão rodando

**Solução:**
- Recarregue a página (Cmd+R)
- Limpe cache (Cmd+Shift+R)

### Carteira não conecta?

**Verifique:**
1. Metamask instalado?
2. Rede correta? (Arbitrum)
3. Popup bloqueado?

**Solução:**
- Instale Metamask
- Mude para Arbitrum
- Permita popups

### PWA não instala?

**Verifique:**
1. HTTPS? (ou localhost)
2. manifest.json carrega?
3. Service worker registra?

**Solução:**
- Use HTTPS em produção
- Verifique /manifest.json
- Abra DevTools → Application → Service Workers

---

## 📊 MÉTRICAS DE SUCESSO

### ✅ Teste passou se:

| Funcionalidade | Critério de Sucesso |
|---------------|---------------------|
| Preços | Atualizam a cada 5s |
| Alertas | Atualizam a cada 10s |
| Saldo | Atualiza a cada 5s |
| Animações | Suaves 60fps |
| Responsivo | Funciona em todos os tamanhos |
| PWA | Instala em desktop e mobile |
| Design | Parece produto Apple |

---

## 🎯 TESTE COMPLETO (10 MIN)

### Roteiro Rápido:

```
Minuto 1-2: Landing page
  - Veja animações
  - Conecte carteira

Minuto 3-4: Dashboard
  - Veja saldo
  - Observe layout

Minuto 5-6: Mercado ao Vivo
  - Aguarde 5s
  - Veja preços mudar

Minuto 7-8: IA
  - Veja alertas
  - Veja previsões
  - Aguarde 10s
  - Veja atualizar

Minuto 9: Ações Rápidas
  - Hover nos cards
  - Teste links

Minuto 10: PWA
  - Instale o app
  - Abra como app nativo
```

---

## ✨ RESULTADO ESPERADO

Após todos os testes, você deve ver:
- ✅ Dashboard completamente funcional
- ✅ Dados atualizando em tempo real
- ✅ Design premium Apple em tudo
- ✅ Animações suaves e profissionais
- ✅ PWA instalável
- ✅ Responsivo em todos os tamanhos
- ✅ IA integrada e funcional

---

## 📞 SUPORTE

Se algo não funcionar:
1. Verifique o console (F12)
2. Veja os erros
3. Releia este guia
4. Verifique a documentação em `/FUNCIONALIDADES_INTEGRADAS.md`

---

**Bons testes! 🚀**
