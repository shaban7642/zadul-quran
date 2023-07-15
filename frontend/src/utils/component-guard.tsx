/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "lodash";
import { useAuth } from "../hooks/use-auth";

const hasAccess = (targetRole: string) => {
  const { user } = useAuth();
  const role = get(user, "role", null);
  if (!role) return true;
  return role && role.toLocaleLowerCase() !== targetRole.toLocaleLowerCase();
};

const giveAccess = (targetRoles: Array<string>): boolean => {
  const { user } = useAuth();
  const role = get(user, "role", null);

  if (role === null) {
    return true;
  }
  return targetRoles.includes(role);
};

const accessAllExecpt = (targetRole: string) => {
  return hasAccess(targetRole);
};

export { hasAccess, accessAllExecpt, giveAccess };
