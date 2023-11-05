import {
    ChangeEvent,
    FC,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { TableHeads } from '../users/users-heads';
import { styled, Theme } from '@mui/material/styles';
import {
    Button,
    Card,
    Chip,
    Divider,
    Tab,
    Tabs,
    useMediaQuery,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { SessionsRow } from './sessions-row';
import { userApi } from '../../api/userApi';
import { useMounted } from '../../hooks/use-mounted';
import toast from 'react-hot-toast';
import { sessionApi } from '../../api/sessionsApi';
import { useRouter } from 'next/router';
import { deptApi } from '../../api/deptApi';
import { SessionListFilters } from './sessions-list-filters';
import { Filter as FilterIcon } from '../../icons/filter';
import { useAuth } from '../../hooks/use-auth';

export interface Data {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}
interface SessionsTableProps {
    roleId?: number;
}

export const SessionListInner = styled('div', {
    shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
        marginLeft: -380,
    },
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        [theme.breakpoints.up('lg')]: {
            marginLeft: 0,
        },
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
export const SessionsTable: FC<SessionsTableProps> = (props) => {
    const isMounted = useMounted();
    const router = useRouter();
    const { user } = useAuth();

    const initialFilters: any = {
        date: {
            from: null,
            to: null,
        },
        teacherId: null,
        departmentId: null,
        studentId: null,
    };
    const [filters, setFilters] = useState<any>({});
    const [sessions, setSessions] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [sessionsCount, setSessionsCount] = useState(0);
    const [statusCount, setStatusCount] = useState<
        { status: string; count: number }[]
    >([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [subjects, setSubjects] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<any>('');
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'), {
        noSsr: false,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [openFilters, setOpenFilters] = useState<boolean>(false);

    const statuses: readonly string[] = [
        'waiting',
        'expired',
        'running',
        'done',
        'cancelled',
        'absent',
        'rescheduled',
    ];
    const headCells: readonly any[] = [
        {
            id: 'teacher',
            numeric: false,
            disablePadding: true,
            label: 'Teacher',
        },
        {
            id: 'student',
            numeric: false,
            disablePadding: true,
            label: 'Student',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
        },
        {
            id: 'startedAt',
            numeric: false,
            disablePadding: true,
            label: 'Started At',
        },
        {
            id: 'endedAt',
            numeric: false,
            disablePadding: true,
            label: 'Ended At',
        },
        {
            id: 'subject',
            numeric: true,
            disablePadding: false,
            label: 'Subject',
        },
        {
            id: 'date',
            numeric: true,
            disablePadding: false,
            label: 'Date',
        },
        {
            id: 'startTime',
            numeric: true,
            disablePadding: false,
            label: 'Start Time',
        },
        {
            id: 'endTime',
            numeric: true,
            disablePadding: false,
            label: 'End Time',
        },
        {
            id: 'actions',
            numeric: true,
            disablePadding: false,
            label: '',
        },
        {
            id: 'delete',
            numeric: true,
            disablePadding: false,
            label: '',
        },
    ];

    const tabs: any[] = [
        {
            label: 'all',
            value: '',
            count: totalCount,
        },
        {
            label: 'waiting',
            value: 'waiting',
            count: statusCount.find((item) => item.status.match('waiting'))
                ?.count,
        },
        {
            label: 'running',
            value: 'running',
            count: statusCount.find((item) => item.status.match('running'))
                ?.count,
        },
        {
            label: 'done',
            value: 'done',
            count: statusCount.find((item) => item.status.match('done'))?.count,
        },
        {
            label: 'cancelled',
            value: 'cancelled',
            count: statusCount.find((item) => item.status.match('cancelled'))
                ?.count,
        },
        {
            label: 'expired',
            value: 'expired',
            count: statusCount.find((item) => item.status.match('expired'))
                ?.count,
        },
        {
            label: 'absent',
            value: 'absent',
            count: statusCount.find((item) => item.status.match('absent'))
                ?.count,
        },
    ];

    const handleTabsChange = (event: ChangeEvent<{}>, value: any): void => {
        setCurrentTab(value);
        getSessions({ limit: rowsPerPage, offset: 0, status: value });
        // setViewParams({ ...viewParams, status: value, pageCount: 1, page: 0 });
    };

    const getSessions = useCallback(
        async (filterObject: any) => {
            try {
                const data: any = await sessionApi.getSessions({
                    ...filterObject,
                    ...filters,
                });
                if (isMounted()) {
                    setSessions(data.rows);
                    setSessionsCount(data.count);
                    setStatusCount(data.statusCount);
                    setTotalCount(data.totalCount);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted, filters]
    );

    const deleteSession = async (id: number): Promise<{ success: boolean }> => {
        const load = toast.loading('delete');
        try {
            const resp = await sessionApi.deleteSession(id);
            if (resp) {
                toast.dismiss(load);
                toast.success('deleteSessionSuccess');
                getSessions({
                    limit: rowsPerPage,
                    offset: page,
                    status: currentTab,
                });
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error('deleteSessionFailed');
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || 'deleteSessionsFailed');
            return { success: false };
        }
    };

    const updateSession = async (
        id: number,
        values: any
    ): Promise<{ success: boolean }> => {
        const load = toast.loading('update');
        try {
            const resp = await sessionApi.updateSession(id, values);
            if (resp) {
                toast.dismiss(load);
                toast.success('updateSessionSuccess');
                getSessions({
                    limit: rowsPerPage,
                    offset: page,
                    status: currentTab,
                });
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error('updateSessionFailed');
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || 'updateSessionsFailed');
            return { success: false };
        }
    };

    // const getSubjects = useCallback(
    //     async () => {
    //         try {
    //             const data: any = await deptApi.getDepts();
    //             if (isMounted()) {
    //                 setSubjects(data.rows);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [isMounted]
    // );

    // useEffect(() => {
    //     getSubjects();
    // }, []);

    useEffect(
        () => {
            getSessions({
                limit: rowsPerPage,
                offset: page,
                status: currentTab,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(
        () => {
            if (router?.query?.code) {
                startMeeting(router.query.code, router.query.sessionId);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.query]
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        getSessions({
            limit: rowsPerPage,
            offset: newPage * rowsPerPage,
            status: currentTab,
        });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getSessions({
            limit: parseInt(event.target.value, 10),
            offset: 0,
            status: currentTab,
        });
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows =
    //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const startMeeting = useCallback(
        async (
            code: string | string[],
            sessionId: string | string[] | undefined
        ) => {
            try {
                const data = await sessionApi.startMeeting(code, sessionId);
                if (data.success) {
                    window.history.replaceState(null, '', '/sessions');
                    window.open(data.meetingUrl, '_blank');
                    getSessions({
                        limit: rowsPerPage,
                        offset: page,
                        status: currentTab,
                    });
                }
            } catch (error: any) {
                window.history.replaceState(null, '', '/sessions');
                toast.error(error?.message || 'failed to start session');
            }
        },
        [isMounted]
    );

    const applyFilters = (filters: any): any => {
        console.log({ filters });
        setFilters(filters);
        getSessions({
            status: currentTab,
            limit: rowsPerPage,
            offset: 0,
            ...filters,
        });
    };

    const clearFilters = () => {
        setLoading(true);
        applyFilters(initialFilters);
    };

    const handleToggleFilters = (): void => {
        setOpenFilters((prevState) => !prevState);
    };

    const handleCloseFilters = (): void => {
        setOpenFilters(false);
    };

    useEffect(() => {
        // This code will execute whenever `value` changes
        // `value` will be the previous state value
        console.log('Previous value:', filters);
    }, [filters]);
    return (
        <Box sx={{ width: '100%', scrollBehavior: 'auto' }}>
            {['super_admin', 'admin'].includes(user?.role?.name) && (
                <Button
                    endIcon={<FilterIcon fontSize='small' />}
                    onClick={handleToggleFilters}
                    sx={{ mr: 2 }}
                    variant='outlined'
                >
                    Filters
                </Button>
            )}
            <Paper
                sx={{
                    m: 1,
                    ...(true && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.info.contrastText,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                <Card sx={{ backgroundColor: 'white' }}>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        flexDirection='row'
                    >
                        <Tabs
                            indicatorColor='primary'
                            onChange={handleTabsChange}
                            scrollButtons='auto'
                            sx={{
                                px: 2,
                            }}
                            textColor='primary'
                            value={currentTab}
                            variant='scrollable'
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    sx={{
                                        minHeight: '60px',
                                        mt: 'auto',
                                        mb: 'auto',
                                    }}
                                    icon={
                                        <Chip
                                            label={tab.count || 0}
                                            size='small'
                                            sx={{
                                                fontSize: '12px !important',
                                                color: 'neutral.600',
                                                // borderRadius: '5px',
                                            }}
                                        />
                                    }
                                    iconPosition='end'
                                    key={tab.value}
                                    label={tab.label}
                                    value={tab.value}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex' }}>
                        <SessionListFilters
                            containerRef={rootRef}
                            onClose={handleCloseFilters}
                            open={openFilters}
                            applyFilters={(filters: any): Promise<void> =>
                                applyFilters(filters)
                            }
                            clearFilters={clearFilters}
                        />
                        <SessionListInner open={openFilters} />
                        <Box sx={{ width: '100%' }}>
                            <TableContainer>
                                <Table
                                    aria-labelledby='tableTitle'
                                    size='small'
                                >
                                    <TableHeads headCells={headCells} />
                                    <TableBody>
                                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                            rows.slice().sort(getComparator(order, orderBy)) */}
                                        {sessions.map((row, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <SessionsRow
                                                    key={row?.id}
                                                    row={row}
                                                    labelId={labelId}
                                                    deleteSession={
                                                        deleteSession
                                                    }
                                                    updateSession={
                                                        updateSession
                                                    }
                                                    statuses={statuses}
                                                />
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                    <TablePagination
                        component='div'
                        count={sessionsCount}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Paper>
        </Box>
    );
};
