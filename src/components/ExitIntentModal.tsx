import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ExitIntentModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    // Refs to maintain values between renders and in event listeners
    const hasLeftTabRef = useRef(false);
    const returnTimerRef = useRef<NodeJS.Timeout | null>(null);
    const mouseLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasShownRef = useRef(false);
    const isOpenRef = useRef(false);

    // Sync refs with state
    useEffect(() => {
        hasShownRef.current = hasShown;
        isOpenRef.current = isOpen;
    }, [hasShown, isOpen]);

    useEffect(() => {
        // Check localStorage
        const hasShownBefore = localStorage.getItem('exitIntentShown');
        if (hasShownBefore) {
            setHasShown(true);
            return;
        }

        const openModal = () => {
            if (!hasShownRef.current && !isOpenRef.current) {
                setIsOpen(true);
                setHasShown(true);
                localStorage.setItem('exitIntentShown', 'true');
                hasLeftTabRef.current = false;
            }
        };

        // 1. Detect when tab loses focus (user switches tabs or minimizes)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                hasLeftTabRef.current = true;
            } else {
                // Tab gained focus - if user had left, show modal
                if (hasLeftTabRef.current && !hasShownRef.current && !isOpenRef.current) {
                    if (returnTimerRef.current) clearTimeout(returnTimerRef.current);

                    // Show after a small delay
                    returnTimerRef.current = setTimeout(openModal, 500);
                }
            }
        };

        // 2. Detect window blur/focus
        const handleBlur = () => {
            if (!hasShownRef.current && !isOpenRef.current) {
                hasLeftTabRef.current = true;
            }
        };

        const handleFocus = () => {
            if (hasLeftTabRef.current && !hasShownRef.current && !isOpenRef.current) {
                if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
                returnTimerRef.current = setTimeout(openModal, 500);
            }
        };

        // 3. Classic Exit Intent (Mouse leaving top of viewport)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 10 && !hasShownRef.current && !isOpenRef.current && !document.hidden) {
                if (mouseLeaveTimerRef.current) clearTimeout(mouseLeaveTimerRef.current);

                // Small delay to confirm intent
                mouseLeaveTimerRef.current = setTimeout(openModal, 150);
            }
        };

        const handleMouseEnter = () => {
            if (mouseLeaveTimerRef.current) {
                clearTimeout(mouseLeaveTimerRef.current);
                mouseLeaveTimerRef.current = null;
            }
        };

        // Add listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
            if (mouseLeaveTimerRef.current) clearTimeout(mouseLeaveTimerRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [hasShown, isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handlePortfolio = () => {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    const handleContact = () => {
        const contactSection = document.getElementById('contato');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-6"
                        initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="relative overflow-hidden border border-border bg-background p-8 shadow-2xl">
                            {/* Decorative Background */}
                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground hover:rotate-90"
                                aria-label="Fechar"
                            >
                                <X size={24} />
                            </button>

                            <div className="relative z-10 text-center">
                                <span className="mb-6 inline-block bg-foreground px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-background">
                                    Oferta Especial
                                </span>

                                <h2 className="mb-4 font-display text-4xl font-bold uppercase leading-tight text-foreground md:text-5xl">
                                    Antes de <span className="text-primary">ir embora</span>
                                </h2>

                                <p className="mb-8 font-sans text-lg text-muted-foreground">
                                    Que tal transformarmos sua ideia em um projeto digital único?
                                    Temos soluções personalizadas esperando por você.
                                </p>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <button
                                        onClick={handlePortfolio}
                                        className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden bg-foreground px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider text-background transition-all hover:bg-primary hover:text-white"
                                    >
                                        <Briefcase size={20} />
                                        <span>Ver Portfolio</span>
                                    </button>

                                    <button
                                        onClick={handleContact}
                                        className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden border-2 border-foreground bg-transparent px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                                    >
                                        <Mail size={20} />
                                        <span>Fazer Orçamento</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExitIntentModal;
