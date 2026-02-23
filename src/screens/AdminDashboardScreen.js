import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card } from 'react-bootstrap'
import { getAdminStats } from '../actions/adminActions'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

function AdminDashboardScreen() {
  const dispatch = useDispatch()

  const adminStats = useSelector((state) => state.adminStats)
  const { loading, error, stats = {} } = adminStats

  useEffect(() => {
    dispatch(getAdminStats())
  }, [dispatch])

  if (loading) return <h3>Loading...</h3>
  if (error) return <h3>{error}</h3>

  // 📊 Chart Data
  const barData = {
    labels: ['Users', 'Products', 'Orders'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.users || 0,
          stats.products || 0,
          stats.orders || 0,
        ],
        backgroundColor: ['#0d6efd', '#198754', '#ffc107'],
      },
    ],
  }

  const pieData = {
    labels: ['Revenue', 'Orders'],
    datasets: [
      {
        data: [stats.totalSales || 0, stats.orders || 0],
        backgroundColor: ['#198754', '#0d6efd'],
      },
    ],
  }

  return (
    <>
      <h2>Admin Dashboard</h2>

      {/* 🔢 STAT CARDS */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 text-center">
            <h5>Users</h5>
            <h2>{stats.users || 0}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 text-center">
            <h5>Products</h5>
            <h2>{stats.products || 0}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 text-center">
            <h5>Orders</h5>
            <h2>{stats.orders || 0}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 text-center">
            <h5>Revenue</h5>
            <h2>₹{stats.totalSales || 0}</h2>
          </Card>
        </Col>
      </Row>

      {/* 📈 CHARTS */}
      <Row>
        <Col md={6}>
          <Card className="p-3">
            <h5 className="text-center">System Overview</h5>
            <Bar data={barData} />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h5 className="text-center">Revenue Distribution</h5>
            <Pie data={pieData} />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminDashboardScreen
