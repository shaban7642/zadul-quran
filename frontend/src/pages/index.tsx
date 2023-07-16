import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { LightBgLogo } from '../components/light-bg-logo';
import { LoginForm } from '../components/auth/login-form';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Zadul-Quran</title>
                <meta
                    name='viewport'
                    content='initial-scale=1, width=device-width'
                />
                <meta name='description' content='' />
                <meta name='keywords' content='' />
            </Head>
            <Box
                component='main'
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <Container
                    maxWidth='sm'
                    sx={{
                        py: {
                            xs: '60px',
                            md: '120px',
                        },
                    }}
                >
                    <Card elevation={16} sx={{ p: 4, backgroundColor: '#FFF' }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <NextLink href='/' passHref>
                                {/* <a> */}
                                <LightBgLogo
                                    sx={{
                                        height: 42,
                                        width: 56,
                                    }}
                                />
                                {/* </a> */}
                            </NextLink>
                            <Typography variant='h4'>Login</Typography>
                        </Box>

                        <Box
                            sx={{
                                flexGrow: 1,
                                mt: 3,
                            }}
                        >
                            <LoginForm />
                        </Box>

                        <Divider sx={{ my: 3 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* <div>
                <NextLink href={'forgetPassword'} passHref>
                  <Link color="textSecondary" variant="body2">
                    {t('auth.login.forgetPassword')}
                  </Link>
                </NextLink>
              </div> */}
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default Home;
