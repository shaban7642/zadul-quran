import { FC, Fragment, useEffect, useState } from "react";
import NextLink from "next/link";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button, TextField } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";

interface RowProps {
  row: any;
  labelId: string;
}
export const RolesRow: FC<RowProps> = (props) => {
  const { row, labelId } = props;

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: 0 } }}>
        <TableCell
          scope="row"
          sx={{
            color: "black",
          }}
        >
          {row.displayName}
        </TableCell>
        <TableCell scope="row" sx={{}}>
          <NextLink
            href={`/roles/${row.id}?role=${row.displayName}&name=${row.name}`}
            passHref
          >
            <Button startIcon={<WidgetsIcon />}>Permissions</Button>
          </NextLink>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
