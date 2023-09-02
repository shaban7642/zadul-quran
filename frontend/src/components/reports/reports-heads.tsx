import { ChangeEvent, MouseEvent } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import type { FC } from "react";
import { Report } from "./reports-table";

interface ReportHeadsProps {
  headCells: readonly any[];

  rowCount: number;
}

export const ReportHeads: FC<ReportHeadsProps> = (props) => {
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
            sx={{
              color: (theme) => theme.palette.info.main,
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
