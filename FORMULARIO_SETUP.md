# Configuração do Formulário de Contato

O formulário de contato suporta duas opções para envio de emails:

## Opção 1: EmailJS (Recomendado)

### Passo a passo:

1. **Criar conta no EmailJS**
   - Acesse: https://www.emailjs.com/
   - Crie uma conta gratuita (200 emails/mês)

2. **Configurar serviço de email**
   - Vá em "Email Services"
   - Adicione seu provedor (Gmail, Outlook, etc.)
   - Siga as instruções para conectar

3. **Criar template**
   - Vá em "Email Templates"
   - Clique em "Create New Template"
   - Use este template:
     ```
     Assunto: {{subject}}
     
     Nova mensagem de contato:
     
     Nome: {{from_name}}
     Email: {{from_email}}
     
     Mensagem:
     {{message}}
     ```
   - Salve e copie o Template ID

4. **Obter Public Key**
   - Vá em "Account" → "General"
   - Copie a "Public Key"

5. **Adicionar ao .env**
   ```env
   VITE_EMAILJS_SERVICE_ID=seu_service_id
   VITE_EMAILJS_TEMPLATE_ID=seu_template_id
   VITE_EMAILJS_PUBLIC_KEY=sua_public_key
   ```

6. **Reiniciar servidor**
   ```bash
   npm run dev
   ```

## Opção 2: Formspree (Alternativa)

### Passo a passo:

1. **Criar conta no Formspree**
   - Acesse: https://formspree.io/
   - Crie uma conta gratuita (50 envios/mês)

2. **Criar formulário**
   - Clique em "New Form"
   - Copie o Form ID (ex: `xzbqkqyz`)

3. **Adicionar ao .env**
   ```env
   VITE_FORMSPREE_ID=seu_form_id
   ```

4. **Reiniciar servidor**
   ```bash
   npm run dev
   ```

## Testando

Após configurar, teste o formulário:
1. Preencha todos os campos
2. Clique em "Enviar Mensagem"
3. Verifique se recebeu o email

## Nota

Se nenhuma opção estiver configurada, o formulário apenas fará log no console (modo desenvolvimento).
