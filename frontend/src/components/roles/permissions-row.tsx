import { FC, Fragment, useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { ToggleButton, Tooltip } from "@mui/material";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
interface RowProps {
  row: any;
  labelId: string;
  checked: boolean;
  sentPermissions: (
    checked: boolean,
    permissionId: number,
    rolePermissionId: number
  ) => void;
}
export const PermissionsRow: FC<RowProps> = (props) => {
  const { row, labelId, checked, sentPermissions } = props;
  const [selected, setSelected] = useState(checked);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: { permissionId: number; rolePermissionId: number }
  ) => {
    event.preventDefault();
    sentPermissions(selected, value.permissionId, value.rolePermissionId);
    setSelected(!selected);
  };
  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: 0 } }}>
        <TableCell
          scope="row"
          sx={{
            color: "black",
          }}
        >
          {row.name}
        </TableCell>
        <TableCell scope="row">
          <ToggleButton
            aria-label={labelId}
            sx={{ border: "none" }}
            value={{
              permissionId: row.id,
              rolePermissionId: row.rolePermission?.id,
            }}
            selected={selected}
            onChange={handleChange}
          >
            {selected ? (
              <Tooltip title="remove">
                <AddModeratorIcon />
              </Tooltip>
            ) : (
              <Tooltip title="add">
                <AddModeratorOutlinedIcon />
              </Tooltip>
            )}
          </ToggleButton>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
