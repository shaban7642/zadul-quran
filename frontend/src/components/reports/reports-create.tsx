import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, Box, Paper, Typography } from "@mui/material";
import { FormEvent, useState, FC } from "react";

interface CreateReportProps {
  createReport: (values: any) => Promise<{ success: boolean }>;
}
const CreateReport: FC<CreateReportProps> = (props) => {
  const { createReport } = props;
  const [formValues, setFormValues] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValues);
    const { success } = await createReport(formValues);
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
      }}
    >
      <Box
        sx={{
          p: 1,
          alignItems: "center",
          ...(true && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.info.contrastText,
                theme.palette.action.activatedOpacity
              ),
          }),
          color: "primary.dark",
          display: "block",
          justifyContent: "space-between",
        }}
      >
        <Typography color="inherit" variant="h6">
          Add Report
        </Typography>
        <textarea
          value={formValues}
          onChange={(event) => setFormValues(event.target?.value)}
          style={{
            width: "95%",
            height: "50vh",
            borderStyle: "solid",
            borderColor: "#ffcccb",
            borderWidth: "1px",
            borderRadius: "5px",
            margin: ".5em .5em ",
            outlineColor: "#ffcccb",
            overflowX: "hidden",
            fontFamily: "cursive",
            fontWeight: "bold",
            textAlign: "justify",
            textJustify: "inter-word",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        />
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
      </Box>
    </Paper>
  );
};

export default CreateReport;