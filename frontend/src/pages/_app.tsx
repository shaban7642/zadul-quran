import { DashboardLayout } from '../components/dashboard/dashboard-layout';
import { ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { createTheme } from '../theme';
import { AuthProvider } from '../contexts/jwt-context';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        // <DashboardLayout>
        <ThemeProvider theme={createTheme()}>
            <AuthProvider>
                <Toaster position='top-center' />
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>

        // </DashboardLayout>
    );
}

export default MyApp;
