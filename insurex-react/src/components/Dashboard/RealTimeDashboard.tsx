   import React, { useEffect, useState } from 'react';
   import { 
     BarChart, 
     Bar, 
     XAxis, 
     YAxis, 
     CartesianGrid, 
     Tooltip, 
     Legend, 
     ResponsiveContainer,
     PieChart,
     Pie,
     Cell,
     LineChart,
     Line
   } from 'recharts';
   import { dashboardApi } from '../../services/dashboardApi';
   interface DashboardData {
     totalPolicies: number;
     activePolicies: number;
     totalClaims: number;
     pendingClaims: number;
     totalAssets: number;
     totalPremium: number;
     monthlyStats: Array<{
       month: string;
       policies: number;
       claims: number;
       premium: number;
     }>;
     claimsByStatus: Array<{
       status: string;
       count: number;
     }>;
     assetsByType: Array<{
       type: string;
       count: number;
       value: number;
     }>;
   }

   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

   export const RealTimeDashboard: React.FC = () => {
     const [data, setData] = useState<DashboardData | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       loadDashboardData();
       // Refresh every 30 seconds
       const interval = setInterval(loadDashboardData, 30000);
       return () => clearInterval(interval);
     }, []);

     const loadDashboardData = async () => {
       try {
         const response = await dashboardApi.getStats();
         setData(response);
       } catch (error) {
         console.error('Failed to load dashboard data:', error);
       } finally {
         setLoading(false);
       }
     };

     if (loading || !data) {
       return (
         <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
         </div>
       );
     }

     return (
       <div className="space-y-6">
         {/* Stats Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard
             title="Total Policies"
             value={data.totalPolicies}
             subtitle={`${data.activePolicies} active`}
             trend="+12%"
             icon="document"
           />
           <StatCard
             title="Total Claims"
             value={data.totalClaims}
             subtitle={`${data.pendingClaims} pending`}
             trend="+5%"
             icon="claim"
             color="yellow"
           />
           <StatCard
             title="Total Assets"
             value={data.totalAssets}
             subtitle="Across all policies"
             trend="+8%"
             icon="asset"
             color="green"
           />
           <StatCard
             title="Total Premium"
             value={`$${data.totalPremium.toLocaleString()}`}
             subtitle="YTD Revenue"
             trend="+15%"
             icon="money"
             color="purple"
           />
         </div>

         {/* Charts Row 1 */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={data.monthlyStats}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="month" />
                 <YAxis yAxisId="left" />
                 <YAxis yAxisId="right" orientation="right" />
                 <Tooltip />
                 <Legend />
                 <Line
                   yAxisId="left"
                   type="monotone"
                   dataKey="policies"
                   stroke="#8884d8"
                   name="New Policies"
                 />
                 <Line
                   yAxisId="left"
                   type="monotone"
                   dataKey="claims"
                   stroke="#82ca9d"
                   name="Claims"
                 />
                 <Line
                   yAxisId="right"
                   type="monotone"
                   dataKey="premium"
                   stroke="#ffc658"
                   name="Premium ($)"
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>

           <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie
                   data={data.claimsByStatus}
                   cx="50%"
                   cy="50%"
                   labelLine={false}
                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                   outerRadius={80}
                   fill="#8884d8"
                   dataKey="count"
                   nameKey="status"
                 >
                   {data.claimsByStatus.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
         </div>

         {/* Charts Row 2 */}
         <div className="bg-white p-6 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold mb-4">Assets by Type</h3>
           <ResponsiveContainer width="100%" height={300}>
             <BarChart data={data.assetsByType}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="type" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Bar dataKey="count" fill="#8884d8" name="Count" />
               <Bar dataKey="value" fill="#82ca9d" name="Total Value ($)" />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>
     );
   };