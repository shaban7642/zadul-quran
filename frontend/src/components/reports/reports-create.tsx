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
          Add Report
        </Typography>
        <textarea
          value={formValues}
          onChange={(event) => setFormValues(event.target?.value)}
          style={{
            width: "50vw",
            height: "4vh",
            resize: "none",
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: ".7em ",
            borderRadius: ".8rem",
            paddingLeft: ".5em",
            margin: ".5em .5em ",
            outlineColor: "#ffcccb",
            outlineWidth: ".5em",
            overflowX: "hidden",
            overflowY: "scroll",
            backgroundSize: "cover",
            boxShadow: `inset -1px -1px ${alpha(
              "#fff",
              0
            )}, inset  1px   1px ${alpha("rgba(0, 0, 0,.2)", 0)}`,
            fontSize: "xx-large",
            fontFamily: "cursive",
            fontWeight: "bold",
            textAlign: "justify",
            textJustify: "inter-word",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        />
      </Box>
    </Paper>
  );
};

export default CreateReport;
