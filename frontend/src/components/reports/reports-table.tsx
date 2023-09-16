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
interface ReportsTableProps {
  reports: Report[];
  deleteReport: (id: number) => Promise<{ success: boolean }>;
  updateReport: (id: number, values: any) => Promise<{ success: boolean }>;
}
export const ReportsTable: FC<ReportsTableProps> = (props) => {
  const { reports, deleteReport, updateReport } = props;
  const [page, setPage] = useState(0);

  const [reportCount, setReportsCount] = useState(reports?.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
                    deleteReport={deleteReport}
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
    </Box>
  );
};
