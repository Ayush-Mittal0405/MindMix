import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import { DEFAULT_POST_IMAGE } from '../constants';
import { Post } from '../types';

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => { fetchPosts(); }, [selectedStatus]);
  const fetchPosts = async () => { try { setLoading(true); const params:any = {}; if (selectedStatus) params.status = selectedStatus; const res = await api.getMyPosts(params); setPosts(res.data.posts); } catch (e) { toast.error('Failed to load posts'); } finally { setLoading(false); } };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.deletePost(postId.toString());
      toast.success('Post deleted successfully!');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };
  const badge = (s:string) => { const m:any = { draft:['bg-yellow-100 text-yellow-800','Draft'], published:['bg-green-100 text-green-800','Published']}; const [cls,label] = m[s]||m.draft; return <span className={`px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{label}</span>; };

  if (loading) return (<div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-600 mt-2">Manage your blog posts</p></div>
        <Link to="/create-post" className="btn-primary"><Plus className="w-4 h-4 mr-2" /> New Post</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6"><div className="flex items-center"><div className="p-2 bg-blue-100 rounded-lg"><Eye className="w-6 h-6 text-blue-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Views</p><p className="text-2xl font-bold text-gray-900">{posts.reduce((s,p)=>s+p.view_count,0)}</p></div></div></div>
        <div className="card p-6"><div className="flex items-center"><div className="p-2 bg-green-100 rounded-lg"><MessageCircle className="w-6 h-6 text-green-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Comments</p><p className="text-2xl font-bold text-gray-900">{posts.reduce((s,p)=>s+(p.comment_count||0),0)}</p></div></div></div>
        <div className="card p-6"><div className="flex items-center"><div className="p-2 bg-purple-100 rounded-lg"><Edit className="w-6 h-6 text-purple-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Published Posts</p><p className="text-2xl font-bold text-gray-900">{posts.filter(p=>p.status==='published').length}</p></div></div></div>
        <div className="card p-6"><div className="flex items-center"><div className="p-2 bg-yellow-100 rounded-lg"><Edit className="w-6 h-6 text-yellow-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Draft Posts</p><p className="text-2xl font-bold text-gray-900">{posts.filter(p=>p.status==='draft').length}</p></div></div></div>
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['','published','draft'].map(s => (
            <button key={s||'all'} onClick={()=>setSelectedStatus(s)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedStatus===s? 'bg-primary-600 text-white':'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{s? s[0].toUpperCase()+s.slice(1):'All Posts'}</button>
          ))}
        </div>
      </div>
      <div className="card overflow-hidden">
        {posts.length===0 ? (
          <div className="text-center py-12"><p className="text-gray-500 text-lg mb-4">No posts found.</p><Link to="/create-post" className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Create Your First Post</Link></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-lg object-cover" src={post.featured_image || DEFAULT_POST_IMAGE} alt={post.title} /></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900"><Link to={`/posts/${post.id}`} className="hover:text-primary-600 transition-colors">{post.title}</Link></div>
                          {post.category_name && (<div className="text-sm text-gray-500">{post.category_name}</div>)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{badge(post.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.view_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.comment_count || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(post.created_at), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/posts/${post.id}`} className="text-primary-600 hover:text-primary-900"><Eye className="w-4 h-4" /></Link>
                        <Link to={`/edit-post/${post.id}`} className="text-gray-600 hover:text-gray-900"><Edit className="w-4 h-4" /></Link>
                        <button onClick={()=>handleDeletePost(post.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 