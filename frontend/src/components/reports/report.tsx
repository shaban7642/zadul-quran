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
import { convertTo12HourFormat } from "../sessions/sessions-row";

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
        minHeight: "280px",
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
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {`${session?.patch?.teacher?.firstName} ${session?.patch?.teacher?.lastName}` ||
                "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Subject:{" "}
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {session?.patch?.department?.name || "No data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Date:
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {" "}
              {session?.date?.substr(0, 10) || "no data"}
            </Typography>{" "}
          </ListItem>{" "}
          <ListItem>
            Start Time:
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {" "}
              {session?.startTime
                ? convertTo12HourFormat(session?.startTime)
                : "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Started At:
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {" "}
              {`${session?.startedAt?.substr(0, 10) || "no"} ${
                session?.startedAt
                  ? convertTo12HourFormat(session.startedAt.substr(11, 8))
                  : "data"
              }` || "no data"}
            </Typography>{" "}
          </ListItem>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ListItem>
            Student:{" "}
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "120px" }}
            >
              {`${session?.patch?.student?.firstName} ${session?.patch?.student?.lastName}` ||
                "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Session Type:{" "}
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {session?.sessionType?.name || "No data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Status:{" "}
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {session?.status || "no data"}
            </Typography>
          </ListItem>
          <ListItem>
            End Time:
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {" "}
              {session?.endTime
                ? convertTo12HourFormat(session?.endTime)
                : "no data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Ended At:
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {" "}
              {`${session?.endedAt?.substr(0, 10) || "no"} ${
                session?.endedAt
                  ? convertTo12HourFormat(session.endedAt.substr(11, 8))
                  : "data"
              }` || "no data"}
            </Typography>{" "}
          </ListItem>
        </Grid>
      </Grid>

      {session?.reports[0] && (
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
                  {session?.reports[0].date && (
                    <ListItem>
                      Submition Date:
                      <Typography
                        color={"black"}
                        sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                      >
                        {" "}
                        {moment(session?.reports[0].date || "No data").format(
                          "MMM-D-YYYY"
                        )}
                      </Typography>{" "}
                    </ListItem>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                  {" "}
                  {session?.reports[0].document && (
                    <ListItem>
                      File:{" "}
                      <IconButton
                        onClick={() =>
                          download(
                            `http://localhost:4000/${session?.reports[0].document?.fileStoragePath}`,
                            session?.reports[0].document?.fileName
                          )
                        }
                        sx={{
                          p: 0.5,
                          ml: 0.5,
                          color: "black",
                          border: "1px solid black",
                          fontSize: "16px",
                        }}
                      >
                        {"Download "}{" "}
                        <FileDownloadOutlinedIcon fontSize="medium" />
                      </IconButton>
                      {/* <p>Size:{size}</p>
          <label htmlFor="file">progress:</label>
          <progress id="file" value={percentage} max="100" /> */}
                      {error && (
                        <p style={{ color: "red" }}>
                          possible error {JSON.stringify(error)}
                        </p>
                      )}
                    </ListItem>
                  )}
                </Grid>
              </Grid>
              {session.patch?.department?.name != "Quran" && (
                <Grid container component={List}>
                  <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                    {session?.reports[0].level && (
                      <ListItem>
                        Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].level || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].book && (
                      <ListItem>
                        Book:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].book?.fileName || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: 0 }}>
                    {session?.reports[0].unit && (
                      <ListItem>
                        Unit:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].unit || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].topic && (
                      <ListItem>
                        Topic:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].topic || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>{" "}
                </Grid>
              )}
              {session.patch?.department?.name == "Arabic" && (
                <>
                  {session?.reports[0].newWords && (
                    <ListItem>
                      New Words:{" "}
                      <Typography
                        color={"black"}
                        sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                      >
                        {session?.reports[0].newWords || "No data"}
                      </Typography>{" "}
                    </ListItem>
                  )}

                  {session?.reports[0].expressions && (
                    <ListItem>
                      Expressions:{" "}
                      <Typography
                        color={"black"}
                        sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                      >
                        {session?.reports[0].expressions || "No data"}
                      </Typography>{" "}
                    </ListItem>
                  )}
                  {session?.reports[0].rules && (
                    <ListItem>
                      Rules:{" "}
                      <Typography
                        color={"black"}
                        sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                      >
                        {session?.reports[0].rules || "No data"}
                      </Typography>{" "}
                    </ListItem>
                  )}
                </>
              )}
              {session.patch?.department?.name == "Quran" && (
                <Grid container component={List}>
                  <Grid item xs={12} sm={6}>
                    {" "}
                    {session?.reports[0].memorization && (
                      <ListItem>
                        Memorization:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].memorization || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].revision && (
                      <ListItem>
                        Revision:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].revision || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].recitation && (
                      <ListItem>
                        Recitation:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].recitation || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].reading && (
                      <ListItem>
                        Reading:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].reading || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {session?.reports[0].memorizationLevel && (
                      <ListItem>
                        Memorization Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].memorizationLevel || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].revisionLevel && (
                      <ListItem>
                        Revision Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].revisionLevel || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].tajweed && (
                      <ListItem>
                        Tajweed:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0].tajweed || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                    {session?.reports[0].readingLevel && (
                      <ListItem>
                        Reading Grade:{" "}
                        <Typography
                          color={"black"}
                          sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                        >
                          {session?.reports[0]?.readingLevel || "No data"}
                        </Typography>{" "}
                      </ListItem>
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
            {session?.reports[0]?.homework && (
              <ListItem>
                H.W:
                <Typography
                  color={"black"}
                  sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                >
                  {session?.reports[0]?.homework || "No data"}
                </Typography>{" "}
              </ListItem>
            )}
            {session?.reports[0]?.notes && (
              <ListItem>
                Notes:{" "}
                <Typography
                  color={"black"}
                  sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                >
                  {session?.reports[0]?.notes || "No data"}
                </Typography>{" "}
              </ListItem>
            )}
          </Grid>
        </>
      )}
    </Paper>
  );
};
