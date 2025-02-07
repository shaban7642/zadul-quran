import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
    TableCell,
    IconButton,
    MenuItem,
    FormControl,
    TextField,
    Button,
    Dialog,
    Chip,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { BillsIcon } from "../../icons/bills";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
import Delete from "@mui/icons-material/Delete";
import { useMounted } from "../../hooks/use-mounted";
import { sessionMethods } from "./sessions-create";
import { useAuth } from "../../hooks/use-auth";
import CreateReport from "../reports/reports-create";
import { Report } from "../reports/report";
import moment from "moment";
interface RowProps {
    row: any;
    isItemSelected: boolean;
    labelId: string;
    handleClick: (event: React.MouseEvent<unknown>, id: number) => void;
    updateSession: (id: any, userData: any) => Promise<{ success: boolean }>;
    statuses: readonly string[];
    setReoprtFlag: any;
    reportFlag: boolean;
}

export const SessionsRow: FC<RowProps> = (props) => {
    const {
        row,
        isItemSelected,
        labelId,
        handleClick,
        updateSession,
        statuses,
        setReoprtFlag,
        reportFlag,
    } = props;
    const isMounted = useMounted();
    const { user } = useAuth();

    const [open, setOpen] = useState(false);
    const [openCreateReport, setOpenCreateReport] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const theme = useTheme();

    const statusColor =
        row?.status === "done"
            ? "success"
            : row?.status === "cancelled" || row?.status === "expired"
            ? "error"
            : row?.status === "waiting"
            ? "warning"
            : row?.status === "rescheduled"
            ? "info"
            : "primary";
    const rows = [
        `${row?.patch?.teacher?.firstName} ${row?.patch?.teacher?.lastName}` ||
            "no data",
        `${row?.patch?.student?.firstName} ${row?.patch?.student?.lastName}` ||
            "no data",
        row?.status ? (
            <Chip label={row?.status} color={statusColor} />
        ) : (
            "no data"
        ),

        `${moment(row?.startedAt).format("YYYY-MM-DD hh:mm A")}` || "no data",
        `${moment(row?.endedAt).format("YYYY-MM-DD hh:mm A")}` || "no data",
        row?.patch?.department?.name || "no data",
        `${moment(row?.date).format("YYYY-MM-DD")}` || "no data",
        `${moment(
            `${row?.date.substr(0, 11)}${row.startTime}${row.date.substr(
                19,
                24
            )}`
        ).format("hh:mm A")}` || "no data",
        `${moment(
            `${row?.date.substr(0, 11)}${row.endTime}${row.date.substr(19, 24)}`
        ).format("hh:mm A")}` || "no data",
    ];

    const flattenObject = (ob: any) => {
        let toReturn: any = {};
        for (let i in ob) {
            if (!ob.hasOwnProperty(i)) continue;
            if (typeof ob[i] == "object" && ob[i] !== null) {
                let flatObject = flattenObject(ob[i]);
                for (let x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;
                    toReturn[i + "." + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    };

    const formik = useFormik({
        initialValues: {
            sessionMethod: row?.sessionMethod,
            title: row?.title,
            status: row?.status,
            date: row?.date,
            startTime: row?.startTime,
            endTime: row?.endTime,
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            sessionMethod: yup.string().required("sessionMethod is required"),
            title: yup.string().max(255).required("title is required"),
            status: yup.string().max(255).required("status is required"),
            date: yup.date().required("date is required"),
            startTime: yup.string().required("startTime is required"),
            endTime: yup.string().required("endTime is required"),
        }),
        onSubmit: async (values) => {
            const flattened = flattenObject(formik.initialValues);
            //only get the modified values to not accidentally edit old ones.
            let resultObject: any = {};
            Object.entries(flattened)?.map((entry) => {
                const [key, oldVal] = entry;
                const newVal = get(values, key);
                if (newVal !== oldVal) {
                    set(resultObject, key, newVal);
                }
            });
            const { success } = await updateSession(row.id, resultObject);
            if (success) {
                setOpen(false);
            }
        },
    });

    const handleOpenCreateReport = () => {
        setOpenCreateReport(true);
    };
    const handleCloseCreateReport = () => {
        setOpenCreateReport(false);
    };
    const handleOpenReport = () => {
        setOpenReport(true);
    };
    const handleCloseReport = () => {
        setOpenReport(false);
    };
    const handleOpenZoomLink = () => {
        const zoomLink = row?.patch?.student?.zoomLink;
        const baseUrl = new URL("https://zoom.us/"); // Base URL
        const url = new URL(zoomLink, baseUrl); // Create relative URL
        window.open(url.toString(), "new");
    };
    useEffect(() => {
        if (row) {
            formik.setValues({
                sessionMethod: row?.sessionMethod,
                title: row?.title,
                status: row?.status,
                date: row?.date?.substr(0, 10),
                startTime: row?.startTime,
                endTime: row?.endTime,
            });
        }
    }, [row]);
    return (
        <Fragment>
            <TableRow sx={{ "& > *": { borderBottom: 0, cursor: "pointer" } }}>
                {rows?.map((r: any, idx) => (
                    <TableCell
                        key={idx}
                        scope="row"
                        onClick={() => setOpen(!open)}
                        sx={{
                            color: "black",
                        }}
                    >
                        {r}
                    </TableCell>
                ))}

                <TableCell
                    scope="row"
                    className="no-print"
                    sx={{
                        color: "black",
                    }}
                >
                    <Box sx={{ display: "flex" }}>
                        {row?.status === "running" &&
                            row?.startedAt === null &&
                            row?.zoomSessionMeetings?.length < 1 &&
                            user?.role?.name !== "student" &&
                            user?.role?.name !== "parent" && (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        updateSession(row.id, {
                                            startedAt: new Date(),
                                        });
                                        handleOpenZoomLink();
                                    }}
                                    sx={{ fontSize: 12, mr: 1 }}
                                    size="small"
                                >
                                    Start
                                </Button>
                            )}
                        {row?.status === "running" && (
                            <>
                                {row?.startedAt != null &&
                                    row?.zoomSessionMeetings?.length < 1 && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => {
                                                if (
                                                    user?.role?.name ===
                                                        "student" &&
                                                    row?.joinedAt === null
                                                ) {
                                                    updateSession(row.id, {
                                                        joinedAt: new Date(),
                                                    });
                                                }

                                                handleOpenZoomLink();
                                            }}
                                            sx={{
                                                fontSize: 12,
                                                mr: 1,
                                                backgroundColor: "green",
                                            }}
                                            size="small"
                                        >
                                            Join
                                        </Button>
                                    )}
                                {user?.role?.name !== "student" &&
                                    user?.role?.name !== "parent" &&
                                    row?.startedAt !== null && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                handleOpenCreateReport();
                                            }}
                                            sx={{
                                                fontSize: 12,
                                                mr: 1,
                                            }}
                                            size="small"
                                        >
                                            End
                                        </Button>
                                    )}
                            </>
                        )}

                        {row?.status !== "done" &&
                            row?.status !== "cancelled" &&
                            row?.status !== "running" &&
                            (user?.role?.name === "admin" ||
                                user?.role?.name === "super_admin") && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                        updateSession(row.id, {
                                            status: "cancelled",
                                        })
                                    }
                                    sx={{ fontSize: 12 }}
                                    size="small"
                                >
                                    Cancel
                                </Button>
                            )}
                    </Box>
                </TableCell>

                <TableCell
                    scope="row"
                    className="no-print"
                    sx={{
                        color: "black",
                    }}
                >
                    <IconButton
                        onClick={() => handleOpenReport()}
                        sx={{ p: 0, ml: 1, mb: 1.5 }}
                    >
                        <BillsIcon color="primary" />
                    </IconButton>
                </TableCell>

                <TableCell
                    className="no-print"
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    padding="checkbox"
                >
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            "aria-labelledby": labelId,
                        }}
                    />
                </TableCell>
            </TableRow>

            <TableRow sx={{ border: 0 }}>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
                    colSpan={12}
                >
                    {" "}
                    {(user?.role?.name === "admin" ||
                        user?.role?.name === "super_admin") && (
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                    sx={{ margin: 0 }}
                                >
                                    edit
                                </Typography>
                                <form onSubmit={formik.handleSubmit}>
                                    <FormControl>
                                        <TextField
                                            size="small"
                                            sx={{
                                                width: {
                                                    xs: 100,
                                                    sm: 125,
                                                    md: 150,
                                                    lg: 175,
                                                    xl: 200,
                                                },
                                                "& .MuiInputBase-root": {
                                                    height: 40,
                                                },
                                                mr: 1,
                                            }}
                                            label="Session Method"
                                            name="sessionMethod"
                                            value={formik.values.sessionMethod}
                                            error={Boolean(
                                                formik.errors.sessionMethod &&
                                                    formik.touched.sessionMethod
                                            )}
                                            helperText={
                                                formik.touched.sessionMethod &&
                                                formik.errors.sessionMethod?.toString()
                                            }
                                            InputLabelProps={{
                                                shrink: formik.values
                                                    .sessionMethod
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
                                    <TextField
                                        label="Title"
                                        name="title"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.title}
                                        error={Boolean(
                                            formik.errors.title &&
                                                formik.touched.title
                                        )}
                                        helperText={
                                            formik.touched.title &&
                                            formik.errors.title?.toString()
                                        }
                                        size="small"
                                        sx={{
                                            width: {
                                                xs: 100,
                                                sm: 125,
                                                md: 150,
                                                lg: 175,
                                                xl: 200,
                                            },
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                            },
                                            mr: 1,
                                        }}
                                    />

                                    <FormControl>
                                        <TextField
                                            size="small"
                                            sx={{
                                                width: {
                                                    xs: 100,
                                                    sm: 125,
                                                    md: 150,
                                                    lg: 175,
                                                    xl: 200,
                                                },
                                                "& .MuiInputBase-root": {
                                                    height: 40,
                                                },
                                                mr: 1,
                                            }}
                                            label="Status"
                                            name="status"
                                            value={formik.values.status}
                                            error={Boolean(
                                                formik.errors.status &&
                                                    formik.touched.status
                                            )}
                                            helperText={
                                                formik.touched.status &&
                                                formik.errors.status?.toString()
                                            }
                                            InputLabelProps={{
                                                shrink: formik.values.status
                                                    ? true
                                                    : false,
                                            }}
                                            fullWidth
                                            required
                                            select
                                            onChange={formik.handleChange}
                                        >
                                            {statuses.map((option: string) => (
                                                <MenuItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>

                                    <TextField
                                        size="small"
                                        sx={{
                                            width: {
                                                xs: 100,
                                                sm: 125,
                                                md: 150,
                                                lg: 175,
                                                xl: 200,
                                            },
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                            },
                                            mr: 1,
                                        }}
                                        label="Date"
                                        name="date"
                                        type="date"
                                        onChange={formik.handleChange}
                                        value={formik.values.date}
                                        error={Boolean(
                                            formik.errors.date &&
                                                formik.touched.date
                                        )}
                                        helperText={
                                            formik.touched.date &&
                                            formik.errors.date?.toString()
                                        }
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        sx={{
                                            width: {
                                                xs: 100,
                                                sm: 125,
                                                md: 150,
                                                lg: 175,
                                                xl: 200,
                                            },
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                            },
                                            mr: 1,
                                        }}
                                        label="Start Time(UTC)"
                                        name="startTime"
                                        type="time"
                                        onChange={formik.handleChange}
                                        value={formik.values.startTime}
                                        error={Boolean(
                                            formik.errors.startTime &&
                                                formik.touched.startTime
                                        )}
                                        helperText={
                                            formik.touched.startTime &&
                                            formik.errors.startTime?.toString()
                                        }
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        sx={{
                                            width: {
                                                xs: 100,
                                                sm: 125,
                                                md: 150,
                                                lg: 175,
                                                xl: 200,
                                            },
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                            },
                                            mr: 1,
                                        }}
                                        label="End Time(UTC)"
                                        name="endTime"
                                        type="time"
                                        onChange={formik.handleChange}
                                        value={formik.values.endTime}
                                        error={Boolean(
                                            formik.errors.endTime &&
                                                formik.touched.endTime
                                        )}
                                        helperText={
                                            formik.touched.endTime &&
                                            formik.errors.endTime?.toString()
                                        }
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    <LoadingButton
                                        type="submit"
                                        sx={{
                                            width: {
                                                xs: 15,
                                                sm: 20,
                                                md: 30,
                                                lg: 40,
                                                xl: 50,
                                            },
                                            "& .MuiInputBase-root": {
                                                height: 40,
                                            },
                                            // m: 0.5,
                                            // mt: 2,
                                        }}
                                        variant="contained"
                                    >
                                        submit
                                    </LoadingButton>
                                </form>
                            </Box>
                        </Collapse>
                    )}
                </TableCell>
            </TableRow>
            <Dialog maxWidth="md" open={openCreateReport}>
                <CreateReport
                    setReoprtFlag={setReoprtFlag}
                    reportFlag={reportFlag}
                    sessionDeptName={row.patch?.department?.name}
                    sessionId={row.id}
                    updateSession={updateSession}
                    handleCloseCreateReport={handleCloseCreateReport}
                />
            </Dialog>
            <Dialog
                maxWidth="md"
                open={openReport}
                onClose={handleCloseReport}
                className="bg-none"
            >
                <Report
                    session={row}
                    handleCloseReport={handleCloseReport}
                    setReoprtFlag={setReoprtFlag}
                />
            </Dialog>
        </Fragment>
    );
};
