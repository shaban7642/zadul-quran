import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { UsersTable } from "../../components/users/users-table";
import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateUser from "../../components/users/users-create";
import { DeptTable } from "../../components/department/dept-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { useMounted } from "../../hooks/use-mounted";
import { rolesApi } from "../../api/rolesApi";
import { OwnerGuard } from "../../components/auth/owner-guard";

interface RoleId {
  displayName: string;
  id: number;
  name: string;
}

const Employees: NextPage = () => {
  const [value, setValue] = useState("1");
  const [valueTable, setValueTable] = useState("0");

  const [roles, setRoles] = useState<RoleId[]>([]);
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

  const getRoles = useCallback(
    async () => {
      try {
        const data: any = await rolesApi.getRoles();

        if (isMounted()) {
          setRoles(data.resp);
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  useEffect(() => {
    getRoles();
  }, []);
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            p: "10px 30px",
          }}
        >
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="Employees options"
          >
            <Tab label="List Employees" value="1" />
            <Tab label="Add Employees" value="2" />
            <Tab label="Add Subject" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 1 }}>
          <TabContext value={valueTable}>
            <Box
              sx={{
                pl: 5,
                borderBottom: 1,
                borderColor: "GrayText",
              }}
            >
              <TabList
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChangeTable}
                aria-label="Role options"
              >
                <Tab label="All Employees" value="0" />
                <Tab label="Super Admins" value="1" />
                <Tab label="Admins" value="2" />
                <Tab label="Teachers" value="3" />
              </TabList>
            </Box>
            <TabPanel value="0" sx={{ p: 1 }}>
              <UsersTable roles={roles} />
            </TabPanel>
            <TabPanel value="1" sx={{ p: 1 }}>
              <UsersTable roles={roles} roleId={"super_admin"} />
            </TabPanel>
            <TabPanel value="2" sx={{ p: 1 }}>
              <UsersTable roles={roles} roleId={"admin"} />
            </TabPanel>
            <TabPanel value="3" sx={{ p: 1 }}>
              <UsersTable roles={roles} roleId={"teacher"} />
            </TabPanel>
          </TabContext>
        </TabPanel>
        <TabPanel value="2" sx={{ p: 1 }}>
          <CreateUser roles={roles} />
        </TabPanel>
        <TabPanel value="3" sx={{ p: 1 }}>
          <DeptTable></DeptTable>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

Employees.getLayout = (page) => (
  <AuthGuard>
    <OwnerGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </OwnerGuard>
  </AuthGuard>
);

export default Employees;
