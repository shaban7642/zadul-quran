import { useRef, useState } from "react";
import type { FC } from "react";
import { Avatar, ButtonBase } from "@mui/material";
import { Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { Menu as MenuIcon } from "../../icons/menu";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAuth } from "../../hooks/use-auth";
import { AccountPopover } from "./account-popover";

interface DashboardNavbarProps extends MuiAppBarProps {
  toggle?: () => void;
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<MuiAppBarProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  ...(theme.palette.mode === "light"
    ? {
        boxShadow: theme.shadows[3],
      }
    : {
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        boxShadow: "none",
      }),
  zIndex: 1100,
}));

// const HomeLogo = () => {
//   const router = useRouter();
//   return (
//     <Box
//       component={ButtonBase}
//       sx={{
//         alignItems: "center",
//         display: "flex",
//         mr: 2,
//       }}
//     >
//       <Tooltip title="goHome">
//         <IconButton sx={{ ml: 1 }} onClick={() => router.push("/sessions")}>
//           <LightBgLogo sx={{ height: "30px", width: "42px" }} />
//         </IconButton>
//       </Tooltip>
//     </Box>
//   );
// };

const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const { user } = useAuth();

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
          ml: 2,
        }}
      >
        <Tooltip title={`Profile`}>
          <ManageAccountsIcon fontSize="medium" color="primary" />
        </Tooltip>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { toggle, open, ...other } = props;

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        <IconButton
          onClick={toggle}
          edge="start"
          sx={{
            backgroundColor: "neutral.700",
            color: "neutral.40",
            ":hover": {
              backgroundColor: "neutral.800",
            },
          }}
        >
          <MenuIcon
            sx={{
              cursor: "pointer",
            }}
          />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        {/* <HomeLogo /> */}
        <AccountButton />
      </Toolbar>
    </AppBar>
  );
};
