import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateSession from "../../components/sessions/sessions-create";
import { SessionsTable } from "../../components/sessions/sessions-table";
import { SessionsGroup } from "../../components/sessions/sessions-group";
import { AuthGuard } from "../../components/auth/auth-guard";

const Session: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1", zoom: "77%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: "10px 30px" }}>
          <TabList
            TabIndicatorProps={{ style: { display: "none" } }} // Hides the indicator
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="Session options"
          >
            <Tab
              sx={{
                minHeight: "45px",
                fontSize: "16px",
                mt: "auto",
                mb: "auto",
                "&.Mui-selected": {
                  color: "text.context", // Custom color for selected tab
                  fontWeight: "bold", // Make the selected tab bold
                  backgroundColor: "secondary.main", // Add background color to selected tab
                  borderRadius: "10%",
                  p: "0 4px",
                },
              }}
              label="List Session"
              value="1"
            />
            <Tab
              sx={{
                minHeight: "45px",
                fontSize: "16px",
                mt: "auto",
                mb: "auto",
                "&.Mui-selected": {
                  color: "text.context", // Custom color for selected tab
                  fontWeight: "bold", // Make the selected tab bold
                  backgroundColor: "secondary.main", // Add background color to selected tab
                  borderRadius: "10%",
                  p: "0 4px",
                },
              }}
              label="Group Session"
              value="2"
            />

            <Tab
              sx={{
                minHeight: "45px",
                fontSize: "16px",
                mt: "auto",
                mb: "auto",
                "&.Mui-selected": {
                  color: "text.context", // Custom color for selected tab
                  fontWeight: "bold", // Make the selected tab bold
                  backgroundColor: "secondary.main", // Add background color to selected tab
                  borderRadius: "10%",
                  p: "0 4px",
                },
              }}
              label="Add Session"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0.5 }}>
          <SessionsTable roleId={4} />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0.5 }}>
          <SessionsGroup />
        </TabPanel>
        <TabPanel value="3">
          <CreateSession />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

Session.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Session;
