import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layouts/AdminLayout'
import HealthManagement from './modules/health/health-management'
import NotificationManagement from './modules/notification/notification-management'
import UserManagement from './modules/users/user-management'
import FoodManagement from './modules/food/food-management'
import HomepageManagement from './modules/home/homepage-management'
import Login from './modules/auth/login'
import RequireAuth from './components/common/RequireAuth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/health" replace />} />
          <Route path="health" element={<HealthManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="food" element={<FoodManagement />} />
          <Route path="homepage" element={<HomepageManagement />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
