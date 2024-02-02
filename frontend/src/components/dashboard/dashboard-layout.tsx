import { useState } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar, drawerWidth } from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayoutRoot = styled("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
}));

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <Box>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "90%",
            paddingLeft: isSidebarOpen
              ? `calc(${drawerWidth}px - 5px)`
              : "45px",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar
        toggle={(): void => setIsSidebarOpen(!isSidebarOpen)}
        open={isSidebarOpen}
      />
      <DashboardSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
