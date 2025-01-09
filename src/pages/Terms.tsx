import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Terms</h2>
        <p>By accessing this website, you are agreeing to be bound by these terms of service and agree that you are responsible for compliance with any applicable local laws.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Disclaimer</h2>
        <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Limitations</h2>
        <p>In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at support@example.com</p>
      </div>
    </div>
  );
};

export default Terms;