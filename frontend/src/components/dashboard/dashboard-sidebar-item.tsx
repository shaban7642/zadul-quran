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
  const [open, setOpen] = useState<boolean>(!!openProp);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 24;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: "block",
          mb: 0.5,
          py: 0,
          px: 2,
        }}
        {...other}
      >
        <Button
          endIcon={
            !open ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronDownIcon fontSize="small" />
            )
          }
          disableRipple
          onClick={handleToggle}
          startIcon={icon}
          sx={{
            color: active ? "white" : "black",
            justifyContent: "flex-start",
            pl: `${paddingLeft}px`,
            pr: 3,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            "&:hover": {
              backgroundColor: "rgba(255,255,255, 0.08)",
            },
            "& .MuiButton-startIcon": {
              color: active ? "white" : "black",
            },
            "& .MuiButton-endIcon": {
              color: "black",
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
        </Button>
        <Collapse in={open} sx={{ mt: 0.5 }}>
          {children}
        </Collapse>
      </ListItem>
    );
  }

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
              color: "black",
              justifyContent: "flex-start",
              pl: `${paddingLeft}px`,
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
                color: active ? "white" : "black",
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255, 0.08)",
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>{title}</Box>
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
              color: "black",
              justifyContent: "flex-start",
              pl: `${paddingLeft}px`,
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
                color: active ? "white" : "black",
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255, 0.08)",
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>{title}</Box>
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