import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p>When you use our service, we may collect certain information about you, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your name and email address when you sign up</li>
          <li>Your Twitter profile information when you login with Twitter</li>
          <li>Usage data and analytics</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p>We use the collected information for various purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information so that we can improve our service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data Security</h2>
        <p>The security of your data is important to us. We implement appropriate security measures to protect your personal information.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@example.com</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;