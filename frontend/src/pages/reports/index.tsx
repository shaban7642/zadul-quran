import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateReport from "../../components/reports/reports-create";
import toast from "react-hot-toast";
import { reportApi } from "../../api/reportApi";
import { useMounted } from "../../hooks/use-mounted";
import { Report, ReportsTable } from "../../components/reports/reports-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { useAuth } from "../../hooks/use-auth";

const Reports: NextPage = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: "10px 30px" }}>
          <TabList onChange={handleChange} aria-label="Reports options">
            <Tab label="List Reports" value="1" />
            <Tab label="Add Reports" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ReportsTable />
        </TabPanel>
        <TabPanel value="2">
          <CreateReport />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

Reports.getLayout = (page) => (
  <AuthGuard>
    {/* <OwnerGuard> */}
    <DashboardLayout>{page}</DashboardLayout>
    {/* </OwnerGuard> */}
  </AuthGuard>
);

export default Reports;
