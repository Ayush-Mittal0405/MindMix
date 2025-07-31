import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Eye, MessageCircle, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Post, Comment } from '../types';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.getPost(id!);
      setPost(response.data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.getComments(id!);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setSubmittingComment(true);
      await api.createComment(id!, { content: commentContent });
      setCommentContent('');
      toast.success('Comment added successfully!');
      fetchComments(); // Refresh comments
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.deletePost(id!);
      toast.success('Post deleted successfully!');
      window.history.back();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <article className="mb-8">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}

        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(post.created_at), 'MMM dd, yyyy')}
              </div>
              {post.category_name && (
                <Link
                  to={`/?category=${post.category_slug}`}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                >
                  {post.category_name}
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.view_count} views
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {comments.length} comments
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {post.author_avatar && (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{post.author_name}</span>
              </div>
              {post.author_bio && (
                <p className="text-sm text-gray-600 mt-1">{post.author_bio}</p>
              )}
            </div>
          </div>

          {/* Action buttons for post owner */}
          {user && user.id === post.author_id && (
            <div className="flex space-x-2 mt-4">
              <Link
                to={`/edit-post/${post.id}`}
                className="btn-secondary text-sm"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="btn-danger text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>

        {/* Add Comment */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="input mb-4"
              required
            />
            <button
              type="submit"
              disabled={submittingComment || !commentContent.trim()}
              className="btn-primary"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              Please{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                sign in
              </Link>{' '}
              to leave a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="card p-6">
                <div className="flex items-start space-x-3">
                  {comment.avatar_url && (
                    <img
                      src={comment.avatar_url}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {comment.full_name || comment.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(comment.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail; 