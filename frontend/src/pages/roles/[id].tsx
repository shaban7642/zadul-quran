import type { NextPage } from "next";
import { useRouter } from "next/router";

import { DashboardLayout } from "../../components/dashboard/dashboard-layout";

const User: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DashboardLayout>
      <h1>{id}</h1>
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
