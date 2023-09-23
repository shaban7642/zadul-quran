import type { NextPage } from "next";
import { useRouter } from "next/router";

import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { PermissionsTable } from "../../components/roles/permissions-table";
import { AuthGuard } from "../../components/auth/auth-guard";
import { OwnerGuard } from "../../components/auth/owner-guard";

const Permissions: NextPage = () => {
  const router = useRouter();
  const { id, role, name } = router.query;
  return (
    <PermissionsTable
      role={String(role)}
      roleId={Number(id)}
      name={String(name)}
    />
  );
};
Permissions.getLayout = (page) => (
  <AuthGuard>
    <OwnerGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </OwnerGuard>
  </AuthGuard>
);

export default Permissions;
