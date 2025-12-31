import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layouts/AdminLayout'
import HealthManagement from './modules/health/health-management'
import NotificationManagement from './modules/notification/notification-management'
import UserManagement from './modules/users/user-management'
import FoodManagementV1 from './modules/food-v1/food-management'
import HomepageManagement from './modules/home/homepage-management'
import Login from './modules/auth/login'
import RequireAuth from './components/common/RequireAuth'
import DishManagement from './modules/dish/dish-management'
import DishCreate from './modules/dish/dish-create'

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
          <Route path="dish" element={<DishManagement />} />
          <Route path="dish/create" element={<DishCreate />} />
          <Route path="food-v1" element={<FoodManagementV1 />} />
          <Route path="homepage" element={<HomepageManagement />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
