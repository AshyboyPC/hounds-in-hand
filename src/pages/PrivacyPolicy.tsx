import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/animations";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="down">
              <h1 className="text-5xl display-font text-primary mb-6">Privacy Policy</h1>
              <p className="text-lg body-font text-gray-700">
                Last Updated: January 2024
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Content */}
        <FadeIn direction="up">
          <div className="bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Introduction</h2>
                <p className="body-font text-gray-700 leading-relaxed mb-4">
                  Connect 4 Paws ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you visit our website 
                  and use our services.
                </p>
                <p className="body-font text-gray-700 leading-relaxed">
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                  please do not access the site.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Information We Collect</h2>
                
                <h3 className="text-2xl heading-font text-primary mb-3 mt-6">Personal Information</h3>
                <p className="body-font text-gray-700 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 body-font text-gray-700 space-y-2 mb-4">
                  <li>Register for an account</li>
                  <li>Apply to adopt a dog</li>
                  <li>Sign up to volunteer</li>
                  <li>Make a donation</li>
                  <li>Contact us with inquiries</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
                <p className="body-font text-gray-700 leading-relaxed">
                  This information may include: name, email address, phone number, mailing address, payment information, 
                  and any other information you choose to provide.
                </p>

                <h3 className="text-2xl heading-font text-primary mb-3 mt-6">Automatically Collected Information</h3>
                <p className="body-font text-gray-700 leading-relaxed">
                  When you visit our website, we may automatically collect certain information about your device, including 
                  information about your web browser, IP address, time zone, and some of the cookies installed on your device.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">How We Use Your Information</h2>
                <p className="body-font text-gray-700 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 body-font text-gray-700 space-y-2">
                  <li>Process adoption applications and volunteer registrations</li>
                  <li>Facilitate donations and maintain donor records</li>
                  <li>Send you updates about dogs available for adoption</li>
                  <li>Communicate with you about volunteer opportunities</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send administrative information and updates</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraudulent transactions and monitor against theft</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Sharing Your Information</h2>
                <p className="body-font text-gray-700 leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-6 body-font text-gray-700 space-y-2">
                  <li><strong>Partner Shelters:</strong> When you apply to adopt, we share your information with the relevant shelter</li>
                  <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our organization</li>
                </ul>
                <p className="body-font text-gray-700 leading-relaxed mt-4">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Data Security</h2>
                <p className="body-font text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information. 
                  However, no electronic transmission over the internet or information storage technology can be guaranteed to 
                  be 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Your Rights</h2>
                <p className="body-font text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 body-font text-gray-700 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request restriction of processing your personal information</li>
                  <li>Request transfer of your personal information</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Cookies and Tracking</h2>
                <p className="body-font text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you 
                  do not accept cookies, you may not be able to use some portions of our website.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Children's Privacy</h2>
                <p className="body-font text-gray-700 leading-relaxed">
                  Our services are not directed to children under the age of 13. We do not knowingly collect personal information 
                  from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                  information, please contact us.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Changes to This Policy</h2>
                <p className="body-font text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                  Policy periodically for any changes.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl display-font text-primary mb-4">Contact Us</h2>
                <p className="body-font text-gray-700 leading-relaxed mb-4">
                  If you have questions or concerns about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="body-font text-gray-700 mb-2"><strong>Connect 4 Paws</strong></p>
                  <p className="body-font text-gray-700 mb-2">123 Rescue Lane, Campbell, PA 15001</p>
                  <p className="body-font text-gray-700">Email: privacy@connect4paws.org</p>
                  <p className="body-font text-gray-700">Phone: (555) 123-4567</p>
                </div>
              </section>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
