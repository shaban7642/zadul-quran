import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateStudent from "../../components/students/students-create";
import { StudentsTable } from "../../components/students/students-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { OwnerGuard } from "../../components/auth/owner-guard";
import { useMounted } from "../../hooks/use-mounted";
import { deptApi } from "../../api/deptApi";
import toast from "react-hot-toast";

const Students: NextPage = () => {
  const [value, setValue] = useState("1");
  const [depts, setDepts] = useState([]);
  const isMounted = useMounted();
  const getDepts = useCallback(async () => {
    try {
      const data: any = await deptApi.getDepts(100, 0);
      if (isMounted()) {
        setDepts(data.rows);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  useEffect(() => {
    getDepts();
  }, []);
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: "10px 30px" }}>
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="Students options"
          >
            <Tab label="List Students" value="1" />
            <Tab label="Add Students" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 1 }}>
          <StudentsTable depts={depts} roleId={"student"} />
        </TabPanel>
        <TabPanel value="2">
          <CreateStudent depts={depts} />
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
