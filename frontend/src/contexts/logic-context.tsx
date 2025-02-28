import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/use-auth";
import { sessionApi } from "../api/sessionsApi";
import { useRouter } from "next/router";
import moment from "moment";

interface LogicContextsProps {
  children: ReactNode;
}

export const LogicContext: FC<LogicContextsProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAlerting, setIsAlerting] = useState(false);

  // Fetch running sessions
  const getSessions = useCallback(async () => {
    try {
      const res = (await sessionApi.getSessions({
        limit: 5,
        offset: 0,
        status: "running",
      })) as any;
      const data = res?.rows ?? [];

      const hasOldSession = data.some((session: any) =>
        moment(session.startedAt).isBefore(moment().subtract(6, "hours"))
      );

      if (hasOldSession && !router?.query?.sub) {
        setIsAlerting(true);
        if (!router.pathname.includes("/sessions")) {
          localStorage.setItem(
            "sessions-selected-tab",
            JSON.stringify({
              value: "running",
              expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
            })
          );
          router.push("/sessions");
        }
      } else {
        setIsAlerting(false);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }, [router]);

  // Check sessions if user is a teacher
  useEffect(() => {
    if (user?.role?.name === "teacher") {
      getSessions();
    }
  }, [user?.role?.name, getSessions]);

  // Alert every 10 seconds if needed
  useEffect(() => {
    if (!isAlerting) return;

    const intervalId = setInterval(() => {
      const createReportForm = document.getElementById("create-report-form");
      if (!createReportForm) {
        alert("Please close the running sessions!");
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isAlerting]);

  return <>{children}</>;
};

LogicContext.propTypes = {
  children: PropTypes.node.isRequired,
};
