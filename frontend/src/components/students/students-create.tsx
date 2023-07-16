import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Field, useFormik } from "formik";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
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
import Select from "@material-ui/core/Select";
import { CssBaseline } from "@material-ui/core";

const options = ["Male", "Female"];
const CreateStudent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const createStudent = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("create");
    try {
      const resp = await userApi.createUser(values);
      if (resp.success) {
        toast.dismiss(load);
        toast.success("createStudentSuccess");
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createStudentFailed");
      }
    } catch (err) {
      toast.dismiss(load);
      toast.error(err.message || "createStudentsFailed");
      return { success: false };
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      DOB: "",
      email: "",
      mobile_no: "",
      city: "",
      gender: options[0],
      password: "",
      confirmPassword: "",
      gName: "",
      relation: "",
      gEmail: "",
      gMobile_no: "",
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      first_name: yup.string().max(255).required("nameIsRequired"),
      last_name: yup.string().max(255).required("nameIsRequired"),
      DOB: yup.date().required(),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      mobile_no: yup
        .string()
        .min(11, "phoneNumberLengthMessage")
        .required("phoneNumberIsRequired"),
      city: yup.string().max(200).required("cityRequired"),
      gender: yup.string().required(),

      password: yup.string().min(7).max(255).required("passwordIsRequired"),
      confirmPassword: yup
        .string()
        .test("passwords-match", "passwordMustMatch", function (value) {
          return this.parent.password === value;
        }),
      gName: yup.string().required(),
      relation: yup.string().required(),
      gEmail: yup.string().required(),
      gMobile_no: yup.string().required(),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const { success } = await createStudent(values);
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
        Student Details
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.first_name && formik.errors.first_name)}
          // @ts-ignore
          helperText={formik.touched.first_name && formik.errors.first_name}
          label="first_name"
          margin="normal"
          id="first_name"
          name="first_name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.first_name}
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
          error={Boolean(formik.touched.last_name && formik.errors.last_name)}
          // @ts-ignore
          helperText={formik.touched.last_name && formik.errors.last_name}
          label="last_name"
          margin="normal"
          id="last_name"
          name="last_name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.last_name}
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
        <CssBaseline />
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ margin: 0 }}
        >
          Guardian Details
        </Typography>
        <TextField
          size="small"
          sx={{
            width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.gName && formik.errors.gName)}
          // @ts-ignore
          helperText={formik.touched.gName && formik.errors.gName}
          label="gName"
          margin="normal"
          id="gName"
          name="gName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.gName}
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
          error={Boolean(formik.touched.relation && formik.errors.relation)}
          // @ts-ignore
          helperText={formik.touched.relation && formik.errors.relation}
          label="relation"
          margin="normal"
          id="relation"
          name="relation"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.relation}
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
        <LoadingButton
          type="submit"
          sx={{
            width: "90%",
            "& .MuiInputBase-root": {
              height: 40,
            },
            m: 0.5,
            mt: 2,
          }}
          variant="contained"
        >
          Save
        </LoadingButton>
      </form>
    </Box>
  );
};

export default CreateStudent;
