import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, Box, Paper, Typography, Divider, Chip } from "@mui/material";
import { useState, FC } from "react";
import { useAuth } from "../../hooks/use-auth";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface CreateDocumentProps {
  createDocument: (
    values: any,
    userId: number
  ) => Promise<{ success: boolean }>;
}
const CreateDocument: FC<CreateDocumentProps> = (props) => {
  const { createDocument } = props;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const uploadFile = async (e: any) => {
    e.preventDefault();

    try {
      console.log("file", e.target.files[0]);
      setLoading(true);
      let formData = new FormData();
      formData.append("userId", user.id);
      formData.append("file", e.target.files[0]);

      const uploadResp = await createDocument(formData, user.id);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
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
          Add Document
        </Typography>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            onChange={(e: any) => {
              uploadFile(e);
            }}
          />
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateDocument;
