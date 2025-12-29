
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const RequireAuth = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
    const location = useLocation()

    // Fallback to localStorage if redux state is lost on refresh (handled by slice init but just in case)
    // But slice handles init from localStorage so selecting from state is fine.

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (user.IS_ADMIN !== 1) {
        // User is logged in but not admin (should login as admin)
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default RequireAuth
