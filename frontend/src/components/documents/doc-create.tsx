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
  const uploadFile = async () => {
    try {
      setLoading(true);
      await createDocument({
        userId: 1,
        file,
        documentType: { name: "book", id: 1 },
      });

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
          variant="outlined"
          value={file}
          onChange={handleChange}
          helperText={!file ? "upload your file" : "uploaded"}
          sx={{ ml: 0, cursor: "pointer" }}
        />
        {file && (
          <LoadingButton
            sx={{
              ml: 2,
            }}
            size="large"
            variant="contained"
            loading={loading}
            type="submit"
            onClick={uploadFile}
          >
            Check
            <FindInPageOutlinedIcon sx={{ ml: 2 }} />
          </LoadingButton>
        )}
        {/* documentType */}

        <Divider sx={{ m: 1 }}></Divider>
        <LoadingButton
          type="submit"
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
