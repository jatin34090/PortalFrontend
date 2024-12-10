import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'operator'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsLoading(true); 
    setErrorMessage('');

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup successful:', data);

      if (formData.role === 'operator') {
        navigate('/operator-dashboard'); 
      } else if (formData.role === 'receptionist') {
        navigate('/receptionist-dashboard');
      }

      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'operator' });
    } catch (error) {
      console.error('Signup error:', error.message);
      setErrorMessage(error.message); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Sign Up</h2>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="operator">Operator</option>
          <option value="receptionist">Receptionist</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 disabled:opacity-50 transition-all"
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>

      {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
    </form>
  );
};

export default Signup;
