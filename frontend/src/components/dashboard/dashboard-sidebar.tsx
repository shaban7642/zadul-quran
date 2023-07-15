import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { useMemo } from "react";
import { Box, Drawer, Theme, useMediaQuery } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosSharp from "@mui/icons-material/ArrowForwardIosSharp";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import { ChartIcon } from "../../icons/chart";
import { UsersIcon } from "../../icons/users";
import { FoodMenuIcon } from "../../icons/food-menu";
import { ShiftsIcon } from "../../icons/shifts";
import { BillsIcon } from "../../icons/bills";

import { giveAccess } from "../../utils/component-guard";
import { useAuth } from "../../hooks/use-auth";
import { get } from "lodash";

interface DashboardSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
  disabled: boolean;
  accessed: boolean;
}

interface Section {
  title: string;
  items: Item[];
  accessed: boolean;
}

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const { user } = useAuth();
  // const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), {
  //   noSsr: true,
  // });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // const isSubscriped = get(user, "store.is_subscribed", false);

  const getSections = (): Section[] => [
    {
      title: "Main",
      items: [
        {
          title: "Employees",
          path: "/employees",
          icon: <ChartIcon fontSize="small" />,
          disabled: false,
          accessed: true,
        },
        {
          title: "sidebar.dashboard.orders",
          path: "/orders",
          icon: <FoodMenuIcon fontSize="small" />,
          disabled: false,
          accessed: true,
        },
        {
          title: "sidebar.dashboard.bills",
          path: "/bills",
          icon: <BillsIcon fontSize="small" />,
          disabled: false,
          accessed: true,
        },
      ],
      accessed: true,
    },
    {
      title: user && user.role === "owner" ? "sidebar.dashboard.managment" : "",
      items: [
        {
          title: "sidebar.dashboard.users",
          path: "/users",
          icon: <UsersIcon fontSize="small" />,
          disabled: false,
          accessed: true, //giveAccess(["owner"])
        },
        {
          title: "sidebar.dashboard.menu",
          path: "/menu",
          icon: <FoodMenuIcon fontSize="small" />,
          disabled: false,
          accessed: true,
        },
        {
          title: "sidebar.dashboard.shifts",
          path: "/shifts",
          icon: <ShiftsIcon fontSize="small" />,
          disabled: false,
          accessed: true,
        },
      ],
      accessed: true,
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections = useMemo(
    () => getSections(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    // if (open && !lgUp) {
    //   onClose?.();
    // }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = async (value: string) => {
    console.log(value);
  };

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
          px: 2.5,
        }}
      >
        <Box sx={{ mt: 1 }}>
          <NextLink href="/" passHref>
            <a>
              <Box
                sx={{
                  height: 32,
                  width: 46,
                }}
              />
            </a>
          </NextLink>
        </Box>

        <ArrowBackIosNewIcon
          onClick={() => onClose()}
          sx={{ color: "black", cursor: "pointer" }}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {sections.map((section) => (
          // eslint-disable-next-line react/jsx-key

          <DashboardSidebarSection
            key={section.title}
            path={router.asPath}
            sx={{
              mt: 1,
              "& + &": {
                mt: 1,
              },
            }}
            {...section}
          />
        ))}
      </Box>
    </>
  );

  // if (lgUp) {
  //   return (
  //     <Drawer
  //       anchor="left"
  //       open={open}
  //       onClose={onClose}
  //       PaperProps={{
  //         sx: {
  //           backgroundColor: "neutral.900",
  //           borderRightColor: "divider",
  //           borderRightStyle: "solid",
  //           borderRightWidth: (theme) =>
  //             theme.palette.mode === "dark" ? 1 : 0,
  //           color: "#FFFFFF",
  //           width: 280,
  //         },
  //       }}
  //       variant="persistent"
  //     >
  //       {content}
  //     </Drawer>
  //   );
  // }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "#aacae9",
          width: 250,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
