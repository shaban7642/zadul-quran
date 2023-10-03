import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { Box, IconButton, Theme, useMediaQuery } from '@mui/material';
import * as React from 'react';
import { styled, useTheme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import { ChartIcon } from '../../icons/chart';
import { UsersIcon } from '../../icons/users';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { FoodMenuIcon } from '../../icons/food-menu';
import { ShiftsIcon } from '../../icons/shifts';
import { BillsIcon } from '../../icons/bills';
import { giveAccess } from '../../utils/component-guard';
import { useAuth } from '../../hooks/use-auth';
import { get } from 'lodash';
import { Settings } from '@mui/icons-material';

interface DashboardSidebarProps {
    onClose?: () => void;
    open?: boolean;
}

interface Item {
    title: string;
    children?: Item[];
    chip?: ReactNode;
    icon?: ReactNode;
    path?: string;
    disabled: boolean;
    accessed: boolean;
}

interface Section {
    title: string;
    items: Item[];
    accessed: boolean;
}
export const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeIn,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    height: '91%',
    top: '8%',
    left: '1px',
    border: '10px',
    borderRadius: '10px',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    top: '8%',
    left: '1px',
    border: '10px',
    borderRadius: '10px',
    height: '91%',
    overflowX: 'hidden',
    width: '50px',
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    zIndex: 1,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
    '&:hover': {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    },
}));

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
    const { onClose, open } = props;
    const router = useRouter();
    const { user } = useAuth();
    // const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), {
    //   noSsr: true,
    // });

    // const isSubscriped = get(user, "store.is_subscribed", false);

    const getSections = (): Section[] => [
        {
            title: 'Main',
            items: [
                {
                    title: 'Live Classes',
                    path: '/sessions',
                    icon: <ShiftsIcon fontSize='small' />,
                    disabled: false,
                    accessed: true,
                },
                {
                    title: 'Reports',
                    path: '/reports',
                    icon: <BillsIcon fontSize='small' />,
                    disabled: false,
                    accessed: true,
                },
                {
                    title: 'Documents',
                    path: '/documents',

                    icon: (
                        <SummarizeOutlinedIcon
                            fontSize='small'
                            sx={{ color: '#FFFCF2' }}
                        />
                    ),
                    disabled: false,
                    accessed: true,
                },
            ],
            accessed: true,
        },
        {
            title: user && user?.roleId === (1 || 2) ? 'managment' : '',
            items: [
                {
                    title: 'Employees',
                    path: '/employees',
                    icon: <UsersIcon fontSize='small' />,
                    disabled: false,
                    accessed: user?.roleId === (1 || 2) ? true : false,
                },
                {
                    title: 'Students',
                    path: '/students',
                    icon: (
                        <SchoolOutlinedIcon
                            fontSize='small'
                            sx={{ color: '#FFFCF2' }}
                        />
                    ),
                    disabled: false,
                    accessed: user?.roleId === (1 || 2) ? true : false,
                },
                {
                    title: 'Roles',
                    path: '/roles',
                    icon: (
                        <Settings fontSize='small' sx={{ color: '#FFFCF2' }} />
                    ),
                    disabled: false,
                    accessed: user?.roleId === (1 || 2) ? true : false,
                },
            ],
            accessed: true,
        },
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sections = useMemo(
        () => getSections(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user]
    );

    const handlePathChange = () => {
        if (!router.isReady) {
            return;
        }

        // if (open && !lgUp) {
        //   onClose?.();
        // }
    };

    useEffect(
        handlePathChange,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.isReady, router.asPath]
    );

    const content = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 2,
                    px: 2.5,
                }}
            >
                {/* <Box sx={{ mt: 1 }}>
          <NextLink href="/" passHref>
            <a>
              <Box
                sx={{
                  height: 32,
                  width: 46,
                }}
              />
            </a>
          </NextLink>
        </Box> */}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {sections.map((section) => (
                    // eslint-disable-next-line react/jsx-key

                    <DashboardSidebarSection
                        key={section.title}
                        path={router.asPath}
                        sx={{
                            mt: 1,
                            '& + &': {
                                mt: 1,
                            },
                        }}
                        {...section}
                    />
                ))}
            </Box>
        </>
    );

    // if (lgUp) {
    //   return (
    //     <Drawer
    //       anchor="left"
    //       open={open}
    //       onClose={onClose}
    //       PaperProps={{
    //         sx: {
    //           backgroundColor: "neutral.900",
    //           borderRightColor: "divider",
    //           borderRightStyle: "solid",
    //           borderRightWidth: (theme) =>
    //             theme.palette.mode === "dark" ? 1 : 0,
    //           color: "neutral.100",
    //           width: 280,
    //         },
    //       }}
    //       variant="persistent"
    //     >
    //       {content}
    //     </Drawer>
    //   );
    // }

    return (
        <Drawer
            anchor='left'
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.700',
                    color: 'neutral.100',
                },
            }}
            variant='permanent'
        >
            {content}
        </Drawer>
    );
};

DashboardSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
