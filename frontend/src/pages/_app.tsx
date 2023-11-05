import { ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { createTheme } from '../theme';
import { AuthConsumer, AuthProvider } from '../contexts/jwt-context';
import { LocalizationProvider } from '@mui/x-date-pickers';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { NextPage } from 'next';
import { FC } from 'react';
import Head from 'next/head';
type EnhancedAppProps = AppProps & {
    Component: NextPage;
};

const App: FC<EnhancedAppProps> = (props) => {
    const { Component, pageProps } = props;
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <title>Zadul Quran</title>
                <meta
                    name='viewport'
                    content='initial-scale=1, width=device-width'
                />
                <meta name='description' content='Zadul Quran ' />
                <meta
                    name='keywords'
                    content='Zadul Quran, zadulquran, zadulQuran, Quran, quran, Zad, zad,Zadul,zadul'
                />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={createTheme()}>
                    <AuthProvider>
                        <Toaster position='top-center' />
                        <AuthConsumer>
                            {(auth) =>
                                auth.isInitialized &&
                                getLayout(<Component {...pageProps} />)
                            }
                        </AuthConsumer>
                    </AuthProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </>
    );
};

export default App;
