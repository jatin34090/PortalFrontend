import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import OperatorDashboard from './components/OperatorDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">
                  {isLogin ? "Login" : "Sign Up"}
                </h1>

                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`px-4 py-2 font-semibold rounded-md ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 transition-all`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`px-4 py-2 font-semibold rounded-md ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 transition-all`}
                  >
                    Sign Up
                  </button>
                </div>

                {isLogin ? <Login /> : <Signup />}
              </div>
            } 
          />
          <Route path="/operator-dashboard" element={<OperatorDashboard />} />
          <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
