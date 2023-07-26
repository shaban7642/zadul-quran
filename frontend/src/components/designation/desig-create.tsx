import { Delete } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  alpha,
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, MouseEvent, FormEvent, useState, FC } from "react";

interface CreateDesigProps {
  createDesigs: (values: any) => Promise<{ success: boolean }>;
}
const CreateDesig: FC<CreateDesigProps> = (props) => {
  const { createDesigs } = props;
  const [formValues, setFormValues] = useState([""]);
  let handleChange = (e: any, i: number, elements?: any) => {
    if (elements) {
      setFormValues(elements);
    } else {
      let newFormValues: string[] = [...formValues];
      newFormValues[i] = e.target.value;
      setFormValues(newFormValues);
    }
  };
  let addFormFields = () => {
    setFormValues([...formValues, ""]);
  };

  let removeFormFields = (e: any, i: number) => {
    const reset: any = [];
    formValues.forEach((element, idx) => {
      if (i !== idx) {
        reset.push(element);
      }
    });
    handleChange(e, i, reset);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success } = await createDesigs(formValues);
    if (success) {
      setFormValues([""]);
    }
  };
  return (
    <Paper
      elevation={9}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: "10px 10px",
        width: "100%",

        ...(true && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.info.contrastText,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "primary.light",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          Add Designations
        </Typography>
      </Box>
      <Box sx={{ margin: 1 }}>
        <form
          onSubmit={(e) => handleSubmit(e)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Table>
            <TableBody>
              {formValues?.map((s, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    p: 0,
                    height: "70px",
                  }}
                >
                  {" "}
                  <Grid container alignItems="center">
                    <Grid item lg={10}>
                      {" "}
                      <TableCell
                        sx={{
                          borderBottom: 0,
                          p: 0,
                          width: "40%",
                        }}
                      >
                        <TextField
                          size="small"
                          label={s}
                          margin="normal"
                          name="department"
                          type="text"
                          onChange={(e) => handleChange(e, idx)}
                          defaultValue={s}
                          sx={{ mr: 1, width: "100%" }}
                        />
                      </TableCell>
                    </Grid>
                    {idx === formValues.length - 1 && (
                      <Grid item lg={2}>
                        <IconButton
                          type="button"
                          onClick={(e) => removeFormFields(e, idx)}
                          sx={{ ml: 1, width: "100%" }}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    borderBottom: 0,
                    p: 0,
                    width: "90%",
                  }}
                >
                  <LoadingButton
                    type="submit"
                    size="medium"
                    sx={{ mt: 1, width: "95%" }}
                    variant="contained"
                  >
                    submit
                  </LoadingButton>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: 0,
                    p: 0,
                    width: "40%",
                  }}
                >
                  <LoadingButton
                    type="button"
                    onClick={addFormFields}
                    size="medium"
                    sx={{ mt: 1, width: "95%" }}
                    variant="contained"
                  >
                    add
                  </LoadingButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form>
      </Box>
    </Paper>
  );
};

export default CreateDesig;
