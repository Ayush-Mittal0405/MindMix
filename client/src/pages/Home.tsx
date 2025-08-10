import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Eye, MessageCircle, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { DEFAULT_AVATAR, DEFAULT_POST_IMAGE } from '../constants';
import { Post, Pagination } from '../types';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [params] = useSearchParams();

  useEffect(() => {
    const cat = params.get('category') || '';
    setSelectedCategory(cat);
  }, [params]);

  useEffect(() => { fetchPosts(); }, [currentPage, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const query: any = { page: currentPage, limit: 10, status: 'published' };
      if (searchTerm) query.search = searchTerm;
      if (selectedCategory) query.category = selectedCategory;
      const res = await api.getPosts(query);
      setPosts(res.data.posts);
      setPagination(res.data.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setCurrentPage(1); };
  const handlePageChange = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const truncate = (t: string, n: number) => (t.length <= n ? t : t.slice(0, n) + '...');

  if (loading && posts.length === 0) return (
    <div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MindMix</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover amazing stories, insights, and knowledge shared by our community.</p>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search posts..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="input pl-10" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {['', 'technology','lifestyle','travel','food','health'].map(cat => (
            <button key={cat || 'all'} onClick={()=>{ setSelectedCategory(cat); setCurrentPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory===cat? 'bg-primary-600 text-white':'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {cat ? cat[0].toUpperCase()+cat.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {posts.length===0 ? (
        <div className="text-center py-12"><p className="text-gray-500 text-lg">No posts found.</p></div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="block card hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Open post ${post.title}`}
            >
              <img src={post.featured_image || DEFAULT_POST_IMAGE} alt={post.title} className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />{format(new Date(post.created_at), 'MMM dd, yyyy')}
                  {post.category_name && (<><span className="mx-2">•</span><span className="capitalize">{post.category_name}</span></>)}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600">
                  {post.title}
                </h2>
                {post.excerpt && (<p className="text-gray-600 mb-4 line-clamp-3">{truncate(post.excerpt,150)}</p>)}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <img
                      src={post.author_avatar || DEFAULT_AVATAR}
                      alt={post.author_name}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <span>{post.author_name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-1" />{post.view_count}</span>
                    <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-1" />{post.comment_count || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.total>1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button onClick={()=>handlePageChange(currentPage-1)} disabled={!pagination.hasPrev} className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Previous</button>
            {Array.from({ length: pagination.total }, (_, i) => i+1).map(p => (
              <button key={p} onClick={()=>handlePageChange(p)} className={`px-3 py-2 text-sm font-medium rounded-md ${p===currentPage? 'bg-primary-600 text-white':'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={()=>handlePageChange(currentPage+1)} disabled={!pagination.hasNext} className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Next</button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Home; 