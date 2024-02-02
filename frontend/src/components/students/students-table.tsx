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
import { TableHeads } from "../users/users-heads";
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import { StudentsRow } from "./students-row";
import { userApi } from "../../api/userApi";
import { useMounted } from "../../hooks/use-mounted";
import { User } from "../../types/user";
import toast from "react-hot-toast";

export interface Data {
  username: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  email: string;
  phoneNumber: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}
interface StudentsTableProps {
  roleId?: string;
  depts: any[];
}
export const StudentsTable: FC<StudentsTableProps> = (props) => {
  const { roleId, depts } = props;
  const isMounted = useMounted();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [usersCount, setUsersCount] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headCells: readonly any[] = [
    {
      id: "firstName",
      numeric: false,
      disablePadding: true,
      label: "First Name",
    },
    {
      id: "lastName",
      numeric: false,
      disablePadding: true,
      label: "Last Name",
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
      id: "phoneNumber",
      numeric: true,
      disablePadding: false,
      label: "Mobile No.",
    },
    {
      id: "action",
      numeric: true,
      disablePadding: false,
      label: "Profile",
    },
  ];

  const getUsers = useCallback(
    async (rowsPerPage: number, page: number) => {
      try {
        const data: any = await userApi.getUsers(rowsPerPage, page, roleId);

        if (isMounted()) {
          setUsers(data.rows);
          setUsersCount(data.count);
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  const deleteUser = async (id: number): Promise<{ success: boolean }> => {
    const load = toast.loading("delete");
    try {
      const resp = await userApi.deleteUser(id);
      if (resp) {
        toast.dismiss(load);
        toast.success("deleteUser ");
        getUsers(rowsPerPage, page);
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("deleteUserFailed");
        return { success: false };
      }
    } catch (err: any) {
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
      if (resp) {
        toast.dismiss(load);
        toast.success("updateUser ");
        getUsers(rowsPerPage, page);
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateUserFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateUsersFailed");
      return { success: false };
    }
  };

  useEffect(
    () => {
      getUsers(rowsPerPage, page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, rowsPerPage]
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getUsers(rowsPerPage, newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getUsers(rowsPerPage, page);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
        elevation={12}
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
        <TableContainer>
          <Table
            sx={{
              minWidth: 100 * headCells.length,
            }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <TableHeads headCells={headCells} />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {users.map((row: any, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StudentsRow
                    key={row?.id}
                    row={row}
                    depts={depts}
                    labelId={labelId}
                    deleteStudent={deleteUser}
                    updateStudent={updateUser}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={usersCount}
          rowsPerPageOptions={[10, 25, 50]}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
