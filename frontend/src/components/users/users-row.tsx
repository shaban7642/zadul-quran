import { FC, Fragment, useEffect, useState } from "react";
import NextLink from "next/link";
import ArrowForwardIosSharp from "@mui/icons-material/ArrowForwardIosSharp";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
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
  roles: any[];
  updateUser: (id: any, userData: any) => Promise<{ success: boolean }>;
  deleteUser: (id: any) => Promise<{ success: boolean }>;
}

export const UsersRow: FC<RowProps> = (props) => {
  const { row, roles, updateUser, deleteUser } = props;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const rows = [
    row?.username || "no data",
    row?.role?.displayName || "no data",

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
      username: row?.username,
      roleId: row?.roleId,

      email: row?.email,
      phoneNumber: row?.phoneNumber,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      roleId: yup.number(),
      id: yup.string().max(255),
      username: yup.string().max(255),
      email: yup.string().email("emailAddress").max(255),
      phoneNumber: yup.string().min(11, "phoneNumberLengthMessage"),
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
        username: row?.username,
        roleId: row?.roleId,

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
            onClick={() => deleteUser(row.id)}
            sx={{ p: 0, ml: 1, mb: 1.5 }}
          >
            <Delete color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow sx={{ border: 0, p: 0 }}>
        <TableCell
          style={{
            paddingLeft: "8px",
            padding: 0,
            border: 0,
          }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, mr: 0 }}>
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
                    width: { xs: "21%" },
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
                      color: "black",
                      fontFamily: "sans-serif",
                    },
                  }}
                />

                <FormControl
                  sx={{
                    width: { xs: "21%" },
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
                    width: { xs: "21%" },
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
                      color: "black",
                      fontFamily: "sans-serif",
                    },
                  }}
                />
                <TextField
                  size="small"
                  sx={{
                    width: { xs: "21%" },
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
                      color: "black",
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
