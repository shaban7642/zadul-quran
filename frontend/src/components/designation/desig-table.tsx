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
import { DesigRow } from "./desig-row";
import { DesigHeads } from "./desig-heads";
import { Delete } from "@mui/icons-material";
import CreateDesig from "./desig-create";
import toast from "react-hot-toast";
import { desigApi } from "../../api/desigApi";
import { useMounted } from "../../hooks/use-mounted";

export interface Desig {
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
  id: keyof Desig;
  label: string;
  numeric: boolean;
}

export const DesigTable = () => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Desig>("title");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [desigs, setDesigs] = useState([
    { id: 234, title: "Marketing" },
    { id: 678, title: "Sales" },
    { id: 987, title: "IT" },
  ]);
  const [desigCount, setDesigsCount] = useState(desigs.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const numSelected = selected.length;
  const isMounted = useMounted();
  useEffect(
    () => {
      getDesigs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const getDesigs = useCallback(async () => {
    try {
      const data: any = await desigApi.getDesigs();
      if (isMounted()) {
        setDesigs(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const deleteDesigs = async (
    produtsToDelete: number[]
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("deleteDesigs");
    try {
      const resp = await desigApi.deleteDesigs(produtsToDelete);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("deleteDesigsSuccess");

        getDesigs();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("deleteDesigsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "deleteDesigsFailed");
      return { success: false };
    }
  };
  const createDesigs = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createDesigs");
    try {
      const resp = await desigApi.createDesigs(values);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("createDesigsSuccess");

        getDesigs();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createDesigsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createDesigsFailed");
      return { success: false };
    }
  };
  const updateDesig = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("updateDesigs");
    try {
      const resp = await desigApi.updateDesig(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateDesigsSuccess");

        getDesigs();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateDesigsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateDesigsFailed");
      return { success: false };
    }
  };
  const handleDeleteDesigs = async (usersToDelete: number[]) => {
    const deleteResp = await deleteDesigs(usersToDelete);
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
    setDesigsCount(desigs.length);
  }, [desigs.length]);
  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Desig
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = desigs.map((n) => n.id);
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
      <Grid container>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <CreateDesig createDesigs={createDesigs} />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Paper
            elevation={9}
            sx={{
              p: "10px 10px",
              width: "100%",
              ml: 2,
              mt: 2,
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
                  Designation List
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
                <DesigHeads
                  headCells={headCells}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={desigCount}
                />
                <TableBody>
                  {stableSort(desigs, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <DesigRow
                          key={row.id}
                          row={row}
                          handleSelectOne={handleSelectOne}
                          isItemSelected={isItemSelected}
                          labelId={labelId}
                          updateDesig={updateDesig}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={desigCount}
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
