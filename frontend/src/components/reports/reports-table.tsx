import {
  ChangeEvent,
  FC,
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
import { ReportRow } from "./reports-row";
import { ReportHeads } from "./reports-heads";
import { Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import { reportApi } from "../../api/reportApi";
import { useMounted } from "../../hooks/use-mounted";
import { useAuth } from "../../hooks/use-auth";

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
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportCount, setReportsCount] = useState(reports?.length);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isMounted = useMounted();
  const getReports = useCallback(
    async (rowsPerPage: number, page: number) => {
      try {
        const data: any = await reportApi.getReports(rowsPerPage, page);
        if (isMounted()) {
          setReports(data.data);
        }
      } catch (err: any) {
        toast.error(err.message || "failed");
      }
    },
    [isMounted]
  );

  const deleteReport = async (id: number): Promise<{ success: boolean }> => {
    const load = toast.loading("deleteReports");
    try {
      const resp = await reportApi.deleteReport(id);
      toast.dismiss(load);
      toast.success("deleteReports ");
      getReports(rowsPerPage, page);
      return { success: true };
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "deleteReportsFailed");
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
        toast.success("updateReports ");

        getReports(rowsPerPage, page);

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
  useEffect(
    () => {
      getReports(rowsPerPage, page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    setReportsCount(reports?.length);
  }, [reports?.length]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage: any = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
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
              minWidth: 100 * headCells.length,
            }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <ReportHeads headCells={headCells} rowCount={reportCount} />
            <TableBody>
              {reports?.map((row: any, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <ReportRow
                    key={row.id}
                    row={row}
                    labelId={labelId}
                    updateReport={updateReport}
                    deleteReport={deleteReport}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={reportCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
