import { FC, useCallback, useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Chip, Divider, Toolbar, Typography } from "@mui/material";
import { PermissionsRow } from "./permissions-row";
import { RolesHeads } from "./roles-heads";
import toast from "react-hot-toast";
import { useMounted } from "../../hooks/use-mounted";
import { rolesApi } from "../../api/rolesApi";
import { LoadingButton } from "@mui/lab";

interface Permissions {
  id: number;
  name: string;
  permission: string;
  action: string;
  matched: boolean;
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
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
  const [result, setResult] = useState<Permissions[]>();
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const sentPermissions = (
    checked: boolean,
    permissionId: number,
    rolePermissionId: number
  ) => {
    if (!checked) {
      // add to added ids array and remove it from deleted ones.
      if (addedIds?.includes(permissionId)) return;
      else if (deletedIds?.includes(permissionId)) {
        setDeletedIds(deletedIds.filter((did) => did !== permissionId));
        setAddedIds([...addedIds, permissionId]);
      } else {
        setAddedIds([...addedIds, permissionId]);
      }
    } else {
      if (deletedIds?.includes(rolePermissionId)) return;
      else if (addedIds?.includes(rolePermissionId)) {
        setAddedIds(addedIds.filter((aid) => aid !== rolePermissionId));
        setDeletedIds([...deletedIds, rolePermissionId]);
      } else {
        setDeletedIds([...deletedIds, rolePermissionId]);
      }
    }
  };
  const isMounted = useMounted();

  const getPermissions = useCallback(async () => {
    try {
      const data: any = await rolesApi.getAllPermissions();
      if (isMounted()) {
        setPermissions(
          data.resp?.sort(function (a: any, b: any) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          })
        );
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
        getResult();
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);
  const getResult = () => {
    const data = permissions.map((row: any, index) => {
      return {
        ...row,
        matched: rolePermissions.some((rP) => rP.permissionId === row.id),
        rolePermission: rolePermissions.find(
          (rP) => rP.permissionId === row.id
        ),
      };
    });
    setResult(data);
  };
  const addPermissions = async (ids: number[], roleId: any) => {
    try {
      const resp = await rolesApi.addPermissions(ids, roleId);
    } catch (err: any) {
      toast.error(err.message || "addPermissionsFailed");
    }
  };
  const removePremissions = async (
    ids: number[]
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("removePremissions");
    try {
      const resp = await rolesApi.removePermissions(ids);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("removePremissions ");
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
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (addedIds.length > 0) {
      await addPermissions(addedIds, roleId);
      setAddedIds([]);
    }
    if (deletedIds.length > 0) {
      await removePremissions(deletedIds);
      setDeletedIds([]);
    }
    if (addedIds.length > 0 || deletedIds.length > 0) {
      getRolePermissions();
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
  useEffect(
    () => {
      getPermissions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(
    () => {
      getRolePermissions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleId]
  );
  useEffect(() => {
    if (permissions?.length > 0 && rolePermissions?.length >= 0) {
      getResult();
    }
  }, [permissions, rolePermissions]);
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
          <Table aria-labelledby="tableTitle" size="small">
            <RolesHeads headCells={headCells} />
            <TableBody>
              {result?.map((row: any, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <>
                    {index % 4 === 0 ? (
                      <Divider textAlign="center" sx={{ width: "138%" }}>
                        <Chip
                          label={`${row.name
                            .replace(/:.*/, "")
                            .toLocaleUpperCase()} Permissions`}
                          sx={{ fontWeight: "600" }}
                        />
                      </Divider>
                    ) : (
                      <Divider sx={{ width: "138%" }}></Divider>
                    )}
                    <PermissionsRow
                      key={row?.id}
                      row={row}
                      labelId={labelId}
                      checked={row?.matched}
                      sentPermissions={sentPermissions}
                    />
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: "right" }}>
          <LoadingButton
            type="button"
            onClick={onSubmit}
            sx={{
              "& .MuiInputBase-root": {
                height: 40,
              },
              m: 0.5,
              p: 1,
            }}
            variant="contained"
          >
            Save
          </LoadingButton>
        </div>
      </Paper>
    </Box>
  );
};
