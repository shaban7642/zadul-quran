import { FC, Fragment, useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import {
  Button,
  FormControlLabel,
  TextField,
  ToggleButton,
} from "@mui/material";
import RemoveModeratorOutlinedIcon from "@mui/icons-material/RemoveModeratorOutlined";
import RemoveModeratorIcon from "@mui/icons-material/RemoveModerator";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
interface RowProps {
  row: any;
  labelId: string;
  checked: boolean;
  sentPermissions: (checked: boolean, id: number) => void;
}
export const PermissionsRow: FC<RowProps> = (props) => {
  const { row, labelId, checked, sentPermissions } = props;
  const [selected, setSelected] = useState(checked);
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number
  ) => {
    event.preventDefault();
    sentPermissions(selected, value);
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
            value={row.id}
            selected={selected}
            onChange={handleChange}
          >
            {selected ? <AddModeratorIcon /> : <AddModeratorOutlinedIcon />}
          </ToggleButton>
        </TableCell>
      </TableRow>
      <TableRow sx={{ border: 0 }}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
          colSpan={4}
        ></TableCell>
      </TableRow>
    </Fragment>
  );
};
