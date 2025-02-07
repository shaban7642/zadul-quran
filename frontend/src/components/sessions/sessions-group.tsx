import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Card, Chip, Divider, Tab, Tabs } from "@mui/material";
import { useMounted } from "../../hooks/use-mounted";
import toast from "react-hot-toast";
import { sessionApi } from "../../api/sessionsApi";
import { useRouter } from "next/router";
import { SessionListFilters } from "./sessions-list-filters";
import { Filter as FilterIcon } from "../../icons/filter";
import { useAuth } from "../../hooks/use-auth";
import useSavedState from "../../hooks/useSavedState";
import { useReactToPrint } from "react-to-print";
import SessionsGroupComponent from "./sessions-group-component";

export interface Data {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

export const SessionListInner = styled("div", {
    shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
    flexGrow: 1,
    overflow: "hidden",
    zIndex: 1,
    [theme.breakpoints.up("lg")]: {
        marginLeft: -380,
    },
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        [theme.breakpoints.up("lg")]: {
            marginLeft: 0,
        },
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
export const SessionsGroup = () => {
    const isMounted = useMounted();
    const router = useRouter();
    const { user } = useAuth();
    const initialFilters: any = {
        date: {
            from: null,
            to: null,
        },
        teacherId: null,
        departmentId: null,
        studentId: null,
    };
    const [filters, setFilters] = useState<any>({});
    const [sessions, setSessions] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [sessionsCount, setSessionsCount] = useState(0);
    const [statusCount, setStatusCount] = useState<
        { status: string; count: number }[]
    >([]);
    const [typesCount, setTypesCount] = useState<
        { sessionTypeId: string; count: number }[]
    >([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [sessionTypes, setSessionTypes] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useSavedState<any>(
        "waiting",
        "sessions-selected-tab"
    );

    const rootRef = useRef<HTMLDivElement | null>(null);
    const [openFilters, setOpenFilters] = useState<boolean>(false);

    const [reportFlag, setReoprtFlag] = useState<boolean>(false);

    const tabs: any[] = [
        {
            label: "all",
            value: "",
            count: totalCount,
        },
        {
            label: "waiting",
            value: "waiting",
            count: statusCount.find((item) => item.status.match("waiting"))
                ?.count,
        },
        {
            label: "running",
            value: "running",
            count: statusCount.find((item) => item.status.match("running"))
                ?.count,
        },
        {
            label: "done",
            value: "done",
            count: statusCount.find((item) => item.status.match("done"))?.count,
        },
        {
            label: "cancelled",
            value: "cancelled",
            count: statusCount.find((item) => item.status.match("cancelled"))
                ?.count,
        },
        {
            label: "expired",
            value: "expired",
            count: statusCount.find((item) => item.status.match("expired"))
                ?.count,
        },
        {
            label: "absent",
            value: "absent",
            count: statusCount.find((item) => item.status.match("absent"))
                ?.count,
        },
        {
            label: "rescheduled",
            value: "rescheduled",
            count: statusCount.find((item) => item.status.match("rescheduled"))
                ?.count,
        },
    ];

    const typesTabs: any[] = sessionTypes?.map((type) => ({
        label: type.name,
        value: type.duration,
        count: typesCount.find((item) => item?.sessionTypeId === type.id)
            ?.count,
    }));

    const handleTabsChange = (event: ChangeEvent<{}>, value: any): void => {
        setCurrentTab(value);
        getSessions({ limit: rowsPerPage, offset: 0, status: value });
        // setViewParams({ ...viewParams, status: value, pageCount: 1, page: 0 });
    };

    const handleGetSessions = () => {
        getSessions({ limit: rowsPerPage, offset: page, status: currentTab });
    };

    const getSessions = useCallback(
        async (filterObject: any) => {
            try {
                const data: any = await sessionApi.getSessions({
                    ...filterObject,
                    // ...filters,
                    studentId:
                        filterObject.studentId ||
                        filters?.studentId ||
                        router?.query?.student ||
                        null,
                });
                if (isMounted()) {
                    setSessions(data.rows);
                    setSessionsCount(data.count);
                    setStatusCount(data.statusCount);
                    setTypesCount(data.typesCount);
                    setTotalCount(data.totalCount);
                }
            } catch (err: any) {
                console.log(err);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted, filters]
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
        getSessionTypes();
    }, []);

    useEffect(
        () => {
            getSessions({
                limit: rowsPerPage,
                offset: page,
                status: currentTab,
                studentId: router?.query?.student || null,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reportFlag]
    );

    useEffect(
        () => {
            if (router?.query?.code) {
                startMeeting(router.query.code, router.query.sessionId);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.query]
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        getSessions({
            limit: rowsPerPage,
            offset: newPage * rowsPerPage,
            status: currentTab,
        });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getSessions({
            limit: parseInt(event.target.value, 10),
            offset: 0,
            status: currentTab,
        });
    };

    const startMeeting = useCallback(
        async (
            code: string | string[],
            sessionId: string | string[] | undefined
        ) => {
            try {
                const data = await sessionApi.startMeeting(code, sessionId);
                if (data.success) {
                    window.history.replaceState(null, "", "/sessions");
                    window.open(data.meetingUrl, "_blank");
                    getSessions({
                        limit: rowsPerPage,
                        offset: page,
                        status: currentTab,
                    });
                }
            } catch (error: any) {
                window.history.replaceState(null, "", "/sessions");
                toast.error(error?.message || "failed to start session");
            }
        },
        [isMounted]
    );

    const applyFilters = (comingFilters: any): any => {
        setFilters(comingFilters);
        getSessions({
            status: currentTab,
            limit: rowsPerPage,
            offset: 0,
            ...comingFilters,
        });
    };

    const clearFilters = () => {
        applyFilters(initialFilters);
    };

    const handleToggleFilters = (): void => {
        setOpenFilters((prevState) => !prevState);
    };

    const handleCloseFilters = (): void => {
        setOpenFilters(false);
    };

    const contentRef = useRef(null);
    const handleExportToPdf = useReactToPrint({
        contentRef,
        ignoreGlobalStyles: false,
    });

    return (
        <Box sx={{ width: "100%", scrollBehavior: "auto" }}>
            {["super_admin", "admin"].includes(user?.role?.name) && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        endIcon={<FilterIcon fontSize="small" />}
                        onClick={handleToggleFilters}
                        sx={{ ml: 1, mt: 1 }}
                        variant="outlined"
                    >
                        Filters
                    </Button>
                    <Button
                        endIcon={<SaveIcon fontSize="small" />}
                        onClick={() => handleExportToPdf()}
                        sx={{ ml: 1, mt: 1 }}
                        variant="outlined"
                    >
                        Save as pdf
                    </Button>
                </Box>
            )}
            <Paper
                elevation={12}
                sx={{
                    mt: 0.5,
                    ...(true && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.info.contrastText,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                <Card sx={{ backgroundColor: "white" }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                    >
                        <Tabs
                            TabIndicatorProps={{ style: { display: "none" } }} // Hides the indicator
                            onChange={handleTabsChange}
                            scrollButtons="auto"
                            sx={{
                                px: 2,
                            }}
                            textColor="primary"
                            value={currentTab}
                            variant="scrollable"
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    sx={{
                                        minHeight: "50px",
                                        mt: "auto",
                                        mb: "auto",
                                        "&.Mui-selected": {
                                            color: "text.context", // Custom color for selected tab
                                            fontWeight: "bold", // Make the selected tab bold
                                            backgroundColor: "secondary.main", // Add background color to selected tab
                                            borderRadius: "10%",
                                            p: "0 4px",
                                        },
                                    }}
                                    icon={
                                        <Chip
                                            label={tab.count || 0}
                                            size="small"
                                            sx={{
                                                fontSize: "12px !important",
                                                color: "neutral.600",
                                                // borderRadius: '5px',
                                            }}
                                        />
                                    }
                                    iconPosition="end"
                                    key={tab.value}
                                    label={tab.label}
                                    value={tab.value}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <Divider />
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                    >
                        <Tabs
                            TabIndicatorProps={{ style: { display: "none" } }} // Hides the indicator
                            // onChange={handleTabsChange}
                            scrollButtons="auto"
                            sx={{
                                px: 2,
                            }}
                            textColor="primary"
                            value={currentTab}
                            variant="scrollable"
                        >
                            {typesTabs?.map((tab) => {
                                return (
                                    <Tab
                                        sx={{
                                            minHeight: "60px",
                                            mt: "auto",
                                            mb: "auto",
                                            cursor: "unset",
                                            color: "primary.dark",
                                        }}
                                        icon={
                                            <Chip
                                                label={tab.count || 0}
                                                size="small"
                                                sx={{
                                                    fontSize: "12px !important",
                                                    color: "text.primary",
                                                    // borderRadius: '5px',
                                                }}
                                            />
                                        }
                                        iconPosition="end"
                                        key={tab.value}
                                        label={tab.label}
                                        value={tab.value}
                                    />
                                );
                            })}
                        </Tabs>
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex" }}>
                        <SessionListFilters
                            containerRef={rootRef}
                            onClose={handleCloseFilters}
                            open={openFilters}
                            applyFilters={(filters: any): Promise<void> =>
                                applyFilters(filters)
                            }
                            clearFilters={clearFilters}
                        />
                        <SessionListInner open={openFilters} />
                        <Box sx={{ width: "100%" }}>
                            <SessionsGroupComponent
                                sessions={sessions}
                                contentRef={contentRef}
                                handleGetSessions={handleGetSessions}
                                reportFlag={reportFlag}
                                setReoprtFlag={setReoprtFlag}
                            />
                        </Box>
                    </Box>
                    <TablePagination
                        component="div"
                        count={sessionsCount}
                        rowsPerPageOptions={[10, 50, 100, 200, 500]}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Paper>
        </Box>
    );
};

export default SessionsGroup;
