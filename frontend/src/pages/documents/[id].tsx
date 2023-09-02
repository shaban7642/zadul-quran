import type { NextPage } from "next";
import { useRouter } from "next/router";

import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { PermissionsTable } from "../../components/roles/permissions-table";

const User: NextPage = () => {
  const router = useRouter();
  const { id, role, name } = router.query;

  return (
    <DashboardLayout>
      <PermissionsTable
        role={String(role)}
        roleId={Number(id)}
        name={String(name)}
      />
    </DashboardLayout>
  );
};
User.getLayout = (page) => (
  // <AuthGuard>
  //   <OwnerGuard>
  <DashboardLayout>{page}</DashboardLayout>
  //   </OwnerGuard>
  // </AuthGuard>
);

export default User;
