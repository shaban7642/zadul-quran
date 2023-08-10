import type { NextPage } from "next";
import { useRouter } from "next/router";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { Profile } from "../../components/users/users-profile";

const User: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DashboardLayout>
      <Profile id={id} />
    </DashboardLayout>
  );
};

export default User;
