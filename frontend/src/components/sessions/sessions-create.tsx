import { useCallback, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Field, useFormik } from 'formik';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Divider,
    Chip,
    Dialog,
    Grid,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import get from 'lodash/get';
import set from 'lodash/set';
import toast from 'react-hot-toast';
import { userApi } from '../../api/userApi';
import { VisibilityOff } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import { PasswordValidationForm } from '../auth/password-validation-form';
import Select from '@material-ui/core/Select';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { formatDate } from '@fullcalendar/core';
import { useMounted } from '../../hooks/use-mounted';
import { deptApi } from '../../api/deptApi';
import { sessionApi } from '../../api/sessionsApi';
import { SessionListFilters } from './sessions-list-filters';
import { SessionListInner } from './sessions-table';
import { useAuth } from '../../hooks/use-auth';

const genders = ['male', 'female'];
const weekDays = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
];

export const sessionMethods = [{ value: 'zoom', label: 'zoom' }];
const CreateSession = () => {
    const initialFilters: any = {
        date: {
            from: null,
            to: null,
        },
        teacherId: null,
        departmentId: null,
        studentId: null,
    };
    const isMounted = useMounted();
    const { user } = useAuth();
    const calendar = useRef(null);

    const [weekendsVisible, setWeekendsVisible] = useState(false);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [sessionTypes, setSessionTypes] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const [filters, setFilters] = useState<any>({});
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'), {
        noSsr: false,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [openFilters, setOpenFilters] = useState<boolean>(mdUp);

    const handleClose = () => {
        formik.resetForm();
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const getUsers = useCallback(
        async (rowsPerPage: any, page: number) => {
            try {
                const data: any = await userApi.getUsers(
                    rowsPerPage,
                    page,
                    'teacher',
                    'student'
                );

                if (isMounted()) {
                    const filteredStudents: any[] = data.rows.filter(
                        (row: any) => row?.roleId === 4
                    );
                    const filteredTeachers: any[] = data.rows.filter(
                        (row: any) => row?.roleId === 3
                    );
                    setStudents(filteredStudents);
                    setTeachers(filteredTeachers);
                }
            } catch (err: any) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    const getSubjects = useCallback(
        async () => {
            try {
                const data: any = await deptApi.getDepts('ALL', -1);
                if (isMounted()) {
                    setSubjects(data.rows);
                }
            } catch (err: any) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    const getSessionTypes = useCallback(
        async () => {
            try {
                const data: any = await sessionApi.getSessionTypes();
                if (isMounted()) {
                    setSessionTypes(data.resp);
                }
            } catch (err: any) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    const getSessions = useCallback(
        async (filterObject: any) => {
            try {
                const data: any = await sessionApi.getSessions({
                    ...filterObject,
                    ...filters,
                });

                if (isMounted()) {
                    setSessions(
                        data.rows.map((ra: any) => ({
                            title: ra.title || 'No name',
                            start: `${ra.date.substr(0, 10)}T${ra.startTime}`,
                            end: `${ra.date.substr(0, 10)}T${ra.endTime}`,
                        }))
                    );
                }
            } catch (err: any) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    useEffect(() => {
        getUsers('ALL', -1);
        getSubjects();
        getSessionTypes();
        getSessions({ limit: 'ALL', offset: -1 });
    }, []);

    const createSession = async (
        values: any
    ): Promise<{ success: boolean }> => {
        const load = toast.loading('create');
        try {
            const resp = await sessionApi.createSession(values);
            if (resp) {
                toast.dismiss(load);
                toast.success('createSessionSuccess');
                getSessions({ limit: 'ALL', offset: -1 });
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error('createSessionFailed');
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || 'createSessionsFailed');
            return { success: false };
        }
    };

    const formik = useFormik({
        initialValues: {
            departmentId: '',
            sessionTypeId: '',
            studentId: '',
            teacherId: '',
            fromDate: '',
            toDate: '',
            dayOfWeek: [],
            startTime: '',
            endTime: '',
            title: '',
            sessionMethod: '',
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            departmentId: yup.number().required('subject is required'),
            sessionTypeId: yup.number().required('session type is required'),
            studentId: yup.number().required('student is required'),
            teacherId: yup.number().required('teacher is required'),
            dayOfWeek: yup.number().required('dayOfWeek is required'),
            fromDate: yup.date().required('fromDate is required'),
            toDate: yup.date().required('toDate is required'),
            startTime: yup.string().required('startTime is required'),
            endTime: yup.string().required('endTime is required'),
            title: yup.string().required('title is required'),
            sessionMethod: yup.string().required('sessionMethod is required'),
        }),
        onSubmit: async (values) => {
            console.log({ values });

            const { success } = await createSession(values);
            if (success) {
                handleClose();
                formik.resetForm();
            }
        },
    });

    const handleWeekendsToggle = () => {
        // setWeekendsVisible(!weekendsVisible);
    };

    const handleDateSelect = (selectInfo: any) => {
        // let title = prompt('Please enter a new title for your event');
        // let calendarApi = selectInfo.view.calendar;
        // calendarApi.unselect(); // clear date selection
        // if (title) {
        //     calendarApi.addEvent({
        //         id: String(counter++),
        //         title,
        //         start: selectInfo.startStr,
        //         end: selectInfo.endStr,
        //         allDay: selectInfo.allDay,
        //     });
        // }
    };

    const handleEventClick = (clickInfo: any) => {
        // if (
        //     confirm(
        //         `Are you sure you want to delete the event '${clickInfo.event.title}'`
        //     )
        // ) {
        //     clickInfo.event.remove();
        // }
    };

    const handleEvents = (events: any) => {
        setCurrentEvents(events);
    };

    const applyFilters = (filters: any): any => {
        setFilters(filters);
        getSessions({ limit: 'ALL', offset: -1, ...filters });
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
        <Box sx={{ margin: 1, display: 'flex', width: '100%' }}>
            {['super_admin', 'admin'].includes(user?.role?.name) && (
                <Box sx={{ width: openFilters ? '20%' : '0%' }}>
                    <SessionListFilters
                        containerRef={rootRef}
                        onClose={handleCloseFilters}
                        open={openFilters}
                        applyFilters={(filters: any): Promise<void> =>
                            applyFilters(filters)
                        }
                        clearFilters={clearFilters}
                        isCreatePage={true}
                    />
                    {/* <SessionListInner open={openFilters} /> */}
                </Box>
            )}
            <Box
                sx={{
                    // width: openFilters
                    //     ? 'calc(100% - 380px)'
                    //     : 'calc(100% + 380px)',
                    m: 'auto',
                    width: openFilters ? '75%' : '90%',
                }}
            >
                <FullCalendar
                    ref={calendar}
                    headerToolbar={{
                        left: 'prev,next today filterButton',
                        center: 'title',
                        right: 'addEventButton,multiMonthYear,listWeek,dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView='dayGridMonth'
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                        multiMonthPlugin,
                    ]}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={weekendsVisible}
                    // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    // eventContent={renderEventContent} // custom render function
                    eventClick={handleEventClick}
                    eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                    /* you can update a remote database when these fire: */
                    eventAdd={function () {}}
                    eventChange={function () {}}
                    eventRemove={function () {}}
                    // weekends={false}
                    events={sessions}
                    customButtons={{
                        ...((user?.role?.name === 'admin' ||
                            user?.role?.name === 'super_admin') && {
                            addEventButton: {
                                text: 'add event',
                                click: function (selectInfo, ev) {
                                    handleOpen();
                                },
                            },
                            filterButton: {
                                text: 'Filter',
                                click: function (selectInfo, ev) {
                                    handleToggleFilters();
                                },
                            },
                        }),
                    }}
                />
            </Box>
            {/* <div className='demo-app-sidebar-section'>
                <h2>All Events ({currentEvents.length})</h2>
                <ul>{currentEvents.map(renderSidebarEvent)}</ul>
            </div> */}
            <Dialog maxWidth='md' open={open}>
                <DialogTitle
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                    }}
                >
                    <Typography variant='subtitle2'>
                        Create patch of sessions
                    </Typography>
                </DialogTitle>
                <Box sx={{ p: 2, width: 600, bgcolor: 'white' }}>
                    <DialogContent sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label='Title'
                                    name='title'
                                    type='text'
                                    sx={{ width: '100%' }}
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                    error={Boolean(
                                        formik.errors.title &&
                                            formik.touched.title
                                    )}
                                    helperText={
                                        formik.touched.title &&
                                        formik.errors.title
                                    }
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Session Method'
                                        name='sessionMethod'
                                        value={formik.values.sessionMethod}
                                        error={Boolean(
                                            formik.errors.sessionMethod &&
                                                formik.touched.sessionMethod
                                        )}
                                        helperText={
                                            formik.touched.sessionMethod &&
                                            formik.errors.sessionMethod
                                        }
                                        InputLabelProps={{
                                            shrink: formik.values.sessionMethod
                                                ? true
                                                : false,
                                        }}
                                        fullWidth
                                        required
                                        select
                                        onChange={formik.handleChange}
                                    >
                                        {sessionMethods.map(
                                            (option: {
                                                value: string;
                                                label: string;
                                            }) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Subject'
                                        name='departmentId'
                                        value={formik.values.departmentId}
                                        error={Boolean(
                                            formik.errors.departmentId &&
                                                formik.touched.departmentId
                                        )}
                                        helperText={
                                            formik.touched.departmentId &&
                                            formik.errors.departmentId
                                        }
                                        InputLabelProps={{
                                            shrink: formik.values.departmentId
                                                ? true
                                                : false,
                                        }}
                                        fullWidth
                                        required
                                        select
                                        onChange={formik.handleChange}
                                    >
                                        {subjects.map(
                                            (option: {
                                                id: string;
                                                name: string;
                                            }) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Teacher'
                                        name='teacherId'
                                        value={formik.values.teacherId}
                                        error={Boolean(
                                            formik.errors.teacherId &&
                                                formik.touched.teacherId
                                        )}
                                        helperText={
                                            formik.touched.teacherId &&
                                            formik.errors.teacherId
                                        }
                                        InputLabelProps={{
                                            shrink: formik.values.teacherId
                                                ? true
                                                : false,
                                        }}
                                        fullWidth
                                        required
                                        select
                                        onChange={formik.handleChange}
                                    >
                                        {teachers.map(
                                            (option: {
                                                id: string;
                                                firstName: string;
                                                lastName: string;
                                            }) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.firstName}{' '}
                                                    {option.lastName}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Student'
                                        name='studentId'
                                        value={formik.values.studentId}
                                        error={Boolean(
                                            formik.errors.studentId &&
                                                formik.touched.studentId
                                        )}
                                        fullWidth
                                        required
                                        select
                                        helperText={
                                            formik.touched.studentId &&
                                            formik.errors.studentId
                                        }
                                        InputLabelProps={{
                                            shrink: formik.values.studentId
                                                ? true
                                                : false,
                                        }}
                                        onChange={formik.handleChange}
                                    >
                                        {students.map(
                                            (option: {
                                                id: string;
                                                firstName: string;
                                                lastName: string;
                                            }) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.firstName}{' '}
                                                    {option.lastName}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label='From Date'
                                    name='fromDate'
                                    type='date'
                                    sx={{ width: '100%' }}
                                    onChange={formik.handleChange}
                                    value={formik.values.fromDate}
                                    error={Boolean(
                                        formik.errors.fromDate &&
                                            formik.touched.fromDate
                                    )}
                                    helperText={
                                        formik.touched.fromDate &&
                                        formik.errors.fromDate
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label='To Date'
                                    name='toDate'
                                    type='date'
                                    sx={{ width: '100%' }}
                                    onChange={formik.handleChange}
                                    value={formik.values.toDate}
                                    error={Boolean(
                                        formik.errors.toDate &&
                                            formik.touched.toDate
                                    )}
                                    helperText={
                                        formik.touched.toDate &&
                                        formik.errors.toDate
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label='Start Time'
                                    name='startTime'
                                    type='time'
                                    sx={{ width: '100%' }}
                                    onChange={formik.handleChange}
                                    value={formik.values.startTime}
                                    error={Boolean(
                                        formik.errors.startTime &&
                                            formik.touched.startTime
                                    )}
                                    helperText={
                                        formik.touched.startTime &&
                                        formik.errors.startTime
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label='End Time'
                                    name='endTime'
                                    type='time'
                                    sx={{ width: '100%' }}
                                    onChange={formik.handleChange}
                                    value={formik.values.endTime}
                                    error={Boolean(
                                        formik.errors.endTime &&
                                            formik.touched.endTime
                                    )}
                                    helperText={
                                        formik.touched.endTime &&
                                        formik.errors.endTime
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Day of week'
                                        name='dayOfWeek'
                                        value={formik.values.dayOfWeek}
                                        error={Boolean(
                                            formik.errors.dayOfWeek &&
                                                formik.touched.dayOfWeek
                                        )}
                                        helperText={
                                            formik.touched.dayOfWeek &&
                                            formik.errors.dayOfWeek
                                        }
                                        InputLabelProps={{
                                            shrink: formik.values.dayOfWeek
                                                ? true
                                                : false,
                                        }}
                                        fullWidth
                                        required
                                        select
                                        onChange={formik.handleChange}
                                        SelectProps={{
                                            multiple: true,
                                        }}
                                    >
                                        {weekDays.map(
                                            (option: {
                                                value: number;
                                                label: string;
                                            }) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Session Type'
                                        name='sessionTypeId'
                                        value={formik.values.sessionTypeId}
                                        error={Boolean(
                                            formik.errors.sessionTypeId &&
                                                formik.touched.sessionTypeId
                                        )}
                                        helperText={
                                            formik.touched.sessionTypeId &&
                                            formik.errors.sessionTypeId
                                        }
                                        InputLabelProps={{
                                            shrink: formik.values.sessionTypeId
                                                ? true
                                                : false,
                                        }}
                                        fullWidth
                                        required
                                        select
                                        onChange={formik.handleChange}
                                    >
                                        {sessionTypes.map(
                                            (option: {
                                                id: string;
                                                name: string;
                                            }) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                            }}
                        >
                            <Button
                                variant='outlined'
                                size='small'
                                onClick={handleClose}
                            >
                                {' '}
                                Cancel
                            </Button>
                            <LoadingButton
                                //   loading={loading}
                                type='submit'
                                variant='contained'
                                onClick={() => formik.handleSubmit()}
                            >
                                Create
                            </LoadingButton>
                        </Box>
                    </DialogActions>
                </Box>
            </Dialog>
            {/* <form onSubmit={formik.handleSubmit}>
                <Divider textAlign='left' sx={{ m: 1 }}>
                    <Chip label='Student Details' sx={{ fontWeight: '600' }} />
                </Divider>
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.firstName && formik.errors.firstName
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.firstName && formik.errors.firstName
                    }
                    label='firstName'
                    margin='normal'
                    id='firstName'
                    name='firstName'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.lastName && formik.errors.lastName
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.lastName && formik.errors.lastName
                    }
                    label='lastName'
                    margin='normal'
                    id='lastName'
                    name='lastName'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />

                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.birthDate && formik.errors.birthDate
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.birthDate && formik.errors.birthDate
                    }
                    label='Date Of Birth'
                    margin='normal'
                    id='birthDate'
                    name='birthDate'
                    type='date'
                    onChange={formik.handleChange}
                    value={formik.values.birthDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.phoneNumber && formik.errors.phoneNumber
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.phoneNumber && formik.errors.phoneNumber
                    }
                    label='phoneNumber'
                    margin='normal'
                    id='phoneNumber'
                    name='phoneNumber'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.phoneNumber}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <FormControl
                    sx={{
                        width: { xs: 100, sm: 150, md: 200, lg: 250, xl: 300 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                        marginTop: 2,
                    }}
                    variant='outlined'
                >
                    {' '}
                    <InputLabel id='outlined-adornment-gender'>
                        Gender
                    </InputLabel>
                    <Select
                        name='gender'
                        id='outlined-adornment-gender'
                        labelId='outlined-adornment-gender'
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                    >
                        {genders.map((gender) => (
                            <MenuItem key={gender} value={gender}>
                                {gender}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(formik.touched.city && formik.errors.city)}
                    // @ts-ignore
                    helperText={formik.touched.city && formik.errors.city}
                    label='city'
                    margin='normal'
                    id='city'
                    name='city'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.city}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <Divider textAlign='left' sx={{ m: 1 }}>
                    <Chip label='Login Details' sx={{ fontWeight: '600' }} />
                </Divider>
               
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.username && formik.errors.username
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.username && formik.errors.username
                    }
                    label='username'
                    margin='normal'
                    id='username'
                    name='username'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 150, sm: 175, md: 200, lg: 225, xl: 250 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    // @ts-ignore
                    helperText={formik.touched.email && formik.errors.email}
                    label='email'
                    margin='normal'
                    id='email'
                    name='email'
                    type='email'
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <FormControl
                    sx={{
                        width: { xs: 200, sm: 250, md: 300, lg: 350, xl: 400 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                        marginTop: 2,
                    }}
                    variant='outlined'
                >
                    <InputLabel htmlFor='outlined-adornment-password'>
                        password
                    </InputLabel>
                    <OutlinedInput
                        error={Boolean(
                            formik.touched.password && formik.errors.password
                        )}
                        fullWidth
                        // helperText={formik.touched.password && formik.errors.password}
                        label='password'
                        name='password'
                        onBlur={onBlur}
                        onChange={formik.handleChange}
                        onFocus={onFocus}
                        value={formik.values.password}
                        type={showPassword ? 'text' : 'password'}
                        sx={{
                            fontFamily: 'sans-serif',
                        }}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge='end'
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {showPasswordValidation === true && (
                        <PasswordValidationForm
                            sx={{ bottom: '-180px' }}
                            password={formik.values.password}
                        />
                    )}
                </FormControl>
                <TextField
                    sx={{
                        width: { xs: 200, sm: 250, md: 300, lg: 350, xl: 400 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                    )}
                    fullWidth
                    helperText={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                    }
                    label='confirmPassword'
                    margin='normal'
                    name='confirmPassword'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <Divider textAlign='left' sx={{ m: 1 }}>
                    <Chip label='Guardian Details' sx={{ fontWeight: '600' }} />
                </Divider>

                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(formik.touched.gName && formik.errors.gName)}
                    // @ts-ignore
                    helperText={formik.touched.gName && formik.errors.gName}
                    label='gName'
                    margin='normal'
                    id='gName'
                    name='gName'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.gName}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.relation && formik.errors.relation
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.relation && formik.errors.relation
                    }
                    label='relation'
                    margin='normal'
                    id='relation'
                    name='relation'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.relation}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />

                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.gEmail && formik.errors.gEmail
                    )}
                    // @ts-ignore
                    helperText={formik.touched.gEmail && formik.errors.gEmail}
                    label='gEmail'
                    margin='normal'
                    id='gEmail'
                    name='gEmail'
                    type='gEmail'
                    onChange={formik.handleChange}
                    value={formik.values.gEmail}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <TextField
                    size='small'
                    sx={{
                        width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        mr: 1,
                    }}
                    error={Boolean(
                        formik.touched.gMobile_no && formik.errors.gMobile_no
                    )}
                    // @ts-ignore
                    helperText={
                        formik.touched.gMobile_no && formik.errors.gMobile_no
                    }
                    label='gMobile_no'
                    margin='normal'
                    id='gMobile_no'
                    name='gMobile_no'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.gMobile_no}
                    InputProps={{
                        style: {
                            fontFamily: 'sans-serif',
                        },
                    }}
                />
                <Divider sx={{ m: 1 }}></Divider>
                <LoadingButton
                    type='submit'
                    sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                        m: 0.5,
                    }}
                    variant='contained'
                >
                    Save
                </LoadingButton>
            </form> */}
        </Box>
    );
};

export default CreateSession;
