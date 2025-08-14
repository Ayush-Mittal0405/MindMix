import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle, XCircle, Scale } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-xl text-gray-600">Please read these terms carefully before using MindMix.</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-primary-600" />
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>By accessing and using MindMix, you accept and agree to be bound by the terms and provision of this agreement.</p>
                <p>If you do not agree to abide by the above, please do not use this service.</p>
                <p>These terms apply to all visitors, users, and others who access or use the service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-primary-600" />
                User Responsibilities
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account and password.</p>
                <p><strong>Content Ownership:</strong> You retain ownership of content you create, but grant us license to display and distribute it.</p>
                <p><strong>Prohibited Content:</strong> You agree not to post content that is illegal, harmful, threatening, abusive, or violates others' rights.</p>
                <p><strong>Respectful Behavior:</strong> Treat other users with respect and follow community guidelines.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-primary-600" />
                Prohibited Activities
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Spam & Scams:</strong> No unsolicited commercial messages or fraudulent activities.</p>
                <p><strong>Harassment:</strong> No bullying, stalking, or harassment of other users.</p>
                <p><strong>Copyright Violation:</strong> Only post content you own or have permission to use.</p>
                <p><strong>Malware:</strong> No uploading of viruses, malware, or harmful code.</p>
                <p><strong>Impersonation:</strong> No pretending to be someone else or creating fake accounts.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-primary-600" />
                Content Moderation
              </h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Right to Remove:</strong> We reserve the right to remove any content that violates these terms.</p>
                <p><strong>Account Suspension:</strong> We may suspend or terminate accounts for repeated violations.</p>
                <p><strong>Appeal Process:</strong> Users can appeal content removal decisions through our support channels.</p>
                <p><strong>Community Reporting:</strong> Users can report inappropriate content for review.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Your Content:</strong> You retain all rights to your original content.</p>
                <p><strong>License Grant:</strong> By posting content, you grant us a worldwide, non-exclusive license to use, display, and distribute it.</p>
                <p><strong>Platform Rights:</strong> MindMix, including its design, code, and branding, is our intellectual property.</p>
                <p><strong>Attribution:</strong> We will always credit you as the author of your content.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>MindMix is provided "as is" without warranties of any kind.</p>
                <p>We are not liable for any damages arising from your use of the service.</p>
                <p>We do not guarantee the accuracy, completeness, or usefulness of any content.</p>
                <p>Users are responsible for backing up their own content.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>User Termination:</strong> You can delete your account at any time.</p>
                <p><strong>Platform Termination:</strong> We may terminate or suspend access immediately for violations.</p>
                <p><strong>Content Removal:</strong> Upon termination, your content may be permanently deleted.</p>
                <p><strong>Survival:</strong> Some terms survive account termination, including intellectual property and liability provisions.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may update these terms from time to time.</p>
                <p>Users will be notified of significant changes via email or platform notification.</p>
                <p>Continued use after changes constitutes acceptance of new terms.</p>
                <p>Previous versions will be archived and accessible upon request.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>For questions about these terms, please contact us:</p>
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

export default Terms;
