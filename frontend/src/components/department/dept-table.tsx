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
import { Collapse } from "@mui/material";
import { DeptRow } from "./dept-row";
import { DeptHeads } from "./dept-heads";
import { Delete } from "@mui/icons-material";
import CreateDept from "./dept-create";
import toast from "react-hot-toast";
import { deptApi } from "../../api/deptApi";
import { useMounted } from "../../hooks/use-mounted";

export interface Dept {
  id: number;
  name: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Dept;
  label: string;
  numeric: boolean;
}
interface DeptTableProps {
  getDepts: () => void;
  depts: any[];
}
export const DeptTable: FC<DeptTableProps> = (props) => {
  const { getDepts, depts } = props;
  const [page, setPage] = useState(0);
  const [deptCount, setDeptsCount] = useState(depts?.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMounted = useMounted();
  useEffect(
    () => {
      getDepts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const deleteDept = async (id: number) => {
    const load = toast.loading("deleteDepts");
    try {
      const resp = await deptApi.deleteDepts(id);

      getDepts();
    } catch (err: any) {
      console.log(err);
    }
  };
  const createDept = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createDepts");
    try {
      await deptApi.createDept(values);

      toast.dismiss(load);
      toast.success("createDeptsSuccess");

      getDepts();

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createDeptsFailed");
      return { success: false };
    }
  };
  const updateDept = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("updateDepts");
    try {
      const resp = await deptApi.updateDept(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateDeptsSuccess");

        getDepts();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateDeptsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateDeptsFailed");
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
    setDeptsCount(depts?.length);
  }, [depts?.length]);

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
        <Grid item sm={5} xs={12}>
          <CreateDept createDept={createDept} />
        </Grid>
        <Grid item sm={0.4} xs={0}>
          <Box></Box>
        </Grid>
        <Grid item sm={6.6} xs={12}>
          <Paper
            elevation={9}
            sx={{
              p: "10px 10px",
              width: "100%",

              ...(true && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.info.contrastText,
                    theme.palette.action.activatedOpacity
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
                Department List
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
                <DeptHeads headCells={headCells} rowCount={deptCount} />
                <TableBody>
                  {depts?.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <DeptRow
                        key={row.id}
                        row={row}
                        labelId={labelId}
                        updateDept={updateDept}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={deptCount}
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
