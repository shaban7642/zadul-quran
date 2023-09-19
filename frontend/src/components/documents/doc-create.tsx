import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, Box, Paper, Typography, Divider, Chip } from "@mui/material";

import { MuiFileInput } from "mui-file-input";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import { ChangeEvent, MouseEvent, FormEvent, useState, FC } from "react";

interface CreateDocumentProps {
  createDocument: (values: any) => Promise<{ success: boolean }>;
}
const CreateDocument: FC<CreateDocumentProps> = (props) => {
  const { createDocument } = props;
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const handleChange = (newFile: File) => {
    setFile(newFile);
    setLoading(false);
    console.log(file);
  };
  const uploadFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      setLoading(true);
      const data = new FormData();
      data.set("userId", "1");
      data.set("file", file);
      data.set("documentType", JSON.stringify({ name: "book", id: 1 }));

      await createDocument(data);

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
