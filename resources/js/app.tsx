import '../css/app.css';
import './bootstrap';

import type { InertiaAppProps } from '@inertiajs/react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Stores
import { useThemeStore } from '@/stores/themeStores';

// Components
import { Toaster } from '@/components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function AppWrapper({
    App,
    props,
}: {
    App: React.ComponentType<InertiaAppProps>;
    props: InertiaAppProps;
}) {
    const theme = useThemeStore((state) => state.theme);
    return (
        <>
            <App {...props} />
            <Toaster
                richColors
                position="bottom-right"
                closeButton
                theme={theme}
            />
        </>
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
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: { color: '#4B5563' },
});
