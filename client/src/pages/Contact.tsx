import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      toast.success('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600">Have questions or feedback? We'd love to hear from you!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <p className="text-gray-600 mb-8">
              Reach out to us through any of these channels. We typically respond within 24 hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <a href="mailto:ayushmittal0456@gmail.com" className="text-primary-600 hover:text-primary-700">
                  ayushmittal0456@gmail.com
                </a>
                <p className="text-sm text-gray-500 mt-1">Best for detailed inquiries</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Github className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">GitHub</h3>
                <a href="https://github.com/Ayush-Mittal0405" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  @Ayush-Mittal0405
                </a>
                <p className="text-sm text-gray-500 mt-1">For technical discussions</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Twitter</h3>
                <a href="https://x.com/Ayushmittal2006" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  @Ayushmittal2006
                </a>
                <p className="text-sm text-gray-500 mt-1">For quick updates</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">LinkedIn</h3>
                <a href="https://www.linkedin.com/in/ayush-mittal-741946313" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  Ayush Mittal
                </a>
                <p className="text-sm text-gray-500 mt-1">For professional inquiries</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-3">Response Time</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• General inquiries: Within 24 hours</li>
              <li>• Technical support: Within 12 hours</li>
              <li>• Bug reports: Within 6 hours</li>
              <li>• Feature requests: Within 48 hours</li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="input w-full"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="input w-full resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By submitting this form, you agree to our{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
              {' '}and{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Contact;
