import { FC, useCallback, useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Toolbar, Typography } from "@mui/material";
import { PermissionsRow } from "./permissions-row";
import { RolesHeads } from "./roles-heads";
import toast from "react-hot-toast";
import { useMounted } from "../../hooks/use-mounted";
import { rolesApi } from "../../api/rolesApi";
interface Permissions {
  id: number;
  permission: string;
  action: string;
}
interface RolePermissions {
  id: number;
  permissionId: number;
  action: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Permissions;
  label: string;
  numeric: boolean;
}
interface PermissionsTableProps {
  roleId: number;
  role: string;
  name: string;
}
export const PermissionsTable: FC<PermissionsTableProps> = (props) => {
  const { roleId, role, name } = props;
  const [permission, setPermissions] = useState<Permissions[]>();
  const [rolePermission, setRolePermissions] = useState<RolePermissions[]>();
  const [addedIds, setAddedIds] = useState<Number[]>([]);
  const [deletedIds, setDeletedIds] = useState<Number[]>([]);
  const sentPermissions = (checked: boolean, id: number) => {
    if (!checked) {
      // add to added ids array and remove it from deleted ones.
      if (addedIds?.includes(id)) return;
      else if (deletedIds?.includes(id)) {
        setDeletedIds(deletedIds.filter((did) => did !== id));
        setAddedIds([...addedIds, id]);
      } else {
        setAddedIds([...addedIds, id]);
      }
    } else {
      if (deletedIds?.includes(id)) return;
      else if (addedIds?.includes(id)) {
        setAddedIds(addedIds.filter((aid) => aid !== id));
        setDeletedIds([...deletedIds, id]);
      } else {
        setDeletedIds([...deletedIds, id]);
      }
    }
  };
  console.log(addedIds);
  console.log(deletedIds);
  const isMounted = useMounted();
  useEffect(
    () => {
      getPermissions();
      getRolePermissions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // useEffect(
  //   () => {
  //     getRolePermissions();
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [name]
  // );
  const getPermissions = useCallback(async () => {
    try {
      const data: any = await rolesApi.getAllPermissions();
      if (isMounted()) {
        setPermissions(data.resp);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);
  const getRolePermissions = useCallback(async () => {
    try {
      const data: any = await rolesApi.getRolePermissions(name);
      if (isMounted()) {
        setRolePermissions(data.rows);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const addPermissions = async (
    ids: number[],
    roleId: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("addPermissions");
    try {
      const resp = await rolesApi.addPermissions(ids, roleId);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("addPermissionsSuccess");

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("addPermissionsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "addPermissionsFailed");
      return { success: false };
    }
  };
  const removePremissions = async (
    ids: number[],
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("removePremissions");
    try {
      const resp = await rolesApi.removePermissions(ids);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("removePremissionsSuccess");
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("removePremissionsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "removePremissionsFailed");
      return { success: false };
    }
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "permission",
      numeric: false,
      disablePadding: true,
      label: "Permission",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: true,
      label: "Action",
    },
  ];
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
            Permissions List for : {role}
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
            <RolesHeads headCells={headCells} />
            <TableBody>
              {permission?.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const checked = rolePermission?.find(
                  (rP) => rP.permissionId === row.id
                );
                return (
                  <PermissionsRow
                    key={row.id}
                    row={row}
                    labelId={labelId}
                    checked={checked ? true : false}
                    sentPermissions={sentPermissions}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
