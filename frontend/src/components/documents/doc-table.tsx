import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Collapse } from "@mui/material";
import { DocumentRow } from "./doc-row";
import { DocumentHeads } from "./doc-heads";
import { Delete } from "@mui/icons-material";
import CreateDocument from "./doc-create";
import toast from "react-hot-toast";
import { useMounted } from "../../hooks/use-mounted";
import { documentApi } from "../../api/documentApi";

export interface Document {
  id: number;
  name: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Document;
  label: string;
  numeric: boolean;
}

export const DocumentTable = () => {
  const [page, setPage] = useState(0);
  const [documents, setDocuments] = useState([
    { id: 1, fileName: "parth", fileType: "book" },
    {
      id: 2,
      fileName: "rajesh",
      fileType: "video",
    },
  ]);
  const [documentCount, setDocumentsCount] = useState(documents?.length);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMounted = useMounted();
  // useEffect(
  //   () => {
  //     getDocuments();
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );
  const getDocuments = useCallback(async () => {
    try {
      const data: any = await documentApi.getDocuments();
      if (isMounted()) {
        setDocuments(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "failed");
    }
  }, [isMounted]);

  const deleteDocument = async (id: number) => {
    const load = toast.loading("deleteDocuments");
    try {
      const resp = await documentApi.deleteDocument(id);

      getDocuments();
    } catch (err: any) {
      console.log(err);
    }
  };
  const createDocument = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("createDocuments");
    try {
      await documentApi.createDocument(values);

      toast.dismiss(load);
      toast.success("createDocumentsSuccess");

      getDocuments();

      return { success: true };
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createDocumentsFailed");
      return { success: false };
    }
  };
  const updateDocument = async (
    id: number,
    values: any
  ): Promise<{ success: boolean }> => {
    const load = toast.loading("updateDocuments");
    try {
      const resp = await documentApi.updateDocument(id, values);

      if (resp.success) {
        toast.dismiss(load);
        toast.success("updateDocumentsSuccess");

        getDocuments();

        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("updateDocumentsFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "updateDocumentsFailed");
      return { success: false };
    }
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Title",
    },
  ];
  useEffect(() => {
    setDocumentsCount(documents?.length);
  }, [documents?.length]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container>
        <Grid item lg={3.8} md={3.8} sm={3.8} xs={12}>
          <CreateDocument createDocument={createDocument} />
        </Grid>
        <Grid item lg={0.4} md={0.4} sm={0.4} xs={0}>
          <Box></Box>
        </Grid>
        <Grid item lg={7.8} md={7.8} sm={7.8} xs={12}>
          <Paper
            elevation={9}
            sx={{
              p: "10px 10px",
              width: "100%",

              ...(true && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.info.contrastText,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            {" "}
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                Document List
              </Typography>
            </Toolbar>
            <TableContainer>
              <Table
                sx={{
                  minWidth: 100 * 2,
                }}
                aria-labelledby="tableTitle"
                size="small"
              >
                <DocumentHeads headCells={headCells} rowCount={documentCount} />
                <TableBody>
                  {documents?.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <DocumentRow
                        key={row.id}
                        row={row}
                        labelId={labelId}
                        updateDocument={updateDocument}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={documentCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};