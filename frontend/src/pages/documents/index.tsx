import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { NextPage } from "next";
import { Box } from "@mui/material";
import { DocumentTable } from "../../components/documents/doc-table";

const Roles: NextPage = () => {
  return (
    <DashboardLayout>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <DocumentTable />
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
