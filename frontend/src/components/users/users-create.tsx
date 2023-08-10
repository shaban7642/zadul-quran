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
  Divider,
  Chip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
import { alpha, useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import { VisibilityOff } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import { PasswordValidationForm } from "../auth/password-validation-form";

const roleIds = [
  { label: "Admin", id: 1 },
  { label: "Teacher", id: 2 },
  { label: "Student", id: 3 },
];
const genders = ["male", "female"];
const departments = ["Admin", "Teacher", "Accountant"];
const designations = ["Admin", "Teacher", "Accountant"];

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
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createUsersFailed");
      return { success: false };
    }
  };

  const formik = useFormik({
    initialValues: {
      roleId: roleIds[0].id,
      join_date: "2/3/2012",
      username: "abdo",
      firstName: "abdo",
      lastName: "abbas",
      city: "giza",
      gender: genders[0],
      birthDate: "2/3/2012",
      designation: designations[0],
      department: departments[0],
      email: "abdo.abd@gmail.com",
      phoneNumber: "011212324545",
      password: "Abdo@001",
      confirmPassword: "Abdo@001",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      roleId: yup.string().required(),
      join_date: yup.date().required("staff_idIsRequired"),
      username: yup.string().max(255).required("usernameIsRequired"),
      firstName: yup.string().max(255).required("firstNameIsRequired"),
      lastName: yup.string().max(255).required("lastNameIsRequired"),
      city: yup.string().max(255).required("cityIsRequired"),
      gender: yup.string().required(),
      birthDate: yup.date().required(),
      designation: yup.string().required(),
      depatment: yup.string().required(),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      gEmail: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      phoneNumber: yup
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
      console.log(values);
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
  const theme = useTheme();
  return (
    <Box sx={{ margin: 1, scrollBehavior: "auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <Divider textAlign="left" sx={{ mb: 1 }}>
          <Chip label="Academic Details" sx={{ fontWeight: "600" }} />
        </Divider>
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
          <InputLabel id="outlined-adornment-roleId">Role</InputLabel>
          <Select
            name="roleId"
            id="outlined-adornment-roleId"
            labelId="outlined-adornment-roleId"
            sx={{
              ...(true && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.info.contrastText,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
            value={formik.values.roleId}
            onChange={formik.handleChange}
          >
            {roleIds.map((roleId) => (
              <MenuItem
                key={roleId.id}
                value={roleId.id}
                sx={{ backgroundColor: theme.palette.background.default }}
              >
                {roleId.label}
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
          <InputLabel id="outlined-adornment-department">Department</InputLabel>
          <Select
            name="department"
            id="outlined-adornment-department"
            labelId="outlined-adornment-department"
            value={formik.values.department}
            onChange={formik.handleChange}
          >
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          <InputLabel id="outlined-adornment-designation">
            Designation
          </InputLabel>
          <Select
            name="designation"
            id="outlined-adornment-designation"
            labelId="outlined-adornment-designation"
            value={formik.values.designation}
            onChange={formik.handleChange}
          >
            {designations.map((designation) => (
              <MenuItem key={designation} value={designation}>
                {designation}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Employee Details" sx={{ fontWeight: "600" }} />
        </Divider>
        {/* firstname */}
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.firstName && formik.errors.firstName)}
          // @ts-ignore
          helperText={formik.touched.firstName && formik.errors.firstName}
          label="First Name"
          margin="normal"
          id="firstName"
          name="firstName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.firstName}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        {/* lastname */}
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.lastName && formik.errors.lastName)}
          // @ts-ignore
          helperText={formik.touched.lastName && formik.errors.lastName}
          label="Last Name"
          margin="normal"
          id="lastName"
          name="lastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.lastName}
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
          error={Boolean(formik.touched.city && formik.errors.city)}
          // @ts-ignore
          helperText={formik.touched.city && formik.errors.city}
          label="city"
          margin="normal"
          id="city"
          name="city"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.city}
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
            {genders.map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
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
          error={Boolean(formik.touched.birthDate && formik.errors.birthDate)}
          // @ts-ignore
          helperText={formik.touched.birthDate && formik.errors.birthDate}
          label="Date Of Birth"
          margin="normal"
          id="birthDate"
          name="birthDate"
          type="date"
          onChange={formik.handleChange}
          value={formik.values.birthDate}
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
          error={Boolean(
            formik.touched.phoneNumber && formik.errors.phoneNumber
          )}
          // @ts-ignore
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          label="phoneNumber"
          margin="normal"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.phoneNumber}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Login Details" sx={{ fontWeight: "600" }} />
        </Divider>
        {/* username */}
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.username && formik.errors.username)}
          // @ts-ignore
          helperText={formik.touched.username && formik.errors.username}
          label="username"
          margin="normal"
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: 150, sm: 175, md: 200, lg: 225, xl: 250 },
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
        <Divider sx={{ m: 1 }}></Divider>
        <LoadingButton
          type="submit"
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              height: 40,
            },
            m: 0.5,
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
