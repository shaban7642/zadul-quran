import { useState } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar, drawerWidth } from "./dashboard-sidebar";
import type { Theme } from "@mui/material";
import toast from "react-hot-toast";
import { Calculate } from "@mui/icons-material";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), {
  //   noSsr: true,
  // });

  return (
    <Box>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",

            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
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
