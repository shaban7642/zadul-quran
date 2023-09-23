import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box, Tab, Typography } from "@mui/material";

import { RolesTable } from "../../components/roles/roles-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { OwnerGuard } from "../../components/auth/owner-guard";

const Roles: NextPage = () => {
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <RolesTable />
    </Box>
  );
};

Roles.getLayout = (page) => (
  <AuthGuard>
    <OwnerGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </OwnerGuard>
  </AuthGuard>
);

export default Roles;
