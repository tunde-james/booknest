import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import { useAuthStore } from '../store/auth-store';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, isLoading, error } = useAuthStore();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const { message } = await login(email, password);

      toast.success(message);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] px-4 md:px-12">
      <h2 className="text-center font-semibold pt-8 md:text-2xl w-full max-w-xl mx-auto">
        Sign up
      </h2>

      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center items-center w-full max-w-xl mx-auto space-y-4 mt-10"
      >
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="md:text-lg">
            Email:{' '}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="password" className="md:text-lg">
            Password:{' '}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {error ? <p className="text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#403d39] text-[#fffcf2] py-2 font-medium rounded-lg"
        >
          {isLoading ? 'Please wait...' : 'Log in'}
        </button>

        <p>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#944424]">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
