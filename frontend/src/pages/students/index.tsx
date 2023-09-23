import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateStudent from "../../components/students/students-create";
import { StudentsTable } from "../../components/students/students-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { OwnerGuard } from "../../components/auth/owner-guard";

const Students: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: "10px 30px" }}>
          <TabList onChange={handleChange} aria-label="Students options">
            <Tab label="List Students" value="1" />
            <Tab label="Add Students" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <StudentsTable roleId={"student"} />
        </TabPanel>
        <TabPanel value="2">
          <CreateStudent />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

Students.getLayout = (page) => (
  <AuthGuard>
    <OwnerGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </OwnerGuard>
  </AuthGuard>
);

export default Students;
