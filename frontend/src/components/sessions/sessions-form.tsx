import React, { FC, useEffect, useState } from "react";
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
import { useFormik } from "formik";
import { useMounted } from "../../hooks/use-mounted";
import { userApi } from "../../api/userApi";
import { deptApi } from "../../api/deptApi";
import { sessionApi } from "../../api/sessionsApi";
import { sessionMethods } from "./sessions-create";
import { Session } from "../users/users-profile";
import moment from "moment";

// Constants
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
    sessionTypesToParent: any;
}

interface Schedule {
    day: number;
    startTime: string;
    endTime: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    roleId: number;
}

interface Subject {
    id: string;
    name: string;
}

interface SessionType {
    id: string;
    type: string;
    duration: number;
}

// Define API response types
interface UserApiResponse {
    rows: User[];
}

interface SubjectApiResponse {
    rows: Subject[];
}

interface SessionTypeApiResponse {
    resp: SessionType[];
}

export const SessionForm: FC<SessionFormProps> = ({
    open,
    setOpen,
    sessions,
    createSession,
    sessionTypesToParent,
}) => {
    const isMounted = useMounted();
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [sessionTypes, setSessionTypes] = useState<any[]>([]);
    const [sessionCount, setSessionCount] = useState<
        number | undefined | string
    >(0);
    const [schedule, setSchedule] = useState<Schedule[]>([]);
    const [scheduleError, setScheduleError] = useState<string | null>(null); // State for schedule validation error
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if form has been submitted
    // Fetch users, subjects, and session types on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, subjectsData, sessionTypesData] =
                    await Promise.all([
                        userApi.getUsers(
                            "ALL",
                            -1,
                            "teacher",
                            "student"
                        ) as Promise<UserApiResponse>,
                        deptApi.getDepts(
                            "ALL",
                            -1
                        ) as Promise<SubjectApiResponse>,
                        sessionApi.getSessionTypes() as Promise<SessionTypeApiResponse>,
                    ]);

                if (isMounted()) {
                    setStudents(
                        usersData.rows.filter((row) => row.roleId === 4)
                    );
                    setTeachers(
                        usersData.rows.filter((row) => row.roleId === 3)
                    );
                    setSubjects(subjectsData.rows);
                    const types = sessionTypesData.resp?.sort(
                        (a, b) => a.duration - b.duration
                    );
                    setSessionTypes(types);
                    sessionTypesToParent && sessionTypesToParent(types);
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        fetchData();
    }, [isMounted]);

    // Validate schedule before submission
    const validateSchedule = () => {
        for (const { startTime, endTime } of schedule) {
            if (!startTime || !endTime) {
                setScheduleError(
                    "Start time and end time are required for all selected days."
                );
                return false;
            }
        }
        setScheduleError(null); // Clear error if validation passes

        return true;
    };

    // Handle form submission
    const handleSubmit = async (values: any) => {
        setIsSubmitted(true);
        if (!validateSchedule()) {
            return; // Prevent submission if schedule is invalid
        }
        try {
            const payload = {
                ...values,
                frontId: "",
                schedule: schedule.map((sch) => {
                    return {
                        ...sch,
                        startTime: moment
                            .utc(sch.startTime, "HH:mm")
                            .format("HH:mm"),
                        endTime: moment
                            .utc(sch.endTime, "HH:mm")
                            .format("HH:mm"),
                    };
                }),
                startTime: schedule[0]?.startTime,
                endTime: schedule[schedule.length - 1]?.endTime,
            };

            const { success } = await createSession(payload);
            if (success) {
                handleClose();
            }
        } catch (err) {
            console.error("Failed to create session:", err);
        }
    };

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            departmentId: "",
            sessionTypeId: "",
            studentId: "",
            teacherId: "",
            fromDate: "",
            toDate: "",
            dayOfWeek: [] as number[],
            title: "",
            sessionMethod: "",
            frontId: "",
        },
        validationSchema: yup.object({
            departmentId: yup.number().required("Subject is required"),
            sessionTypeId: yup.number().required("Session type is required"),
            studentId: yup.number().required("Student is required"),
            teacherId: yup.number().required("Teacher is required"),
            dayOfWeek: yup.array().min(1, "At least one day is required"),
            fromDate: yup.date().required("Start date is required"),
            toDate: yup.date().required("End date is required"),
            title: yup.string().required("Title is required"),
            sessionMethod: yup.string().required("Session method is required"),
            schedule: yup.array().of(
                yup.object().shape({
                    startTime: yup.string().required("Start time is required"),
                    endTime: yup.string().required("End time is required"),
                })
            ),
        }),
        onSubmit: handleSubmit,
    });

    // Update schedule when selected days change
    useEffect(() => {
        const selectedDays = formik.values.dayOfWeek || [];
        const updatedSchedule = selectedDays.map((day) => {
            const existing = schedule.find((item) => item.day === day);
            return existing || { day, startTime: "", endTime: "" };
        });
        setSchedule(updatedSchedule);
    }, [formik.values.dayOfWeek]);

    // Calculate end date based on session count and selected days
    useEffect(() => {
        if (
            formik.values.fromDate &&
            formik.values.dayOfWeek?.length > 0 &&
            +(sessionCount || 0) > 0
        ) {
            const start = new Date(formik.values.fromDate);
            let currentDate = new Date(start);
            let sessionsScheduled = 0;
            const selectedDays = formik.values.dayOfWeek.sort();
            let lastSessionDate = null;

            while (sessionsScheduled < +(sessionCount || 0)) {
                if (selectedDays.includes(currentDate.getDay())) {
                    lastSessionDate = new Date(currentDate);
                    sessionsScheduled++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (lastSessionDate) {
                formik.setFieldValue(
                    "toDate",
                    lastSessionDate.toISOString().split("T")[0]
                );
            }
        }
    }, [formik.values.fromDate, formik.values.dayOfWeek, sessionCount]);

    // Close dialog and reset form
    const handleClose = () => {
        formik.resetForm();
        setOpen(false);
        setIsSubmitted(false); // Reset submission state
    };

    return (
        <Dialog maxWidth="md" open={open} onClose={handleClose}>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                <Typography variant="subtitle2">
                    Create patch of sessions
                </Typography>
            </DialogTitle>
            <Box sx={{ p: 2, bgcolor: "white" }}>
                {sessions?.map((session) => (
                    <Typography
                        key={session.frontId}
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
                        onClick={() => {
                            const schedule = session.dayOfWeek?.map((day) => {
                                const matchedChild = session?.children?.find(
                                    (child: any) =>
                                        moment(child.date).day() === day
                                );

                                return {
                                    day,
                                    startTime: matchedChild?.startTime || "",
                                    endTime: matchedChild?.endTime || "",
                                };
                            });

                            setSchedule(schedule);

                            formik.setValues({
                                ...session,
                                fromDate: session.fromDate || "",
                                frontId: session.frontId || "",
                            });
                        }}
                    >
                        {session.title}
                    </Typography>
                ))}

                <DialogContent sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        {/* Title */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={Boolean(
                                    formik.errors.title && formik.touched.title
                                )}
                                helperText={
                                    formik.touched.title && formik.errors.title
                                }
                                fullWidth
                            />
                        </Grid>

                        {/* Session Method */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Session Method"
                                    name="sessionMethod"
                                    value={formik.values.sessionMethod}
                                    onChange={formik.handleChange}
                                    error={Boolean(
                                        formik.errors.sessionMethod &&
                                            formik.touched.sessionMethod
                                    )}
                                    helperText={
                                        formik.touched.sessionMethod &&
                                        formik.errors.sessionMethod
                                    }
                                    fullWidth
                                    required
                                    select
                                >
                                    {sessionMethods.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* Subject */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Subject"
                                    name="departmentId"
                                    value={formik.values.departmentId}
                                    onChange={formik.handleChange}
                                    error={Boolean(
                                        formik.errors.departmentId &&
                                            formik.touched.departmentId
                                    )}
                                    helperText={
                                        formik.touched.departmentId &&
                                        formik.errors.departmentId
                                    }
                                    fullWidth
                                    required
                                    select
                                >
                                    {subjects.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* Teacher */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Teacher"
                                    name="teacherId"
                                    value={formik.values.teacherId}
                                    onChange={formik.handleChange}
                                    error={Boolean(
                                        formik.errors.teacherId &&
                                            formik.touched.teacherId
                                    )}
                                    helperText={
                                        formik.touched.teacherId &&
                                        formik.errors.teacherId
                                    }
                                    fullWidth
                                    required
                                    select
                                >
                                    {teachers.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.firstName} {option.lastName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* Student */}
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
                                            helperText={
                                                formik.touched.studentId &&
                                                formik.errors.studentId
                                            }
                                            required
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        {/* Day of Week */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Day of Week"
                                    name="dayOfWeek"
                                    value={formik.values.dayOfWeek}
                                    onChange={formik.handleChange}
                                    error={Boolean(
                                        formik.errors.dayOfWeek &&
                                            formik.touched.dayOfWeek
                                    )}
                                    helperText={
                                        formik.touched.dayOfWeek &&
                                        formik.errors.dayOfWeek
                                    }
                                    fullWidth
                                    required
                                    select
                                    SelectProps={{ multiple: true }}
                                >
                                    {weekDays.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* From Date */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                disabled={!formik.values?.dayOfWeek?.length}
                                label="From Date"
                                name="fromDate"
                                type="date"
                                value={formik.values.fromDate}
                                onChange={formik.handleChange}
                                error={Boolean(
                                    formik.errors.fromDate &&
                                        formik.touched.fromDate
                                )}
                                helperText={
                                    formik.touched.fromDate &&
                                    formik.errors.fromDate
                                }
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* Number of Sessions */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                disabled={!formik.values.fromDate}
                                label="Number of Sessions"
                                type="number"
                                value={sessionCount}
                                onChange={(e) =>
                                    setSessionCount(e.target.value)
                                }
                                fullWidth
                                error={Boolean(
                                    formik.values.dayOfWeek.length >
                                        +(sessionCount || 0) &&
                                        formik.touched.dayOfWeek
                                )}
                                helperText={
                                    formik.touched.dayOfWeek &&
                                    formik.values.dayOfWeek.length >
                                        +(sessionCount || 0) &&
                                    "Session count cannot be less than day count"
                                }
                            />
                        </Grid>

                        {/* To Date */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                label="To Date"
                                name="toDate"
                                type="date"
                                value={formik.values.toDate}
                                onChange={formik.handleChange}
                                error={Boolean(
                                    formik.errors.toDate &&
                                        formik.touched.toDate
                                )}
                                helperText={
                                    formik.touched.toDate &&
                                    formik.errors.toDate
                                }
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </Grid>

                        {/* Session Type */}
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Session Type"
                                    name="sessionTypeId"
                                    value={formik.values.sessionTypeId}
                                    onChange={formik.handleChange}
                                    error={Boolean(
                                        formik.errors.sessionTypeId &&
                                            formik.touched.sessionTypeId
                                    )}
                                    helperText={
                                        formik.touched.sessionTypeId &&
                                        formik.errors.sessionTypeId
                                    }
                                    fullWidth
                                    required
                                    select
                                >
                                    {sessionTypes.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* Schedule (Start and End Times) */}
                        {schedule.map(({ day, startTime, endTime }) => (
                            <React.Fragment key={day}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label={`Start Time (${
                                            weekDays.find(
                                                (d) => d.value === day
                                            )?.label
                                        })`}
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => {
                                            setSchedule((prev) =>
                                                prev.map((d) =>
                                                    d.day === day
                                                        ? {
                                                              ...d,
                                                              startTime:
                                                                  e.target
                                                                      .value,
                                                          }
                                                        : d
                                                )
                                            );
                                        }}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={isSubmitted && !startTime} // Show error only after submission
                                        helperText={
                                            isSubmitted &&
                                            !startTime &&
                                            "Start time is required"
                                        }
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label={`End Time (${
                                            weekDays.find(
                                                (d) => d.value === day
                                            )?.label
                                        })`}
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => {
                                            setSchedule((prev) =>
                                                prev.map((d) =>
                                                    d.day === day
                                                        ? {
                                                              ...d,
                                                              endTime:
                                                                  e.target
                                                                      .value,
                                                          }
                                                        : d
                                                )
                                            );
                                        }}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={isSubmitted && !endTime} // Show error only after submission
                                        helperText={
                                            isSubmitted &&
                                            !endTime &&
                                            "End time is required"
                                        }
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                        {/* Schedule Validation Error */}
                        {isSubmitted && scheduleError && (
                            <Grid item xs={12}>
                                <Typography color="error" variant="body2">
                                    {scheduleError}
                                </Typography>
                            </Grid>
                        )}
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
                            Cancel
                        </Button>
                        <LoadingButton
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
