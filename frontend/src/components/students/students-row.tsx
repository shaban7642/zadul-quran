import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { TableCell, IconButton } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import ArrowForwardIosSharp from "@mui/icons-material/ArrowForwardIosSharp";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
import Delete from "@mui/icons-material/Delete";
interface RowProps {
  row: any;
  labelId: string;
  updateStudent: (id: any, userData: any) => Promise<{ success: boolean }>;
  deleteStudent: (id: any) => Promise<{ success: boolean }>;
}
export const StudentsRow: FC<RowProps> = (props) => {
  const { row, labelId, updateStudent, deleteStudent } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const rows = [
    row?.firstName || "no data",
    row?.lastName || "no data",
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
      firstName: row?.firstName,
      lastName: row?.lastName,
      department: row?.department,
      email: row?.email,
      phoneNumber: row?.phoneNumber,
      password: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      sl: yup.string().max(255).required("slIsRequired"),
      staff_id: yup.string().max(255).required("staff_idIsRequired"),
      name: yup.string().max(255).required("nameIsRequired"),
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
      const { success } = await updateStudent(row.id, resultObject);
      if (success) {
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    if (row) {
      formik.setValues({
        firstName: row?.firstName,
        lastName: row?.lastName,
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
          <NextLink href={`/students/${row.id}`} passHref>
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
            onClick={() => deleteStudent(row.id)}
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
                  error={Boolean(
                    formik.touched.firstName && formik.errors.firstName
                  )}
                  // @ts-ignore
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  label="name"
                  margin="normal"
                  id="name"
                  name="name"
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
                    width: { xs: 100, sm: 125, md: 150, lg: 175, xl: 200 },
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
                  label="name"
                  margin="normal"
                  id="name"
                  name="name"
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
                  error={Boolean(
                    formik.touched.department && formik.errors.department
                  )}
                  // @ts-ignore
                  helperText={
                    formik.touched.department && formik.errors.department
                  }
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
