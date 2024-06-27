import LoadingButton from "@mui/lab/LoadingButton";
import {
  alpha,
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { useState, FC, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/use-auth";
import toast from "react-hot-toast";
import { reportApi } from "../../api/reportApi";
import { documentApi } from "../../api/documentApi";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { Document } from "../documents/doc-table";
import { useMounted } from "../../hooks/use-mounted";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CreateReportProps {
  sessionDeptName: string;
  sessionId: number;
  updateSession: (id: any, userData: any) => Promise<{ success: boolean }>;
  handleCloseCreateReport: (id: number) => void;
  setReoprtFlag: any;
  reportFlag: boolean;
}

const CreateReport: FC<CreateReportProps> = (props) => {
  const {
    sessionDeptName,
    sessionId,
    updateSession,
    handleCloseCreateReport,
    setReoprtFlag,
    reportFlag,
  } = props;
  const [documents, setDocuments] = useState<Document[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const levels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const isMounted = useMounted();

  const getDocuments = useCallback(
    async (rowsPerPage: number, page: number) => {
      try {
        const data: any = await documentApi.getDocuments(
          rowsPerPage,
          page,
          "books"
        );
        if (isMounted()) {
          setDocuments(data.rows);
        }
      } catch (err: any) {
        toast.error(err.message || "failed");
      }
    },
    [isMounted]
  );

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      documentId: null,
      sessionId: sessionId,
      // Islamic studies
      notes: "",
      homework: "",
      bookId: documents[0]?.id,
      unit: "",
      topic: "",
      level: "",
      // Arabic
      newWords: "",
      expressions: "",
      rules: "",
      // Quran
      memorization: "",
      revision: "",
      tajweed: "",
      recitation: "",
      reading: "",
      memorizationLevel: "",
      revisionLevel: "",
      readingLevel: "",
    },

    onSubmit: async (values: any) => {
      try {
        console.log(values);
        const { success } = await createReport(values);
        if (success) {
          formik.resetForm();
          handleCloseCreateReport(sessionId);
          updateSession(sessionId, {
            status: "done",
            endedAt: new Date(Date.now()),
          });
          setReoprtFlag(!reportFlag);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const createReport = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createReports");

    try {
      await reportApi.createReport(values);

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
    try {
      const doc = await documentApi.createDocument(
        { name: "reports", id: 2 },
        values,
        userId
      );

      formik.setFieldValue("documentId", doc.data.id);

      return { success: true };
    } catch (err: any) {
      return { success: false };
    }
  };
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

  useEffect(
    () => {
      getDocuments(1000, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#CAF0F8",
      }}
    >
      <Paper
        elevation={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: "20px 20px",
          width: "95%",

          bgcolor: "#CAF0F8",
        }}
      >
        {" "}
        <Grid container>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Divider textAlign="left" sx={{ mb: 1 }}>
                <Chip label="Feedback Report" sx={{ fontWeight: "600" }} />
              </Divider>

              {sessionDeptName != "Quran" && (
                <>
                  {/* level */}
                  <FormControl
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                      marginTop: 2,
                      mb: 1,
                    }}
                    variant="outlined"
                  >
                    {" "}
                    <InputLabel
                      sx={{
                        top: -6,
                      }}
                      id="outlined-level"
                    >
                      Grade
                    </InputLabel>
                    <Select
                      name="level"
                      id="outlined-level"
                      labelId="outlined-level"
                      value={formik.values.level}
                      onChange={(event) => {
                        formik.setFieldValue("level", event.target.value);
                      }}
                    >
                      {levels.map((level) => (
                        <MenuItem
                          sx={{
                            color: "black",
                            ...(true && {
                              bgcolor: (theme) =>
                                alpha(
                                  theme.palette.info.contrastText,
                                  theme.palette.action.activatedOpacity
                                ),
                            }),
                            fontFamily: "sans-serif",
                          }}
                          key={level}
                          value={level}
                        >
                          {level} / 10
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Book */}
                  <FormControl
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                      marginTop: 2,
                      mb: 1,
                    }}
                    variant="outlined"
                  >
                    {" "}
                    <InputLabel
                      sx={{
                        top: -6,
                      }}
                      id="outlined-adornment-bookId"
                    >
                      Book
                    </InputLabel>
                    <Select
                      name="bookId"
                      id="outlined-adornment-bookId"
                      labelId="outlined-adornment-bookId"
                      value={formik.values.bookId}
                      onChange={(event) => {
                        formik.setFieldValue("bookId", event.target.value);
                        console.log(event.target.value);
                      }}
                    >
                      {documents?.map((book) => (
                        <MenuItem
                          sx={{
                            color: "black",
                            ...(true && {
                              bgcolor: (theme) =>
                                alpha(
                                  theme.palette.info.contrastText,
                                  theme.palette.action.activatedOpacity
                                ),
                            }),
                            fontFamily: "sans-serif",
                          }}
                          key={book?.id}
                          value={book?.id}
                        >
                          {book?.fileName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* unit */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(formik.touched.unit && formik.errors.unit)}
                    // @ts-ignore
                    helperText={formik.touched.unit && formik.errors.unit}
                    label="Unit"
                    margin="normal"
                    id="unit"
                    name="unit"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.unit}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* topic */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(formik.touched.topic && formik.errors.topic)}
                    // @ts-ignore
                    helperText={formik.touched.topic && formik.errors.topic}
                    label="Topic"
                    margin="normal"
                    id="topic"
                    name="topic"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.topic}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                </>
              )}
              {sessionDeptName === "Arabic" && (
                <>
                  {" "}
                  {/* new words */}
                  <TextField
                    multiline
                    minRows={3}
                    size="medium"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 100,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.newWords && formik.errors.newWords
                    )}
                    // @ts-ignore
                    helperText={
                      formik.touched.newWords && formik.errors.newWords
                    }
                    label="New Words"
                    margin="normal"
                    id="newWords"
                    name="newWords"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.newWords}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* Expressions */}
                  <TextField
                    multiline
                    minRows={3}
                    size="medium"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 100,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.expressions && formik.errors.expressions
                    )}
                    // @ts-ignore
                    helperText={
                      formik.touched.expressions && formik.errors.expressions
                    }
                    label="Expressions"
                    margin="normal"
                    id="expressions"
                    name="expressions"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.expressions}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* rules */}
                  <TextField
                    multiline
                    minRows={3}
                    size="medium"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 100,
                      },
                      mr: 1,
                    }}
                    error={Boolean(formik.touched.rules && formik.errors.rules)}
                    // @ts-ignore
                    helperText={formik.touched.rules && formik.errors.rules}
                    label="Rules"
                    margin="normal"
                    id="rules"
                    name="rules"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.rules}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                </>
              )}

              {sessionDeptName === "Quran" && (
                <>
                  {/* memorization */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.memorization && formik.errors.memorization
                    )}
                    // @ts-ignore
                    helperText={
                      formik.touched.memorization && formik.errors.memorization
                    }
                    label="Memorization"
                    margin="normal"
                    id="memorization"
                    name="memorization"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.memorization}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* revision */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.revision && formik.errors.revision
                    )}
                    // @ts-ignore
                    helperText={
                      formik.touched.revision && formik.errors.revision
                    }
                    label="Revision"
                    margin="normal"
                    id="revision"
                    name="revision"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.revision}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* tajweed */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.tajweed && formik.errors.tajweed
                    )}
                    // @ts-ignore
                    helperText={formik.touched.tajweed && formik.errors.tajweed}
                    label="Tajweed"
                    margin="normal"
                    id="tajweed"
                    name="tajweed"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.tajweed}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* recitation */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.recitation && formik.errors.recitation
                    )}
                    // @ts-ignore
                    helperText={
                      formik.touched.recitation && formik.errors.recitation
                    }
                    label="Recitation"
                    margin="normal"
                    id="recitation"
                    name="recitation"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.recitation}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* reading */}
                  <TextField
                    size="small"
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                    }}
                    error={Boolean(
                      formik.touched.reading && formik.errors.reading
                    )}
                    // @ts-ignore
                    helperText={formik.touched.reading && formik.errors.reading}
                    label="Reading"
                    margin="normal"
                    id="reading"
                    name="reading"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.reading}
                    InputProps={{
                      style: {
                        fontFamily: "sans-serif",
                        color: "black",
                      },
                    }}
                  />
                  {/* memorizationLevel */}
                  <FormControl
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                      marginTop: 2,
                      mb: 1,
                    }}
                    variant="outlined"
                  >
                    {" "}
                    <InputLabel
                      sx={{
                        top: -6,
                      }}
                      id="outlined-memorizationLevel"
                    >
                      Memorization Grade
                    </InputLabel>
                    <Select
                      name="memorizationLevel"
                      id="outlined-memorizationLevel"
                      labelId="outlined-memorizationLevel"
                      value={formik.values.memorizationLevel}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "memorizationLevel",
                          event.target.value
                        );
                      }}
                    >
                      {levels.map((level) => (
                        <MenuItem
                          sx={{
                            color: "black",
                            ...(true && {
                              bgcolor: (theme) =>
                                alpha(
                                  theme.palette.info.contrastText,
                                  theme.palette.action.activatedOpacity
                                ),
                            }),
                            fontFamily: "sans-serif",
                          }}
                          key={level}
                          value={level}
                        >
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* revisionLevel */}
                  <FormControl
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                      marginTop: 2,
                      mb: 1,
                    }}
                    variant="outlined"
                  >
                    {" "}
                    <InputLabel
                      sx={{
                        top: -6,
                      }}
                      id="outlined-revisionLevel"
                    >
                      Revision Grade
                    </InputLabel>
                    <Select
                      name="revisionLevel"
                      id="outlined-revisionLevel"
                      labelId="outlined-revisionLevel"
                      value={formik.values.revisionLevel}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "revisionLevel",
                          event.target.value
                        );
                      }}
                    >
                      {levels.map((level) => (
                        <MenuItem
                          sx={{
                            color: "black",
                            ...(true && {
                              bgcolor: (theme) =>
                                alpha(
                                  theme.palette.info.contrastText,
                                  theme.palette.action.activatedOpacity
                                ),
                            }),
                            fontFamily: "sans-serif",
                          }}
                          key={level}
                          value={level}
                        >
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* readingLevel */}
                  <FormControl
                    sx={{
                      width: { xs: "100%" },
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      mr: 1,
                      marginTop: 2,
                      mb: 1,
                    }}
                    variant="outlined"
                  >
                    {" "}
                    <InputLabel
                      sx={{
                        top: -6,
                      }}
                      id="outlined-readingLevel"
                    >
                      Reading Grade
                    </InputLabel>
                    <Select
                      name="readingLevel"
                      id="outlined-readingLevel"
                      labelId="outlined-readingLevel"
                      value={formik.values.readingLevel}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "readingLevel",
                          event.target.value
                        );
                      }}
                    >
                      {levels.map((level) => (
                        <MenuItem
                          sx={{
                            color: "black",
                            ...(true && {
                              bgcolor: (theme) =>
                                alpha(
                                  theme.palette.info.contrastText,
                                  theme.palette.action.activatedOpacity
                                ),
                            }),
                            fontFamily: "sans-serif",
                          }}
                          key={level}
                          value={level}
                        >
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {/* HW */}
              <TextField
                multiline
                minRows={3}
                size="medium"
                sx={{
                  width: { xs: "100%" },
                  "& .MuiInputBase-root": {
                    height: 100,
                  },
                  mr: 1,
                }}
                error={Boolean(
                  formik.touched.homework && formik.errors.homework
                )}
                // @ts-ignore
                helperText={formik.touched.homework && formik.errors.homework}
                label="H.W"
                margin="normal"
                id="homework"
                name="homework"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.homework}
                InputProps={{
                  style: {
                    fontFamily: "sans-serif",
                    color: "black",
                  },
                }}
              />

              {/* notes */}
              <TextField
                multiline
                minRows={2}
                size="medium"
                sx={{
                  width: { xs: "100%" },
                  "& .MuiInputBase-root": {
                    height: 80,
                  },
                  mr: 1,
                }}
                error={Boolean(formik.touched.notes && formik.errors.notes)}
                // @ts-ignore
                helperText={formik.touched.notes && formik.errors.notes}
                label="Notes"
                margin="normal"
                id="notes"
                name="notes"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.notes}
                InputProps={{
                  style: {
                    fontFamily: "sans-serif",
                    color: "black",
                  },
                }}
              />

              <div style={{ textAlign: "center" }}>
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
                {formik.values.documentId && (
                  <CheckCircleIcon
                    color="success"
                    sx={{ position: "relative", top: 10, ml: 1 }}
                  />
                )}
              </div>

              <Divider sx={{ mb: 1, mt: 2 }} />
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
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Grid>
        </Grid>{" "}
      </Paper>
    </Box>
  );
};

export default CreateReport;
