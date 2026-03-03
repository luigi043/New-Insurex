import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/common/DataTable';
import axiosInstance from '../../api/axiosInstance';
import { Policy } from '../../types/insurance';
import StatusBadge from '../../components/common/StatusBadge'; // You'll create this next

const PolicyList = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const { data } = await axiosInstance.get('/policies');
        setPolicies(data);
      } catch (error) {
        console.error("Failed to fetch policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const columns: GridColDef[] = [
    { field: 'policyNumber', headerName: 'Policy #', width: 150 },
    { field: 'holderName', headerName: 'Client', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => <StatusBadge status={params.value} />
    },
    { field: 'premiumAmount', headerName: 'Premium', type: 'number', width: 130 },
    { field: 'endDate', headerName: 'Expiry Date', width: 150 },
  ];

  return <DataTable title="Policy Management" rows={policies} columns={columns} loading={loading} />;
};

export default PolicyList;