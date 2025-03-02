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

interface Session {
    id: number;
    patchId: string;
    teacher: string;
    student: string;
    status: string;
    startedAt: string;
    endedAt: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    title?: string;
}

interface SessionsGroupComponentProps {
    sessions: Session[];
    contentRef: React.RefObject<HTMLTableElement>;
    handleGetSessions: () => void;
    reportFlag: boolean;
    setReoprtFlag: (flag: boolean) => void;
}

const SessionsGroupComponent = ({
    sessions,
    contentRef,
    handleGetSessions,
    reportFlag,
    setReoprtFlag,
}: SessionsGroupComponentProps) => {
    const [selectedBatchId, setSelectedBatchId] = useState<string>("");
    const [selected, setSelected] = useState<number[]>([]);

    const sessionsGroupByBatchId = sessions?.reduce(
        (acc: Record<string, Session[]>, session: Session) => {
            const patchId = session.patchId;
            if (!acc[patchId]) {
                acc[patchId] = [];
            }
            acc[patchId].push(session);
            return acc;
        },
        {}
    );

    const statuses: readonly string[] = [
        "waiting",
        "expired",
        "running",
        "done",
        "cancelled",
        "absent",
        "rescheduled",
    ];

    const headCells = [
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
        { id: "status", numeric: false, disablePadding: true, label: "Status" },
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
        { id: "date", numeric: true, disablePadding: false, label: "Date" },
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
            const newSelected = currentSessions.map((n) => n.id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
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
        const load = toast.loading("Deleting...");
        try {
            const resp = await sessionApi.deleteSession(selected);
            if (resp) {
                toast.dismiss(load);
                toast.success("Session deleted successfully");
                handleGetSessions();
                setSelected([]);
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error("Failed to delete session");
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || "Failed to delete session");
            return { success: false };
        }
    };

    const updateSession = async (
        id: number,
        values: any
    ): Promise<{ success: boolean }> => {
        const load = toast.loading("Updating...");
        try {
            const resp = await sessionApi.updateSession(id, values);
            if (resp) {
                toast.dismiss(load);
                toast.success("Session updated successfully");
                handleGetSessions();
                return { success: true };
            } else {
                toast.dismiss(load);
                toast.error("Failed to update session");
                return { success: false };
            }
        } catch (err: any) {
            toast.dismiss(load);
            toast.error(err.message || "Failed to update session");
            return { success: false };
        }
    };

    const currentSessions = sessionsGroupByBatchId?.[selectedBatchId] || [];

    const renderMonthsGrid = () => (
        <Grid container spacing={3}>
            {Object.keys(sessionsGroupByBatchId || {}).map((batchId) => {
                const batchTitle =
                    sessionsGroupByBatchId[batchId]?.[0]?.title ||
                    `Batch ${batchId}`;
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={batchId}>
                        <Paper
                            onClick={() => setSelectedBatchId(batchId)}
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
                            Batch:{" "}
                            {`${batchTitle} (${sessionsGroupByBatchId[batchId].length})`}
                        </Paper>
                    </Grid>
                );
            })}
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
                    onClick={() => setSelectedBatchId("")}
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
                                    padding: 10px;
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
                        rowCount={currentSessions.length}
                    />
                    <TableBody>
                        {currentSessions.map((row: Session, index: number) => {
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
            {selectedBatchId ? renderSessionsTable() : renderMonthsGrid()}
        </Box>
    );
};

export default SessionsGroupComponent;
