import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

interface RowProps {
  row: any;
  updateDesig: (id: number, values: any) => void;
  handleSelectOne: (name: number) => void;
  isItemSelected: boolean;
  labelId: string;
}
export const DesigRow: FC<RowProps> = (props) => {
  const { row, handleSelectOne, updateDesig, isItemSelected, labelId } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      title: row?.title,
    },
    onSubmit: (values) => {
      updateDesig(row.id, values);
      setOpen(false);
    },
  });
  useEffect(() => {
    if (row) {
      formik.setValues({
        title: row?.title,
      });
    }
  }, [row]);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: 0, cursor: "pointer" } }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            sx={{
              color: theme.palette.info.main,
            }}
            onClick={() => handleSelectOne(row.id)}
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell
          scope="row"
          onClick={() => setOpen(!open)}
          sx={{
            color: "black",
          }}
        >
          {row.title}
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
                  error={Boolean(formik.touched.title && formik.errors.title)}
                  label="title"
                  margin="normal"
                  id="title"
                  name="title"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.title}
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
