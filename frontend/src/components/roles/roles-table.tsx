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
import { RolesRow } from "./roles-row";
import { RolesHeads } from "./roles-heads";
import { Delete } from "@mui/icons-material";
import CreateRoles from "./roles-create";
import toast from "react-hot-toast";
import { rolesApi } from "../../api/rolesApi";
import { useMounted } from "../../hooks/use-mounted";

export interface Roles {
  id: number;
  role: string;
  action: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Roles;
  label: string;
  numeric: boolean;
}

export const RolesTable = () => {
  const [page, setPage] = useState(0);
  const [roles, setRoles] = useState([
    { id: 234, role: "Marketing" },
    { id: 678, role: "Sales" },
    { id: 987, role: "IT" },
  ]);
  const [roleCount, setRolesCount] = useState(roles.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const isMounted = useMounted();
  useEffect(
    () => {
      getRoles();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const getRoles = useCallback(async () => {
    try {
      const data: any = await rolesApi.getRoles();
      if (isMounted()) {
        setRoles(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const updateRoles = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("updateRoles");
    try {
      const resp = await rolesApi.updateRoles(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateRolesSuccess");

        getRoles();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateRolesFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateRolesFailed");
      return { success: false };
    }
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "role",
      numeric: false,
      disablePadding: true,
      label: "Role name",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: true,
      label: "Action",
    },
  ];
  useEffect(() => {
    setRolesCount(roles.length);
  }, [roles.length]);

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
            Roles List
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
            <RolesHeads headCells={headCells} rowCount={roleCount} />
            <TableBody>
              {roles.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RolesRow
                    key={row.id}
                    row={row}
                    labelId={labelId}
                    updateRoles={updateRoles}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={roleCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
