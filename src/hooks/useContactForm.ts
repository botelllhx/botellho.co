import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

interface ContactFormData {
    name: string;
    email: string;
    project: string;
    message: string;
}

export const useContactForm = () => {
    const [loading, setLoading] = useState(false);

    const sendEmail = async (data: ContactFormData, captchaToken?: string | null) => {
        setLoading(true);

        // Credenciais do EmailJS via variáveis de ambiente
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        try {
            // Verificar se as credenciais estão configuradas (não são os placeholders padrão do .env de exemplo)
            if (!serviceId || serviceId === 'seu_service_id' ||
                !templateId || templateId === 'seu_template_id' ||
                !publicKey || publicKey === 'sua_public_key') {

                console.warn('EmailJS credentials not configured in .env. Simulating success.');
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success('Projeto enviado. (Modo simulação, configure o .env)');
                return true;
            }

            // O token do reCAPTCHA deve ser passado se disponível (v2 Invisible)
            if (captchaToken) {
                console.log('Enviando com reCAPTCHA Token:', captchaToken);
            } else {
                console.warn('Enviando SEM reCAPTCHA Token (pode falhar se o EmailJS exigir)');
            }

            await emailjs.send(serviceId, templateId, {
                from_name: data.name,
                from_email: data.email,
                project_type: data.project,
                message: data.message,
                'g-recaptcha-response': captchaToken || ''
            }, publicKey);

            toast.success('Projeto enviado. Retorno em breve.');
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            // Verifica se é erro de captcha
            if (error && typeof error === 'object' && 'text' in error && String((error as { text: unknown }).text).includes('reCAPTCHA')) {
                toast.error('Erro de validação do reCAPTCHA. Atualize a página e tente novamente.');
            } else {
                toast.error('Erro ao enviar mensagem. Tente novamente mais tarde.');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { sendEmail, loading };
};
