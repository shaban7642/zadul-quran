import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { UsersTable } from "../../components/users/users-table";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateUser from "../../components/users/users-create";
import CreateStudent from "../../components/students/students-create";
import { StudentsTable } from "../../components/students/students-table";

const Students: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Students options">
              <Tab label="List Students" value="1" />
              <Tab label="Add Students" value="2" />
              <Tab label=" Students" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <StudentsTable />
          </TabPanel>
          <TabPanel value="2">
            <CreateStudent />
          </TabPanel>
          <TabPanel value="3"></TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
};

// Students.getLayout = (page) => (
//   // <AuthGuard>
//   //   <OwnerGuard>

//   //   </OwnerGuard>
//   // </AuthGuard>
// );

export default Students;
