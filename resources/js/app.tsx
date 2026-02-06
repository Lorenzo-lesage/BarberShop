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
        // --- Notifications ---
        let lastNotifId: string | null = null;

        router.on('success', (event) => {
            const auth = event.detail.page.props.auth as any;
            const notification = auth?.notification;

            if (notification && lastNotifId !== notification.id) {
                lastNotifId = notification.id;

                const event = new CustomEvent('show-global-notification', {
                    detail: {
                        id: notification.id,
                        title: notification.data.message,
                        description: notification.data.description,
                    },
                });
                window.dispatchEvent(event);
            }
        });
        // --------------------------------
        const root = createRoot(el);
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: { color: '#4B5563' },
});
