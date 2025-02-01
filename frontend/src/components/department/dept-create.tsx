import LoadingButton from "@mui/lab/LoadingButton";
import {
  alpha,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState, FC } from "react";
import toast from "react-hot-toast";

interface CreateDeptProps {
  createDept: (values: any) => Promise<{ success: boolean }>;
}
const CreateDept: FC<CreateDeptProps> = (props) => {
  const { createDept } = props;
  const [formValues, setFormValues] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValues !== '') {
      const { success } = await createDept(formValues);
      if (success) {
      setFormValues("");
    }
    }else {
      toast.error('Please enter a subject')
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
          Add Subjects
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
              <TableRow
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
                        label="Subject"
                        margin="normal"
                        name="subject"
                        type="text"
                        value={formValues}
                        error={formValues === ''}
                        helperText={formValues === '' ? 'Please enter a subject.':''}
                        onChange={(e) => setFormValues(e.target.value)}
                        sx={{ mr: 1, width: "100%" }}
                      />
                    </TableCell>
                  </Grid>
                </Grid>
              </TableRow>
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
                  <div style={{ textAlign: "right" }}>
                    <LoadingButton
                      type="submit"
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 40,
                        },
                        m: 0.5,
                        p: 1,
                      }}
                      variant="contained"
                    >
                      Save
                    </LoadingButton>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form>
      </Box>
    </Paper>
  );
};

export default CreateDept;
