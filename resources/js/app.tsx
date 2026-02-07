import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Stores e UI
import { GlobalNotificationDialog } from '@/components/GlobalNotificationDialog';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useThemeStore } from '@/stores/themeStores';
import { toast } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Interfaces
interface AppWrapperProps {
    App: React.ElementType;
    props: any;
}

function AppWrapper({ App, props }: React.PropsWithChildren<AppWrapperProps>) {
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const theme = useThemeStore((state) => state.theme);

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */
    return (
        <TooltipProvider delayDuration={150}>
            <App {...props} />
            <GlobalNotificationDialog />
            <Toaster
                richColors
                position="bottom-right"
                closeButton
                theme={theme}
            />
        </TooltipProvider>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // --- FUNZIONE PER MOSTRARE IL TOAST ---
        const triggerToast = (toastData: any) => {
            if (toastData) {
                // Usiamo un timeout per essere sicuri che il Toaster sia montato nel DOM
                setTimeout(() => {
                    // @ts-ignore
                    toast[toastData.type || 'success'](toastData.message, {
                        description: toastData.description,
                    });
                }, 100);
            }
        };

        // --- 1. CONTROLLO AL BOOT (Per OAuth e Refresh F5) ---
        // Leggiamo i dati che Laravel ha passato nel primo caricamento
        const initialProps = props.initialPage.props as any;
        const initialToast = initialProps.flash?.toast || initialProps.toast;

        if (initialToast) {
            triggerToast(initialToast);
        }

        // --- 2. LOGICA NOTIFICHE (La tua già esistente) ---
        const showNotification = (notification: any) => {
            if (notification && notification.id) {
                window.dispatchEvent(
                    new CustomEvent('show-global-notification', {
                        detail: {
                            id: notification.id,
                            title: notification.data.message,
                            description: notification.data.description,
                        },
                    }),
                );
            }
        };

        const initialAuth = initialProps.auth as any;
        if (initialAuth?.notification) {
            setTimeout(() => showNotification(initialAuth.notification), 100);
        }

        // --- 3. CONTROLLO DURANTE NAVIGAZIONE (SPA) ---
        let lastId = initialAuth?.notification?.id;

        router.on('success', (event) => {
            const pageProps = event.detail.page.props as any;

            // Toast durante navigazione
            const navToast = pageProps.flash?.toast || pageProps.toast;
            if (navToast) {
                triggerToast(navToast);
            }

            // Notifica durante navigazione
            const auth = pageProps.auth as any;
            if (auth?.notification && auth.notification.id !== lastId) {
                lastId = auth.notification.id;
                showNotification(auth.notification);
            }
        });

        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: { color: '#4B5563' },
});
