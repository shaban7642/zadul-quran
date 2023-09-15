import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";

import { RolesTable } from "../../components/roles/roles-table";
import { AuthGuard } from "../../components/auth/auth-guard";

const Roles: NextPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <RolesTable />
      </Box>
    </DashboardLayout>
  );
};

Roles.getLayout = (page) => (
  <AuthGuard>
    {/* <OwnerGuard> */}
    <DashboardLayout>{page}</DashboardLayout>
    {/* </OwnerGuard> */}
  </AuthGuard>
);

export default Roles;
