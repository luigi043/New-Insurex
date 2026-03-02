import { useState, useEffect } from 'react';
import { policyService } from '../services/policy.service';
import { Policy } from '../types/policy.types';

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const loadPolicies = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const response = await policyService.getPolicies(page, pageSize);
    setPolicies(response.items);
    setTotalItems(response.totalItems);
    setLoading(false);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const createPolicy = async (data: any) => {
    const newPolicy = await policyService.createPolicy(data);
    await loadPolicies();
    return newPolicy;
  };

  const updatePolicy = async (id: string, data: any) => {
    const updated = await policyService.updatePolicy(id, data);
    await loadPolicies();
    return updated;
  };

  const deletePolicy = async (id: string) => {
    await policyService.deletePolicy(id);
    await loadPolicies();
  };

  return {
    policies,
    loading,
    totalItems,
    loadPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy
  };
};
