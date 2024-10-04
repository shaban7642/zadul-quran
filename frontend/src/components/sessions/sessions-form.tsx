import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  MenuItem,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { Field, useFormik } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMounted } from "../../hooks/use-mounted";
import { useAuth } from "../../hooks/use-auth";
import { userApi } from "../../api/userApi";
import { deptApi } from "../../api/deptApi";
import { sessionApi } from "../../api/sessionsApi";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { sessionMethods } from "./sessions-create";
import { Session } from "../users/users-profile";

const weekDays = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

interface SessionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  session?: Session;
  createSession: (values: any) => Promise<{ success: boolean }>;
}
export const SessionForm: FC<SessionFormProps> = (props) => {
  const { open, setOpen, session, createSession } = props;
  const isMounted = useMounted();

  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sessionTypes, setSessionTypes] = useState<any[]>([]);

  const getUsers = useCallback(
    async (rowsPerPage: any, page: number) => {
      try {
        const data: any = await userApi.getUsers(
          rowsPerPage,
          page,
          "teacher",
          "student"
        );

        if (isMounted()) {
          const filteredStudents: any[] = data.rows.filter(
            (row: any) => row?.roleId === 4
          );
          const filteredTeachers: any[] = data.rows.filter(
            (row: any) => row?.roleId === 3
          );
          setStudents(filteredStudents);
          setTeachers(filteredTeachers);
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  const getSubjects = useCallback(
    async () => {
      try {
        const data: any = await deptApi.getDepts("ALL", -1);
        if (isMounted()) {
          setSubjects(data.rows);
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  const getSessionTypes = useCallback(
    async () => {
      try {
        const data: any = await sessionApi.getSessionTypes();
        if (isMounted()) {
          setSessionTypes(data.resp);
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );
  useEffect(() => {
    getUsers("ALL", -1);
    getSubjects();
    getSessionTypes();
  }, []);
  useEffect(() => {
    if (session) {
      formik.setValues(session);
    }
  }, [session]);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      departmentId: "",
      sessionTypeId: "",
      studentId: "",
      teacherId: "",
      //  fromDate: "",
      toDate: "",
      dayOfWeek: [] as number[],

      endTime: "",
      title: "",
      sessionMethod: "",
    },

    validationSchema: yup.object({
      departmentId: yup.number().required("subject is required"),
      sessionTypeId: yup.number().required("session type is required"),
      studentId: yup.number().required("student is required"),
      teacherId: yup.number().required("teacher is required"),
      dayOfWeek: yup.number().required("dayOfWeek is required"),
      // fromDate: yup.date().required("fromDate is required"),
      toDate: yup.date().required("toDate is required"),
      //startTime: yup.string().required("startTime is required"),
      endTime: yup.string().required("endTime is required"),
      title: yup.string().required("title is required"),
      sessionMethod: yup.string().required("sessionMethod is required"),
    }),
    onSubmit: async (values) => {
      const date = new Date(String(fromDate));
      const time = date.getTime();
      const startTime = moment(time);
      const endTime = moment(values.endTime, "HH:mm");

      const { success } = await createSession({
        ...values,
        fromDate,
        startTime: startTime.utc().format("HH:mm"),
        endTime: endTime.utc().format("HH:mm"),
      });
      if (success) {
        handleClose();
        formik.resetForm();
      }
    },
  });

  return (
    <Dialog maxWidth="md" open={open}>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="subtitle2">Create patch of sessions</Typography>
      </DialogTitle>
      <Box sx={{ p: 2, bgcolor: "white" }}>
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                label="Title"
                name="title"
                type="text"
                sx={{ width: "100%" }}
                onChange={formik.handleChange}
                value={formik.values.title}
                error={Boolean(formik.errors.title && formik.touched.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Session Method"
                  name="sessionMethod"
                  value={formik.values.sessionMethod}
                  error={Boolean(
                    formik.errors.sessionMethod && formik.touched.sessionMethod
                  )}
                  helperText={
                    formik.touched.sessionMethod && formik.errors.sessionMethod
                  }
                  InputLabelProps={{
                    shrink: formik.values.sessionMethod ? true : false,
                  }}
                  fullWidth
                  required
                  select
                  onChange={formik.handleChange}
                >
                  {sessionMethods.map(
                    (option: { value: string; label: string }) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Subject"
                  name="departmentId"
                  value={formik.values.departmentId}
                  error={Boolean(
                    formik.errors.departmentId && formik.touched.departmentId
                  )}
                  helperText={
                    formik.touched.departmentId && formik.errors.departmentId
                  }
                  InputLabelProps={{
                    shrink: formik.values.departmentId ? true : false,
                  }}
                  fullWidth
                  required
                  select
                  onChange={formik.handleChange}
                >
                  {subjects.map((option: { id: string; name: string }) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Teacher"
                  name="teacherId"
                  value={formik.values.teacherId}
                  error={Boolean(
                    formik.errors.teacherId && formik.touched.teacherId
                  )}
                  helperText={
                    formik.touched.teacherId && formik.errors.teacherId
                  }
                  InputLabelProps={{
                    shrink: formik.values.teacherId ? true : false,
                  }}
                  fullWidth
                  required
                  select
                  onChange={formik.handleChange}
                >
                  {teachers.map(
                    (option: {
                      id: string;
                      firstName: string;
                      lastName: string;
                    }) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.firstName} {option.lastName}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Student"
                  name="studentId"
                  value={formik.values.studentId}
                  error={Boolean(
                    formik.errors.studentId && formik.touched.studentId
                  )}
                  fullWidth
                  required
                  select
                  helperText={
                    formik.touched.studentId && formik.errors.studentId
                  }
                  InputLabelProps={{
                    shrink: formik.values.studentId ? true : false,
                  }}
                  onChange={formik.handleChange}
                >
                  {students.map(
                    (option: {
                      id: string;
                      firstName: string;
                      lastName: string;
                    }) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.firstName} {option.lastName}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {/* <TextField
              label="From Date"
              name="fromDate"
              type="date"
              sx={{ width: "100%" }}
              onChange={formik.handleChange}
              value={formik.values.fromDate}
              error={Boolean(
                formik.errors.fromDate && formik.touched.fromDate
              )}
              helperText={formik.touched.fromDate && formik.errors.fromDate}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  name="fromDate"
                  sx={{ width: "100%" }}
                  label="From Date & Start Time"
                  value={fromDate}
                  onChange={(newValue: any) => {
                    setFromDate(newValue?.$d);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                label="To Date"
                name="toDate"
                type="date"
                sx={{ width: "100%" }}
                onChange={formik.handleChange}
                value={formik.values.toDate}
                error={Boolean(formik.errors.toDate && formik.touched.toDate)}
                helperText={formik.touched.toDate && formik.errors.toDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                label="End Time"
                name="endTime"
                type="time"
                sx={{ width: "100%" }}
                onChange={formik.handleChange}
                value={formik.values.endTime}
                error={Boolean(formik.errors.endTime && formik.touched.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Day of week"
                  name="dayOfWeek"
                  value={formik.values.dayOfWeek}
                  error={Boolean(
                    formik.errors.dayOfWeek && formik.touched.dayOfWeek
                  )}
                  helperText={
                    formik.touched.dayOfWeek && formik.errors.dayOfWeek
                  }
                  InputLabelProps={{
                    shrink: formik.values.dayOfWeek ? true : false,
                  }}
                  fullWidth
                  required
                  select
                  onChange={formik.handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  {weekDays.map((option: { value: number; label: string }) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Session Type"
                  name="sessionTypeId"
                  value={formik.values.sessionTypeId}
                  error={Boolean(
                    formik.errors.sessionTypeId && formik.touched.sessionTypeId
                  )}
                  helperText={
                    formik.touched.sessionTypeId && formik.errors.sessionTypeId
                  }
                  InputLabelProps={{
                    shrink: formik.values.sessionTypeId ? true : false,
                  }}
                  fullWidth
                  required
                  select
                  onChange={formik.handleChange}
                >
                  {sessionTypes.map((option: { id: string; name: string }) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button variant="outlined" size="small" onClick={handleClose}>
              {" "}
              Cancel
            </Button>
            <LoadingButton
              //   loading={loading}
              type="submit"
              variant="contained"
              onClick={() => formik.handleSubmit()}
            >
              Create
            </LoadingButton>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
