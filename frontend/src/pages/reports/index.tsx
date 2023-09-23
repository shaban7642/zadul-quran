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
  const { user } = useAuth();
  const [value, setValue] = useState("1");
  const [reports, setReports] = useState<Report[]>([]);
  const isMounted = useMounted();
  const getReports = useCallback(async () => {
    try {
      const data: any = await reportApi.getReports();
      if (isMounted()) {
        setReports(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const deleteReport = async (id: number): Promise<{ success: boolean }> => {
    const load = toast.loading("deleteReports");
    try {
      const resp = await reportApi.deleteReport(id);
      toast.dismiss(load);
      toast.success("deleteReportsSuccess");
      getReports();
      return { success: true };
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "deleteReportsFailed");
      return { success: false };
    }
  };
  const createReport = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createReports");
    try {
      await reportApi.createReport(user?.id, values);

      toast.dismiss(load);
      toast.success("createReportsSuccess");

      getReports();

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createReportsFailed");
      return { success: false };
    }
  };
  const updateReport = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("updateReports");
    try {
      const resp = await reportApi.updateReport(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateReportsSuccess");

        getReports();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateReportsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateReportsFailed");
      return { success: false };
    }
  };
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
          <ReportsTable
            reports={reports}
            getReports={getReports}
            deleteReport={deleteReport}
            updateReport={updateReport}
          />
        </TabPanel>
        <TabPanel value="2">
          <CreateReport createReport={createReport} />
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
