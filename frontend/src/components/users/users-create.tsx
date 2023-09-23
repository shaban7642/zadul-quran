import { FC, useCallback, useEffect, useState } from "react";
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
import { rolesApi } from "../../api/rolesApi";
import { useMounted } from "../../hooks/use-mounted";
import { deptApi } from "../../api/deptApi";

interface CreateTableProps {
  depts: any[];
  roles: any[];
}

const CreateUser: FC<CreateTableProps> = (props) => {
  const { depts, roles } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const genders = ["male", "female"];
  const isMounted = useMounted();

  const createUser = async (values: any) => {
    console.log("fff");
    const load = toast.loading("create");
    try {
      await userApi.createUser(values);

      toast.dismiss(load);
      toast.success("createUserSuccess");
    } catch (err: any) {
      toast.error(err.message || "createUsersFailed");
    }
  };

  const formik = useFormik({
    initialValues: {
      roleId: 1,
      join_date: "",
      name: "",
      username: "",
      firstName: "",
      lastName: "",
      city: "",
      gender: "",
      birthDate: "",
      department: 1,
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      roleId: yup.number().required(),
      join_date: yup.date().required("join date Is Required"),
      username: yup.string().required("usernameIsRequired"),
      firstName: yup.string().required("firstNameIsRequired"),
      lastName: yup.string().required("lastNameIsRequired"),
      city: yup.string().required("cityIsRequired"),
      gender: yup.string().required(),
      birthDate: yup.date().required(),
      email: yup.string().email("emailAddress").required("emailIsRequired"),
      phoneNumber: yup.string().required("phoneNumberIsRequired"),
      password: yup.string().min(7).required("passwordIsRequired"),
      confirmPassword: yup
        .string()
        .test("passwords-match", "passwordMustMatch", function (value) {
          return this.parent.password === value;
        }),
    }),
    onSubmit: async (values) => {
      try {
        await createUser(values);

        formik.resetForm();
      } catch (error) {
        console.log(error);
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
    <Box sx={{ margin: 1, scrollBehavior: "auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <Divider textAlign="left" sx={{ mb: 1 }}>
          <Chip label="Academic Details" sx={{ fontWeight: "600" }} />
        </Divider>
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
          <InputLabel
            sx={{
              top: -6,
            }}
            id="outlined-adornment-roleId"
          >
            Role
          </InputLabel>
          <Select
            name="roleId"
            id="outlined-adornment-roleId"
            labelId="outlined-adornment-roleId"
            value={formik.values.roleId}
            onChange={formik.handleChange}
          >
            {roles?.map((roleId) => (
              <MenuItem
                sx={{
                  color: "black",
                  ...(true && {
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette.info.contrastText,
                        theme.palette.action.activatedOpacity
                      ),
                  }),
                  fontFamily: "sans-serif",
                }}
                key={roleId?.id}
                value={roleId?.id}
              >
                {roleId?.displayName}
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
          <InputLabel
            sx={{
              top: -6,
            }}
            id="outlined-adornment-department"
          >
            Department
          </InputLabel>
          <Select
            name="department"
            id="outlined-adornment-department"
            labelId="outlined-adornment-department"
            value={formik.values.department}
            onChange={formik.handleChange}
          >
            {depts?.map((department) => (
              <MenuItem
                sx={{
                  color: "black",
                  ...(true && {
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette.info.contrastText,
                        theme.palette.action.activatedOpacity
                      ),
                  }),
                  fontFamily: "sans-serif",
                }}
                key={department?.id}
                value={department?.id}
              >
                {department?.name}
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
            width: { xs: "100%", sm: "32%" },
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
            width: { xs: "100%", sm: "32%" },
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
          <InputLabel
            sx={{
              top: -6,
            }}
            id="outlined-gender"
          >
            Gender
          </InputLabel>
          <Select
            name="gender"
            id="outlined-gender"
            labelId="outlined-gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
          >
            {genders.map((gender) => (
              <MenuItem
                sx={{
                  color: "black",
                  ...(true && {
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette.info.contrastText,
                        theme.palette.action.activatedOpacity
                      ),
                  }),
                  fontFamily: "sans-serif",
                }}
                key={gender}
                value={gender}
              >
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
          <InputLabel
            sx={{
              top: -6,
            }}
            htmlFor="outlined-adornment-password"
          >
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

export default CreateUser;
