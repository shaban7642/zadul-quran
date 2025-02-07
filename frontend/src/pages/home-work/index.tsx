import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { NextPage } from 'next';
import { Box } from '@mui/material';
import { DocumentTable } from '../../components/documents/doc-table';
import { AuthGuard } from '../../components/auth/auth-guard';

const Documents: NextPage = () => {
    return (
        <>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <DocumentTable pageName="home-work" />
            </Box>
        </>
    );
};

Documents.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
);

export default Documents;
