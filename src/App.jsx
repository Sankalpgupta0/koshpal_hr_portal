import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Directory from './pages/Directory';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<Login />} />
          
          {/* All routes protected - unified login on koshpal.com */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="directory" element={<Directory />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
