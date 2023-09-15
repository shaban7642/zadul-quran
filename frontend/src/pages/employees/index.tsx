import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { UsersTable } from "../../components/users/users-table";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RegisterForm } from "../../components/auth/register-form";
import CreateUser from "../../components/users/users-create";
import { DeptTable } from "../../components/department/dept-table";
import { AuthGuard } from "../../components/auth/auth-guard";

const Employees: NextPage = () => {
  const [value, setValue] = useState("1");
  const [valueTable, setValueTable] = useState("0");
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
            }}
          >
            <TabList onChange={handleChange} aria-label="Employees options">
              <Tab label="List Employees" value="1" />
              <Tab label="Add Employees" value="2" />
              <Tab label="Add Department" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TabContext value={valueTable}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "GrayText",
                }}
              >
                <TabList onChange={handleChangeTable} aria-label="Role options">
                  <Tab label="All Employees" value="0" />
                  <Tab label="Super Admins" value="1" />
                  <Tab label="Admins" value="2" />
                  <Tab label="Teachers" value="3" />
                </TabList>
              </Box>
              <TabPanel value="0">
                <UsersTable />
              </TabPanel>
              <TabPanel value="1">
                <UsersTable roleId={1} />
              </TabPanel>
              <TabPanel value="2">
                <UsersTable roleId={2} />
              </TabPanel>
              <TabPanel value="3">
                <UsersTable roleId={3} />
              </TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel value="2">
            <CreateUser />
          </TabPanel>
          <TabPanel value="3">
            <DeptTable></DeptTable>
          </TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
};

Employees.getLayout = (page) => (
  <AuthGuard>
    {/* <OwnerGuard> */}
    <DashboardLayout>{page}</DashboardLayout>
    {/* </OwnerGuard> */}
  </AuthGuard>
);

export default Employees;
