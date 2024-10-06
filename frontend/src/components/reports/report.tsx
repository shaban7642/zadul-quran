import { FC } from "react";
import { useState } from "react";
import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import useDownloader from "react-use-downloader";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { convertTo12HourFormat } from "../../utils/convertTo12HourFormat";

interface reportProps {
  session: any;
  handleCloseReport: () => void;
}
export const Report: FC<reportProps> = (props) => {
  const { session, handleCloseReport } = props;
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();

  return (
    <Paper
      elevation={12}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "20px 25px",
        minHeight: "fit-content",
        m: 1,
        bgcolor: "#CAF0F8",
      }}
    >
      <Typography color="inherit" variant="h6">
        Session information
      </Typography>
      <Divider textAlign="left" sx={{ m: 1 }}>
        <Chip label="Primary Details" sx={{ fontWeight: "600" }} />
      </Divider>
      <Grid container component={List}>
        <Grid item xs={12} sm={6}>
          <ListItem>
            Teacher:{" "}
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {`${session?.patch?.teacher?.firstName} ${session?.patch?.teacher?.lastName}` ||
                "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Subject:{" "}
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {session?.patch?.department?.name || "No data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Date:
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {" "}
              {moment(session?.date).format("YYYY-MM-DD") || "no data"}
            </Typography>{" "}
          </ListItem>{" "}
          <ListItem>
            Start Time:
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {" "}
              {session?.startTime
                ? `${moment(
                    `${session?.date.substr(0, 11)}${
                      session.startTime
                    }${session.date.substr(19, 24)}`
                  ).format("hh:mm A")}`
                : "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Started At:
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {" "}
              {moment(session?.startedAt).format("YYYY-MM-DD hh:mm A") ||
                "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Joined At:
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {" "}
              {moment(session?.joinedAt).format("YYYY-MM-DD hh:mm A") ||
                "no data"}
            </Typography>{" "}
          </ListItem>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ListItem>
            Student:{" "}
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "120px",
              }}
            >
              {`${session?.patch?.student?.firstName} ${session?.patch?.student?.lastName}` ||
                "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Session Type:{" "}
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {session?.sessionType?.name || "No data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Status:{" "}
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {session?.status || "no data"}
            </Typography>
          </ListItem>
          <ListItem>
            End Time:
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {" "}
              {session?.endTime
                ? moment(
                    `${session?.date.substr(0, 11)}${
                      session.endTime
                    }${session.date.substr(19, 24)}`
                  ).format("hh:mm A")
                : "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Ended At:
            <Typography
              color={"black"}
              sx={{
                overflowWrap: "break-word",
                minWidth: "100px",
              }}
            >
              {" "}
              {moment(session?.endedAt).format("YYYY-MM-DD hh:mm A") ||
                "no data"}
            </Typography>{" "}
          </ListItem>
        </Grid>
      </Grid>

      {session?.report && (
        <>
          <Divider textAlign="left" sx={{ m: 1 }}>
            <Chip label="Feedback " sx={{ fontWeight: "600" }} />
          </Divider>
          <Grid container component={List}>
            <Grid item xs={12}>
              {" "}
              <Grid container component={List} sx={{ p: 0 }}>
                <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                  {" "}
                  {session?.report.date && (
                    <ListItem>
                      Submition Date:
                      <Typography
                        color={"black"}
                        sx={{
                          overflowWrap: "break-word",
                          minWidth: "100px",
                        }}
                      >
                        {" "}
                        {moment(session?.report.date || "No data").format(
                          "MMM-D-YYYY"
                        )}
                      </Typography>{" "}
                    </ListItem>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                  {" "}
                  {session?.report.document[0] &&
                    session?.report.document.map((d: any, index: number) => (
                      <ListItem key={index}>
                        File:{index + 1}
                        <IconButton
                          onClick={() =>
                            download(
                              `https://login-api.zadulquran.com/${d.fileStoragePath}`,
                              d.fileName
                            )
                          }
                          sx={{
                            p: 0.5,
                            ml: 1,
                            color: "black",
                            border: "1px solid black",
                            fontSize: "16px",
                          }}
                        >
                          {"Download "}{" "}
                          <FileDownloadOutlinedIcon fontSize="medium" />
                        </IconButton>
                        {/* <label htmlFor="file">progress:</label>
                      <progress id="file" value={percentage} max="100" /> */}
                        {error && (
                          <p style={{ color: "red" }}>
                            possible error {JSON.stringify(error)}
                          </p>
                        )}
                      </ListItem>
                    ))}
                </Grid>
              </Grid>
              {session.patch?.department?.name != "Quran" && (
                <Grid container component={List}>
                  <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                    {session?.report.level && (
                      <ListItem>
                        Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {`${session?.report.level} / 10` || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.book && (
                      <ListItem>
                        Book:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.book?.fileName || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                    {session?.report.unit && (
                      <ListItem>
                        Unit:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.unit || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.topic && (
                      <ListItem>
                        Topic:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.topic || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>{" "}
                </Grid>
              )}
              {session.patch?.department?.name == "Arabic" && (
                <>
                  {session?.report.newWords && (
                    <ListItem>
                      New Words:{" "}
                      <Typography
                        color={"black"}
                        sx={{
                          overflowWrap: "break-word",
                          minWidth: "100px",
                        }}
                      >
                        {session?.report.newWords || "No data"}
                      </Typography>{" "}
                    </ListItem>
                  )}

                  {session?.report.expressions && (
                    <ListItem>
                      Expressions:{" "}
                      <Typography
                        color={"black"}
                        sx={{
                          overflowWrap: "break-word",
                          minWidth: "100px",
                        }}
                      >
                        {session?.report.expressions || "No data"}
                      </Typography>{" "}
                    </ListItem>
                  )}
                  {session?.report.rules && (
                    <ListItem>
                      Rules:{" "}
                      <Typography
                        color={"black"}
                        sx={{
                          overflowWrap: "break-word",
                          minWidth: "100px",
                        }}
                      >
                        {session?.report.rules || "No data"}
                      </Typography>{" "}
                    </ListItem>
                  )}
                </>
              )}
              {session.patch?.department?.name == "Quran" && (
                <Grid container component={List}>
                  <Grid item xs={12} sm={6}>
                    {" "}
                    {session?.report.memorization && (
                      <ListItem>
                        Memorization:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.memorization || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.revision && (
                      <ListItem>
                        Revision:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.revision || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.recitation && (
                      <ListItem>
                        Recitation:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.recitation || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.reading && (
                      <ListItem>
                        Reading:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.reading || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {session?.report.memorizationLevel && (
                      <ListItem>
                        Memorization Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {`${session?.report.memorizationLevel}  / 10` ||
                            "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.revisionLevel && (
                      <ListItem>
                        Revision Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {`${session?.report.revisionLevel}  / 10` ||
                            "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.tajweed && (
                      <ListItem>
                        Tajweed:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {session?.report.tajweed || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.report.readingLevel && (
                      <ListItem>
                        Reading Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{
                            overflowWrap: "break-word",
                            minWidth: "100px",
                          }}
                        >
                          {`${session?.report?.readingLevel}  / 10` ||
                            "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
            {session?.report?.homework && (
              <ListItem>
                H.W:
                <Typography
                  color={"black"}
                  sx={{
                    overflowWrap: "break-word",
                    minWidth: "100px",
                  }}
                >
                  {session?.report?.homework || "No data"}
                </Typography>{" "}
              </ListItem>
            )}
            {session?.report?.notes && (
              <ListItem>
                Notes:{" "}
                <Typography
                  color={"black"}
                  sx={{
                    overflowWrap: "break-word",
                    minWidth: "100px",
                  }}
                >
                  {session?.report?.notes || "No data"}
                </Typography>{" "}
              </ListItem>
            )}
          </Grid>
        </>
      )}
    </Paper>
  );
};
