import { useRef, useState } from "react";
import type { FC } from "react";
import { AppBarProps, ButtonBase } from "@mui/material";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Menu as MenuIcon } from "../../icons/menu";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAuth } from "../../hooks/use-auth";
import { AccountPopover } from "./account-popover";

import { useRouter } from "next/router";
type Language = "en" | "ar-EG";

const languages: Record<Language, string> = {
  en: "/static/icons/uk_flag.svg",
  "ar-EG": "/static/icons/eg_flag.svg",
};

interface DashboardNavbarProps extends AppBarProps {
  onOpenSidebar?: () => void;
  open?: boolean;
}

const DashboardNavbarRoot = styled(AppBar)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.background.paper,
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
}));

interface LanguageButtonProps {
  text?: string;
}

interface LanguageConfig {
  [language: string]: { name: string };
}

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
        <Tooltip title="user.profile">
          <IconButton sx={{ ml: 1 }}>
            <ManageAccountsIcon>{user?.username}</ManageAccountsIcon>
          </IconButton>
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
  const { onOpenSidebar, open, ...other } = props;

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          transition: "all .13s linear",
          left: {
            lg: open && 250,
          },
          width: {
            lg: `calc(100% - ${open ? "250px" : "0"})`,
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          {!open && (
            <IconButton
              onClick={onOpenSidebar}
              sx={{
                display: {
                  xs: "inline-flex",
                  // lg: 'none',
                },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {/* <HomeLogo /> */}
          <AccountButton />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};
