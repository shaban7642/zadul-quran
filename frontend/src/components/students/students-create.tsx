import { FC, useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import { VisibilityOff } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import { PasswordValidationForm } from "../auth/password-validation-form";
import Select from "@material-ui/core/Select";
import { alpha, useTheme } from "@mui/material/styles";
import { useMounted } from "../../hooks/use-mounted";
interface CreateStudentProps {
  depts: any[];
}
interface parent {
  id: number;
  name: string;
}

const CreateStudent: FC<CreateStudentProps> = (props) => {
  const { depts } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [flag, setFlag] = useState(false);
  const [parents, setParents] = useState<parent[]>([]);
  const genders = ["male", "female"];
  const isMounted = useMounted();

  const handleChange = () => {
    setFlag(!flag);
  };
  const getParents = useCallback(async () => {
    try {
      const data: any = await userApi.getAllParents();
      if (isMounted()) {
        setParents(data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const createStudent = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("create");
    try {
      const resp = await userApi.createUser(values);
      if (!resp.message) {
        toast.dismiss(load);
        toast.success("createStudent ");
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createStudentFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createStudentsFailed");
      return { success: false };
    }
  };

  const formik = useFormik({
    initialValues: {
      roleId: 4,
      username: "",
      firstName: "",
      lastName: "",
      city: "",
      birthDate: "",
      departmentId: 1,
      email: "",
      zoomLink: "",
      phoneNumber: "",
      gender: genders[0],
      password: "",
      confirmPassword: "",
      parentId: "",
      gname: "",
      relation: "",
      gemail: "",
      gphoneNumber: "",
      gcity: "",
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      firstName: yup.string().max(255).required("name Is Required"),
      lastName: yup.string().max(255).required("name Is Required"),
      username: yup.string().max(255).required("username Is Required"),
      birthDate: yup.date().required(),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("email Is Required"),
      zoomLink: yup
        .string()
        .url("Zoom Link must be a url")
        .required("Zoom link Is Required"),
      phoneNumber: yup.string().required("phoneNumber Is Required"),
      city: yup.string().max(200).required("cityRequired"),
      gender: yup.string().required(),

      password: yup.string().min(7).max(255).required("password Is Required"),
      confirmPassword: yup
        .string()
        .test("passwords-match", "passwordMustMatch", function (value) {
          return this.parent.password === value;
        }),
    }),
    onSubmit: async (values) => {
      const data = {
        parentData: {
          name: values.gname,
          email: values.gemail,
          relation: values.relation,
          phoneNumber: values.gphoneNumber,
          city: values.gcity,
        },
        ...values,
      };
      const dataAny = data as any;
      delete dataAny.gname;
      delete dataAny.gemail;
      delete dataAny.relation;
      delete dataAny.gphoneNumber;
      delete dataAny.gcity;
      delete dataAny.submit;

      const { success } = await createStudent(data);
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

  useEffect(() => {
    getParents();
  }, [formik.values.email]);
  return (
    <Box sx={{ margin: 1, scrollBehavior: "auto" }}>
      <form onSubmit={formik.handleSubmit}>
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Student Details" sx={{ fontWeight: "600" }} />
        </Divider>
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "48.5%" },
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
              paddingLeft: "6px",
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "48.5%" },
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
              paddingLeft: "6px",
              fontFamily: "sans-serif",
            },
          }}
        />{" "}
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
            id="outlined-adornment-gender"
          >
            Gender
          </InputLabel>
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
          error={Boolean(formik.touched.city && formik.errors.city)}
          // @ts-ignore
          helperText={formik.touched.city && formik.errors.city}
          label="City"
          margin="normal"
          id="city"
          name="city"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.city}
          InputProps={{
            style: {
              paddingLeft: "6px",
              fontFamily: "sans-serif",
            },
          }}
        />
        <TextField
          size="small"
          sx={{
            width: { xs: "100%", sm: "48.5%" },
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
          label="Phone Number"
          margin="normal"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.phoneNumber}
          InputProps={{
            style: {
              paddingLeft: "6px",
              fontFamily: "sans-serif",
            },
          }}
        />
        <FormControl
          sx={{
            width: { xs: "100%", sm: "48.5%" },
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
            name="departmentId"
            id="outlined-adornment-department"
            labelId="outlined-adornment-department"
            value={formik.values.departmentId}
            onChange={formik.handleChange}
          >
            {depts?.map((department: any) => (
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
        <TextField
          size="small"
          sx={{
            width: { xs: "98%" },
            "& .MuiInputBase-root": {
              height: 40,
            },
            mr: 1,
          }}
          error={Boolean(formik.touched.zoomLink && formik.errors.zoomLink)}
          // @ts-ignore
          helperText={formik.touched.zoomLink && formik.errors.zoomLink}
          label="Zoom Link"
          margin="normal"
          id="zoomLink"
          name="zoomLink"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.zoomLink}
          InputProps={{
            style: {
              paddingLeft: "6px",
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
          label="Username"
          margin="normal"
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
          InputProps={{
            style: {
              paddingLeft: "6px",
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
          label="Email"
          margin="normal"
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          InputProps={{
            style: {
              paddingLeft: "6px",
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
              paddingLeft: "6px",
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
              paddingLeft: "6px",
              fontFamily: "sans-serif",
            },
          }}
        />
        <Divider textAlign="left" sx={{ m: 1 }}>
          <Chip label="Guardian Details" sx={{ fontWeight: "600" }} />
        </Divider>
        <FormControlLabel
          sx={{ width: "100%" }}
          control={<Checkbox value={flag} onChange={handleChange} />}
          label="Guardian Already Exist"
        />
        {flag ? (
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
              id="outlined-adornment-parentId"
            >
              Guardian
            </InputLabel>
            <Select
              name="parentId"
              id="outlined-adornment-parentId"
              labelId="outlined-adornment-parentId"
              value={formik.values.parentId}
              onChange={formik.handleChange}
            >
              {parents?.map((parent) => {
                if (parent.name) {
                  return (
                    <MenuItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
        ) : (
          <>
            <TextField
              size="small"
              sx={{
                width: { xs: "100%", sm: "48.5%" },
                "& .MuiInputBase-root": {
                  height: 40,
                },
                mr: 1,
              }}
              error={Boolean(formik.touched.gname && formik.errors.gname)}
              // @ts-ignore
              helperText={formik.touched.gname && formik.errors.gname}
              label="Name"
              margin="normal"
              id="gname"
              name="gname"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.gname}
              InputProps={{
                style: {
                  paddingLeft: "6px",
                  fontFamily: "sans-serif",
                },
              }}
            />
            <TextField
              size="small"
              sx={{
                width: { xs: "100%", sm: "48.5%" },
                "& .MuiInputBase-root": {
                  height: 40,
                },
                mr: 1,
              }}
              error={Boolean(formik.touched.relation && formik.errors.relation)}
              // @ts-ignore
              helperText={formik.touched.relation && formik.errors.relation}
              label="Relation"
              margin="normal"
              id="relation"
              name="relation"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.relation}
              InputProps={{
                style: {
                  paddingLeft: "6px",
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
              error={Boolean(formik.touched.gemail && formik.errors.gemail)}
              // @ts-ignore
              helperText={formik.touched.gemail && formik.errors.gemail}
              label="Email"
              margin="normal"
              id="gemail"
              name="gemail"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.gemail}
              InputProps={{
                style: {
                  paddingLeft: "6px",
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
              error={Boolean(
                formik.touched.gphoneNumber && formik.errors.gphoneNumber
              )}
              // @ts-ignore
              helperText={
                formik.touched.gphoneNumber && formik.errors.gphoneNumber
              }
              label="Phone Number"
              margin="normal"
              id="gphoneNumber"
              name="gphoneNumber"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.gphoneNumber}
              InputProps={{
                style: {
                  paddingLeft: "6px",
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
              error={Boolean(formik.touched.gcity && formik.errors.gcity)}
              // @ts-ignore
              helperText={formik.touched.gcity && formik.errors.gcity}
              label="City"
              margin="normal"
              id="gcity"
              name="gcity"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.gcity}
              InputProps={{
                style: {
                  paddingLeft: "6px",
                  fontFamily: "sans-serif",
                },
              }}
            />
          </>
        )}
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
