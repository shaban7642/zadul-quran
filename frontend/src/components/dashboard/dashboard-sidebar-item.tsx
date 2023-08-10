import { useState } from "react";
import type { FC, ReactNode } from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, Button, Collapse, ListItem, Tooltip } from "@mui/material";
import type { ListItemProps } from "@mui/material";
import { ChevronDown as ChevronDownIcon } from "../../icons/chevron-down";
import { ChevronRight as ChevronRightIcon } from "../../icons/chevron-right";

interface DashboardSidebarItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  chip?: ReactNode;
  depth: number;
  icon?: ReactNode;
  info?: ReactNode;
  open?: boolean;
  disabled?: boolean;
  path?: string;
  title: string;
}

export const DashboardSidebarItem: FC<DashboardSidebarItemProps> = (props) => {
  const {
    active,
    children,
    chip,
    depth,
    icon,
    info,
    disabled,
    open: openProp,
    path,
    title,
    ...other
  } = props;

  // Leaf
  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        mb: 0.5,
        py: 0,
        px: 2,
      }}
    >
      {disabled && (
        <Tooltip
          title="sidebar.dashboard.disabledMessage"
          placement="right"
          arrow
        >
          <Button
            component="a"
            startIcon={icon}
            endIcon={chip}
            disableRipple
            sx={{
              borderRadius: 1,
              color: "neutral.100",
              justifyContent: "flex-start",
              pl: `2px`,
              pr: 3,
              textAlign: "left",
              textTransform: "none",
              width: "100%",
              ...(active && {
                backgroundColor: "rgba(255,255,255, 0.08)",
                color: "white",
                fontWeight: "fontWeightBold",
              }),
              "& .MuiButton-startIcon": {
                color: active ? "secondary.main" : "neutral.400",
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255, 0.08)",
              },
            }}
          >
            <Box sx={{ flexGrow: 1, ml: 2, color: "neutral.100" }}>{title}</Box>
            {info}
          </Button>
        </Tooltip>
      )}

      {!disabled && (
        <NextLink href={path as string} passHref>
          <Button
            component="a"
            startIcon={icon}
            endIcon={chip}
            disableRipple
            sx={{
              borderRadius: 1,
              color: "neutral.200",
              justifyContent: "flex-start",
              pl: `2px`,
              pr: 3,
              textAlign: "left",
              textTransform: "none",
              width: "100%",
              ...(active && {
                backgroundColor: "rgba(255,255,255, 0.08)",
                color: "white",
                fontWeight: "fontWeightBold",
              }),
              "& .MuiButton-startIcon": {
                color: active ? "secondary.main" : "neutral.400",
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255, 0.08)",
              },
            }}
          >
            <Box sx={{ flexGrow: 1, ml: 2, color: "neutral.100" }}>{title}</Box>
            {info}
          </Button>
        </NextLink>
      )}
    </ListItem>
  );
};

DashboardSidebarItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  depth: PropTypes.number.isRequired,
  icon: PropTypes.node,
  info: PropTypes.node,
  open: PropTypes.bool,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};

DashboardSidebarItem.defaultProps = {
  active: false,
  open: false,
};
