import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { AssetValuation } from '../../types/asset.types';
import { formatCurrency } from '../../utils/formatters';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AssetValuationChartProps {
    data: AssetValuation[];
}

export const AssetValuationChart: React.FC<AssetValuationChartProps> = ({ data }) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Nenhum dado de valorização disponível</Typography>
            </Box>
        );
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) =>
        parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper elevation={3} sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {label ? format(parseISO(label), 'dd/MM/yyyy', { locale: ptBR }) : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {formatCurrency(payload[0].value || 0)}
                    </Typography>
                    {payload[0].payload.source && (
                        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                            Fonte: {payload[0].payload.source}
                        </Typography>
                    )}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={sortedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(str) => {
                            try {
                                return format(parseISO(str), 'MM/yyyy');
                            } catch {
                                return str;
                            }
                        }}
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tickFormatter={(value) => `R$ ${value / 1000}k`}
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AssetValuationChart;
