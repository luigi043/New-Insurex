import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  TableChart,
  BarChart,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assignment,
  Warning,
  CalendarToday
} from '@mui/icons-material';
import { useReports } from '../../hooks/useReports';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const reportTypes = [
  { value: 'financial', label: 'Financeiro' },
  { value: 'policies', label: 'Apólices' },
  { value: 'claims', label: 'Sinistros' },
  { value: 'assets', label: 'Bens' },
  { value: 'partners', label: 'Parceiros' }
];

const periodOptions = [
  { value: 'current_month', label: 'Mês Atual' },
  { value: 'last_month', label: 'Mês Anterior' },
  { value: 'current_quarter', label: 'Trimestre Atual' },
  { value: 'last_quarter', label: 'Trimestre Anterior' },
  { value: 'current_year', label: 'Ano Atual' },
  { value: 'last_year', label: 'Ano Anterior' },
  { value: 'custom', label: 'Período Personalizado' }
];

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reportType, setReportType] = useState('financial');
  const [period, setPeriod] = useState('current_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showSuccess, showError } = useNotification();
  
  const { 
    financialReport, 
    policiesReport, 
    claimsReport, 
    loading, 
    error,
    generateReport,
    exportReport 
  } = useReports();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport({
        type: reportType,
        period,
        startDate: period === 'custom' ? startDate : undefined,
        endDate: period === 'custom' ? endDate : undefined
      });
      showSuccess('Relatório gerado com sucesso!');
    } catch (err) {
      showError('Erro ao gerar relatório');
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await exportReport({
        type: reportType,
        format
      });
      showSuccess(`Relatório exportado como ${format.toUpperCase()}!`);
    } catch (err) {
      showError('Erro ao exportar relatório');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Relatórios</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={() => handleExport('excel')}
          >
            Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={() => handleExport('pdf')}
          >
            PDF
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Filtros</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Relatório</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                {reportTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {periodOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Gerar Relatório'}
            </Button>
          </Grid>
          {period === 'custom' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data Inicial"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data Final"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<BarChart />} label="Visão Geral" />
          <Tab icon={<AttachMoney />} label="Financeiro" />
          <Tab icon={<Assignment />} label="Apólices" />
          <Tab icon={<Warning />} label="Sinistros" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Total de Apólices</Typography>
                  <Typography variant="h4">{policiesReport?.totalPolicies || 0}</Typography>
                  <Typography variant="caption" color="success.main">
                    <TrendingUp fontSize="small" /> +12% vs mês anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Prêmios Totais</Typography>
                  <Typography variant="h4">{formatCurrency(financialReport?.totalPremiums || 0)}</Typography>
                  <Typography variant="caption" color="success.main">
                    <TrendingUp fontSize="small" /> +8% vs mês anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Sinistros</Typography>
                  <Typography variant="h4">{claimsReport?.totalClaims || 0}</Typography>
                  <Typography variant="caption" color="error.main">
                    <TrendingDown fontSize="small" /> +5% vs mês anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Taxa de Sinistralidade</Typography>
                  <Typography variant="h4">{claimsReport?.lossRatio?.toFixed(1) || 0}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Meta: &lt; 70%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>Resumo Financeiro</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Métrica</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">Variação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Prêmios Emitidos</TableCell>
                  <TableCell align="right">{formatCurrency(financialReport?.totalPremiums || 0)}</TableCell>
                  <TableCell align="right" style={{ color: 'green' }}>+8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Prêmios Recebidos</TableCell>
                  <TableCell align="right">{formatCurrency(financialReport?.receivedPremiums || 0)}</TableCell>
                  <TableCell align="right" style={{ color: 'green' }}>+12%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Comissões Pagas</TableCell>
                  <TableCell align="right">{formatCurrency(financialReport?.totalCommissions || 0)}</TableCell>
                  <TableCell align="right" style={{ color: 'red' }}>+3%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sinistros Pagos</TableCell>
                  <TableCell align="right">{formatCurrency(financialReport?.totalClaimsPaid || 0)}</TableCell>
                  <TableCell align="right" style={{ color: 'red' }}>+15%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Resultado Líquido</strong></TableCell>
                  <TableCell align="right"><strong>{formatCurrency(financialReport?.netResult || 0)}</strong></TableCell>
                  <TableCell align="right" style={{ color: 'green' }}><strong>+5%</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>Resumo de Apólices</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Prêmio Total</TableCell>
                  <TableCell align="right">Ticket Médio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {policiesReport?.byType?.map((item: any) => (
                  <TableRow key={item.type}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell align="right">{item.count}</TableCell>
                    <TableCell align="right">{formatCurrency(item.premium)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.average)}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum dado disponível
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>Resumo de Sinistros</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor Reivindicado</TableCell>
                  <TableCell align="right">Valor Pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claimsReport?.byStatus?.map((item: any) => (
                  <TableRow key={item.status}>
                    <TableCell>{item.status}</TableCell>
                    <TableCell align="right">{item.count}</TableCell>
                    <TableCell align="right">{formatCurrency(item.claimed)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum dado disponível
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Reports;
