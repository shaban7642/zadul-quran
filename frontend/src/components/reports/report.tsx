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

interface reportProps {
  session: any;
  handleCloseReport: () => void;
}
export const Report: FC<reportProps> = (props) => {
  const { session, handleCloseReport } = props;
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();

  return (
    <Box sx={{ width: "100%", typography: "body1", bgcolor: "#CAF0F8" }}>
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
                {session?.startTime || "no data"}
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
                  session?.startedAt?.substr(11, 8) || "data"
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
                {session?.endTime || "no data"}
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
                  session?.endedAt?.substr(11, 8) || "data"
                }` || "no data"}
              </Typography>{" "}
            </ListItem>
          </Grid>
        </Grid>

        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Feedback " sx={{ fontWeight: "600" }} />
        </Divider>
        <Grid container component={List}>
          <Grid item xs={12} sm={6}>
            {" "}
            <ListItem>
              Submition Date:
              <Typography
                color={"black"}
                sx={{ overflowWrap: "break-word", minWidth: "100px" }}
              >
                {" "}
                {moment(session?.reports[0]?.date || "No data").format(
                  "MMM-D-YYYY"
                )}
              </Typography>{" "}
            </ListItem>
            {session.patch?.department?.name != "Quran" && (
              <>
                <ListItem>
                  Book:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.book || "No data"}
                  </Typography>{" "}
                </ListItem>

                <ListItem>
                  Unit:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.unit || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Topic:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.topic || "No data"}
                  </Typography>{" "}
                </ListItem>

                <ListItem>
                  Level:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.level || "No data"}
                  </Typography>{" "}
                </ListItem>
              </>
            )}
            {session.patch?.department?.name == "Arabic" && (
              <>
                <ListItem>
                  New Words:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.newWords || "No data"}
                  </Typography>{" "}
                </ListItem>

                <ListItem>
                  Expressions:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.expressions || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Rules:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.rules || "No data"}
                  </Typography>{" "}
                </ListItem>
              </>
            )}
            {session.patch?.department?.name == "Quran" && (
              <>
                {" "}
                <ListItem>
                  Memorization:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.memorization || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Revision:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.revision || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Tajweed:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.tajweed || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Recitation:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.recitation || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Reading:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.reading || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  MemorizationLevel:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.memorizationLevel || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  RevisionLevel:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.revisionLevel || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  ReadingLevel:{" "}
                  <Typography
                    color={"black"}
                    sx={{ overflowWrap: "break-word", minWidth: "100px" }}
                  >
                    {session?.reports[0]?.readingLevel || "No data"}
                  </Typography>{" "}
                </ListItem>
              </>
            )}
          </Grid>
          <ListItem>
            H.W:
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {session?.reports[0]?.homework || "No data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            Notes:{" "}
            <Typography
              color={"black"}
              sx={{ overflowWrap: "break-word", minWidth: "100px" }}
            >
              {session?.reports[0]?.notes || "No data"}
            </Typography>{" "}
          </ListItem>
          <ListItem>
            File:{" "}
            <IconButton
              onClick={() =>
                download(
                  `http://localhost:4000/${session?.reports[0]?.fileStoragePath}`,
                  session?.reports[0]?.fileName
                )
              }
              sx={{ p: 0, ml: 1, mb: 1.5 }}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
            {/* <p>Size:{size}</p>
          <label htmlFor="file">progress:</label>
          <progress id="file" value={percentage} max="100" /> */}
            {error && <p>possible error {JSON.stringify(error)}</p>}
          </ListItem>
        </Grid>
      </Paper>
    </Box>
  );
};
