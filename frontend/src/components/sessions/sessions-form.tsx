import React, { FC, useCallback, useEffect, useState } from "react";
import {
    Box,
    TextField,
    FormControl,
    MenuItem,
    Dialog,
    Grid,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Autocomplete,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { Field, useFormik } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMounted } from "../../hooks/use-mounted";
import { useAuth } from "../../hooks/use-auth";
import { userApi } from "../../api/userApi";
import { deptApi } from "../../api/deptApi";
import { sessionApi } from "../../api/sessionsApi";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { sessionMethods } from "./sessions-create";
import { Session } from "../users/users-profile";

const weekDays = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
];

interface SessionFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    sessions?: Session[];
    createSession: (values: any) => Promise<{ success: boolean }>;
}
export const SessionForm: FC<SessionFormProps> = (props) => {
    const { open, setOpen, sessions, createSession } = props;
    const isMounted = useMounted();

    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [sessionTypes, setSessionTypes] = useState<any[]>([]);
    const [sessionCount, setSessionCount] = useState<number>(0);

    const getUsers = useCallback(
        async (rowsPerPage: any, page: number) => {
            try {
                const data: any = await userApi.getUsers(
                    rowsPerPage,
                    page,
                    "teacher",
                    "student"
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
                const data: any = await deptApi.getDepts("ALL", -1);
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
    useEffect(() => {
        getUsers("ALL", -1);
        getSubjects();
        getSessionTypes();
    }, []);
    useEffect(() => {
        if (sessions?.length === 1) {
            formik.setValues({
                ...sessions[0],
                frontId: sessions[0].frontId || "",
            });
        }
    }, [sessions]);

    const handleClose = () => {
        formik.resetForm();
        setOpen(false);
    };
    const formik = useFormik({
        initialValues: {
            departmentId: "",
            sessionTypeId: "",
            studentId: "",
            teacherId: "",
            //  fromDate: "",
            toDate: "",
            dayOfWeek: [] as number[],

            endTime: "",
            title: "",
            sessionMethod: "",
            frontId: "",
        },

        validationSchema: yup.object({
            departmentId: yup.number().required("subject is required"),
            sessionTypeId: yup.number().required("session type is required"),
            studentId: yup.number().required("student is required"),
            teacherId: yup.number().required("teacher is required"),
            dayOfWeek: yup.number().required("dayOfWeek is required"),
            // fromDate: yup.date().required("fromDate is required"),
            toDate: yup.date().required("toDate is required"),
            //startTime: yup.string().required("startTime is required"),
            endTime: yup.string().required("endTime is required"),
            title: yup.string().required("title is required"),
            sessionMethod: yup.string().required("sessionMethod is required"),
        }),
        onSubmit: async (values) => {
            const date = new Date(String(fromDate));
            const time = date.getTime();
            const startTime = moment(time);
            const endTime = moment(values.endTime, "HH:mm");

            const { success } = await createSession({
                ...values,
                frontId: "",
                fromDate,
                startTime: startTime.utc().format("HH:mm"),
                endTime: endTime.utc().format("HH:mm"),
            });
            if (success) {
                handleClose();
                formik.resetForm();
            }
        },
    });

    useEffect(() => {
        if (fromDate && formik?.values?.toDate && formik.values.dayOfWeek) {
            const start = new Date(fromDate.toDate());
            const end = new Date(formik.values.toDate);
            end.setHours(23, 59, 59, 999); // Set end date to the end of the day
            const result = [];

            // For each day of the week (e.g., [1, 3, 5] for Mon, Wed, Fri)
            for (const targetDay of formik.values.dayOfWeek) {
                // Create a new Date object to prevent modifying the original `start`
                const currentDate = new Date(start);

                // Adjust currentDate to the first occurrence of targetDay
                while (currentDate.getDay() !== targetDay) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Loop through the dates, adding 7 days at a time, until we pass `end`
                while (currentDate <= end) {
                    result.push(new Date(currentDate).toISOString()); // Save the date
                    currentDate.setDate(currentDate.getDate() + 7);
                }
            }
            setSessionCount(result?.length || 0);
        }
    }, [fromDate, formik.values.toDate, formik.values.dayOfWeek]);

    return (
        <Dialog maxWidth="md" open={open}>
            <DialogTitle
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                }}
            >
                <Typography variant="subtitle2">
                    Create patch of sessions
                </Typography>
            </DialogTitle>
            <Box sx={{ p: 2, bgcolor: "white" }}>
                {/* map on sessions and show the session title  */}
                {sessions?.map((session: Session) => (
                    <Typography
                        key={session.frontId} // Use session.id as key
                        variant="h6"
                        sx={{
                            padding: "5px 0",
                            borderBottom: "1px solid #ccc",
                            display: "inline-block",
                            width: "20%",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor:
                                formik.values?.frontId === session?.frontId
                                    ? "gray"
                                    : "transparent",
                            color:
                                formik.values?.frontId === session?.frontId
                                    ? "white"
                                    : "inherit",
                            "&:hover": {
                                backgroundColor: "gray",
                                color: "white",
                            },
                        }}
                        onClick={() =>
                            formik.setValues({
                                ...session,
                                frontId: session.frontId || "",
                            })
                        }
                    >
                        {session.title}
                    </Typography>
                ))}

                <DialogContent sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                label="Title"
                                name="title"
                                type="text"
                                sx={{ width: "100%" }}
                                onChange={formik.handleChange}
                                value={formik.values.title}
                                error={Boolean(
                                    formik.errors.title && formik.touched.title
                                )}
                                helperText={
                                    formik.touched.title && formik.errors.title
                                }
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Session Method"
                                    name="sessionMethod"
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
                                    label="Subject"
                                    name="departmentId"
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
                                    label="Teacher"
                                    name="teacherId"
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
                                                {option.firstName}{" "}
                                                {option.lastName}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    options={students}
                                    getOptionLabel={(option) =>
                                        `${option.firstName} ${option.lastName}`
                                    }
                                    value={
                                        students.find(
                                            (student) =>
                                                student.id ===
                                                formik.values.studentId
                                        ) || null
                                    }
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue(
                                            "studentId",
                                            newValue ? newValue.id : ""
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Student"
                                            name="studentId"
                                            error={Boolean(
                                                formik.errors.studentId &&
                                                    formik.touched.studentId
                                            )}
                                            required
                                            helperText={
                                                formik.touched.studentId &&
                                                formik.errors.studentId
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    name="fromDate"
                                    sx={{ width: "100%" }}
                                    label="From Date & Start Time"
                                    value={fromDate}
                                    onChange={(newValue: any) => {
                                        setFromDate(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                label="To Date"
                                name="toDate"
                                type="date"
                                sx={{ width: "100%" }}
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
                                label="End Time"
                                name="endTime"
                                type="time"
                                sx={{ width: "100%" }}
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
                                    label="Day of week"
                                    name="dayOfWeek"
                                    value={
                                        Array.isArray(formik.values.dayOfWeek)
                                            ? formik.values.dayOfWeek
                                            : []
                                    } // Ensure dayOfWeek is an array
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
                            {sessionCount > 0 && (
                                <Typography color={"primary"} sx={{ mt: 2 }}>
                                    Number of sessions: {String(sessionCount)}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Session Type"
                                    name="sessionTypeId"
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
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClose}
                        >
                            {" "}
                            Cancel
                        </Button>
                        <LoadingButton
                            //   loading={loading}
                            type="submit"
                            variant="contained"
                            onClick={() => formik.handleSubmit()}
                        >
                            Create
                        </LoadingButton>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    );
};
