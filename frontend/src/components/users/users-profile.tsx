import { FC, useEffect } from "react";
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
/* eslint-disable */
const departments = ["Admin", "Teacher", "Accountant"];
const designations = ["Admin", "Teacher", "Accountant"];

interface profileProps {
  id: number;
}
export const Profile: FC<profileProps> = (props) => {
  const { id } = props;
  const [userData, setUserData] = useState<Data>({
    id: "",
    username: "",
    roleId: "",
    desination: "",
    department: "",
    email: "",
    phoneNumber: "",
  });

  const getProfile = async (id: number) => {
    try {
      const resp = await userApi.getUserById(id);

      setUserData(resp);
    } catch (err: any) {
      console.log(err);
    }
  };
  const formik = useFormik({
    initialValues: {
      id: userData?.id,
      username: userData?.username,
      designation: userData?.desination,
      department: userData?.department,
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
      password: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      id: yup.string().max(255).required("idIsRequired"),
      username: yup.string().max(255),
      designation: yup.string().max(255),
      department: yup.string().max(255),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("emailIsRequired"),
      phoneNumber: yup
        .string()
        .min(11, "phoneNumberLengthMessage")
        .required("phoneNumberIsRequired"),
      password: yup.string().min(6).max(255),
    }),
    onSubmit: (values) => {
      updateProfile(values);
    },
  });

  const updateProfile = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("update");
    try {
      const resp = await userApi.updateUser(id, values);
      if (resp.success) {
        setUserData(resp.data);
        toast.dismiss(load);
        toast.success("updateSuccess");
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
              height: "400px",
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
            <List>
              <ListItem>username: {userData.username}</ListItem>
              <ListItem>email: {userData.email}</ListItem>
              <ListItem>phone_number: {userData.phoneNumber}</ListItem>
              <ListItem>role: {userData.roleId}</ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Paper
            elevation={12}
            sx={{
              m: 1,
              p: 2,
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
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  mb: 0,
                  mt: 2,
                }}
                error={Boolean(formik.touched.id && formik.errors.id)}
                // @ts-ignore
                helperText={formik.touched.id && formik.errors.id}
                label="id"
                margin="normal"
                id="id"
                name="id"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.id}
                InputProps={{
                  style: {
                    fontFamily: "sans-serif",
                  },
                }}
              />
              <TextField
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  mb: 0,
                  mt: 2,
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
                  },
                }}
              />

              <FormControl
                sx={{
                  width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },

                  mr: 1,
                  mb: 0,
                  mt: 2,
                }}
                variant="outlined"
              >
                {" "}
                <InputLabel id="outlined-adornment-department">
                  Department
                </InputLabel>
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
                  width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  mb: 0,
                  mt: 2,
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
              <TextField
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  mb: 0,
                  mt: 2,
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
                  },
                }}
              />
              <TextField
                size="small"
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                  mr: 1,
                  mb: 0,
                  mt: 2,
                }}
                error={Boolean(
                  formik.touched.password && formik.errors.password
                )}
                // @ts-ignore
                helperText={formik.touched.password && formik.errors.password}
                label="password"
                margin="normal"
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                InputProps={{
                  style: {
                    fontFamily: "sans-serif",
                  },
                }}
              />
              <LoadingButton
                type="submit"
                sx={{ m: 1, mt: 2 }}
                variant="contained"
              >
                submit
              </LoadingButton>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
