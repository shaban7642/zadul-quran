import { FC } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../hooks/use-auth";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      onClose?.();
      await logout();
      router.push("/").catch(console.error);
    } catch (err: any) {
      toast.error(err?.message || "failed");
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: "center",
          p: 2,
          display: "flex",
        }}
      >
        <Box
          sx={{
            ml: 1,
          }}
        >
          <Typography variant="body1">{user?.username}</Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </Box>
      </Box>
      <Divider />

      <Box sx={{ my: 1 }}>
        <MenuItem>
          <NextLink href={`/profile/${user?.id}`} passHref>
            <ListItemText
              primary={<Typography variant="body1">Profile</Typography>}
            />
          </NextLink>
        </MenuItem>

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary={<Typography variant="body1">Logout</Typography>}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
