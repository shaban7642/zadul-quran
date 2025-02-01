import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { createTheme } from "../theme";
import { AuthConsumer, AuthProvider } from "../contexts/jwt-context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import "moment-timezone";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { NextPage } from "next";
import { FC, useEffect, useState } from "react";
import Head from "next/head";

import "./global-style.css";
import { LogicContext } from "../contexts/logic-context";

type EnhancedAppProps = AppProps & {
    Component: NextPage;
};

const App: FC<EnhancedAppProps> = (props) => {
    const { Component, pageProps } = props;
    const getLayout = Component.getLayout ?? ((page) => page);
    const [userTimezone, setUserTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    // Get the user's timezone
    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        moment.tz.setDefault(userTimezone);
    }, [userTimezone]);

    console.log("User's Time zone is: ", userTimezone);
    return (
        <>
            <Head>
                <title>Zadul Quran</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
                <meta name="description" content="Zadul Quran " />
                <meta
                    name="keywords"
                    content="Zadul Quran, zadulquran, zadulQuran, Quran, quran, Zad, zad,Zadul,zadul"
                />
            </Head>
            <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale={userTimezone}
            >
                <ThemeProvider theme={createTheme()}>
                    <AuthProvider>
                        <Toaster position="top-center" />
                        <LogicContext>
                            <AuthConsumer>
                                {(auth) =>
                                    auth.isInitialized &&
                                    getLayout(<Component {...pageProps} />)
                                }
                            </AuthConsumer>
                        </LogicContext>
                    </AuthProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </>
    );
};

export default App;
