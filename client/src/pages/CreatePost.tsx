import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Save, Eye, EyeOff, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../services/api';
import { DEFAULT_POST_IMAGE } from '../constants';

interface CreatePostFormData { title: string; content: string; excerpt: string; category_id: string; status: 'draft'|'published'; featured_image?: string }

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState:{ errors } } = useForm<CreatePostFormData>({ defaultValues: { status: 'published' } });
  const content = watch('content');
  const featuredImage = watch('featured_image');

  const onSubmit = async (data: CreatePostFormData) => {
    try { setIsLoading(true); const res = await api.createPost({ ...data, category_id: data.category_id ? parseInt(data.category_id) : undefined }); toast.success('Post created successfully!'); navigate(`/posts/${res.data.post.id}`); }
    catch (e:any) { toast.error(e.response?.data?.message || 'Failed to create post'); }
    finally { setIsLoading(false); }
  };

  const handleImageUpload = async (file: File) => {
    try { setUploading(true); const res = await api.uploadImage(file); setValue('featured_image', res.data.url); toast.success('Image uploaded'); }
    catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Create New Post</h1><p className="text-gray-600 mt-2">Share your thoughts with the world</p></div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          {featuredImage ? (
            <div className="relative inline-block">
              <img src={featuredImage} alt="featured" className="w-full max-h-64 object-cover rounded-md border" />
              <button type="button" className="absolute top-2 right-2 bg-white/80 rounded-full p-1" onClick={()=>setValue('featured_image','')}><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer text-gray-500 hover:text-gray-700">
              <img src={DEFAULT_POST_IMAGE} alt="default" className="h-16 mb-2 opacity-80" />
              <input type="file" accept="image/*" className="hidden" onChange={(e)=>{ const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              {uploading ? 'Uploading...' : (<><ImageIcon className="w-6 h-6 mr-2" /> Click to upload</>)}
            </label>
          )}
          <input type="hidden" {...register('featured_image')} />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input id="title" type="text" {...register('title', { required:'Title is required', maxLength:{ value:255, message:'Max 255 characters' } })} className="input text-lg" placeholder="Enter your post title..." />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea id="excerpt" rows={3} {...register('excerpt', { maxLength:{ value:500, message:'Max 500 characters' } })} className="input" placeholder="Brief summary (optional)..." />
          {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select id="category" {...register('category_id')} className="input">
            <option value="">Select a category (optional)</option>
            <option value="1">Technology</option>
            <option value="2">Lifestyle</option>
            <option value="3">Travel</option>
            <option value="4">Food</option>
            <option value="5">Health</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2"><label htmlFor="content" className="block text-sm font-medium text-gray-700">Content *</label><button type="button" onClick={()=>setShowPreview(!showPreview)} className="flex items-center text-sm text-gray-600 hover:text-gray-900">{showPreview? 'Hide Preview':'Show Preview'}</button></div>
          {!showPreview ? (<textarea id="content" rows={15} {...register('content', { required:'Content is required' })} className="input font-mono text-sm" placeholder="Write your post content here..." />) : (<div className="border border-gray-300 rounded-md p-4 bg-white prose max-w-none"><div className="whitespace-pre-wrap">{content || 'No content to preview'}</div></div>)}
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select id="status" {...register('status')} className="input"><option value="draft">Draft</option><option value="published">Published</option></select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={()=>navigate('/')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary">{isLoading? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (<><Save className="w-4 h-4 mr-2" /> Save Post</>)}</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost; 