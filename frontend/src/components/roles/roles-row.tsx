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
  updateRoles: (id: number, values: any) => void;

  labelId: string;
}
export const RolesRow: FC<RowProps> = (props) => {
  const { row, updateRoles, labelId } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      role: row?.role,
    },
    onSubmit: (values) => {
      updateRoles(row.id, values);
      setOpen(false);
    },
  });
  useEffect(() => {
    if (row) {
      formik.setValues({
        role: row?.role,
      });
    }
  }, [row]);

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
          {row.role}
        </TableCell>
        <TableCell scope="row" sx={{}}>
          <NextLink href={`/roles/${row.id}`} passHref>
            <Button startIcon={<WidgetsIcon />}>Permissions</Button>
          </NextLink>
        </TableCell>
      </TableRow>
      <TableRow sx={{ border: 0 }}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
          colSpan={4}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ margin: 0 }}
              >
                edit
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  size="small"
                  error={Boolean(formik.touched.role && formik.errors.role)}
                  label="role"
                  margin="normal"
                  id="role"
                  name="role"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.role}
                  sx={{ mr: 1 }}
                />
                <LoadingButton
                  type="submit"
                  size="medium"
                  sx={{ m: 1, mt: 2 }}
                  variant="contained"
                >
                  submit
                </LoadingButton>
              </form>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
