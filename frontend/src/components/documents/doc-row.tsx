import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { IconButton, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Delete } from "@mui/icons-material";
import useDownloader from "react-use-downloader";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface RowProps {
  row: any;
  updateDocument: (id: number, values: any) => Promise<{ success: boolean }>;
  deleteDocument: (id: number) => Promise<{ success: boolean }>;
  labelId: string;
}
export const DocumentRow: FC<RowProps> = (props) => {
  const { row, updateDocument, deleteDocument, labelId } = props;
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      fileName: row?.fileName,
    },
    onSubmit: (values) => {
      updateDocument(row.id, values);
      setOpen(false);
    },
  });
  useEffect(() => {
    if (row) {
      formik.setValues({
        fileName: row?.fileName,
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
          {row.fileName}
        </TableCell>
        <TableCell>
          <IconButton
            onClick={() => deleteDocument(row.id)}
            sx={{ p: 0, ml: 1, mb: 1.5 }}
          >
            <Delete color="error" />
          </IconButton>
          <IconButton
            onClick={() =>
              download(
                `https://login-api.zadulquran.com/${row.fileStoragePath}`,
                row.fileName
              )
            }
            sx={{ p: 0, ml: 1, mb: 1.5 }}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
          {/* <p>Size:{size}</p>
          <label htmlFor="file">progress:</label>
          <progress id="file" value={percentage} max="100" /> */}
          {error && <p>possible error {JSON.stringify(error)}</p>}
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
                  sx={{
                    width: { xs: "50%" },
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                    mr: 1,
                  }}
                  error={Boolean(
                    formik.touched.fileName && formik.errors.fileName
                  )}
                  // @ts-ignore
                  helperText={formik.touched.fileName && formik.errors.fileName}
                  label="file name"
                  margin="normal"
                  id="fileName"
                  name="fileName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.fileName}
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
