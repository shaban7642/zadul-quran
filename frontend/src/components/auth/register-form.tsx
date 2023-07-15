import { useState } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  Button,
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
import { useAuth } from "../../hooks/use-auth";
import { useMounted } from "../../hooks/use-mounted";
import { PasswordValidationForm } from "./password-validation-form";
import toast from "react-hot-toast";

export const RegisterForm: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
      submit: null,
    },
    validationSchema: Yup.object({
      username: Yup.string().max(255).required("usernameIsRequired"),
      first_name: Yup.string().max(255).required("first_nameIsRequired"),
      last_name: Yup.string().max(255).required("last_nameIsRequired"),
      email: Yup.string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      password: Yup.string().min(7).max(255).required("passwordIsRequired"),
      confirmPassword: Yup.string().test(
        "passwords-match",
        "passwordMustMatch",
        function (value) {
          return this.parent.password === value;
        }
      ),
      phone_number: Yup.string()
        .min(11, "phoneNumberLengthMessage")
        .max(11, "phoneNumberLengthMessage")
        .required("phoneNumberIsRequired"),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const {
          username,
          first_name,
          last_name,
          email,
          phone_number,
          password,
        } = values;
        await register({
          username,
          first_name,
          last_name,
          email,
          phone_number,
          password,
        });

        if (isMounted()) {
          router
            .push({
              pathname: "/sessions",
              query: {
                isVerify: true,
              },
            })
            .catch(console.error);
        }
      } catch (err) {
        toast.error(err.message || "failed");

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.params });
          helpers.setSubmitting(false);
        }
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
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      <TextField
        error={Boolean(formik.touched.username && formik.errors.username)}
        fullWidth
        helperText={formik.touched.username && formik.errors.username}
        label="username"
        margin="normal"
        name="username"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="name"
        value={formik.values.username}
        InputProps={{
          style: {
            fontFamily: "sans-serif",
          },
        }}
      />
      <TextField
        error={Boolean(formik.touched.first_name && formik.errors.first_name)}
        fullWidth
        helperText={formik.touched.first_name && formik.errors.first_name}
        label="first_name"
        margin="normal"
        name="first_name"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="name"
        value={formik.values.first_name}
        InputProps={{
          style: {
            fontFamily: "sans-serif",
          },
        }}
      />
      <TextField
        error={Boolean(formik.touched.last_name && formik.errors.last_name)}
        fullWidth
        helperText={formik.touched.last_name && formik.errors.last_name}
        label="last_name"
        margin="normal"
        name="last_name"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="name"
        value={formik.values.last_name}
        InputProps={{
          style: {
            fontFamily: "sans-serif",
          },
        }}
      />
      <TextField
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        helperText={formik.touched.email && formik.errors.email}
        label="emailAddress"
        margin="normal"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
        InputProps={{
          style: {
            fontFamily: "sans-serif",
          },
        }}
      />
      <TextField
        error={Boolean(
          formik.touched.phone_number && formik.errors.phone_number
        )}
        fullWidth
        helperText={formik.touched.phone_number && formik.errors.phone_number}
        label="phone_number"
        margin="normal"
        name="phone_number"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="text"
        value={formik.values.phone_number}
        InputProps={{
          style: {
            fontFamily: "sans-serif",
          },
        }}
      />
      <FormControl sx={{ width: "100%", marginTop: "10px" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">password</InputLabel>
        <OutlinedInput
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          // helperText={formik.touched.password && formik.errors.password}
          label="password"
          name="password"
          onBlur={onBlur}
          onChange={formik.handleChange}
          onFocus={onFocus}
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
        {showPasswordValidation === true && (
          <PasswordValidationForm
            sx={{ bottom: "-180px" }}
            password={formik.values.password}
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
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{`${formik.errors.submit}`}</FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          register
        </Button>
      </Box>
    </form>
  );
};
