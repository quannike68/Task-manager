import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout';
const Dashboard = () => {
  useUserAuth();
  return (
    <DashboardLayout>
      User/dashboard
    </DashboardLayout>
  )
}

export default Dashboard
