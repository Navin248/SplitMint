import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupsPage from './pages/GroupsPage';
import GroupDashboardPage from './pages/GroupDashboardPage';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/groups" element={
            <PrivateRoute>
              <GroupsPage />
            </PrivateRoute>
          } />

          <Route path="/groups/:groupId" element={
            <PrivateRoute>
              <GroupDashboardPage />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/groups" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
