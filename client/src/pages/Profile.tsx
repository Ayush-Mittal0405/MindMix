import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface ProfileFormData {
  full_name: string;
  bio: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await api.updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      // Refresh user data (you might want to update the auth context)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary text-sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    {...register('full_name', {
                      maxLength: {
                        value: 100,
                        message: 'Full name must be less than 100 characters',
                      },
                    })}
                    className="input"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register('bio', {
                      maxLength: {
                        value: 500,
                        message: 'Bio must be less than 500 characters',
                      },
                    })}
                    className="input"
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-gray-900">{user.full_name || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <p className="mt-1 text-gray-900">{user.bio || 'No bio provided'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Card */}
          <div className="card p-6 text-center">
            <div className="mb-4">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-20 h-20 rounded-full mx-auto"
                />
              ) : (
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.username}</h3>
            <p className="text-sm text-gray-600 mb-4">{user.email}</p>
            
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Account Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 text-gray-900 capitalize">{user.role}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Member since:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posts:</span>
                <span className="font-medium text-gray-900">{user.post_count || 0}</span>
              </div>
              {/* Add more stats as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 