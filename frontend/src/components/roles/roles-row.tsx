import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import NextLink from "next/link";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import WidgetsIcon from "@mui/icons-material/Widgets";

interface RowProps {
  row: any;
  labelId: string;
}
export const RolesRow: FC<RowProps> = (props) => {
  const { row, labelId } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: 0, cursor: "pointer" } }}>
        <TableCell
          scope="row"
          onClick={() => setOpen(!open)}
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
      <TableRow sx={{ border: 0 }}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
          colSpan={4}
        ></TableCell>
      </TableRow>
    </Fragment>
  );
};
