import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateSession from "../../components/sessions/sessions-create";
import { SessionsTable } from "../../components/sessions/sessions-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { OwnerGuard } from "../../components/auth/owner-guard";

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
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="Session options"
          >
            <Tab label="List Session" value="1" />

            <Tab label="Add Session" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0.5 }}>
          <SessionsTable roleId={4} />
        </TabPanel>
        <TabPanel value="2">
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
