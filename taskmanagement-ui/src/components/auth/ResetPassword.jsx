import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../utils/validationSchemas';
import authService from '../../services/authService';
import Button from '../common/Button';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Reset password failed:', error);
      toast.error(error.response?.data || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Lock className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Lock className="text-primary-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              {...register('confirmPassword')}
              className={`
                w-full px-4 py-2 border rounded-lg outline-none
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="mt-4"
          >
            Reset Password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
