import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { FC, FormEvent, MutableRefObject } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Checkbox,
    Drawer,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    MenuItem,
    Slider,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Search as SearchIcon } from '../../icons/search';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowRight } from '../../icons/arrow-right';
// import { giveAccess } from 'src/utils/component-guard';
// import { Role } from 'src/shared/enums';
import { debounce } from 'lodash';
import { userApi } from '../../api/userApi';
import { useMounted } from '../../hooks/use-mounted';
import { deptApi } from '../../api/deptApi';

export interface Filters {
    teacherId?: number | null;
    studentId?: number | null;
    departmentId?: number | null;
    date: {
        from?: Date | null;
        to?: Date | null;
    };
}

interface SessionListFiltersProps {
    containerRef?: MutableRefObject<HTMLDivElement | null>;
    // filters?: Filters;
    // onChange?: (filters: Filters) => void;
    onClose?: () => void;
    open?: boolean;
    applyFilters: (filters: Filters) => void;
    clearFilters?: () => void;
    loading?: boolean;
    isCreatePage?: boolean;
}

const FiltersDrawerDesktop = styled(Drawer)({
    flexShrink: 0,
    width: 305,
    '& .MuiDrawer-paper': {
        position: 'relative',
        width: 305,
        backgroundColor: 'white',
    },
});

const FiltersDrawerMobile = styled(Drawer)({
    maxWidth: '100%',
    width: 305,
    '& .MuiDrawer-paper': {
        height: 'calc(100% - 64px)',
        maxWidth: '100%',
        top: 64,
        width: 305,
    },
});

export const SessionListFilters: FC<SessionListFiltersProps> = (props) => {
    const initialFilters: Filters = {
        date: {
            from: null,
            to: null,
        },
        teacherId: null,
        departmentId: null,
        studentId: null,
    };
    const isMounted = useMounted();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [filters, setFilters] = useState(initialFilters);
    const {
        containerRef,
        // filters,
        // onChange,
        onClose,
        open,
        applyFilters,
        clearFilters,
        loading,
        isCreatePage,
        ...other
    } = props;

    const onChange = (filters: Filters) => {
        setFilters(filters);
    };
    const teacherIdRef = useRef<HTMLInputElement | null>(null);
    const studentIdRef = useRef<HTMLInputElement | null>(null);
    const departmentIdRef = useRef<HTMLInputElement | null>(null);
    const prevFiltersRef = useRef<Filters>({
        date: {
            from: null,
            to: null,
        },
        teacherId: null,
        departmentId: null,
        studentId: null,
    });
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const handleTeacherChange = useRef(
        debounce((value) => {
            onChange?.({
                ...filters,
                teacherId: teacherIdRef.current?.value
                    ? +teacherIdRef.current.value
                    : null,
            });
            applyFilters({
                ...filters,
                teacherId: value,
            });
        }, 2000)
    ).current;

    const handleStudentChange = useRef(
        debounce((value) => {
            onChange?.({
                ...filters,
                studentId: studentIdRef.current?.value
                    ? +studentIdRef.current.value
                    : null,
            });
            applyFilters({
                ...filters,
                studentId: value,
            });
        }, 2000)
    ).current;

    const handleDepartmentChange = useRef(
        debounce((value) => {
            onChange?.({
                ...filters,
                departmentId: departmentIdRef.current?.value
                    ? +departmentIdRef.current.value
                    : null,
            });
            applyFilters({
                ...filters,
                departmentId: value,
            });
        }, 2000)
    ).current;

    // const handleDepartmentChange = (
    //     event: FormEvent<HTMLFormElement>
    // ): void => {
    //     event?.preventDefault();

    //     onChange?.({
    //         ...filters,
    //         departmentId: departmentIdRef.current?.value
    //             ? +departmentIdRef.current.value
    //             : null,
    //     });
    //     applyFilters({
    //         ...filters,
    //         departmentId: departmentIdRef.current?.value
    //             ? +departmentIdRef.current.value
    //             : null,
    //     });
    // };

    function valuetext(value: number) {
        return `${value}`;
    }

    const handleUploadDateChange = (newValues: any) => {
        const newFilters = {
            ...filters,
            date: {
                from: newValues[0],
                to: newValues[1],
            },
        };
        onChange?.(newFilters);
    };

    const handleSpendDateChange = (newValues: any) => {
        const newFilters = {
            ...filters,
            spendOn: {
                from: newValues[0],
                to: newValues[1],
            },
        };
        onChange?.(newFilters);
    };

    const handleXeroStatusYesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFilters = {
            ...filters,
            xeroStatusYes: e.target.checked,
        };
        onChange?.(newFilters);
    };

    const handleXeroStatusNoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFilters = {
            ...filters,
            xeroStatusNo: e.target.checked,
        };
        onChange?.(newFilters);
    };

    const onClear = () => {
        setFilters(initialFilters);
        clearFilters?.();
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
            } catch (err) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    const getSubjects = useCallback(
        async () => {
            try {
                const data: any = await deptApi.getDepts();
                if (isMounted()) {
                    setSubjects(data.rows);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    useEffect(() => {
        getUsers('ALL', -1);
        getSubjects();
    }, []);

    useEffect(() => {
        prevFiltersRef.current = filters;
    }, [filters]);

    const content = (
        <Box
            sx={{
                pb: 3,
                pt: {
                    xs: 3,
                },
                px: 3,
            }}
        >
            <Box component='form'>
                <TextField
                    label='Teacher'
                    name='teacherId'
                    value={filters.teacherId}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTeacherChange(e.target.value);
                        }
                    }}
                    inputProps={{ ref: teacherIdRef }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon fontSize='small' />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    select
                    onChange={(e: any): any => {
                        onChange?.({
                            ...filters,
                            teacherId: e.target.value,
                        });
                        // handleTeacherChange(e.target.value);
                    }}
                >
                    {teachers.map(
                        (option: {
                            id: string;
                            firstName: string;
                            lastName: string;
                        }) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.firstName} {option.lastName}
                            </MenuItem>
                        )
                    )}
                </TextField>
            </Box>
            <Box component='form'>
                <TextField
                    sx={{ mt: 3 }}
                    label='Student'
                    name='studentId'
                    value={filters.studentId}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleStudentChange(e.target.value);
                        }
                    }}
                    inputProps={{ ref: studentIdRef }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon fontSize='small' />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    select
                    onChange={(e: any): any => {
                        onChange?.({
                            ...filters,
                            studentId: e.target.value,
                        });
                        // handleStudentChange(e.target.value);
                    }}
                >
                    {students.map(
                        (option: {
                            id: string;
                            firstName: string;
                            lastName: string;
                        }) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.firstName} {option.lastName}
                            </MenuItem>
                        )
                    )}
                </TextField>
            </Box>
            <Box component='form'>
                <TextField
                    sx={{ mt: 3 }}
                    label='Subject'
                    name='departmentId'
                    value={filters.departmentId}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleDepartmentChange(e.target.value);
                        }
                    }}
                    inputProps={{ ref: departmentIdRef }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon fontSize='small' />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    select
                    onChange={(e: any): any => {
                        onChange?.({
                            ...filters,
                            departmentId: e.target.value,
                        });
                        // handleDepartmentChange(e.target.value);
                    }}
                >
                    {subjects.map((option: { id: string; name: string }) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Typography
                color='textSecondary'
                sx={{ mt: 4 }}
                variant='subtitle2'
            >
                {'Date'}
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ pr: 1 }}>
                            <DatePicker
                                label={'from'}
                                value={filters.date.from as unknown as Date}
                                onChange={(newValue: any) => {
                                    handleUploadDateChange([
                                        newValue,
                                        filters.date.to,
                                    ]);
                                }}
                                maxDate={new Date() as unknown as Date}
                                renderInput={(params: any) => (
                                    <TextField {...params} />
                                )}
                            />
                        </Box>
                        <ArrowRight fontSize='inherit' />{' '}
                        <Box sx={{ pl: 1 }}>
                            <DatePicker
                                label={'to'}
                                minDate={filters.date.from}
                                maxDate={new Date() as unknown as Date}
                                value={filters.date.to as unknown as Date}
                                onChange={(newValue: any) => {
                                    handleUploadDateChange([
                                        filters.date.from,
                                        newValue,
                                    ]);
                                }}
                                renderInput={(params: any) => (
                                    <TextField {...params} />
                                )}
                            />
                        </Box>
                    </Box>
                </LocalizationProvider>
            </Stack>

            <LoadingButton
                loading={loading}
                sx={{ mt: 2 }}
                variant='contained'
                onClick={() => {
                    const previousFilters = prevFiltersRef.current;
                    console.log({ filters, previousFilters });
                    applyFilters(filters);
                }}
            >
                Apply Filters
            </LoadingButton>
            <Button sx={{ mt: 2 }} variant='text' onClick={onClear}>
                Clear
            </Button>
        </Box>
    );

    if (isCreatePage) {
        return open ? <Box>{content}</Box> : <Box sx={{ width: '0px' }}></Box>;
    }

    if (lgUp) {
        return (
            <FiltersDrawerDesktop
                anchor='left'
                open={open}
                SlideProps={{ container: containerRef?.current }}
                variant='persistent'
                {...other}
            >
                {content}
            </FiltersDrawerDesktop>
        );
    }

    return (
        <FiltersDrawerMobile
            anchor='left'
            ModalProps={{ container: containerRef?.current }}
            onClose={onClose}
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant='temporary'
            {...other}
        >
            {content}
        </FiltersDrawerMobile>
    );
};

SessionListFilters.propTypes = {
    containerRef: PropTypes.any,
    // @ts-ignore
    filters: PropTypes.object,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
