import { FC, useCallback, useEffect } from "react";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  alpha,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
import { get } from "lodash";
import { useRouter } from "next/router";
import { Data } from "./users-table";
import { userApi } from "../../api/userApi";
import { rolesApi } from "../../api/rolesApi";
import { useMounted } from "../../hooks/use-mounted";
import { deptApi } from "../../api/deptApi";
import moment from "moment";

interface RoleId {
  displayName: string;
  id: number;
  name: string;
}
interface profileProps {
  id: number;
}
export const Profile: FC<profileProps> = (props) => {
  const { id } = props;
  const [roles, setRoles] = useState<RoleId[]>([]);
  const [depts, setDepts] = useState([]);
  const genders = ["male", "female"];
  const isMounted = useMounted();
  const [userData, setUserData] = useState<Data>({
    id: 1,
    roleId: 1,
    username: "",
    firstName: "",
    lastName: "",
    city: "",
    gender: "",
    birthDate: "",
    department: 1,
    email: "",
    phoneNumber: "",
  });
  const getDepts = useCallback(async () => {
    try {
      const data: any = await deptApi.getDepts();
      if (isMounted()) {
        setDepts(data.rows);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);
  const getRoles = useCallback(
    async () => {
      try {
        const data: any = await rolesApi.getRoles();

        if (isMounted()) {
          setRoles(data.resp);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  useEffect(() => {
    getDepts();
  }, []);
  useEffect(() => {
    getRoles();
  }, []);
  const getProfile = async (id: number) => {
    try {
      const resp = await userApi.getUserById(id);

      setUserData(resp);
    } catch (err: any) {
      console.log(err);
    }
  };
  const getUserRole = () => {
    switch (userData?.roleId) {
      case 1:
        return "Super Admin";
      case 2:
        return "Admin";
      case 3:
        return "Teacher";
      case 4:
        return "Student";
      case 5:
        return "Parent";
      default:
        return "";
    }
  };
  const formik = useFormik({
    initialValues: {
      roleId: userData?.roleId,
      username: userData?.username,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      city: userData?.city,
      gender: userData?.gender,
      birthDate: userData?.birthDate,
      department: userData?.department,
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      roleId: yup.number(),
      username: yup.string(),
      firstName: yup.string(),
      lastName: yup.string(),
      city: yup.string(),
      gender: yup.string(),
      birthDate: yup.date(),
      email: yup.string().email("emailAddress"),
      phoneNumber: yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        await updateProfile(values);

        formik.resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const updateProfile = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("update");
    try {
      const resp = await userApi.updateUser(id, values);
      if (resp.success) {
        setUserData(resp.data);
        toast.dismiss(load);
        toast.success("update ");
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updatesFailed");
      return { success: false };
    }
  };

  useEffect(() => {
    getProfile(id);
  }, [id]);
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Paper
            elevation={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "40px 60px",
              minHeight: "280px",

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
            <Typography color="inherit" variant="h6">
              prsonal info
            </Typography>

            <Grid container component={List}>
              <Grid item xs={6}>
                {" "}
                <ListItem>
                  Username:{" "}
                  <Typography color={"black"}>
                    {userData?.username || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Email:{" "}
                  <Typography color={"black"}>
                    {userData?.email || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  First name:{" "}
                  <Typography color={"black"}>
                    {userData?.firstName || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Last name:{" "}
                  <Typography color={"black"}>
                    {userData?.lastName || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  City:{" "}
                  <Typography color={"black"}>
                    {userData?.city || "No data"}
                  </Typography>{" "}
                </ListItem>
              </Grid>
              <Grid item xs={6}>
                <ListItem>
                  Role:{" "}
                  <Typography color={"black"}>
                    {getUserRole() || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Department:{" "}
                  <Typography color={"black"}>
                    {userData?.department || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Gender:{" "}
                  <Typography color={"black"}>
                    {userData?.gender || "No data"}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Date of birth:
                  <Typography color={"black"}>
                    {" "}
                    {moment(userData?.birthDate.toString() || "No data").format(
                      "MMM-D-YYYY"
                    )}
                  </Typography>{" "}
                </ListItem>
                <ListItem>
                  Phone number:{" "}
                  <Typography color={"black"}>
                    {userData?.phoneNumber || "No data"}
                  </Typography>{" "}
                </ListItem>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Paper
            elevation={12}
            sx={{
              m: 1,
              p: 2,
              minHeight: "280px",
              ...(true && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.info.contrastText,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <TextField
                size="small"
                sx={{
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                }}
                error={Boolean(
                  formik.touched.username && formik.errors.username
                )}
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
                    color: "black",
                  },
                }}
              />
              <TextField
                size="small"
                sx={{
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%" },
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
                    color: "black",
                  },
                }}
              />
              <TextField
                size="small"
                sx={{
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%", md: "31.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                }}
                error={Boolean(
                  formik.touched.firstName && formik.errors.firstName
                )}
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
                    color: "black",
                  },
                }}
              />
              {/* lastname */}
              <TextField
                size="small"
                sx={{
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%", md: "31.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                }}
                error={Boolean(
                  formik.touched.lastName && formik.errors.lastName
                )}
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
                    color: "black",
                  },
                }}
              />
              <TextField
                size="small"
                sx={{
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%", md: "31.5%" },
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
                    color: "black",
                  },
                }}
              />
              <FormControl
                sx={{
                  width: { xs: "100%", sm: "47.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  marginTop: 3,
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
              <FormControl
                sx={{
                  width: { xs: "100%", sm: "47.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  marginTop: 3,
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
              <FormControl
                sx={{
                  width: { xs: "100%", sm: "47.5%", md: "31.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  marginTop: 3,
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
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%", md: "31.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                }}
                error={Boolean(
                  formik.touched.birthDate && formik.errors.birthDate
                )}
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
                  mt: 3,
                  width: { xs: "100%", sm: "47.5%", md: "31.5%" },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                }}
                error={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                )}
                // @ts-ignore
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
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
                    color: "black",
                  },
                }}
              />
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
