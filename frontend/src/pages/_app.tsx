import { DashboardLayout } from '../components/dashboard/dashboard-layout';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        // <DashboardLayout>
        <Component {...pageProps} />
        // </DashboardLayout>
    );
}

export default MyApp;
