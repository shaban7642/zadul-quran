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
  Divider,
  Chip,
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

const genders = ["male", "female"];
const CreateStudent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const createStudent = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("create");
    try {
      const resp = await userApi.createUser(values);
      if (resp) {
        toast.dismiss(load);
        toast.success("createStudentSuccess");
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createStudentFailed");
        return { success: false };
      }
    } catch (err) {
      toast.dismiss(load);
      toast.error(err.message || "createStudentsFailed");
      return { success: false };
    }
  };

  const formik = useFormik({
    initialValues: {
      roleId: 4,
      username: "abdo",
      firstName: "abdo",
      lastName: "abbas",
      city: "giza",
      birthDate: "",
      email: "A.ai@gmail.com",
      phoneNumber: "023245345345",
      gender: genders[0],
      password: "Abdo@001",
      confirmPassword: "Abdo@001",
      gName: "",
      relation: "",
      gEmail: "",
      gMobile_no: "",
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      firstName: yup.string().max(255).required("nameIsRequired"),
      lastName: yup.string().max(255).required("nameIsRequired"),
      username: yup.string().max(255).required("usernameIsRequired"),
      birthDate: yup.date().required(),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      phoneNumber: yup
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
      <form onSubmit={formik.handleSubmit}>
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Student Details" sx={{ fontWeight: "600" }} />
        </Divider>
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "32%" },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.firstName && formik.errors.firstName)}
          // @ts-ignore
          helperText={formik.touched.firstName && formik.errors.firstName}
          label="firstName"
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
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "32%" },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.lastName && formik.errors.lastName)}
          // @ts-ignore
          helperText={formik.touched.lastName && formik.errors.lastName}
          label="lastName"
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
            width: { xs: "100%", sm: "32%" },
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
            width: { xs: "100%", sm: "32%" },
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
        <FormControl
          sx={{
            width: { xs: "100%", sm: "32%" },
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
            width: { xs: "100%", sm: "32%" },
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
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Login Details" sx={{ fontWeight: "600" }} />
        </Divider>
        {/* username */}
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "35%" },
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
            width: { xs: "100%", sm: "45%" },
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
            width: { xs: "100%", sm: "40%" },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
            marginTop: 2,
          }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            // helperText={formik.touched.password && formik.errors.password}
            label="Password"
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
            width: { xs: "100%", sm: "40%" },
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
          label="Confirm Password"
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
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Guardian Details" sx={{ fontWeight: "600" }} />
        </Divider>

        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "24%" },
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
            width: { xs: "100%", sm: "24%" },
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
            width: { xs: "100%", sm: "24%" },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.gEmail && formik.errors.gEmail)}
          // @ts-ignore
          helperText={formik.touched.gEmail && formik.errors.gEmail}
          label="gEmail"
          margin="normal"
          id="gEmail"
          name="gEmail"
          type="gEmail"
          onChange={formik.handleChange}
          value={formik.values.gEmail}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "24%" },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.gMobile_no && formik.errors.gMobile_no)}
          // @ts-ignore
          helperText={formik.touched.gMobile_no && formik.errors.gMobile_no}
          label="gMobile_no"
          margin="normal"
          id="gMobile_no"
          name="gMobile_no"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.gMobile_no}
          InputProps={{
            style: {
              fontFamily: "sans-serif",
            },
          }}
        />
        <Divider sx={{ m: 1 }}></Divider>
        <div style={{ textAlign: "right" }}>
          <LoadingButton
            type="submit"
            sx={{
              "& .MuiInputBase-root": {
                height: 40,
              },
              m: 0.5,
              p: 1,
            }}
            variant="contained"
          >
            Save
          </LoadingButton>
        </div>
      </form>
    </Box>
  );
};

export default CreateStudent;
