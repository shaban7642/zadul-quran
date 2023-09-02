import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Collapse } from "@mui/material";
import { ReportRow } from "./reports-row";
import { ReportHeads } from "./reports-heads";
import { Delete } from "@mui/icons-material";
import CreateReport from "./reports-create";
import toast from "react-hot-toast";
import { reportApi } from "../../api/reportApi";
import { useMounted } from "../../hooks/use-mounted";

export interface Report {
  id: number;
  name: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Report;
  label: string;
  numeric: boolean;
}

export const ReportsTable = () => {
  const [page, setPage] = useState(0);
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      name: "test",
    },
  ]);
  const [reportCount, setReportsCount] = useState(reports?.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMounted = useMounted();
  useEffect(
    () => {
      getReports();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const getReports = useCallback(async () => {
    try {
      const data: any = await reportApi.getReports();
      if (isMounted()) {
        setReports(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const deleteReport = async (id: number) => {
    const load = toast.loading("deleteReports");
    try {
      const resp = await reportApi.deleteReport(id);

      getReports();
    } catch (err: any) {
      console.log(err);
    }
  };
  const createReport = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createReports");
    try {
      await reportApi.createReport(values);

      toast.dismiss(load);
      toast.success("createReportsSuccess");

      getReports();

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createReportsFailed");
      return { success: false };
    }
  };
  const updateReport = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("updateReports");
    try {
      const resp = await reportApi.updateReport(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateReportsSuccess");

        getReports();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateReportsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateReportsFailed");
      return { success: false };
    }
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Title",
    },
  ];
  useEffect(() => {
    setReportsCount(reports?.length);
  }, [reports?.length]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container>
        <Grid item lg={5.8} md={5.8} sm={5.8} xs={12}>
          <CreateReport createReport={createReport} />
        </Grid>
        <Grid item lg={0.4} md={0.4} sm={0.4} xs={0}>
          <Box></Box>
        </Grid>
        <Grid item lg={5.8} md={5.8} sm={5.8} xs={12}>
          <Paper
            elevation={9}
            sx={{
              p: "10px 10px",
              width: "100%",

              ...(true && {
                bgcolor: (theme) =>
                  alpha(
                    theme?.palette.info.contrastText,
                    theme?.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            {" "}
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                Report List
              </Typography>
            </Toolbar>
            <TableContainer>
              <Table
                sx={{
                  minWidth: 100 * 2,
                }}
                aria-labelledby="tableTitle"
                size="small"
              >
                <ReportHeads headCells={headCells} rowCount={reportCount} />
                <TableBody>
                  {reports?.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <ReportRow
                        key={row.id}
                        row={row}
                        labelId={labelId}
                        updateReport={updateReport}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={reportCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
