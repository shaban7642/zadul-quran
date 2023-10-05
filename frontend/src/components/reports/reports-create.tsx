import LoadingButton from "@mui/lab/LoadingButton";
import {
  alpha,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { FormEvent, useState, FC } from "react";
import { useAuth } from "../../hooks/use-auth";
import toast from "react-hot-toast";
import { reportApi } from "../../api/reportApi";
import { documentApi } from "../../api/documentApi";
import { MuiFileInput } from "mui-file-input";

interface CreateReportProps {
  sessionId: number;
}

const CreateReport: FC<CreateReportProps> = (props) => {
  const { sessionId } = props;
  const [formValues, setFormValues] = useState("");
  const [document, setDocument] = useState(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();

  const createReport = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createReports");
    try {
      if (document !== 0) {
        await reportApi.createReport(sessionId, user?.id, values);
      } else {
        await reportApi.createReport(sessionId, user?.id, values, document);
      }

      toast.dismiss(load);
      toast.success("createReports ");

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createReportsFailed");
      return { success: false };
    }
  };
  const createDocument = async (
    values: any,
    userId: number
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("createDocuments");
    try {
      const doc = await documentApi.createDocument(values, userId);
      setDocument(doc.id);
      toast.dismiss(load);
      toast.success("createDocuments ");

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createDocumentsFailed");
      return { success: false };
    }
  };
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formValues);
    const { success } = await createReport(formValues);
    if (success) {
      setFormValues("");
    }
  };
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: "10px 10px",
          width: "%",

          ...(true && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.info.contrastText,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {" "}
        <Grid container>
          <Grid item lg={3.8} md={3.8} sm={3.8} xs={12}>
            <Box
              sx={{
                alignItems: "center",
                color: "primary.dark",
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
                <Chip label="Upload your report" sx={{ fontWeight: "600" }} />
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
                Upload
              </LoadingButton>
            </Box>
          </Grid>
          <Grid item lg={0.4} md={0.4} sm={0.4} xs={0}>
            <Box></Box>
          </Grid>
          <Grid item lg={7.8} md={7.8} sm={7.8} xs={12}>
            <Box
              sx={{
                alignItems: "center",
                color: "primary.dark",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: 2,
              }}
            >
              <Typography color="inherit" variant="h6">
                Add details
              </Typography>
            </Box>
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
              <textarea
                placeholder="Type all details here"
                value={formValues}
                onChange={(event) => setFormValues(event.target?.value)}
                style={{
                  width: "100%",
                  height: "40vh",
                  borderStyle: "solid",
                  borderColor: "#ffcccb",
                  borderWidth: "1px",
                  borderRadius: "5px",
                  margin: 1,
                  marginLeft: 0,
                  padding: "10px",
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
                  type="button"
                  onClick={handleSubmit}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                    m: 0.5,
                    p: 1,
                  }}
                  variant="contained"
                >
                  Submit report
                </LoadingButton>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreateReport;
