import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; // Ensure Dashboard exists
import Layout from './components/Layout'; // <--- YE MISSING THA (Isliye error aaya)
import { useAuth } from './auth/AuthContext';

// Protected Route: Sirf logged-in users ke liye
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // Agar user nahi hai aur LocalStorage mein bhi fake token nahi hai -> Login pe bhejo
  if (!user && !localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Route: Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes: Dashboard etc. (Wrapped in Layout) */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Layout ke andar Dashboard dikhega */}
        <Route index element={<Dashboard />} />
      </Route>

      {/* Agar koi ulti-seedhi link khole -> Home par bhej do */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;