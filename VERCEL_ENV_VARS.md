# ⚙️ VARIÁVEIS DE AMBIENTE PARA VERCEL

Copie essas variáveis e cole no Vercel (Project Settings → Environment Variables):

## Variáveis de Produção do MercadoPago:

```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = APP_USR-c4bf8b37-5eef-407e-892b-42459bf8a38c
MERCADOPAGO_ACCESS_TOKEN = APP_USR-2309601440872186-012318-26f3b5ffe9762c9c29c106473cf6c659-2974353431
```

## Variáveis do Google Sheets (já existentes, se precisar atualizar):

```
GOOGLE_SHEETS_ID = 1Rx68jEqbjTzagv7wemsLPIQrrwOWpoFohLzyLqMrDpo
GOOGLE_SERVICE_ACCOUNT_EMAIL = retiro-closer-api@retiro-closer.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = (sua chave privada com quebras de linha)
```

## URL Base (será gerada pelo Vercel automaticamente):

```
NEXT_PUBLIC_BASE_URL = https://retirojovem.vercel.app
```

---

## 📝 Passos para Configurar no Vercel:

1. **Acessar Vercel**
   - Ir para https://vercel.com/dashboard

2. **Selecionar Projeto**
   - Procurar por "retirojovem"
   - Clicar nele

3. **Ir para Settings**
   - Aba "Environment Variables"

4. **Adicionar Variáveis**
   - Copiar cada variável acima
   - Colar nome e valor
   - Selecionar: Production, Preview, Development
   - Clicar "Save"

5. **Redeploy**
   - Ir para "Deployments"
   - Clicar no último deploy
   - "Redeploy"

6. **Testar**
   - Acessar https://retirojovem.vercel.app
   - Testar fluxo completo

---

## ✅ Após Deploy

Configurar webhook no MercadoPago:

1. Acessar sua conta MercadoPago
2. Ir para **Configurações → Webhooks**
3. Adicionar URL: `https://retirojovem.vercel.app/api/notificacoes/pagamento`
4. Selecionar eventos: `payment.created` e `payment.updated`
5. Salvar
