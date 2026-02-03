import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Stores e UI
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useThemeStore } from '@/stores/themeStores';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Interfaces
import { PageProps } from '@/types';

interface AppWrapperProps {
    App: React.ElementType;
    props: any;
}

function AppWrapper({ App, props }: React.PropsWithChildren<AppWrapperProps>) {
    const theme = useThemeStore((state) => state.theme);
    return (
        <TooltipProvider delayDuration={150}>
            <App {...props} />
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
        root.render(
            <AppWrapper App={App} props={props as unknown as PageProps} />,
        );
    },
    progress: { color: '#4B5563' },
});
