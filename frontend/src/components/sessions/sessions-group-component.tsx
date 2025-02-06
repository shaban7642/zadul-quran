import moment from "moment";
import { useState } from "react";
import { sessionApi } from "../../api/sessionsApi";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { TableHeads } from "./sessions-heads";
import { SessionsRow } from "./sessions-row";
const SessionsGroupComponent = ({
    sessions,
    contentRef,
    handleGetSessions,
    reportFlag,
    setReoprtFlag,
}: {
    sessions: any;
    contentRef: any;
    handleGetSessions: any;
    reportFlag: boolean;
    setReoprtFlag: () => void;
}) => {
    const [selectedDate, setSelectedDate] = useState("");
    const sessionsGroupByDate = sessions?.reduce((acc: any, session: any) => {
        const date = moment(session.date).format("YYYY-MM");
        acc[date] = acc[date] || [];
        acc[date].push(session);
        return acc;
    }, {});

    const [selected, setSelected] = useState<number[]>([]);
    const statuses: readonly string[] = [
        "waiting",
        "expired",
        "running",
        "done",
        "cancelled",
        "absent",
        "rescheduled",
    ];
    const headCells: readonly any[] = [
        {
            id: "teacher",
            numeric: false,
            disablePadding: true,
            label: "Teacher",
        },
        {
            id: "student",
            numeric: false,
            disablePadding: true,
            label: "Student",
        },
        {
            id: "status",
            numeric: false,
            disablePadding: true,
            label: "Status",
        },
        {
            id: "startedAt",
            numeric: false,
            disablePadding: true,
            label: "Started At",
        },
        {
            id: "endedAt",
            numeric: false,
            disablePadding: true,
            label: "Ended At",
        },
        {
            id: "subject",
            numeric: true,
            disablePadding: false,
            label: "Subject",
        },
        {
            id: "date",
            numeric: true,
            disablePadding: false,
            label: "Date",
        },
        {
            id: "startTime",
            numeric: true,
            disablePadding: false,
            label: "Start Time",
        },
        {
            id: "endTime",
            numeric: true,
            disablePadding: false,
            label: "End Time",
        },
    ];

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = sessions.map((n: any) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };
    const deleteSession = async (): Promise<{ success: boolean }> => {
        const load = toast.loading("delete");
        try {
            const resp = await sessionApi.deleteSession(selected);
            if (resp) {
                toast.dismiss(load);
                toast.success("deleteSessionSuccess");
                handleGetSessions();
                setSelected([]);
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error("deleteSessionFailed");
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || "deleteSessionsFailed");
            return { success: false };
        }
    };

    const updateSession = async (
        id: number,
        values: any
    ): Promise<{ success: boolean }> => {
        const load = toast.loading("update");
        try {
            const resp = await sessionApi.updateSession(id, values);
            if (resp) {
                toast.dismiss(load);
                toast.success("updateSessionSuccess");
                handleGetSessions();
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error("updateSessionFailed");
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || "updateSessionsFailed");
            return { success: false };
        }
    };

    const currentSessions = sessionsGroupByDate[selectedDate];

    const renderMonthsGrid = () => (
        <Grid container spacing={3}>
            {Object.keys(sessionsGroupByDate).map((date) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={date}>
                    <Paper
                        onClick={() => setSelectedDate(date)}
                        elevation={3}
                        sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "20px",
                            textAlign: "center",
                            padding: "16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "0.3s",
                            "&:hover": {
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        {moment(date, "YYYY-MM").format("MMMM YYYY")} (
                        {sessionsGroupByDate[date]?.length || 0})
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );

    const renderSessionsTable = () => (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                }}
            >
                <Button
                    onClick={() => setSelectedDate("")}
                    sx={{ m: 2, gap: 1 }}
                    variant="outlined"
                >
                    <ArrowBack fontSize="small" className="no-print" />
                    Back
                </Button>
            </Box>

            <TableContainer>
                <Table
                    ref={contentRef}
                    aria-labelledby="tableTitle"
                    size="small"
                >
                    <style>
                        {`
													@media print {
															body {
																	-webkit-print-color-adjust: exact;
															}
															table {
																	padding:10px;
															}
															.no-print {
																	display: none !important;
															}
													}
											`}
                    </style>

                    <TableHeads
                        headCells={headCells}
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        deleteSession={deleteSession}
                        rowCount={currentSessions?.length}
                    />
                    <TableBody>
                        {currentSessions?.map((row: any, index: number) => {
                            const isItemSelected = selected.includes(row.id);
                            return (
                                <SessionsRow
                                    key={row.id}
                                    row={row}
                                    handleClick={handleClick}
                                    isItemSelected={isItemSelected}
                                    labelId={`enhanced-table-checkbox-${index}`}
                                    updateSession={updateSession}
                                    statuses={statuses}
                                    setReoprtFlag={setReoprtFlag}
                                    reportFlag={reportFlag}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

    return (
        <Box sx={{ p: 2 }}>
            {selectedDate ? renderSessionsTable() : renderMonthsGrid()}
        </Box>
    );
};

export default SessionsGroupComponent;
