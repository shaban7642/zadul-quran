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
import { desigApi } from "../../api/rolesApi";
import toast from "react-hot-toast";

const CreateSettings = () => {
  const [formValues, setFormValues] = useState("");
  const createSettings = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createSettings");
    try {
      const resp = await desigApi.createSettings(values);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("createSettingsSuccess");

        getSettings();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createSettingsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createSettingsFailed");
      return { success: false };
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success } = await createSettings(formValues);
    if (success) {
      setFormValues("");
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
          Add Settings
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
              <TableRow>
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
                        label="Settings"
                        margin="normal"
                        name="department"
                        type="text"
                        onChange={(e) => setFormValues(e.value)}
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
                  <LoadingButton
                    type="submit"
                    size="medium"
                    sx={{ mt: 1 }}
                    variant="contained"
                  >
                    submit
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

export default CreateSettings;
