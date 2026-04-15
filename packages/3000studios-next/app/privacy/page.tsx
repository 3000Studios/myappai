import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for 3000 Studios - How we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-gray-300 text-lg mb-8">Last updated: January 2, 2026</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-400 leading-relaxed">
              Welcome to 3000 Studios (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are
              committed to protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website at 3000studios.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Personal Information</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide, including:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>Name and email address (when you contact us or subscribe)</li>
              <li>Payment information (when making purchases)</li>
              <li>Phone number (if provided)</li>
              <li>Company name and job title (for business inquiries)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">
              Automatically Collected Information
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              When you visit our website, we automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our website and user experience</li>
              <li>Detect and prevent fraud and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to collect and track information
              about our website visitors. Cookies are small data files placed on your device. You
              can control cookie preferences through your browser settings.
            </p>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Types of Cookies We Use:</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for basic website functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with
                our site
              </li>
              <li>
                <strong>Advertising Cookies:</strong> Used to deliver relevant advertisements
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and preferences
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We may use third-party services that collect, monitor, and analyze data:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <strong>Google Analytics:</strong> For website traffic analysis
              </li>
              <li>
                <strong>Google AdSense:</strong> For serving advertisements
              </li>
              <li>
                <strong>Stripe/PayPal:</strong> For payment processing
              </li>
              <li>
                <strong>Vercel:</strong> For website hosting and analytics
              </li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              These third parties have their own privacy policies governing the use of your
              information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
            <p className="text-gray-400 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect
              your personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is 100% secure, and
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify or update inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability (receive data in a structured format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-gray-400 leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian
              and believe your child has provided us with personal information, please contact us
              immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &quot;Last
              updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please
              contact us:
            </p>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-white font-semibold mb-2">3000 Studios</p>
              <p className="text-gray-400">Email: privacy@3000studios.com</p>
              <p className="text-gray-400">Website: https://3000studios.com/contact</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

