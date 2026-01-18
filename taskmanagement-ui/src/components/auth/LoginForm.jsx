import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../../store/slices/authSlice';
import { loginSchema } from '../../utils/validationSchemas';
import Input from '../common/Input';
import Button from '../common/Button';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the slice
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <LogIn className="text-primary-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
              className={`
                w-full px-4 py-2 border rounded-lg outline-none
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.username ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register('password')}
                className={`
                  w-full px-4 py-2 pr-12 border rounded-lg outline-none
                  focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="mt-6"
          >
            Sign In
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
