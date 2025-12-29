import { ImgHTMLAttributes } from 'react';

// Destrutturiamo className dalle props per poterlo usare nella stringa
export default function ApplicationLogo({
    className = '',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/android-chrome-512x512.png"
            alt="Logo"
            /* 1. h-10 w-auto: Imposta l'altezza e mantiene le proporzioni
               2. object-contain: Evita distorsioni
               3. dark:invert: Inverte i colori nella Dark Mode (ottimo per i bordi neri)
               4. ${className}: Permette di aggiungere classi extra quando richiami il componente
            */
            className={`h-10 w-auto object-contain dark:brightness-200 dark:invert ${className}`}
        />
    );
}
