import { FC, Fragment, useEffect, useState } from "react";
import NextLink from "next/link";
import ArrowForwardIosSharp from "@mui/icons-material/ArrowForwardIosSharp";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
import { useRouter } from "next/router";
import Delete from "@mui/icons-material/Delete";
interface RowProps {
  row: any;
  labelId: string;
  updateUser: (id: any, userData: any) => Promise<{ success: boolean }>;
  deleteUser: (id: any) => Promise<{ success: boolean }>;
}

const departments = ["Admin", "Teacher", "Accountant"];
const designations = ["Admin", "Teacher", "Accountant"];
export const UsersRow: FC<RowProps> = (props) => {
  const { row, labelId, updateUser, deleteUser } = props;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const rows = [
    row?.id || "no data",
    row?.username || "no data",
    row?.designation || "no data",
    row?.department || "no data",
    row?.email || "no data",
    row?.phoneNumber || "no data",
  ];

  const flattenObject = (ob: any) => {
    let toReturn: any = {};
    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;
      if (typeof ob[i] == "object" && ob[i] !== null) {
        let flatObject = flattenObject(ob[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + "." + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  };

  const formik = useFormik({
    initialValues: {
      id: row?.id,
      username: row?.username,
      designation: row?.designation,
      department: row?.department,
      email: row?.email,
      phoneNumber: row?.phoneNumber,
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
    onSubmit: async (values) => {
      const flattened = flattenObject(formik.initialValues);
      //only get the modified values to not accidentally edit old ones.
      let resultObject: any = {};
      Object.entries(flattened)?.map((entry) => {
        const [key, oldVal] = entry;
        const newVal = get(values, key);
        if (newVal !== oldVal) {
          set(resultObject, key, newVal);
        }
      });
      const { success } = await updateUser(row.id, resultObject);
      if (success) {
        setOpen(false);
        console.log("done");
      }
    },
  });

  useEffect(() => {
    if (row) {
      formik.setValues({
        id: row?.id,
        username: row?.username,
        designation: row?.designation,
        department: row?.department,
        email: row?.email,
        phoneNumber: row?.phoneNumber,
        password: "",
      });
    }
  }, [row]);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: 0, cursor: "pointer" } }}>
        {rows?.map((r: any, idx) => (
          <TableCell
            key={idx}
            scope="row"
            onClick={() => setOpen(!open)}
            sx={{
              color: "black",
            }}
          >
            {r}
          </TableCell>
        ))}
        <TableCell scope="row" sx={{}}>
          <NextLink href={`/employees/${row.id}`} passHref>
            <ArrowForwardIosSharp
              sx={{
                color: "black",
                bgcolor: theme.palette.info.light,
                cursor: "pointer",
                border: "1px",
                borderRadius: "70%",
                ":hover": { bgcolor: theme.palette.info.main },
              }}
            />
          </NextLink>
          <IconButton
            onClick={() => deleteUser(row.id)}
            sx={{ p: 0, ml: 1, mb: 1.5 }}
          >
            <Delete color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow sx={{ border: 0 }}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ margin: 0 }}
              >
                edit
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
                    width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
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
                    width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                    mr: 1,
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
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
