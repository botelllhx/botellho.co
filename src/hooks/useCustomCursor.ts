import { useEffect } from 'react';

export const useCustomCursor = () => {
    useEffect(() => {
        // Apenas em desktop (não touch devices)
        if (window.matchMedia('(pointer: coarse)').matches) {
            document.documentElement.style.cursor = 'auto';
            return;
        }

        const cursor = document.createElement('div');
        const cursorDot = document.createElement('div');
        cursor.className = 'cursor cursor-hoverable';
        cursorDot.className = 'cursor-dot cursor-hoverable';
        document.body.appendChild(cursor);
        document.body.appendChild(cursorDot);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let dotX = 0;
        let dotY = 0;

        let animationFrameId: number;

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';

            animationFrameId = requestAnimationFrame(updateCursor);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseEnter = (e: Event) => {
            // Verifica se o alvo ou algum pai é um elemento interativo
            const target = e.target as HTMLElement;
            if (target) {
                cursor.classList.add('hover');
            }
        };

        const handleMouseLeave = () => {
            cursor.classList.remove('hover');
        };

        const handleMouseDown = () => {
            cursor.classList.add('click');
        };

        const handleMouseUp = () => {
            cursor.classList.remove('click');
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Adicionar hover em elementos interativos dinamicamente
        const addInteractiveHover = () => {
            const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
            interactiveElements.forEach((el) => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        // Adicionar hover inicialmente e observar mudanças no DOM
        addInteractiveHover();

        // Observar mudanças no DOM para novos elementos
        const observer = new MutationObserver(() => {
            addInteractiveHover();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        updateCursor();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            observer.disconnect();

            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            if (cursorDot.parentNode) cursorDot.parentNode.removeChild(cursorDot);
        };
    }, []);
};
