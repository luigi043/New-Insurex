import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';

interface DataTableProps {
  title: string;
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
}

const DataTable = ({ title, rows, columns, loading }: DataTableProps) => {
  return (
    <Box sx={{ height: 600, width: '100%', mt: 2 }}>
      <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
};

export default DataTable;