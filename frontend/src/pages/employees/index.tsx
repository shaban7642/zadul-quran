import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { UsersTable } from "../../components/users/users-table";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RegisterForm } from "../../components/auth/register-form";
import CreateUser from "../../components/users/users-create";
import { DeptTable } from "../../components/department/dept-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { deptApi } from "../../api/deptApi";
import { useMounted } from "../../hooks/use-mounted";
import toast from "react-hot-toast";

const Employees: NextPage = () => {
  const [value, setValue] = useState("1");
  const [valueTable, setValueTable] = useState("0");
  const [depts, setDepts] = useState([]);
  const isMounted = useMounted();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleChangeTable = (
    event: React.SyntheticEvent,
    newValueTable: string
  ) => {
    setValueTable(newValueTable);
  };
  const getDepts = useCallback(async () => {
    try {
      const data: any = await deptApi.getDepts();
      if (isMounted()) {
        setDepts(data.rows);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);
  useEffect(() => {
    getDepts();
  }, []);
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
                <UsersTable depts={depts} />
              </TabPanel>
              <TabPanel value="1">
                <UsersTable depts={depts} roleId={1} />
              </TabPanel>
              <TabPanel value="2">
                <UsersTable depts={depts} roleId={2} />
              </TabPanel>
              <TabPanel value="3">
                <UsersTable depts={depts} roleId={3} />
              </TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel value="2">
            <CreateUser depts={depts} />
          </TabPanel>
          <TabPanel value="3">
            <DeptTable getDepts={getDepts} depts={depts}></DeptTable>
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
