/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, CircularProgress,
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import apiClient from '../../services/api.service';
import { formatCurrency } from '../../utils/formatters';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardOverview {
  uninsuredAssets: number;
  uninsuredValue: number;
  totalAssets: number;
  totalFinancedValue: number;
}

interface PremiumsDataPoint {
  month: string;
  unpaidPremiums: number;
  reinstatedCover: number;
}

interface InsuranceStatusItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  borderColor: string;
}

function StatCard({ title, value, borderColor }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 1,
        boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
        backgroundColor: '#fff',
        height: '100%',
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          color: '#555',
          textTransform: 'uppercase',
          fontSize: '11px',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          color: '#1a1a2e',
          fontSize: '22px',
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

// ── Custom donut label ────────────────────────────────────────────────────────

const renderDonutLabel = ({
  cx, cy, midAngle, outerRadius, name, percentage,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#555"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
    >
      {`${name}, ${Number(percentage).toFixed(2)}%`}
    </text>
  );
};

// ── Custom Legend ─────────────────────────────────────────────────────────────

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'flex-start',
        mt: 1,
        pl: 1,
      }}
    >
      {payload.map((entry: any, index: number) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: '12px', color: '#555' }}>{entry.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [premiumsData, setPremiumsData] = useState<PremiumsDataPoint[]>([]);
  const [insuranceStatus, setInsuranceStatus] = useState<InsuranceStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, premiumsRes, statusRes] = await Promise.all([
          apiClient.get('/dashboard/overview'),
          apiClient.get('/dashboard/premiums-vs-reinstated'),
          apiClient.get('/dashboard/insurance-status'),
        ]);
        setOverview(overviewRes.data);
        setPremiumsData(premiumsRes.data);
        setInsuranceStatus(statusRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mx: -3,
        mt: -3,
        p: 3,
        pb: 4,
        minHeight: '100%',
        background: 'linear-gradient(160deg, #e8edf5 0%, #dde3ef 100%)',
      }}
    >
      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Uninsured Assets"
            value={overview?.uninsuredAssets ?? 0}
            borderColor="#e53935"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Uninsured Value"
            value={formatCurrency(overview?.uninsuredValue ?? 0, 'ZAR')}
            borderColor="#e53935"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assets"
            value={overview?.totalAssets ?? 0}
            borderColor="#1565c0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Financed Value"
            value={formatCurrency(overview?.totalFinancedValue ?? 0, 'ZAR')}
            borderColor="#1565c0"
          />
        </Grid>
      </Grid>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <Grid container spacing={2.5}>
        {/* Line Chart – Premiums Unpaid vs Re-Instated Cover */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              backgroundColor: '#fff',
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                textAlign: 'center',
                fontSize: '14px',
                color: '#1a1a2e',
              }}
            >
              Premiums Unpaid vs Re-Instated Cover
            </Typography>
            <Typography
              sx={{
                display: 'block',
                textAlign: 'center',
                color: '#888',
                fontSize: '12px',
                mb: 2,
              }}
            >
              Last year
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={premiumsData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#888' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#888' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[-10, 30]}
                  ticks={[-10, 0, 10, 20, 30]}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 6, border: '1px solid #e0e0e0', fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="unpaidPremiums"
                  name="Unpaid Premiums"
                  stroke="#3d3d8f"
                  strokeWidth={2}
                  dot={{ r: 5, fill: 'white', stroke: '#3d3d8f', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#3d3d8f' }}
                  isAnimationActive
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="reinstatedCover"
                  name="Re-Instated Cover"
                  stroke="#00b5b5"
                  strokeWidth={2}
                  dot={{ r: 5, fill: 'white', stroke: '#00b5b5', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#00b5b5' }}
                  isAnimationActive
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Donut Chart – Insurance Status on Assets */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 1,
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              backgroundColor: '#fff',
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                textAlign: 'center',
                fontSize: '14px',
                color: '#1a1a2e',
                mb: 2,
              }}
            >
              Insurance Status on Assets
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={insuranceStatus}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={100}
                  dataKey="value"
                  label={renderDonutLabel}
                  labelLine
                  isAnimationActive
                  animationDuration={900}
                >
                  {insuranceStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
