import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { UsersTable } from "../../components/users/users-table";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RegisterForm } from "../../components/auth/register-form";
import CreateUser from "../../components/users/users-create";

const Employees: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", p: "10px 30px" }}>
            <TabList onChange={handleChange} aria-label="Employees options">
              <Tab label="List Employees" value="1" />
              <Tab label="Add Employees" value="2" />
              <Tab label=" Employees" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Typography color="inherit" variant="h4">
              List of employees
            </Typography>
            <UsersTable />
          </TabPanel>
          <TabPanel value="2">
            <Typography color="inherit" variant="h4">
              Add new employee
            </Typography>
            <CreateUser />
          </TabPanel>
          <TabPanel value="3">
            <Typography color="inherit" variant="h4">
              List of employees
            </Typography>
          </TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
};

// Employees.getLayout = (page) => (
//   // <AuthGuard>
//   //   <OwnerGuard>

//   //   </OwnerGuard>
//   // </AuthGuard>
// );

export default Employees;
