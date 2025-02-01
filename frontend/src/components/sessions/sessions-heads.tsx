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
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface TableHeadsProps {
    headCells: readonly any[];
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteSession: () => Promise<{ success: boolean }>;
    rowCount: number;
}

export const TableHeads: FC<TableHeadsProps> = (props) => {
    const {
        headCells,
        numSelected,
        onSelectAllClick,
        deleteSession,
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
                <TableCell className="no-print">
                    <Typography color="error" sx={{ fontWeight: "bold" }}>
                        {numSelected > 0 && ` ${numSelected} selected`}
                    </Typography>
                </TableCell>
                <TableCell padding="checkbox" className="no-print">
                    {numSelected > 0 && (
                        <IconButton onClick={() => deleteSession()}>
                            <Delete color="error" fontSize="medium" />
                        </IconButton>
                    )}
                </TableCell>
                <TableCell padding="checkbox" className="no-print">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                    />
                </TableCell>
            </TableRow>
        </TableHead>
    );
};
