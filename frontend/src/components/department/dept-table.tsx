import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { Grid, Toolbar, Typography } from "@mui/material";
import { DeptRow } from "./dept-row";
import { DeptHeads } from "./dept-heads";
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

export const DeptTable = () => {
  const [page, setPage] = useState(0);
  const [depts, setDepts] = useState([]);
  const [deptCount, setDeptsCount] = useState(depts?.length);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isMounted = useMounted();
  const getDepts = useCallback(
    async (rowsPerPage: number, page: number) => {
      try {
        const data: any = await deptApi.getDepts(rowsPerPage, page);
        if (isMounted()) {
          setDepts(data.rows);
          setDeptsCount(data.count);
        }
      } catch (err: any) {
        toast.error(err.message || "failed");
      }
    },
    [isMounted]
  );

  const deleteDept = async (id: number) => {
    const load = toast.loading("Deleting departments");
    try {
      const resp = await deptApi.deleteDepts(id);
      toast.dismiss(load);

      getDepts(rowsPerPage, page);
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "Deleting departments failed");
      console.log(err);
    }
  };
  const createDept = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("Create department");
    try {
      await deptApi.createDept(values);

      toast.dismiss(load);
      toast.success("Department created");

      getDepts(rowsPerPage, page);

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "Create department failed");
      return { success: false };
    }
  };
  const updateDept = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("Update department");
    try {
      const resp = await deptApi.updateDept(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("Department updated");

        getDepts(rowsPerPage, page);

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("update department failed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "update department failed");
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getDepts(rowsPerPage, newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getDepts(parseInt(event.target.value, 10), 0);
  };
  useEffect(
    () => {
      getDepts(rowsPerPage, page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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
                Subjects List
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
                        deleteDept={deleteDept}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
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
