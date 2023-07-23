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
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
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
  title: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Dept;
  label: string;
  numeric: boolean;
}

export const DeptTable = () => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Dept>("title");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [depts, setDepts] = useState([
    { id: 234, title: "Marketing" },
    { id: 678, title: "Sales" },
    { id: 987, title: "IT" },
  ]);
  const [deptCount, setDeptsCount] = useState(depts.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const numSelected = selected.length;
  const isMounted = useMounted();
  useEffect(
    () => {
      getDepts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const getDepts = useCallback(async () => {
    try {
      const data: any = await deptApi.getDepts();
      if (isMounted()) {
        setDepts(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const deleteDepts = async (
    produtsToDelete: number[]
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("deleteDepts");
    try {
      const resp = await deptApi.deleteDepts(produtsToDelete);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("deleteDeptsSuccess");

        getDepts();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("deleteDeptsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "deleteDeptsFailed");
      return { success: false };
    }
  };
  const createDepts = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createDepts");
    try {
      const resp = await deptApi.createDepts(values);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("createDeptsSuccess");

        getDepts();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createDeptsFailed");
        return { success: false };
      }
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
  const handleDeleteDepts = async (usersToDelete: number[]) => {
    const deleteResp = await deleteDepts(usersToDelete);
    if (deleteResp.success) {
      setSelected([]);
    }
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "title",
      numeric: false,
      disablePadding: true,
      label: "Title",
    },
  ];
  useEffect(() => {
    setDeptsCount(depts.length);
  }, [depts.length]);
  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Dept
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = depts.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectOne = (name: number): void => {
    if (!selected.includes(name)) {
      setSelected((prevSelected) => [...prevSelected, name]);
    } else {
      setSelected((prevSelected) => prevSelected.filter((id) => id !== name));
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: any) => selected.indexOf(name) !== -1;

  // const handlePagination

  // Avoid a layout jump when reaching the last page with empty rows.

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <CreateDept createDepts={createDepts} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 0,
          mt: 1,
        }}
      >
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
              ...(numSelected > 0 && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.info.main,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            {numSelected > 0 ? (
              <Typography color="inherit" variant="subtitle1" component="div">
                {numSelected} selected
              </Typography>
            ) : (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                Department List
              </Typography>
            )}
          </Toolbar>
          <TableContainer>
            <Table
              sx={{
                minWidth: 100 * 2,
              }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <DeptHeads
                headCells={headCells}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={deptCount}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(depts, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <DeptRow
                        key={row.id}
                        row={row}
                        headCells={headCells}
                        handleSelectOne={handleSelectOne}
                        isItemSelected={isItemSelected}
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
      </Box>
    </Box>
  );
};
