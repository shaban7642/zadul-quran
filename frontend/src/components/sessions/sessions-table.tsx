import {
    ChangeEvent,
    FC,
    MouseEvent,
    useCallback,
    useEffect,
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
import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { SessionsRow } from './sessions-row';
import { userApi } from '../../api/userApi';
import { useMounted } from '../../hooks/use-mounted';
import toast from 'react-hot-toast';
import { sessionApi } from '../../api/sessionsApi';

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
export const SessionsTable: FC<SessionsTableProps> = (props) => {
    const { roleId } = props;
    const isMounted = useMounted();
    const [sessions, setSessions] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [sessionsCount, setSessionsCount] = useState(2);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const headCells: readonly any[] = [
        {
            id: 'classMethod',
            numeric: false,
            disablePadding: true,
            label: 'Class Method',
        },
        {
            id: 'title',
            numeric: false,
            disablePadding: true,
            label: 'Title',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
        },
        {
            id: 'meetingId',
            numeric: false,
            disablePadding: true,
            label: 'Meeting ID',
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

    const getSessions = useCallback(
        async (rowsPerPage: number, page: number) => {
            try {
                const data: any = await sessionApi.getSessions(
                    rowsPerPage,
                    page
                );
                console.log({ data });
                if (isMounted()) {
                    setSessions(data.rows);
                    setSessionsCount(data.count);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    const deleteSession = async (id: number): Promise<{ success: boolean }> => {
        const load = toast.loading('delete');
        try {
            const resp = await sessionApi.deleteSession(id);
            if (resp) {
                toast.dismiss(load);
                toast.success('deleteSessionSuccess');
                getSessions(rowsPerPage, page);
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
                getSessions(rowsPerPage, page);
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

    useEffect(
        () => {
            getSessions(rowsPerPage, page);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [page, rowsPerPage]
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        // getSessions(rowsPerPage, newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getSessions(rowsPerPage, page);
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
    return (
        <Box sx={{ width: '100%', scrollBehavior: 'auto' }}>
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
                <TableContainer>
                    <Table aria-labelledby='tableTitle' size='small'>
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
                                        deleteSession={deleteSession}
                                        updateSession={updateSession}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component='div'
                    count={sessionsCount}
                    rowsPerPageOptions={[5, 10, 25]}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};
