import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { Post } from '../types';

interface EditPostFormData { title: string; content: string; excerpt: string; category_id: string; status: 'draft'|'published' }

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { register, handleSubmit, watch, formState:{ errors }, reset } = useForm<EditPostFormData>();
  const content = watch('content');

  useEffect(()=>{ if (id) fetchPost(); }, [id]);
  const fetchPost = async () => { try { const res = await api.getPost(id!); const d = res.data.post; setPost(d); reset({ title:d.title, content:d.content, excerpt:d.excerpt || '', category_id: d.category_id?.toString() || '', status: d.status }); } catch { toast.error('Failed to load post'); } finally { setLoading(false); } };

  const onSubmit = async (data: EditPostFormData) => { try { setIsLoading(true); await api.updatePost(id!, { ...data, category_id: data.category_id? parseInt(data.category_id): undefined }); toast.success('Post updated'); navigate(`/posts/${id}`); } catch (e:any) { toast.error(e.response?.data?.message || 'Failed to update'); } finally { setIsLoading(false); } };

  if (loading) return (<div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>);
  if (!post) return (<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2><button onClick={()=>navigate('/dashboard')} className="btn-primary">Back to Dashboard</button></div>);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={()=>navigate(`/posts/${id}`)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Post</button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600 mt-2">Update your post content and settings</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input id="title" type="text" {...register('title', { required:'Title is required', maxLength:{ value:255, message:'Max 255 characters' } })} className="input text-lg" placeholder="Enter your post title..." />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea id="excerpt" rows={3} {...register('excerpt', { maxLength:{ value:500, message:'Max 500 characters' } })} className="input" placeholder="Brief summary (optional)..." />
          {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
        </div>
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
        <div>
          <div className="flex items-center justify-between mb-2"><label htmlFor="content" className="block text-sm font-medium text-gray-700">Content *</label><button type="button" onClick={()=>setShowPreview(!showPreview)} className="flex items-center text-sm text-gray-600 hover:text-gray-900">{showPreview? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />} {showPreview? 'Hide Preview':'Show Preview'}</button></div>
          {!showPreview ? (<textarea id="content" rows={15} {...register('content', { required:'Content is required' })} className="input font-mono text-sm" placeholder="Write your post content here..." />) : (<div className="border border-gray-300 rounded-md p-4 bg-white prose max-w-none"><div className="whitespace-pre-wrap">{content || 'No content to preview'}</div></div>)}
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select id="status" {...register('status')} className="input"><option value="draft">Draft</option><option value="published">Published</option></select>
        </div>
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={()=>navigate(`/posts/${id}`)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary">{isLoading? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (<><Save className="w-4 h-4 mr-2" /> Update Post</>)}</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost; 