import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, Box, Paper, Typography, Divider, Chip } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState, FC } from "react";
import { useAuth } from "../../hooks/use-auth";

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
  const [file, setFile] = useState<File>();

  const uploadFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("userId", user.id);
      formData.append("file", file);

      const uploadResp = await createDocument(formData, user.id);

      setFile(undefined);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
          Add Document
        </Typography>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Divider textAlign="left" sx={{ mb: 1 }}>
          <Chip label="File Details" sx={{ fontWeight: "600" }} />
        </Divider>

        <MuiFileInput
          size="small"
          name="file"
          variant="outlined"
          value={file}
          onChange={(e: any) => {
            setFile(e);
          }}
          helperText={!file ? "upload your file" : "uploaded"}
          sx={{ ml: 0, cursor: "pointer" }}
        />
        <Divider sx={{ m: 1 }}></Divider>
        <LoadingButton
          type="button"
          onClick={uploadFile}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              height: 40,
            },
          }}
          variant="contained"
        >
          submit
        </LoadingButton>
      </Box>
    </Paper>
  );
};

export default CreateDocument;
