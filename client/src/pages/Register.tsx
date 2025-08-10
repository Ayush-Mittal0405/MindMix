import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormData { username: string; email: string; password: string; confirmPassword: string; full_name: string; }

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState:{ errors } } = useForm<RegisterFormData>();
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try { setIsLoading(true); await registerUser({ username: data.username, email: data.email, password: data.password, full_name: data.full_name }); toast.success('Registration successful!'); navigate('/'); }
    catch (e: any) { toast.error(e.message || 'Registration failed'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Or <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">sign in to your existing account</Link></p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="username" type="text" autoComplete="username" {...register('username', { required:'Username is required', minLength:{ value:3, message:'Username must be at least 3 characters' }, maxLength:{ value:50, message:'Username must be less than 50 characters' }, pattern:{ value:/^[a-zA-Z0-9_]+$/, message:'Letters, numbers, underscores only' } })} className="input pl-10" placeholder="Enter your username" />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="full_name" type="text" autoComplete="name" {...register('full_name', { required:'Full name is required', maxLength:{ value:100, message:'Full name must be less than 100 characters' } })} className="input pl-10" placeholder="Enter your full name" />
              </div>
              {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="email" type="email" autoComplete="email" {...register('email', { required:'Email is required', pattern:{ value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message:'Invalid email address' } })} className="input pl-10" placeholder="Enter your email" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="password" type={showPassword?'text':'password'} autoComplete="new-password" {...register('password', { required:'Password is required', minLength:{ value:6, message:'Password must be at least 6 characters' } })} className="input pl-10 pr-10" placeholder="Enter your password" />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="confirmPassword" type={showConfirmPassword?'text':'password'} autoComplete="new-password" {...register('confirmPassword', { required:'Please confirm your password', validate: (v)=> v===password || 'Passwords do not match' })} className="input pl-10 pr-10" placeholder="Confirm your password" />
                <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">{isLoading? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Create account'}</button>
          </div>
          <div className="text-center"><Link to="/" className="font-medium text-primary-600 hover:text-primary-500">Back to home</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Register; 