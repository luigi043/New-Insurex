import { useState, useCallback } from 'react';

import { reportService } from '../services/report.service';

 

interface FinancialReport {

  totalPremiums: number;

  receivedPremiums: number;

  totalCommissions: number;

  totalClaimsPaid: number;

  netResult: number;

}

 

interface PoliciesReport {

  totalPolicies: number;

  byType: Array<{

    type: string;

    count: number;

    premium: number;

    average: number;

  }>;

}

 

interface ClaimsReport {

  totalClaims: number;

  lossRatio: number;

  byStatus: Array<{

    status: string;

    count: number;

    claimed: number;

    paid: number;

  }>;

}

 

interface GenerateReportParams {

  type: string;

  period: string;

  startDate?: string;

  endDate?: string;

}

 

interface ExportReportParams {

  type: string;

  format: 'pdf' | 'excel';

}

 

interface ScheduleReportParams {

  type: string;

  frequency: 'daily' | 'weekly' | 'monthly';

  recipients: string[];

  time?: string;

  dayOfWeek?: number;

  dayOfMonth?: number;

}

 

interface ScheduledReport {

  id: string;

  type: string;

  frequency: string;

  recipients: string[];

  nextRun: string;

  isActive: boolean;

  createdAt: string;

}

 

export const useReports = () => {

  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);

  const [policiesReport, setPoliciesReport] = useState<PoliciesReport | null>(null);

  const [claimsReport, setClaimsReport] = useState<ClaimsReport | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

 

  const generateReport = useCallback(async (params: GenerateReportParams) => {

    setLoading(true);

    setError(null);

    try {

      const data = await reportService.getReportData(params.type, {

        period: params.period,

        startDate: params.startDate,

        endDate: params.endDate,

      });

 

      switch (params.type) {

        case 'financial':

          setFinancialReport(data);

          break;

        case 'policies':

          setPoliciesReport(data);

          break;

        case 'claims':

          setClaimsReport(data);

          break;

        default:

          setFinancialReport(data);

      }

    } catch (err: any) {

      setError(err.response?.data?.message || 'Failed to generate report');

      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

 

  const exportReport = useCallback(async (params: ExportReportParams) => {

    setLoading(true);

    setError(null);

    try {

      const response = await reportService.exportReport(params.type, {

        format: params.format,

      });

 

      // Create download link

      const blob = new Blob([response.data], {

        type: params.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute('download', `report_${params.type}_${new Date().toISOString().split('T')[0]}.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err: any) {

      setError(err.response?.data?.message || 'Failed to export report');

      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

 

  const getScheduledReports = useCallback(async (): Promise<ScheduledReport[]> => {

    try {

      const data = await reportService.getReportList();

      return data || [];

    } catch {

      return [];

    }

  }, []);

 

  const scheduleReport = useCallback(async (params: ScheduleReportParams) => {

    setLoading(true);

    setError(null);

    try {

      const result = await reportService.scheduleReport(params.type, {

        frequency: params.frequency,

        recipients: params.recipients,

        time: params.time,

        dayOfWeek: params.dayOfWeek,

        dayOfMonth: params.dayOfMonth,

      });

      return result;

    } catch (err: any) {

      setError(err.response?.data?.message || 'Failed to schedule report');

      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

 

  return {

    financialReport,

    policiesReport,

    claimsReport,

    loading,

    error,

    generateReport,

    exportReport,

    getScheduledReports,

    scheduleReport,

  };

};
