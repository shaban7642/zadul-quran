import { FC, useCallback, useEffect } from "react";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    alpha,
    Box,
    Button,
    Card,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
import { userApi } from "../../api/userApi";
import { rolesApi } from "../../api/rolesApi";
import { useMounted } from "../../hooks/use-mounted";
import { deptApi } from "../../api/deptApi";
import moment from "moment";
import { sessionApi } from "../../api/sessionsApi";
import { SessionForm } from "../sessions/sessions-form";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/router";
const weekDays = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
];
export type Session = {
    departmentId: string;
    sessionTypeId: string;
    studentId: string;
    teacherId: string;
    fromDate?: string;
    toDate: string;
    dayOfWeek: number[];
    children: any[];

    endTime: string;
    title: string;
    sessionMethod: string;
    frontId?: string | undefined;
    patch?: any;
};
interface RoleId {
    displayName: string;
    id: number;
    name: string;
}
interface profileProps {
    id: number;
}
type SessionType = {
    id: number;
    duration: string; // or number, depending on your data type
};

export const Profile: FC<profileProps> = (props) => {
    const { id } = props;
    const { user } = useAuth();
    const router = useRouter();
    const [roles, setRoles] = useState<RoleId[]>([]);
    const [depts, setDepts] = useState([]);
    const genders = ["male", "female"];
    const [open, setOpen] = useState(false);
    const [sessions, setSessions] = useState<Session[]>();
    const isMounted = useMounted();
    const [sessionTypes, sessionTypesToParent] = useState<any[]>([]);

    const [userData, setUserData] = useState<any>({
        id: 1,
        roleId: 1,
        username: "",
        firstName: "",
        lastName: "",
        city: "",
        gender: "",
        birthDate: "",
        departmentId: 1,
        email: "",
        zoomLink: "",
        phoneNumber: "",
    });
    const getDepts = useCallback(async () => {
        try {
            const data: any = await deptApi.getDepts(100, 0);
            if (isMounted()) {
                setDepts(data.rows);
            }
        } catch (err: any) {
            toast.error(err.message || "failed");
        }
    }, [isMounted]);
    const getRoles = useCallback(
        async () => {
            try {
                const data: any = await rolesApi.getRoles();

                if (isMounted()) {
                    setRoles(data.resp);
                }
            } catch (err: any) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted]
    );

    useEffect(() => {
        getDepts();
        getRoles();
    }, []);

    const getProfile = async (id: number) => {
        try {
            const resp = await userApi.getUserById(id);

            setUserData(resp);
        } catch (err: any) {
            console.log(err);
        }
    };
    const getSession = async (id: number) => {
        try {
            const resp = await sessionApi.getSessionByStudentId(id, true);
            const formatSessions = resp?.sessions?.map((session: any) => {
                const frontId = Math.random().toString(36).substr(2, 9);
                return {
                    ...session,
                    departmentId: session.patch.departmentId,
                    sessionTypeId: session.sessionTypeId,
                    sessionMethod: session.sessionMethod,
                    studentId: session.patch.studentId,
                    teacherId: session.patch.teacherId,
                    dayOfWeek: session.patch.dayOfWeek,
                    fromDate: session.patch.fromDate,
                    endTime:
                        moment(
                            `${session?.date.substr(0, 11)}${
                                session.endTime
                            }${session.date.substr(19, 24)}`
                        ).format("HH:mm") || "00:00",
                    toDate: "",
                    title: session.title,
                    frontId,
                };
            });
            setSessions(formatSessions || []);
        } catch (err: any) {
            console.log(err);
        }
    };
    const getUserRole = () => {
        switch (userData?.roleId) {
            case 1:
                return "Super Admin";
            case 2:
                return "Admin";
            case 3:
                return "Teacher";
            case 4:
                return "Student";
            case 5:
                return "Parent";
            default:
                return "";
        }
    };
    const getValidationSchema = (roleId: number) => {
        let zoomLinkSchema;
        if (roleId === 4) {
            zoomLinkSchema = yup
                .string()
                .url("Zoom Link must be a url")
                .required("Zoom link Is Required");
        } else {
            zoomLinkSchema = yup.mixed().nullable();
        }
        return yup.object({
            roleId: yup.number(),
            username: yup.string(),
            firstName: yup.string(),
            lastName: yup.string(),
            city: yup.string(),
            gender: yup.string(),
            birthDate: yup.date(),
            email: yup.string().email("emailAddress"),
            zoomLink: zoomLinkSchema,
            phoneNumber: yup.string(),
        });
    };
    const formik = useFormik({
        initialValues: {
            roleId: userData?.roleId,
            username: userData?.username,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            city: userData?.city,
            gender: userData?.gender,
            birthDate: userData?.birthDate,
            departmentId: userData?.departmentId,
            email: userData?.email,
            zoomLink: userData?.zoomLink,
            phoneNumber: userData?.phoneNumber,
        },
        enableReinitialize: true,
        validationSchema: getValidationSchema(userData?.roleId),
        onSubmit: async (values) => {
            if (userData?.roleId !== 4) {
                delete values.zoomLink;
            }

            try {
                await updateProfile(values);

                formik.resetForm();
            } catch (error) {
                console.log(error);
            }
        },
    });

    const updateProfile = async (
        values: any
    ): Promise<{ success: boolean }> => {
        const load = toast.loading("update");
        try {
            const resp = await userApi.updateUser(id, values);
            if (resp.success) {
                getProfile(id);
                toast.dismiss(load);
                toast.success("updated");
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error("updateFailed");
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || "updatesFailed");
            return { success: false };
        }
    };
    const createSession = async (
        values: any
    ): Promise<{ success: boolean }> => {
        const load = toast.loading("create");
        try {
            const resp = await sessionApi.createSession(values);
            if (resp) {
                toast.dismiss(load);
                toast.success("createSessionSuccess");
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error("createSessionFailed");
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || "createSessionsFailed");
            return { success: false };
        }
    };

    const handleOpenClasses = () => {
        router.push(`/sessions?student=${userData?.id}`);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        getProfile(id);
    }, [id]);
    useEffect(() => {
        if (userData?.roleId === 4 && !open) {
            getSession(id);
        }
    }, [id, userData, open]);
    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <Grid container spacing={3}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper
                        elevation={12}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "20px 25px",
                            minHeight: "280px",

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
                        <Typography color="inherit" variant="h6">
                            prsonal information
                        </Typography>

                        <Grid container component={List}>
                            <Grid item xs={12} md={6}>
                                {" "}
                                <ListItem>
                                    Username:{" "}
                                    <Typography color={"black"}>
                                        {userData?.username || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                <ListItem>
                                    Email:{" "}
                                    <Typography
                                        color={"black"}
                                        sx={{
                                            overflowWrap: "break-word",
                                            minWidth: "120px",
                                        }}
                                    >
                                        {userData?.email || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                <ListItem>
                                    First name:{" "}
                                    <Typography color={"black"}>
                                        {userData?.firstName || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                <ListItem>
                                    Last name:{" "}
                                    <Typography color={"black"}>
                                        {userData?.lastName || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                <ListItem>
                                    City:{" "}
                                    <Typography color={"black"}>
                                        {userData?.city || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ListItem>
                                    Role:{" "}
                                    <Typography color={"black"}>
                                        {getUserRole() || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                {userData?.roleId === 4 && (
                                    <ListItem>
                                        Department:{" "}
                                        <Typography color={"black"}>
                                            {userData?.department?.name ||
                                                "No data"}
                                        </Typography>{" "}
                                    </ListItem>
                                )}
                                <ListItem>
                                    Gender:{" "}
                                    <Typography color={"black"}>
                                        {userData?.gender || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                <ListItem>
                                    Date of birth:
                                    <Typography color={"black"}>
                                        {" "}
                                        {moment(
                                            userData?.birthDate?.toString() ||
                                                "No data"
                                        ).format("MMM-D-YYYY")}
                                    </Typography>{" "}
                                </ListItem>
                                <ListItem>
                                    Phone number:{" "}
                                    <Typography color={"black"}>
                                        {userData?.phoneNumber || "No data"}
                                    </Typography>{" "}
                                </ListItem>
                                {user?.role?.name === "teacher" && userData && (
                                    <>
                                        <ListItem
                                            sx={{
                                                borderTop: "1px solid #777",
                                            }}
                                        >
                                            Students:
                                            <Typography color={"black"}>
                                                {userData?.students
                                                    .map(
                                                        (s: any) =>
                                                            `${s.firstName}- ${s.lastName} |`
                                                    )
                                                    ?.join(",") || "No data"}
                                            </Typography>
                                        </ListItem>
                                    </>
                                )}
                                {user?.role?.name !== "student" &&
                                    sessions &&
                                    Boolean(sessions?.length) && (
                                        <>
                                            <ListItem
                                                sx={{
                                                    borderTop: "1px solid #777",
                                                }}
                                            >
                                                Session Title:
                                                <Typography color="black">
                                                    {sessions[0]?.title ||
                                                        "No data"}
                                                </Typography>
                                            </ListItem>
                                            <ListItem
                                                sx={{
                                                    borderTop: "1px solid #777",
                                                }}
                                            >
                                                Duration:
                                                <Typography color="black">
                                                    {(sessionTypes &&
                                                        sessionTypes?.find(
                                                            (se: any) =>
                                                                se.id ===
                                                                sessions[0]
                                                                    ?.sessionTypeId
                                                        )?.duration) ||
                                                        "No data"}
                                                </Typography>
                                            </ListItem>

                                            <ListItem
                                                sx={{
                                                    borderTop: "1px solid #777",
                                                }}
                                            >
                                                Days:
                                                {Boolean(
                                                    sessions[0]?.dayOfWeek
                                                        ?.length
                                                ) ? (
                                                    <ul>
                                                        {sessions[0].dayOfWeek.map(
                                                            (day: Number) => {
                                                                const {
                                                                    id,
                                                                    date,
                                                                    startTime,
                                                                    endTime,
                                                                } =
                                                                    sessions[0]?.children?.find(
                                                                        (
                                                                            child: any
                                                                        ) =>
                                                                            moment(
                                                                                child.date
                                                                            ).day() ===
                                                                            day
                                                                    );

                                                                return (
                                                                    <li
                                                                        key={id}
                                                                    >
                                                                        <Typography color="black">
                                                                            {moment(
                                                                                date
                                                                            ).format(
                                                                                "dddd"
                                                                            )}
                                                                            :{" "}
                                                                            {startTime &&
                                                                                moment(
                                                                                    startTime,
                                                                                    "hh:mm"
                                                                                ).format(
                                                                                    "hh:mm"
                                                                                )}{" "}
                                                                            -{" "}
                                                                            {endTime &&
                                                                                moment(
                                                                                    endTime,
                                                                                    "hh:mm"
                                                                                ).format(
                                                                                    "hh:mm"
                                                                                )}{" "}
                                                                        </Typography>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <Typography color="black">
                                                        لا يوجد بيانات
                                                    </Typography>
                                                )}
                                            </ListItem>
                                        </>
                                    )}
                            </Grid>
                        </Grid>
                        {userData?.roleId === 4 &&
                            user?.role?.name === "super_admin" &&
                            sessions &&
                            sessions?.length > 0 && (
                                <>
                                    <LoadingButton
                                        type="button"
                                        onClick={() => handleOpenClasses()}
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                                width: "100%",
                                            },
                                            m: 0.5,
                                            p: 1,
                                        }}
                                        variant="contained"
                                    >
                                        View Classes
                                    </LoadingButton>
                                    <LoadingButton
                                        type="button"
                                        onClick={() => handleOpen()}
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                                width: "100%",
                                            },
                                            m: 0.5,
                                            p: 1,
                                        }}
                                        variant="contained"
                                    >
                                        Renew Subscription
                                    </LoadingButton>
                                </>
                            )}
                    </Paper>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper
                        elevation={12}
                        sx={{
                            m: 1,
                            p: 2,
                            minHeight: "280px",
                            ...(true && {
                                bgcolor: (theme) =>
                                    alpha(
                                        theme.palette.info.contrastText,
                                        theme.palette.action.activatedOpacity
                                    ),
                            }),
                        }}
                    >
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: { xs: "100%", sm: "47.5%" },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.username &&
                                        formik.errors.username
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.username &&
                                    formik.errors.username
                                }
                                label="username"
                                margin="normal"
                                id="username"
                                name="username"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                InputProps={{
                                    style: {
                                        fontFamily: "sans-serif",
                                        color: "black",
                                    },
                                }}
                            />
                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: { xs: "100%", sm: "47.5%" },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.email && formik.errors.email
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.email && formik.errors.email
                                }
                                label="email"
                                margin="normal"
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                InputProps={{
                                    style: {
                                        fontFamily: "sans-serif",
                                        color: "black",
                                    },
                                }}
                            />
                            {userData?.roleId === 4 && (
                                <TextField
                                    size="small"
                                    sx={{
                                        width: { xs: "96%" },
                                        "& .MuiInputBase-root": {
                                            height: 40,
                                        },
                                        mr: 1,
                                    }}
                                    error={Boolean(
                                        formik.touched.zoomLink &&
                                            formik.errors.zoomLink
                                    )}
                                    // @ts-ignore
                                    helperText={
                                        formik.touched.zoomLink &&
                                        formik.errors.zoomLink
                                    }
                                    label="Zoom Link"
                                    margin="normal"
                                    id="zoomLink"
                                    name="zoomLink"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.zoomLink}
                                    InputProps={{
                                        style: {
                                            paddingLeft: "6px",
                                            fontFamily: "sans-serif",
                                        },
                                    }}
                                />
                            )}
                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: {
                                        xs: "100%",
                                        sm: "47.5%",
                                        md: "31.5%",
                                    },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.firstName &&
                                        formik.errors.firstName
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.firstName &&
                                    formik.errors.firstName
                                }
                                label="First Name"
                                margin="normal"
                                id="firstName"
                                name="firstName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                InputProps={{
                                    style: {
                                        fontFamily: "sans-serif",
                                        color: "black",
                                    },
                                }}
                            />
                            {/* lastname */}
                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: {
                                        xs: "100%",
                                        sm: "47.5%",
                                        md: "31.5%",
                                    },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.lastName &&
                                        formik.errors.lastName
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.lastName &&
                                    formik.errors.lastName
                                }
                                label="Last Name"
                                margin="normal"
                                id="lastName"
                                name="lastName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.lastName}
                                InputProps={{
                                    style: {
                                        fontFamily: "sans-serif",
                                        color: "black",
                                    },
                                }}
                            />
                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: {
                                        xs: "100%",
                                        sm: "47.5%",
                                        md: "31.5%",
                                    },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.city && formik.errors.city
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.city && formik.errors.city
                                }
                                label="city"
                                margin="normal"
                                id="city"
                                name="city"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.city}
                                InputProps={{
                                    style: {
                                        fontFamily: "sans-serif",
                                        color: "black",
                                    },
                                }}
                            />
                            <FormControl
                                sx={{
                                    width: { xs: "100%", sm: "47.5%" },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                    marginTop: 3,
                                }}
                                variant="outlined"
                            >
                                {" "}
                                <InputLabel
                                    sx={{
                                        top: -6,
                                    }}
                                    id="outlined-adornment-roleId"
                                >
                                    Role
                                </InputLabel>
                                <Select
                                    name="roleId"
                                    id="outlined-adornment-roleId"
                                    labelId="outlined-adornment-roleId"
                                    value={formik.values.roleId}
                                    onChange={formik.handleChange}
                                >
                                    {roles?.map((roleId) => (
                                        <MenuItem
                                            sx={{
                                                color: "black",
                                                ...(true && {
                                                    bgcolor: (theme) =>
                                                        alpha(
                                                            theme.palette.info
                                                                .contrastText,
                                                            theme.palette.action
                                                                .activatedOpacity
                                                        ),
                                                }),
                                                fontFamily: "sans-serif",
                                            }}
                                            key={roleId?.id}
                                            value={roleId?.id}
                                        >
                                            {roleId?.displayName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {userData?.roleId === 4 && (
                                <FormControl
                                    sx={{
                                        width: { xs: "100%", sm: "47.5%" },
                                        "& .MuiInputBase-root": {
                                            height: 40,
                                        },
                                        mr: 1,
                                        marginTop: 3,
                                    }}
                                    variant="outlined"
                                >
                                    {" "}
                                    <InputLabel
                                        sx={{
                                            top: -6,
                                        }}
                                        id="outlined-adornment-department"
                                    >
                                        Department
                                    </InputLabel>
                                    <Select
                                        name="departmentId"
                                        id="outlined-adornment-department"
                                        labelId="outlined-adornment-department"
                                        value={formik.values.departmentId}
                                        onChange={formik.handleChange}
                                    >
                                        {depts?.map((department: any) => (
                                            <MenuItem
                                                sx={{
                                                    color: "black",
                                                    ...(true && {
                                                        bgcolor: (theme) =>
                                                            alpha(
                                                                theme.palette
                                                                    .info
                                                                    .contrastText,
                                                                theme.palette
                                                                    .action
                                                                    .activatedOpacity
                                                            ),
                                                    }),
                                                    fontFamily: "sans-serif",
                                                }}
                                                key={department?.id}
                                                value={department?.id}
                                            >
                                                {department?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <FormControl
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "47.5%",
                                        md: "31.5%",
                                    },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                    marginTop: 3,
                                }}
                                variant="outlined"
                            >
                                {" "}
                                <InputLabel
                                    sx={{
                                        top: -6,
                                    }}
                                    id="outlined-gender"
                                >
                                    Gender
                                </InputLabel>
                                <Select
                                    name="gender"
                                    id="outlined-gender"
                                    labelId="outlined-gender"
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                >
                                    {genders.map((gender) => (
                                        <MenuItem
                                            sx={{
                                                color: "black",
                                                ...(true && {
                                                    bgcolor: (theme) =>
                                                        alpha(
                                                            theme.palette.info
                                                                .contrastText,
                                                            theme.palette.action
                                                                .activatedOpacity
                                                        ),
                                                }),
                                                fontFamily: "sans-serif",
                                            }}
                                            key={gender}
                                            value={gender}
                                        >
                                            {gender}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: {
                                        xs: "100%",
                                        sm: "47.5%",
                                        md: "31.5%",
                                    },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.birthDate &&
                                        formik.errors.birthDate
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.birthDate &&
                                    formik.errors.birthDate
                                }
                                label="Date Of Birth"
                                margin="normal"
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                onChange={formik.handleChange}
                                value={formik.values.birthDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                size="small"
                                sx={{
                                    mt: 3,
                                    width: {
                                        xs: "100%",
                                        sm: "47.5%",
                                        md: "31.5%",
                                    },
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                    },
                                    mr: 1,
                                }}
                                error={Boolean(
                                    formik.touched.phoneNumber &&
                                        formik.errors.phoneNumber
                                )}
                                // @ts-ignore
                                helperText={
                                    formik.touched.phoneNumber &&
                                    formik.errors.phoneNumber
                                }
                                label="phoneNumber"
                                margin="normal"
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.phoneNumber}
                                InputProps={{
                                    style: {
                                        fontFamily: "sans-serif",
                                        color: "black",
                                    },
                                }}
                            />
                            <div style={{ textAlign: "right" }}>
                                <LoadingButton
                                    type="submit"
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            height: 40,
                                        },
                                        m: 0.5,
                                        p: 1,
                                    }}
                                    variant="contained"
                                >
                                    Save
                                </LoadingButton>
                            </div>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            {userData?.roleId === 4 && user?.role?.name === "super_admin" && (
                <SessionForm
                    open={open}
                    setOpen={setOpen}
                    sessions={sessions}
                    createSession={createSession}
                    sessionTypesToParent={sessionTypesToParent}
                />
            )}
        </Box>
    );
};
