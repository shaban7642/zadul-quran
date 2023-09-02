import { useCallback, useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Toolbar, Typography } from "@mui/material";
import { RolesRow } from "./roles-row";
import { RolesHeads } from "./roles-heads";
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
  const [roles, setRoles] = useState<Roles[]>();

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
        setRoles(data.resp);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

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
            <RolesHeads headCells={headCells} />
            <TableBody>
              {roles?.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return <RolesRow key={row.id} row={row} labelId={labelId} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
