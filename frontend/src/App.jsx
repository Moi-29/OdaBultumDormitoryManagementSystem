import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import StudentPortal from './pages/StudentPortal';
import StudentLayout from './components/Layout/StudentLayout';
import Home from './pages/Student/Home';
import NewsPage from './pages/Student/NewsPage';
import DormitoryView from './pages/Student/DormitoryView';
import ApplicationFormWrapper from './pages/Student/ApplicationFormWrapper';
import ReportIssueWrapper from './pages/Student/ReportIssueWrapper';
import Permission from './pages/Student/Permission';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Students from './pages/Admin/Students';
import Dorms from './pages/Admin/Dorms';
import Reports from './pages/Admin/Reports';
import Applications from './pages/Admin/Applications';
import Requests from './pages/Admin/Requests';
import Permissions from './pages/Admin/Permissions';
import Announcements from './pages/Admin/Announcements';
import Gallery from './pages/Admin/Gallery';
import Settings from './pages/Admin/Settings';
import AdminManagement from './pages/Admin/AdminManagement';
import UserManagement from './pages/Admin/UserManagement';
import ProctorDashboard from './pages/Proctor/ProctorDashboard';
import MaintainerDashboard from './pages/Maintainer/MaintainerDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];
  const hasPermission = userPermissions.includes('*') || userPermissions.includes(requiredPermission);
  
  if (!hasPermission) {
    return <Navigate to="/admin/redirect" replace />;
  }
  
  return children;
};

// Smart Redirect Component - redirects to first available page
const SmartRedirect = () => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];
  const hasPermission = (permission) => userPermissions.includes('*') || userPermissions.includes(permission);
  
  // Check permissions in order and redirect to first available
  if (hasPermission('dashboard.view')) return <Navigate to="/admin/dashboard" replace />;
  if (hasPermission('students.view')) return <Navigate to="/admin/students" replace />;
  if (hasPermission('dorms.view')) return <Navigate to="/admin/dorms" replace />;
  if (hasPermission('reports.view')) return <Navigate to="/admin/reports" replace />;
  if (hasPermission('admins.view')) return <Navigate to="/admin/admin-management" replace />;
  
  // If no permissions, show access denied
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</h1>
      <h2 style={{ marginBottom: '0.5rem' }}>Access Denied</h2>
      <p style={{ color: '#64748b' }}>You don't have permission to access any admin pages.</p>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Please contact your administrator.</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to student home */}
          <Route path="/" element={<Navigate to="/student/home" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes with Layout */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="dormitory" element={<DormitoryView />} />
            <Route path="application" element={<ApplicationFormWrapper />} />
            <Route path="permission" element={<Permission />} />
            <Route path="report" element={<ReportIssueWrapper />} />
          </Route>

          {/* Legacy Student Portal (keep for direct access) */}
          <Route path="/old-portal" element={<StudentPortal />} />

          {/* Proctor Routes */}
          <Route path="/proctor/dashboard" element={<ProctorDashboard />} />

          {/* Maintainer Routes */}
          <Route path="/maintainer/dashboard" element={<MaintainerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="redirect" element={<SmartRedirect />} />
            <Route path="dashboard" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="students" element={
              <ProtectedRoute requiredPermission="students.view">
                <Students />
              </ProtectedRoute>
            } />
            <Route path="dorms" element={
              <ProtectedRoute requiredPermission="dorms.view">
                <Dorms />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute requiredPermission="reports.view">
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="applications" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="requests" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Requests />
              </ProtectedRoute>
            } />
            <Route path="permissions" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Permissions />
              </ProtectedRoute>
            } />
            <Route path="announcements" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Announcements />
              </ProtectedRoute>
            } />
            <Route path="gallery" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Gallery />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="admin-management" element={
              <ProtectedRoute requiredPermission="admins.view">
                <AdminManagement />
              </ProtectedRoute>
            } />
            <Route path="user-management" element={
              <ProtectedRoute requiredPermission="admins.view">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route index element={<SmartRedirect />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
