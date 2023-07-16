import { useState } from "react";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import { VisibilityOff } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import { PasswordValidationForm } from "../auth/password-validation-form";

const options1 = ["Admin", "Teacher", "Accountant"];
const options = ["Male", "Female"];
const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const createUser = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("create");
    try {
      const resp = await userApi.createUser(values);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("createUserSuccess");
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createUserFailed");
      }
    } catch (err) {
      toast.dismiss(load);
      toast.error(err.message || "createUsersFailed");
      return { success: false };
    }
  };

  const formik = useFormik({
    initialValues: {
      role: options1[0],
      join_date: "",
      name: "",
      gender: options[0],
      DOB: "",
      designation: "",
      department: "",
      email: "",
      mobile_no: "",
      password: "",
      confirmPassword: "",
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      role: yup.string().required(),
      join_date: yup.date().required("staff_idIsRequired"),
      name: yup.string().max(255).required("nameIsRequired"),
      gender: yup.string().required(),
      DOB: yup.date().required(),
      designation: yup.string().required(),
      depatment: yup.string().required(),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      mobile_no: yup
        .string()
        .min(11, "phoneNumberLengthMessage")
        .required("phoneNumberIsRequired"),
      password: yup.string().min(7).max(255).required("passwordIsRequired"),
      confirmPassword: yup
        .string()
        .test("passwords-match", "passwordMustMatch", function (value) {
          return this.parent.password === value;
        }),
    }),
    onSubmit: async (values) => {
      const { success } = await createUser(values);
      if (success) {
        formik.resetForm();
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
    <Box sx={{ margin: 1 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ margin: 0 }}>
        edit
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          sx={{
            width: { xs: 100, sm: 150, md: 200, lg: 250, xl: 300 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
            marginTop: 2,
          }}
          variant="outlined"
        >
          {" "}
          <InputLabel id="outlined-adornment-role">Role</InputLabel>
          <Select
            name="role"
            id="outlined-adornment-role"
            labelId="outlined-adornment-role"
            value={formik.values.role}
            onChange={formik.handleChange}
          >
            {options1.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.join_date && formik.errors.join_date)}
          // @ts-ignore
          helperText={formik.touched.join_date && formik.errors.join_date}
          label="Joining Date"
          margin="normal"
          id="join_date"
          name="join_date"
          type="date"
          onChange={formik.handleChange}
          value={formik.values.join_date}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.name && formik.errors.name)}
          // @ts-ignore
          helperText={formik.touched.name && formik.errors.name}
          label="name"
          margin="normal"
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <FormControl
          sx={{
            width: { xs: 100, sm: 150, md: 200, lg: 250, xl: 300 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
            marginTop: 2,
          }}
          variant="outlined"
        >
          {" "}
          <InputLabel id="outlined-adornment-gender">Gender</InputLabel>
          <Select
            name="gender"
            id="outlined-adornment-gender"
            labelId="outlined-adornment-gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.DOB && formik.errors.DOB)}
          // @ts-ignore
          helperText={formik.touched.DOB && formik.errors.DOB}
          label="Date Of Birth"
          margin="normal"
          id="DOB"
          name="DOB"
          type="date"
          onChange={formik.handleChange}
          value={formik.values.DOB}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.department && formik.errors.department)}
          // @ts-ignore
          helperText={formik.touched.department && formik.errors.department}
          label="department"
          margin="normal"
          id="department"
          name="department"
          type="department"
          onChange={formik.handleChange}
          value={formik.values.department}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(
            formik.touched.designation && formik.errors.designation
          )}
          // @ts-ignore
          helperText={formik.touched.designation && formik.errors.designation}
          label="designation"
          margin="normal"
          id="designation"
          name="designation"
          type="designation"
          onChange={formik.handleChange}
          value={formik.values.designation}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.email && formik.errors.email)}
          // @ts-ignore
          helperText={formik.touched.email && formik.errors.email}
          label="email"
          margin="normal"
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.mobile_no && formik.errors.mobile_no)}
          // @ts-ignore
          helperText={formik.touched.mobile_no && formik.errors.mobile_no}
          label="mobile_no"
          margin="normal"
          id="mobile_no"
          name="mobile_no"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.mobile_no}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <FormControl
          sx={{
            width: { xs: 200, sm: 250, md: 300, lg: 350, xl: 400 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
            marginTop: 2,
          }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            password
          </InputLabel>
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
          sx={{
            width: { xs: 200, sm: 250, md: 300, lg: 350, xl: 400 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
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
        <LoadingButton
          type="submit"
          sx={{
            width: { xs: 15, sm: 20, md: 30, lg: 40, xl: 50 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            m: 0.5,
            mt: 2,
          }}
          variant="contained"
        >
          submit
        </LoadingButton>
      </form>
    </Box>
  );
};

export default CreateUser;
