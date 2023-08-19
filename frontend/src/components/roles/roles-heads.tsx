import { ChangeEvent, MouseEvent } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { FC } from "react";

interface RolesHeadsProps {
  headCells: readonly any[];
  rowCount: number;
}

export const RolesHeads: FC<RolesHeadsProps> = (props) => {
  const {
    headCells,

    rowCount,
  } = props;

  const theme = useTheme();

  return (
    <TableHead
      sx={{
        width: "100%",
        mb: 2,
        ...(true && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.info.contrastText,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sx={{ color: (theme) => theme.palette.info.main }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
