import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { UsersTable } from "../../components/users/users-table";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RegisterForm } from "../../components/auth/register-form";
import CreateUser from "../../components/users/users-create";
import { DeptTable } from "../../components/department/dept-table";

const Employees: NextPage = () => {
  const [value, setValue] = useState("1");
  const [valueTable, setValueTable] = useState("Admin");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleChangeTable = (
    event: React.SyntheticEvent,
    newValueTable: string
  ) => {
    setValueTable(newValueTable);
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              p: "5px 20px",
            }}
          >
            <TabList onChange={handleChange} aria-label="Employees options">
              <Tab label="List Employees" value="1" />
              <Tab label="Add Employees" value="2" />
              <Tab label="Add Department" value="3" />
              <Tab label="Add Designation" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TabContext value={valueTable}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "GrayText",
                  p: "5px 20px",
                }}
              >
                <TabList onChange={handleChangeTable} aria-label="Role options">
                  <Tab label="Admins" value="Admin" />
                  <Tab label="Teachers" value="Teacher" />
                </TabList>
              </Box>
              <TabPanel value="Admin">
                <UsersTable role="admin" />
              </TabPanel>
              <TabPanel value="Teacher">
                <UsersTable role="teacher" />
              </TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel value="2">
            <CreateUser />
          </TabPanel>
          <TabPanel value="3">
            <DeptTable></DeptTable>
          </TabPanel>
          <TabPanel value="4"></TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
};

Employees.getLayout = (page) => (
  // <AuthGuard>
  //   <OwnerGuard>
  <DashboardLayout>{page}</DashboardLayout>
  //   </OwnerGuard>
  // </AuthGuard>
);

export default Employees;
