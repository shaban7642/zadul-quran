import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
    Chip,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    Paper,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
} from "@mui/material";

import useDownloader from "react-use-downloader";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useAuth } from "../../hooks/use-auth";
import { useMounted } from "../../hooks/use-mounted";
import { documentApi } from "../../api/documentApi";
import toast from "react-hot-toast";
import { reportApi } from "../../api/reportApi";
import { LightBgLogo } from "../light-bg-logo";

interface ReportProps {
    session: any;
    handleCloseReport: () => void;
    setReoprtFlag: any;
}

export const Report: FC<ReportProps> = ({
    session,
    handleCloseReport,
    setReoprtFlag,
}) => {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
        ignoreGlobalStyles: false,
        pageStyle: `
                @media print {
                    @page {
                        size: A4;
                        margin: 3mm 2mm;
                    }
                    html, body {
                        -webkit-print-color-adjust: exact;
                        margin: 0px !important;
                        padding: 0px  !important;
                        overflow: hidden !important;
                    }
                    .page {
                        box-shadow: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: flex !important;
                    }
                }
            `,
    });

    const { user } = useAuth();

    const [view, setView] = useState<Boolean>(true);

    return (
        <Paper
            ref={contentRef}
            elevation={12}
            className="page"
            sx={{
                position: "relative",
                padding: "20px",
                margin: "20px auto",
                maxWidth: { xs: "100%", lg: "800px" },
                borderRadius: "16px",
                backgroundColor: "#FFF",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            {/* Close Icon */}
            <IconButton
                className="no-print"
                onClick={handleCloseReport}
                sx={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    color: "primary.main",
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Print PDF Button */}
            <Button
                className="no-print"
                variant="outlined"
                endIcon={<PrintIcon />}
                onClick={() => reactToPrintFn()}
                sx={{ marginBottom: "16px" }}
            >
                Print as pdf
            </Button>
            <Box
                className="print-only"
                sx={{
                    display: "none",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    p: 2,
                }}
            >
                <Box>
                    <LightBgLogo loading="eager" />
                </Box>
                <Box>
                    <Typography variant="h4" color="primary">
                        Zadul Quran
                    </Typography>
                </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Session Information
            </Typography>

            <div>
                <Divider sx={{ marginBottom: "16px" }}>
                    <Chip label="Primary Details" color="primary" />
                </Divider>

                <Grid container spacing={2} component={List}>
                    <Grid item xs={12} sm={6}>
                        {[
                            {
                                label: "Teacher",
                                value: `${session?.patch?.teacher?.firstName} ${session?.patch?.teacher?.lastName}`,
                            },
                            {
                                label: "Subject",
                                value: session?.patch?.department?.name,
                            },
                            {
                                label: "Date",
                                value: moment(session?.date).format(
                                    "YYYY-MM-DD"
                                ),
                            },
                            {
                                label: "Start Time",
                                value: session?.startTime
                                    ? moment(
                                          `${session?.date.substr(0, 11)}${
                                              session.startTime
                                          }${session.date.substr(19, 24)}`
                                      ).format("hh:mm A")
                                    : "no data",
                            },
                            {
                                label: "Teacher Joined At",
                                value: session?.startedAt
                                    ? moment(session?.startedAt).format(
                                          "hh:mm A"
                                      )
                                    : "no data",
                            },
                            {
                                label: "Student Joined At",
                                value: session?.joinedAt
                                    ? moment(session?.joinedAt).format(
                                          "hh:mm A"
                                      )
                                    : "no data",
                            },
                        ].map((item, index) => (
                            <ListItem key={index} sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    {item.label}:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {item.value || "No data"}
                                </Typography>
                            </ListItem>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {[
                            {
                                label: "Student",
                                value: `${session?.patch?.student?.firstName} ${session?.patch?.student?.lastName}`,
                            },
                            {
                                label: "Session Type",
                                value: session?.sessionType?.name,
                            },
                            { label: "Status", value: session?.status },
                            {
                                label: "End Time",
                                value: session?.endTime
                                    ? moment(
                                          `${session?.date.substr(0, 11)}${
                                              session.endTime
                                          }${session.date.substr(19, 24)}`
                                      ).format("hh:mm A")
                                    : "no data",
                            },
                            {
                                label: "Ended At",
                                value: session?.endedAt
                                    ? moment(session?.endedAt).format(
                                          "YYYY-MM-DD hh:mm A"
                                      )
                                    : "no data",
                            },
                            {
                                label: "Ended Day",
                                value: session?.endedAt
                                    ? moment(session?.endedAt).format("dddd")
                                    : "no data",
                            },
                        ].map((item, index) => (
                            <ListItem key={index} sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    {item.label}:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {item.value || "No data"}
                                </Typography>
                            </ListItem>
                        ))}
                    </Grid>
                </Grid>

                {session?.report && (
                    <>
                        <Divider sx={{ marginBottom: "16px" }}>
                            <Chip label="Feedback" color="primary" />
                            {user?.role?.name != "student" && (
                                <Chip
                                    className="no-print"
                                    onClick={() => setView(!view)}
                                    label="Edit"
                                    color="success"
                                />
                            )}
                        </Divider>

                        {view ? (
                            <ViewFeedback session={session} />
                        ) : (
                            <EditFeedback
                                session={session}
                                setReoprtFlag={setReoprtFlag}
                                setView={setView}
                            />
                        )}
                    </>
                )}
            </div>
        </Paper>
    );
};

const ViewFeedback = ({ session }: { session: any }) => {
    const { download, error } = useDownloader();
    return (
        <Grid container component={List}>
            {/* Submission Date */}
            {session?.report?.date && (
                <Grid item xs={12}>
                    <ListItem sx={{ padding: "8px 0" }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Submition Date:
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                marginLeft: "8px",
                                color: "text.secondary",
                            }}
                        >
                            {moment(session?.report?.date).format("MMM-D-YYYY")}
                        </Typography>
                    </ListItem>
                </Grid>
            )}

            {/* Documents */}
            {session?.report?.document &&
                session?.report?.document.length > 0 && (
                    <Grid className="no-print" item xs={12}>
                        <Grid container sx={{ p: 0 }}>
                            {session?.report?.document.map(
                                (d: any, index: number) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <ListItem>
                                            File: {index + 1}
                                            <IconButton
                                                onClick={() =>
                                                    download(
                                                        `https://login-api.zadulquran.com/${d.fileStoragePath}`,
                                                        d.fileName
                                                    )
                                                }
                                                sx={{
                                                    p: 0.5,
                                                    ml: 1,
                                                    color: "black",
                                                    border: "1px solid black",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                Download
                                                <FileDownloadOutlinedIcon fontSize="medium" />
                                            </IconButton>
                                            {error && (
                                                <Typography
                                                    color="error"
                                                    sx={{
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    Error:{" "}
                                                    {JSON.stringify(error)}
                                                </Typography>
                                            )}
                                        </ListItem>
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Grid>
                )}

            {/* Department-specific Fields */}
            {session.patch?.department?.name !== "Quran" && (
                <Grid container component={List}>
                    {/* Non-Quran Report Fields */}
                    <Grid item xs={12} sm={6}>
                        {session?.report?.level && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Grade:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {`${session?.report?.level} / 10`}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.book && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Book:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.book?.fileName ||
                                        "No data"}
                                </Typography>
                            </ListItem>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {session?.report?.unit && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Unit:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.unit || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.topic && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Topic:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.topic || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                    </Grid>
                </Grid>
            )}

            {/* Arabic-specific Fields */}
            {session.patch?.department?.name === "Arabic" && (
                <>
                    {session?.report?.newWords && (
                        <ListItem sx={{ padding: "8px 0" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                New Words:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    marginLeft: "8px",
                                    color: "text.secondary",
                                }}
                            >
                                {session?.report?.newWords || "No data"}
                            </Typography>
                        </ListItem>
                    )}
                    {session?.report?.expressions && (
                        <ListItem sx={{ padding: "8px 0" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Expressions:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    marginLeft: "8px",
                                    color: "text.secondary",
                                }}
                            >
                                {session?.report?.expressions || "No data"}
                            </Typography>
                        </ListItem>
                    )}
                    {session?.report?.rules && (
                        <ListItem sx={{ padding: "8px 0" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Rules:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    marginLeft: "8px",
                                    color: "text.secondary",
                                }}
                            >
                                {session?.report?.rules || "No data"}
                            </Typography>
                        </ListItem>
                    )}
                </>
            )}

            {/* Quran-specific Fields */}
            {session.patch?.department?.name === "Quran" && (
                <Grid container component={List}>
                    {/* Quran Report Fields */}
                    <Grid item xs={12} sm={6}>
                        {session?.report?.memorization && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Memorization:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.memorization || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.revision && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Revision:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.revision || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.recitation && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Recitation:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.recitation || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.reading && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Reading:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.reading || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {session?.report?.memorizationLevel && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Memorization Grade:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {`${session?.report?.memorizationLevel} / 10`}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.revisionLevel && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Revision Grade:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {`${session?.report?.revisionLevel} / 10`}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.tajweed && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Tajweed:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {session?.report?.tajweed || "No data"}
                                </Typography>
                            </ListItem>
                        )}
                        {session?.report?.readingLevel && (
                            <ListItem sx={{ padding: "8px 0" }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Reading Grade:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginLeft: "8px",
                                        color: "text.secondary",
                                    }}
                                >
                                    {`${session?.report?.readingLevel} / 10`}
                                </Typography>
                            </ListItem>
                        )}
                    </Grid>
                </Grid>
            )}

            {/* Homework and Notes */}
            {session?.report?.homework && (
                <ListItem sx={{ padding: "8px 0" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        H.W:
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            marginLeft: "8px",
                            color: "text.secondary",
                        }}
                    >
                        {session?.report?.homework || "No data"}
                    </Typography>
                </ListItem>
            )}
            {session?.report?.notes && (
                <ListItem sx={{ padding: "8px 0" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Notes:
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            marginLeft: "8px",
                            color: "text.secondary",
                        }}
                    >
                        {session?.report?.notes || "No data"}
                    </Typography>
                </ListItem>
            )}
        </Grid>
    );
};

const EditFeedback = ({
    session,
    setReoprtFlag,
    setView,
}: {
    session: any;
    setReoprtFlag: any;
    setView: any;
}) => {
    const [editedSession, setEditedSession] = useState(session);
    const sessionDeptName = session?.patch?.department?.name;

    const [documents, setDocuments] = useState<Document[]>([]);

    const levels = [
        { id: "1", name: "1" },
        { id: "2", name: "2" },
        { id: "3", name: "3" },
        { id: "4", name: "4" },
        { id: "5", name: "5" },
        { id: "6", name: "6" },
        { id: "7", name: "7" },
        { id: "8", name: "8" },
        { id: "9", name: "9" },
        { id: "10", name: "10" },
    ];
    const isMounted = useMounted();

    const getDocuments = useCallback(
        async (rowsPerPage: number, page: number) => {
            try {
                const data: any = await documentApi.getDocuments(
                    rowsPerPage,
                    page,
                    "books"
                );
                if (isMounted()) {
                    setDocuments(
                        data.rows.map((row: any) => {
                            return { ...row, name: row.fileName };
                        })
                    );
                }
            } catch (err: any) {
                toast.error(err.message || "failed");
            }
        },
        [isMounted]
    );
    useEffect(() => {
        getDocuments(100, 0);
    }, [getDocuments]);

    const handleChange = (field: string, value: string) => {
        setEditedSession((prev: any) => ({
            ...prev,
            report: {
                ...prev.report,
                [field]: value,
            },
        }));
    };

    const [isPending, setIsPending] = useState(false);
    const onSave = async () => {
        setIsPending(true);
        try {
            const res = await reportApi.updateReport(
                editedSession.report?.id,
                editedSession.report
            );

            toast.success("Updated successfully");
            setReoprtFlag((prev: Boolean) => !prev);
            setTimeout(() => {
                setView(true);
            }, 500);
        } catch (err: any) {
            toast.error(err.message || "updateReportsFailed");
        } finally {
            setTimeout(() => {
                setIsPending(false);
            }, 500);
        }
    };

    const onCancel = () => {
        setEditedSession(session);
        setView(true);
    };

    return (
        <Grid container spacing={2} component={List}>
            {/* Editable Fields */}

            {/* !Quran && Quran */}
            {sessionDeptName != "Quran" ? (
                <>
                    {[
                        {
                            label: "Grade",
                            field: "level",
                            type: "select",
                            options: levels,
                        },
                        {
                            label: "Book",
                            field: "bookId",
                            type: "select",
                            options: documents,
                        },
                        { label: "Unit", field: "unit", type: "text" },
                        { label: "Topic", field: "topic", type: "text" },
                    ].map(({ label, field, type, options = [] }) => (
                        <Grid item xs={6} key={field}>
                            <ListItem>
                                {type === "text" ? (
                                    <TextField
                                        label={label}
                                        fullWidth
                                        value={
                                            editedSession?.report[field] || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(field, e.target.value)
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                ) : (
                                    <FormControl fullWidth>
                                        <InputLabel
                                            sx={{
                                                top: -6,
                                                ml: 2,
                                            }}
                                            id={field}
                                        >
                                            {label}
                                        </InputLabel>
                                        <Select
                                            labelId={field}
                                            fullWidth
                                            value={
                                                editedSession?.report[field] ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    field,
                                                    e.target.value
                                                )
                                            }
                                            sx={{ ml: 2 }}
                                        >
                                            <MenuItem value="">None</MenuItem>
                                            {options.map((option: any) => {
                                                return (
                                                    <MenuItem
                                                        key={option.id}
                                                        value={option.id}
                                                    >
                                                        {option.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                )}
                            </ListItem>
                        </Grid>
                    ))}
                </>
            ) : (
                <>
                    {[
                        {
                            label: "Memorization",
                            field: "memorization",
                            type: "text",
                        },
                        { label: "Revision", field: "revision", type: "text" },
                        { label: "Tajweed", field: "tajweed", type: "text" },
                        {
                            label: "Recitation",
                            field: "recitation",
                            type: "text",
                        },
                        { label: "Reading", field: "reading", type: "text" },
                        {
                            label: "Memorization Grade",
                            field: "memorizationLevel",
                            type: "select",
                            options: levels,
                        },
                        {
                            label: "Revision Grade",
                            field: "revisionLevel",
                            type: "select",
                            options: levels,
                        },
                        {
                            label: "Reading Grade",
                            field: "readingLevel",
                            type: "select",
                            options: levels,
                        },
                    ].map(({ label, field, type, options = [] }) => (
                        <Grid item xs={6} key={field}>
                            <ListItem>
                                {type === "text" ? (
                                    <TextField
                                        label={label}
                                        fullWidth
                                        value={
                                            editedSession?.report[field] || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(field, e.target.value)
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                ) : (
                                    <FormControl fullWidth>
                                        <InputLabel
                                            sx={{
                                                top: -6,
                                                ml: 2,
                                            }}
                                            id={field}
                                        >
                                            {label}
                                        </InputLabel>
                                        <Select
                                            labelId={field}
                                            fullWidth
                                            value={
                                                editedSession?.report[field] ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    field,
                                                    e.target.value
                                                )
                                            }
                                            sx={{ ml: 2 }}
                                        >
                                            <MenuItem value="">None</MenuItem>
                                            {options.map((option: any) => {
                                                return (
                                                    <MenuItem
                                                        key={option.id}
                                                        value={option.id}
                                                    >
                                                        {option.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                )}
                            </ListItem>
                        </Grid>
                    ))}
                </>
            )}
            {/* Arabic */}
            {sessionDeptName == "Arabic" && (
                <>
                    {[
                        { label: "New Words", field: "newWords", type: "text" },
                        {
                            label: "Expressions",
                            field: "expressions",
                            type: "text",
                        },
                        { label: "Rules", field: "rules", type: "text" },
                    ].map(({ label, field, type }) => (
                        <Grid item xs={6} key={field}>
                            <ListItem>
                                <TextField
                                    label={label}
                                    fullWidth
                                    value={editedSession?.report[field] || ""}
                                    onChange={(e) =>
                                        handleChange(field, e.target.value)
                                    }
                                    sx={{ ml: 2 }}
                                />
                            </ListItem>
                        </Grid>
                    ))}
                </>
            )}

            {/* Homework and Notes */}
            {[
                { label: "H.W", field: "homework" },
                { label: "Notes", field: "notes" },
            ].map(({ label, field }) => (
                <Grid item xs={6} key={field}>
                    <ListItem>
                        <TextField
                            label={label}
                            fullWidth
                            value={editedSession?.report[field] || ""}
                            onChange={(e) =>
                                handleChange(field, e.target.value)
                            }
                            sx={{ ml: 2 }}
                        />
                    </ListItem>
                </Grid>
            ))}

            {/* Save & Cancel Buttons */}
            <Grid
                item
                xs={12}
                container
                spacing={2}
                sx={{ mt: 2, justifyContent: "center" }}
            >
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isPending}
                        onClick={onSave}
                    >
                        {isPending ? "Loading..." : "Save"}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        // variant="outlined"
                        // color="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};
