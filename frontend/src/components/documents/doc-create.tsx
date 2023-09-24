import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, Box, Paper, Typography, Divider, Chip } from '@mui/material';

import { MuiFileInput } from 'mui-file-input';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { ChangeEvent, MouseEvent, FormEvent, useState, FC } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/use-auth';
import { apiService } from '../../services/api.service';

interface CreateDocumentProps {
    createDocument: (values: any) => Promise<{ success: boolean }>;
}
const CreateDocument: FC<CreateDocumentProps> = (props) => {
    const { createDocument } = props;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File>();
    const handleChange = (newFile: File) => {
        setFile(newFile);
        setLoading(false);
        console.log(file);
    };
    const uploadFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!file) return;
        console.log({ file });
        try {
            setLoading(true);
            let formData = new FormData();
            formData.append('userId', user.id);
            formData.append('file', file);
            // data.append(
            //     'documentType',
            //     JSON.stringify({ name: 'book', id: 1 })
            // );

            console.log({ formData });

            // apiService.post(
            //     `/documents/upload?data={"documentType": {"name": "books", "id": 1}}`,
            //     formData,
            //     {
            //         headers: {
            //             'Content-Type': 'multipart/form-data',
            //         },
            //     }
            // );

            const uploadResp = await axios.post(
                `http://localhost:4000/api/documents/upload?data={"documentType": {"name": "books", "id": 1}, "userId": ${user.id}}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // await createDocument(formData);

            // setFile(undefined);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={9}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: '10px 10px',
                width: '100%',

                ...(true && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.info.contrastText,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                }}
            >
                <Typography color='inherit' variant='h6'>
                    Add Document
                </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>
                <Divider textAlign='left' sx={{ mb: 1 }}>
                    <Chip label='File Details' sx={{ fontWeight: '600' }} />
                </Divider>

                <MuiFileInput
                    size='small'
                    name='file'
                    variant='outlined'
                    value={file}
                    onChange={(e: any) => {
                        setFile(e);
                    }}
                    helperText={!file ? 'upload your file' : 'uploaded'}
                    sx={{ ml: 0, cursor: 'pointer' }}
                />
                <Divider sx={{ m: 1 }}></Divider>
                <LoadingButton
                    type='button'
                    onClick={uploadFile}
                    sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                            height: 40,
                        },
                    }}
                    variant='contained'
                >
                    submit
                </LoadingButton>
            </Box>
        </Paper>
    );
};

export default CreateDocument;
