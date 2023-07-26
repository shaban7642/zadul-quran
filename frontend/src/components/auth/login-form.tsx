import { useState } from "react";
import type { FC } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  FormHelperText,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuth } from "../../hooks/use-auth";
import toast from "react-hot-toast";

export const LoginForm: FC = (props) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values: any): Promise<void> => {
      try {
        setLoading(true);
        await login(values);
        console.log("log");
      } catch (err) {
        toast.error(err.message || "failed");
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      <TextField
        // autoFocus
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        label="Username or Email"
        margin="normal"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="name"
        value={formik.values.email}
        InputProps={{
          style: {
            fontFamily: "sans-serif",
          },
        }}
      />

      <FormControl sx={{ width: "100%", marginTop: "10px" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          label="Password"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.password}
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
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{`${formik.errors.submit}`}</FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <LoadingButton
          color="primary"
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Login
        </LoadingButton>
      </Box>
    </form>
  );
};
