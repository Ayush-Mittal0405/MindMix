import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

interface FormData { email: string }

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await api.requestPasswordReset({ email: data.email });
      toast.success('If an account exists, a reset link has been sent');
      setSubmitted(true);
      if (res?.data?.token) {
        setDevToken(res.data.token);
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to request reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your email and we'll send you a reset link.</p>
        </div>
        {submitted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded">Check your email for further instructions if the account exists.</div>
            {devToken && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded text-sm">
                <div className="font-medium mb-1">Development only:</div>
                <div className="break-all">Token: {devToken}</div>
                <a className="text-primary-600 underline" href={`/reset-password?token=${devToken}`}>Open reset link</a>
              </div>
            )}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" type="email" className="input mt-1" placeholder="Enter your email" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full btn btn-primary">{isLoading ? 'Sending...' : 'Send reset link'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;


