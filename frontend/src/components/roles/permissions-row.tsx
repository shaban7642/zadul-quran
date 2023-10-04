import { FC, Fragment, useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  Chip,
  Divider,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";
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
  const command = (command: string) => {
    if (command == "create") {
      return (
        <>
          <Typography
            sx={{
              background: "rgba(0,170,89,0.11)",
              color: "#00AA59",
              display: "inline-block",
              p: "5px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "5px",
            }}
          >
            {command.toUpperCase()}
          </Typography>
        </>
      );
    } else if (command == "delete") {
      return (
        <>
          <Typography
            sx={{
              background: "rgba(255,0,0,0.11)",
              color: "#FF0000",
              display: "inline-block",
              p: "5px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "5px",
            }}
          >
            {command.toUpperCase()}
          </Typography>
        </>
      );
    } else if (command == "read") {
      return (
        <>
          <Typography
            sx={{
              background: "rgba(0,0,255,0.11)",
              color: "#0000FF",
              display: "inline-block",
              p: "5px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "5px",
            }}
          >
            {command.toUpperCase()}
          </Typography>
        </>
      );
    } else if (command == "update") {
      return (
        <>
          <Typography
            sx={{
              background: "rgba(255,165,0,0.11)",
              color: "#FFA500",
              display: "inline-block",
              p: "5px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "5px",
            }}
          >
            {command.toUpperCase()}
          </Typography>
        </>
      );
    }
  };

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { border: 0, p: 1, pl: 4 } }}>
        <TableCell scope="row">
          {command(row.name.replace(/.*:/, ""))}
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
