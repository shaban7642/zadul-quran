import type { NextPage } from "next";
import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Profile } from "../../../components/users/users-profile";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { AuthGuard } from "../../../components/auth/auth-guard";
import { ChangePasswordForm } from "../../../components/users/change-password";
import { useAuth } from "../../../hooks/use-auth";

const User: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [value, setValue] = useState("1");
  const isSuperAdmin = user?.roleId === 1;
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
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
            aria-label="lab API tabs example"
          >
            <Tab label="Profile" value="1" />
            {isSuperAdmin && <Tab label="Change Password" value="2" />}
          </TabList>
        </Box>
        <TabPanel value="1">
          <Typography color="inherit" variant="h4">
            Profile
          </Typography>
          <Profile id={Number(id)} />
        </TabPanel>
        {isSuperAdmin && (
          <TabPanel value="2">
            <Typography color="inherit" variant="h4">
              Change Password
            </Typography>
            <ChangePasswordForm id={Number(id)} />
          </TabPanel>
        )}
      </TabContext>
    </Box>
  );
};
User.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default User;
