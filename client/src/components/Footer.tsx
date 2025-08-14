import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold text-primary-400 mb-4">MindMix</h3>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              A modern blog platform where writers share insights, stories, and knowledge. 
              Join our community of creators and discover amazing content.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Ayush-Mittal0405" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://x.com/Ayushmittal2006" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/ayush-mittal-741946313" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:ayushmittal0456@gmail.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=technology" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/?category=lifestyle" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/?category=travel" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Travel
                </Link>
              </li>
              <li>
                <Link to="/?category=food" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Food
                </Link>
              </li>
              <li>
                <Link to="/?category=health" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} MindMix. Made with <Heart className="inline w-4 h-4 text-red-500" /> for creators.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
