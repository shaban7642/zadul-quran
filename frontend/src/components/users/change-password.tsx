import { useState } from "react";
import type { FC } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  alpha,
  Grid,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { PasswordValidationForm } from "../auth/password-validation-form";
import { authApi } from "../../api/authApi";
import toast from "react-hot-toast";

export const ChangePasswordForm: FC = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(7).max(255).required("passwordIsRequired"),
      confirmPassword: Yup.string().test(
        "passwords-match",
        "passwordMustMatch",
        function (value) {
          return this.parent.newPassword === value;
        }
      ),
    }),
    onSubmit: async (values): Promise<void> => {
      const load = toast.loading(t("change"));
      try {
        const { oldPassword, newPassword } = values;
        const response = await authApi.changePassword({
          oldPassword,
          newPassword,
        });

        if (response.success) {
          toast.dismiss(load);
          toast.success("change ");
          formik.resetForm();
        } else {
          toast.dismiss(load);
          toast.error("changeFailed");
        }
      } catch (err) {
        toast.dismiss(load);
        toast.error(err.message || "changeFailed");
      }
    },
  });

  const onFocus = () => {
    setShowPasswordValidation(true);
  };
  const onBlur = () => {
    formik.handleBlur;
    setShowPasswordValidation(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={5} md={6} sm={8} xs={12}>
        <Paper
          elevation={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 40px",
            m: 1,
            ...(true && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.info.contrastText,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          <form noValidate onSubmit={formik.handleSubmit} {...props}>
            <FormControl
              sx={{ width: "100%", marginTop: "10px" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Old Password
              </InputLabel>
              <OutlinedInput
                error={Boolean(
                  formik.touched.oldPassword && formik.errors.oldPassword
                )}
                fullWidth
                // helperText={formik.touched.password && formik.errors.password}
                label="oldPassword"
                name="oldPassword"
                onChange={formik.handleChange}
                value={formik.values.oldPassword}
                type={showPassword ? "text" : "password"}
                sx={{
                  fontFamily: "sans-serif",
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl
              sx={{ width: "100%", marginTop: "10px" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                New Password
              </InputLabel>
              <OutlinedInput
                error={Boolean(
                  formik.touched.newPassword && formik.errors.newPassword
                )}
                fullWidth
                // helperText={formik.touched.newPassword && formik.errors.newPassword}
                label="newPassword"
                name="newPassword"
                onBlur={onBlur}
                onChange={formik.handleChange}
                onFocus={onFocus}
                value={formik.values.newPassword}
                type={showPassword ? "text" : "password"}
                sx={{
                  fontFamily: "sans-serif",
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {showPasswordValidation === true && (
                <PasswordValidationForm
                  sx={{ bottom: "-180px" }}
                  password={formik.values.newPassword}
                />
              )}
            </FormControl>
            <TextField
              error={Boolean(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )}
              fullWidth
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              label="confirmPassword"
              margin="normal"
              name="confirmPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              InputProps={{
                style: {
                  fontFamily: "sans-serif",
                },
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Change Password
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};
