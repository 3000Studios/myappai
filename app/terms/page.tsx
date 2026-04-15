import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for 3000 Studios - Rules and guidelines for using our services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-8">Terms of Service</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-gray-300 text-lg mb-8">Last updated: January 2, 2026</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using the 3000 Studios website (&quot;Service&quot;), you accept and
              agree to be bound by these Terms of Service. If you do not agree to these terms,
              please do not use our Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-400 leading-relaxed">
              3000 Studios provides premium digital services including web development, design, AI
              solutions, live streaming services, digital products, and creative consulting. We
              reserve the right to modify, suspend, or discontinue any aspect of the Service at any
              time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              When you create an account with us, you must provide accurate and complete
              information. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Purchases and Payments</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              For any purchases made through our Service:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>All prices are displayed in USD unless otherwise specified</li>
              <li>Payment must be made in full at the time of purchase</li>
              <li>We accept major credit cards and PayPal</li>
              <li>Digital products are delivered electronically upon payment confirmation</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Refund Policy</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Our refund policy varies by product type:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <strong>Digital Products:</strong> Due to the nature of digital goods, refunds are
                generally not available after download. However, we may consider refunds on a
                case-by-case basis within 14 days of purchase if the product is defective.
              </li>
              <li>
                <strong>Services:</strong> Refunds for services are handled according to the
                specific service agreement.
              </li>
              <li>
                <strong>Subscriptions:</strong> You may cancel subscriptions at any time. Refunds
                for the current billing period are not provided.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p className="text-gray-400 leading-relaxed">
              All content on this Service, including text, graphics, logos, images, audio clips,
              digital downloads, and software, is the property of 3000 Studios or its content
              suppliers and is protected by international copyright laws. You may not reproduce,
              distribute, modify, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">7. User Conduct</h2>
            <p className="text-gray-400 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload viruses or malicious code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Collect user information without consent</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Links</h2>
            <p className="text-gray-400 leading-relaxed">
              Our Service may contain links to third-party websites or services. We are not
              responsible for the content, privacy policies, or practices of any third-party sites
              or services. Your use of such sites is at your own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-400 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE
              WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. YOUR USE OF THE SERVICE IS AT YOUR SOLE
              RISK.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, 3000 STUDIOS SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF
              PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-gray-400 leading-relaxed">
              You agree to indemnify and hold harmless 3000 Studios, its officers, directors,
              employees, and agents from any claims, damages, losses, liabilities, and expenses
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
            <p className="text-gray-400 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the
              United States, without regard to its conflict of law provisions. Any disputes arising
              under these Terms shall be resolved in the courts of the United States.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any
              material changes by posting the new Terms on this page. Your continued use of the
              Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-white font-semibold mb-2">3000 Studios</p>
              <p className="text-gray-400">Email: legal@3000studios.com</p>
              <p className="text-gray-400">Website: https://3000studios.com/contact</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

