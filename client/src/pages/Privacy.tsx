import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">Your privacy matters to us. Learn how we protect your data.</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-primary-600" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Account Information:</strong> When you register, we collect your username, email address, and full name to create and manage your account.</p>
                <p><strong>Content:</strong> We store the blog posts, comments, and profile information you choose to share on our platform.</p>
                <p><strong>Usage Data:</strong> We collect information about how you interact with our platform, including pages visited and features used.</p>
                <p><strong>Technical Information:</strong> We may collect your IP address, browser type, and device information for security and analytics purposes.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-primary-600" />
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Service Provision:</strong> To provide, maintain, and improve our blog platform services.</p>
                <p><strong>Communication:</strong> To send you important updates about your account and our services.</p>
                <p><strong>Security:</strong> To protect against fraud, abuse, and security threats.</p>
                <p><strong>Analytics:</strong> To understand how our platform is used and improve user experience.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-primary-600" />
                Information Sharing
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Public Content:</strong> Your blog posts and public profile information are visible to other users.</p>
                <p><strong>Third-Party Services:</strong> We may use trusted third-party services for hosting, analytics, and email delivery.</p>
                <p><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</p>
                <p><strong>Never Sold:</strong> We will never sell, rent, or trade your personal information to third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-primary-600" />
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Access:</strong> You can view and update your personal information through your profile settings.</p>
                <p><strong>Deletion:</strong> You can delete your account and all associated data at any time.</p>
                <p><strong>Portability:</strong> You can export your content and data from our platform.</p>
                <p><strong>Opt-out:</strong> You can unsubscribe from non-essential communications.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <div className="space-y-4 text-gray-700">
                <p>We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits.</p>
                <p>However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Email: <a href="mailto:ayushmittal0456@gmail.com" className="text-primary-600 hover:text-primary-700">ayushmittal0456@gmail.com</a></li>
                  <li>GitHub: <a href="https://github.com/Ayush-Mittal0405" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">@Ayush-Mittal0405</a></li>
                </ul>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Privacy;
