import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

// Mock Pages (to be implemented)
const Login = () => <div className="p-8 text-center text-2xl font-bold mt-20">Login Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const DriverDashboard = () => <div>Driver Dashboard</div>;
const AdminLayout = ({ children }) => <div className="flex h-screen bg-gray-50"><div className="w-64 bg-slate-900 text-white p-4">Admin Sidebar</div><div className="flex-1 flex flex-col"><div className="h-16 bg-white shadow-sm flex items-center px-4">Admin Navbar</div><div className="flex-1 p-6 overflow-auto">{children}</div></div></div>;
const DriverLayout = ({ children }) => <div className="flex h-screen bg-gray-50"><div className="w-64 bg-slate-900 text-white p-4">Driver Sidebar</div><div className="flex-1 flex flex-col"><div className="h-16 bg-white shadow-sm flex items-center px-4">Driver Navbar</div><div className="flex-1 p-6 overflow-auto">{children}</div></div></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/" element={<RoleRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></RoleRoute>} />
          
          {/* Driver Routes */}
          <Route path="/driver" element={<RoleRoute role="driver"><DriverLayout><DriverDashboard /></DriverLayout></RoleRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
