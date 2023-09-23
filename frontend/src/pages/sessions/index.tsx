import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateSession from "../../components/sessions/sessions-create";
import { SessionsTable } from "../../components/sessions/sessions-table";
import { AuthGuard } from "../../components/auth/auth-guard";

const Session: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: "10px 30px" }}>
          <TabList onChange={handleChange} aria-label="Session options">
            <Tab label="List Session" value="1" />
            <Tab label="Add Session" value="2" />
            <Tab label="Session" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <SessionsTable roleId={4} />
        </TabPanel>
        <TabPanel value="2">
          <CreateSession />
        </TabPanel>
        <TabPanel value="3"></TabPanel>
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
