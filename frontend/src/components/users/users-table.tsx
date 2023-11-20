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
import { UsersRow } from "./users-row";
import { userApi } from "../../api/userApi";
import { useMounted } from "../../hooks/use-mounted";
import { User } from "../../types/user";
import toast from "react-hot-toast";

export interface Data {
  id: number;
  username: String;
  firstName: String;
  lastName: String;
  city: String;
  gender: String;
  birthDate: String;
  roleId: number;
  departmentId: number;
  email: String;
  phoneNumber: String;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface UsersTableProps {
  roleId?: string;
  roles: any[];
}
export const UsersTable: FC<UsersTableProps> = (props) => {
  const { roleId, roles } = props;
  const isMounted = useMounted();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headCells: readonly any[] = [
    {
      id: "username",
      numeric: false,
      disablePadding: true,
      label: "username",
    },
    {
      id: "role",
      numeric: false,
      disablePadding: true,
      label: "Role",
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
        let data: any = {};

        if (isMounted()) {
          if (roleId) {
            data = await userApi.getUsers(rowsPerPage, page, roleId);
          } else {
            data = await userApi.getUsers(
              rowsPerPage,
              page,
              "super_admin",
              "admin",
              "teacher"
            );
          }
          setUsers(data.rows);
          setUsersCount(data.count);
        }
      } catch (err) {
        toast.error(err.message || "Need Permission");
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
    } catch (err) {
      toast.dismiss(load);
      toast.error(err.message || "updateUsersFailed");
      return { success: false };
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getUsers(rowsPerPage, newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getUsers(parseInt(event.target.value, 10), 0);
  };

  useEffect(
    () => {
      getUsers(rowsPerPage, page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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
              {users.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <UsersRow
                    key={row?.id}
                    row={row}
                    roles={roles}
                    deleteUser={deleteUser}
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
