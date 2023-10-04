import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { IconButton, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Delete } from "@mui/icons-material";

interface RowProps {
  row: any;
  updateDept: (id: number, values: any) => void;
  deleteDept: (id: number) => void;
  labelId: string;
}
export const DeptRow: FC<RowProps> = (props) => {
  const { row, updateDept, deleteDept, labelId } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      name: row?.name,
    },
    onSubmit: (values) => {
      updateDept(row.id, values);
      setOpen(false);
    },
  });
  useEffect(() => {
    if (row) {
      formik.setValues({
        name: row?.name,
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
          {row.name}
        </TableCell>
        <TableCell>
          <IconButton
            onClick={() => deleteDept(row.id)}
            sx={{ p: 0, ml: 1, mb: 1.5 }}
          >
            <Delete color="error" />
          </IconButton>
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
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  label="name"
                  margin="normal"
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
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
