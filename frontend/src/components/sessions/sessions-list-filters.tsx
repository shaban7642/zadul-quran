import { useCallback, useEffect, useMemo, useState } from "react";
import type { FC, MutableRefObject, SyntheticEvent, ChangeEvent } from "react";
import PropTypes from "prop-types";
import {
    Autocomplete,
    Box,
    Button,
    Drawer,
    FormControl,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/router";
import { userApi } from "../../api/userApi";
import { useMounted } from "../../hooks/use-mounted";
import { deptApi } from "../../api/deptApi";

// Type definitions
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    roleId: number;
    email?: string;
}

export interface Department {
    id: number;
    name: string;
    code?: string;
}

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
    onClose?: () => void;
    open?: boolean;
    applyFilters: (filters: Filters) => void;
    clearFilters?: () => void;
    loading?: boolean;
    isCreatePage?: boolean;
}

interface ApiResponse<T> {
    rows: T[];
    count: number;
}

// Styled components
const FiltersDrawerDesktop = styled(Drawer)({
    flexShrink: 0,
    width: 305,
    "& .MuiDrawer-paper": {
        position: "relative",
        width: 305,
        backgroundColor: "white",
    },
});

const FiltersDrawerMobile = styled(Drawer)({
    maxWidth: "100%",
    width: 305,
    "& .MuiDrawer-paper": {
        height: "calc(100% - 64px)",
        maxWidth: "100%",
        top: 64,
        width: 305,
    },
});

export const SessionListFilters: FC<SessionListFiltersProps> = ({
    containerRef,
    onClose,
    open,
    applyFilters,
    clearFilters,
    loading,
    isCreatePage,
    ...other
}) => {
    const router = useRouter();
    const isMounted = useMounted();
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

    // Memoized initial filters
    const initialFilters = useMemo<Filters>(
        () => ({
            date: { from: null, to: null },
            teacherId: null,
            departmentId: null,
            studentId: Number(router.query.student) || null,
        }),
        [router.query.student]
    );

    // Component state
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [subjects, setSubjects] = useState<Department[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // Data fetching
    const fetchData = useCallback(async () => {
        try {
            setLoadingTeachers(true);
            setLoadingStudents(true);

            const [usersData, deptData] = await Promise.all([
                userApi.getUsers("All", 0, "teacher", "student") as Promise<
                    ApiResponse<User>
                >,
                deptApi.getDepts("All", -1) as Promise<ApiResponse<Department>>,
            ]);

            if (isMounted()) {
                setTeachers(
                    usersData.rows.filter((user: User) => user.roleId === 3)
                );
                setStudents(
                    usersData.rows.filter((user: User) => user.roleId === 4)
                );
                setSubjects(deptData.rows);
            }
        } catch (error) {
            console.error("Error fetching filter data:", error);
        } finally {
            setLoadingTeachers(false);
            setLoadingStudents(false);
        }
    }, [isMounted]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Sync student ID from URL query
    useEffect(() => {
        if (router.query.student) {
            const studentId = Number(router.query.student);
            if (!isNaN(studentId)) {
                setFilters((prev) => ({ ...prev, studentId }));
            }
        }
    }, [router.query.student]);

    // Handlers
    const handleDateChange =
        (type: "from" | "to") => (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const date = value ? new Date(value) : null;

            setFilters((prev) => ({
                ...prev,
                date: {
                    ...prev.date,
                    [type]: date,
                },
            }));
        };

    const handleAutocompleteChange =
        <T extends User | Department>(field: keyof Filters) =>
        (_event: SyntheticEvent, newValue: T | null) => {
            setFilters((prev) => ({
                ...prev,
                [field]: newValue?.id ?? null,
            }));
        };

    const handleClear = () => {
        setFilters(initialFilters);
        clearFilters?.();
    };

    // Component content
    const content = (
        <Box sx={{ p: 3 }}>
            {/* Teacher Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
                <Autocomplete<User>
                    options={teachers}
                    loading={loadingTeachers}
                    getOptionLabel={(option) =>
                        `${option.firstName} ${option.lastName}`
                    }
                    value={
                        teachers.find((t) => t.id === filters.teacherId) || null
                    }
                    onChange={handleAutocompleteChange<User>("teacherId")}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Teacher"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </FormControl>

            {/* Student Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
                <Autocomplete<User>
                    options={students}
                    loading={loadingStudents}
                    getOptionLabel={(option) =>
                        `${option.firstName} ${option.lastName}`
                    }
                    value={
                        students.find((s) => s.id === filters.studentId) || null
                    }
                    onChange={handleAutocompleteChange<User>("studentId")}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Student"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </FormControl>

            {/* Department Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
                <Autocomplete<Department>
                    options={subjects}
                    getOptionLabel={(option) => option.name}
                    value={
                        subjects.find((d) => d.id === filters.departmentId) ||
                        null
                    }
                    onChange={handleAutocompleteChange<Department>(
                        "departmentId"
                    )}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Subject"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </FormControl>

            {/* Date Range Filter */}
            <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ mb: 2 }}
            >
                Date Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box display="flex" gap={2} mb={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="From"
                        InputLabelProps={{ shrink: true }}
                        value={
                            filters.date.from?.toISOString().split("T")[0] || ""
                        }
                        onChange={handleDateChange("from")}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="To"
                        InputLabelProps={{ shrink: true }}
                        value={
                            filters.date.to?.toISOString().split("T")[0] || ""
                        }
                        onChange={handleDateChange("to")}
                        disabled={!filters.date.from}
                        inputProps={{
                            min: filters.date.from?.toISOString().split("T")[0],
                        }}
                    />
                </Box>
            </LocalizationProvider>

            {/* Action Buttons */}
            <LoadingButton
                fullWidth
                loading={loading}
                variant="contained"
                onClick={() => applyFilters(filters)}
            >
                Apply Filters
            </LoadingButton>
            <Button
                fullWidth
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={handleClear}
            >
                Clear Filters
            </Button>
        </Box>
    );

    // Render logic
    if (isCreatePage) {
        return open ? <Box>{content}</Box> : <Box sx={{ width: "0px" }}></Box>;
    }

    if (lgUp) {
        return (
            <FiltersDrawerDesktop
                anchor="left"
                open={open}
                SlideProps={{ container: containerRef?.current }}
                variant="persistent"
                {...other}
            >
                {content}
            </FiltersDrawerDesktop>
        );
    }

    return (
        <FiltersDrawerMobile
            anchor="left"
            ModalProps={{ container: containerRef?.current }}
            onClose={onClose}
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="temporary"
            {...other}
        >
            {content}
        </FiltersDrawerMobile>
    );
};

SessionListFilters.propTypes = {
    containerRef: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    applyFilters: PropTypes.func.isRequired,
    clearFilters: PropTypes.func,
    loading: PropTypes.bool,
    isCreatePage: PropTypes.bool,
};
