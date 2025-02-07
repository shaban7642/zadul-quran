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

export const LogicContext: FC<LogicContextsProps> = (props) => {
    const { children } = props;

    const { user } = useAuth();
    const router = useRouter(); // Initialize navigation

    const [isAlerting, setIsAlerting] = useState(false);
    const [alertIntervalId, setAlertIntervalId] =
        useState<NodeJS.Timeout | null>(null);

    const getSessions = useCallback(async () => {
        try {
            const res: any = await sessionApi.getSessions({
                limit: 5,
                offset: 0,
                status: "running",
            });
            const data = res.rows;

            if (
                Array.isArray(data) &&
                data.length > 0 &&
                data.some((c) =>
                    moment(c.startedAt).isBefore(moment().subtract(6, "hours"))
                )
            ) {
                setIsAlerting(true);
                if (!router.pathname.includes("sessions")) {
                    router.push("/sessions");
                }
            }
        } catch (err: any) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        if (user?.role?.name === "teacher") {
            getSessions();
        }
    }, [user?.role?.name, getSessions]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (isAlerting) {
            intervalId = setInterval(() => {
                alert("Please close the running sessions!");
            }, 10000);

            // Store intervalId in the state or ref if needed for later cleanup
            setAlertIntervalId(intervalId);
        }

        // Cleanup on unmount or when isAlerting changes
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            // You can leave the state change to true/false outside of cleanup to avoid conflicts
        };
    }, [isAlerting]); // Only re-run when isAlerting changes

    return <>{children}</>;
};

// PropTypes can be added if you want to enforce prop types at runtime
LogicContext.propTypes = {
    children: PropTypes.node.isRequired,
};
