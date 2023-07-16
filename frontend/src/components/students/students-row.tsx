import { FC, Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import get from "lodash/get";
import set from "lodash/set";
interface RowProps {
  row: any;
  handleSelectOne: (name: number) => void;
  isItemSelected: boolean;
  labelId: string;
  updateStudent: (id: any, userData: any) => Promise<{ success: boolean }>;
}
export const StudentsRow: FC<RowProps> = (props) => {
  const { row, handleSelectOne, isItemSelected, labelId, updateStudent } =
    props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const rows = [
    row?.first_name || "no data",
    row?.last_name || "no data",
    row?.department || "no data",
    row?.email || "no data",
    row?.mobile_no || "no data",
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
      first_name: row?.first_name,
      last_name: row?.last_name,
      department: row?.department,
      email: row?.email,
      mobile_no: row?.mobile_no,
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
      mobile_no: yup
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
        sl: row?.sl,
        staff_id: row?.staff_id,
        name: row?.name,
        department: row?.department,
        email: row?.email,
        mobile_no: row?.mobile_no,
        password: "",
      });
    }
  }, [row]);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: 0, cursor: "pointer" } }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            sx={{
              color: theme.palette.info.main,
            }}
            onClick={() => handleSelectOne(row.sl)}
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
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
      </TableRow>
      <TableRow sx={{ border: 0 }}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
          colSpan={6}
        >
          {/* <Collapse in={open} timeout="auto" unmountOnExit>
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
                    formik.touched.staff_id && formik.errors.staff_id
                  )}
                  // @ts-ignore
                  helperText={formik.touched.staff_id && formik.errors.staff_id}
                  label="staff_id"
                  margin="normal"
                  id="staff_id"
                  name="staff_id"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.staff_id}
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
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  // @ts-ignore
                  helperText={formik.touched.name && formik.errors.name}
                  label="name"
                  margin="normal"
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
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
                    formik.touched.mobile_no && formik.errors.mobile_no
                  )}
                  // @ts-ignore
                  helperText={
                    formik.touched.mobile_no && formik.errors.mobile_no
                  }
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
          </Collapse> */}
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
