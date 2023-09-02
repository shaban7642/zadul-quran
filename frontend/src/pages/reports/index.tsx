import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateReport from "../../components/reports/reports-create";
import { ReportsTable } from "../../components/reports/reports-table";

const Reports: NextPage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Reports options">
              <Tab label="List Reports" value="1" />
              <Tab label="Add Reports" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <ReportsTable />
          </TabPanel>
          <TabPanel value="2">{/* <CreateReport /> */}</TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
};

// Reports.getLayout = (page) => (
//   // <AuthGuard>
//   //   <OwnerGuard>

//   //   </OwnerGuard>
//   // </AuthGuard>
// );

export default Reports;
