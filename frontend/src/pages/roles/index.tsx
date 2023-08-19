import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateSetting from "../../components/roles/roles-create";
import { RolesTable } from "../../components/roles/roles-table";

const Roles: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Roles options">
              <Tab label="List Roles" value="1" />
              <Tab label="Add Roles" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <RolesTable />
          </TabPanel>
          <TabPanel value="2">
            <CreateSetting />
          </TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
};

// Roles.getLayout = (page) => (
//   // <AuthGuard>
//   //   <OwnerGuard>

//   //   </OwnerGuard>
//   // </AuthGuard>
// );

export default Roles;
