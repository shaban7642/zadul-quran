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
import { TableHeads } from "./users-heads";
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { UsersRow } from "./users-row";
import { userApi } from "../../api/userApi";
import { useMounted } from "../../hooks/use-mounted";
import { User } from "../../types/user";
import toast from "react-hot-toast";

export interface Data {
  sl: String;
  staff_id: String;
  name: String;
  role: String;
  desination: String;
  department: String;
  email: String;
  mobile_no: String;
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
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
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
  id: keyof Data;
  label: string;
  numeric: boolean;
}
interface UsersTableProps {
  role?: string;
}
export const UsersTable: FC<UsersTableProps> = (props) => {
  const { role } = props;
  const tableName: string = "users";
  const isMounted = useMounted();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("name");
  const [selected, setSelected] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([
    // mock data for table display
    {
      sl: 1,
      staff_id: 123,
      name: "abdo",
      role: "admin",
      desination: "Admin",
      department: "sdsd",
      email: "e@b.com",
      mobile_no: " + 91 - 876543210",
    },
    {
      sl: 2,
      staff_id: 456,
      name: "johndoe",
      role: "admin",
      desination: "Admin",
      department: "dsdsddds",
      email: "<EMAIL>",
      mobile_no: "+91-9876543210",
    },
    {
      sl: 3,
      staff_id: 223,
      name: "abdo",
      role: "teacher",
      desination: "Teacher",
      department: "sdsd",
      email: "e@b.com",
      mobile_no: " + 91 - 876543210",
    },
    {
      sl: 4,
      staff_id: 556,
      name: "johndoe",
      role: "teacher",
      desination: "Teacher",
      department: "dsdsddds",
      email: "<EMAIL>",
      mobile_no: "+91-9876543210",
    },
  ]);
  const [page, setPage] = useState(0);
  const [usersCount, setUsersCount] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const numSelected = selected.length;
  const headCells: readonly any[] = [
    {
      id: "sl",
      numeric: false,
      disablePadding: true,
      label: "Sl",
    },
    {
      id: "staff_id",
      numeric: false,
      disablePadding: true,
      label: "Staff Id",
    },
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "desination",
      numeric: false,
      disablePadding: true,
      label: "Desination",
    },
    {
      id: "department",
      numeric: false,
      disablePadding: true,
      label: "Department",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "mobile_no",
      numeric: true,
      disablePadding: false,
      label: "Mobile No.",
    },
  ];

  // const getUsers = useCallback(
  //   async (rowsPerPage: number, page: number) => {
  //     try {
  //       const data: any = await userApi.getUsers(rowsPerPage, page);

  //       if (isMounted()) {
  //         setUsersCount(data.count);
  //         setUsers(data.rows);
  //       }
  //     } catch (err) {
  //       toast.error(err.message || "failed");
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [isMounted]
  // );

  const deleteUsers = async (
    usersToDelete: number[]
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("delete");
    try {
      const resp = await userApi.deleteUsers(usersToDelete);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("deleteUserSuccess");
        //  getUsers(rowsPerPage, page);
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("deleteUserFailed");
        return { success: false };
      }
    } catch (err) {
      toast.dismiss(load);
      toast.error(err.message || "deleteUsersFailed");
      return { success: false };
    }
  };

  const updateUser = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("update");
    try {
      const resp = await userApi.updateUser(id, values);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateUserSuccess");
        // getUsers(rowsPerPage, page);
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateUserFailed");
        return { success: false };
      }
    } catch (err) {
      toast.dismiss(load);
      toast.error(err.message || "updateUsersFailed");
      return { success: false };
    }
  };

  // useEffect(
  //   () => {
  //     getUsers(rowsPerPage, page);
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [page, rowsPerPage]
  // );

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users?.map((n) => n.sl);
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
    // getUsers(rowsPerPage, newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // getUsers(rowsPerPage, page);
  };

  const isSelected = (name: any) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleDeleteUsers = async (usersToDelete: number[]) => {
    const deleteResp = await deleteUsers(usersToDelete);
    if (deleteResp.success) {
      setSelected([]);
    }
  };
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  return (
    <Box sx={{ width: "100%", scrollBehavior: "auto" }}>
      <Paper
        sx={{
          m: 0,
          ...(true && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.info.contrastText,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
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
            <Typography color="inherit" variant="subtitle1" component="div">
              {numSelected} selected
            </Typography>
            <Tooltip title="delete">
              <IconButton onClick={() => handleDeleteUsers(selected)}>
                <Delete color="error" />
                <Typography
                  variant={tableName ? "h6" : "h5"}
                  id="iconTitle"
                  component="div"
                >
                  delete user
                </Typography>
              </IconButton>
            </Tooltip>
          </Toolbar>
        ) : (
          <></>
        )}
        <TableContainer>
          <Table
            sx={{
              minWidth: 100 * usersCount,
            }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <TableHeads
              tableName={tableName}
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={usersCount}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(users, getComparator(order, orderBy))
                .filter((row) => row.role === role)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.sl);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <UsersRow
                      key={row.name}
                      row={row}
                      handleSelectOne={handleSelectOne}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      updateUser={updateUser}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={usersCount}
          rowsPerPageOptions={[5, 10, 25]}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
