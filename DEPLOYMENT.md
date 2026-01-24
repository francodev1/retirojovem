# 🚀 PRÓXIMOS PASSOS - Deploy no Vercel

## 1️⃣ Você precisa fornecer as chaves de PRODUÇÃO do MercadoPago

Quando tiver as chaves de produção, me envie:
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` (chave pública)
- `MERCADOPAGO_ACCESS_TOKEN` (access token)

## 2️⃣ Deploy no Vercel (Automático)

O repositório já está no GitHub: https://github.com/francodev1/retirojovem

Agora é só:
1. Acessar https://vercel.com
2. Login com GitHub
3. Clicar em "Add New" → "Project"
4. Selecionar o repositório `retirojovem`
5. Vercel vai detectar que é Next.js
6. Clicar em "Deploy"

## 3️⃣ Configurar Variáveis de Ambiente no Vercel

Após o deploy inicial, ir para:
**Project Settings → Environment Variables**

E adicionar:

```env
GOOGLE_SHEETS_ID=seu_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu_email_de_servico
GOOGLE_PRIVATE_KEY=sua_chave_privada (com quebras de linha)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=sua_chave_publica_prod
MERCADOPAGO_ACCESS_TOKEN=seu_token_prod
NEXT_PUBLIC_BASE_URL=https://seu-dominio.vercel.app
```

## 4️⃣ Configurar Webhook do MercadoPago

Na sua conta MercadoPago (depois que tiver o domínio do Vercel):

1. Ir para **Configurações → Webhooks**
2. Adicionar URL: `https://seu-dominio.vercel.app/api/notificacoes/pagamento`
3. Selecionar eventos: `payment.created` e `payment.updated`

## ✅ Checklist de Deploy

- [ ] Chaves de produção do MercadoPago obtidas
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Webhook do MercadoPago configurado
- [ ] Testar fluxo completo:
  - [ ] Preencher formulário
  - [ ] Clicar em Cartão → Redirecionar ao MercadoPago
  - [ ] Clicar em PIX → Mostrar QR Code
  - [ ] Verificar dados no Google Sheets

## 📞 Quando Estiver Pronto

Me avise quando tiver:
1. As chaves de produção do MercadoPago
2. Vercel configurado

Aí fazemos os ajustes finais e está tudo funcionando! 🎉
