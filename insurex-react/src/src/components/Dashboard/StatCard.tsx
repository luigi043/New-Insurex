import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';}