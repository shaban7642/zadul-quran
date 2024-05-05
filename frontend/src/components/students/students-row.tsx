import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  TableCell,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import ArrowForwardIosSharp from "@mui/icons-material/ArrowForwardIosSharp";
import Collapse from "@mui/material/Collapse";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
import Delete from "@mui/icons-material/Delete";
import { alpha, useTheme } from "@mui/material/styles";
interface RowProps {
  row: any;
  labelId: string;
  depts: any[];
  updateStudent: (id: any, userData: any) => Promise<{ success: boolean }>;
  deleteStudent: (id: any) => Promise<{ success: boolean }>;
}
export const StudentsRow: FC<RowProps> = (props) => {
  const { row, depts, labelId, updateStudent, deleteStudent } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const rows = [
    row?.firstName || "no data",
    row?.lastName || "no data",
    row?.department?.name || "no data",
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
      departmentId: row?.departmentId,
      email: row?.email,
      phoneNumber: row?.phoneNumber,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      firstName: yup.string().max(255).required("first name Is Required"),
      lastName: yup.string().max(255).required("last name Is Required"),
      email: yup
        .string()
        .email("emailAddress")
        .max(255)
        .required("email Is Required"),
      phoneNumber: yup
        .string()
        .min(11, "phoneNumberLengthMessage")
        .required("phoneNumber Is Required"),
    }),
    onSubmit: async (values) =>
    {
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
        departmentId: row?.departmentId,
        email: row?.email,
        phoneNumber: row?.phoneNumber,
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
          <NextLink href={`/profile/${row.id}`} passHref>
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
                    width: { xs: "17%" },
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
                    width: { xs: "17%" },
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
                <FormControl
                  sx={{
                    width: { xs: "17%" },
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
                    width: { xs: "17%" },
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
                    width: { xs: "17%" },
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

                <LoadingButton
                  type="submit"
                  sx={{
                    width: { xs: 15, sm: 21, md: 30, lg: 40, xl: 50 },
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
