import React from "react";

function PrivacyPolicy() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use our
        services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Personal Information:</strong> When you register an account,
          make a purchase, or contact us, we may collect your name, email
          address, phone number, and payment information.
        </li>
        <li>
          <strong>Usage Data:</strong> We may collect information about how you
          interact with our website, including IP addresses, browser types,
          and pages visited.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use the information we collect for the following purposes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and improve our services.</li>
        <li>To process payments and complete transactions.</li>
        <li>To send updates, promotions, or important notices.</li>
        <li>To analyze website usage and improve user experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. Sharing Your Information</h2>
      <p className="mb-4">
        We do not sell your personal information. However, we may share your
        information with:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Third-party service providers to facilitate our services.</li>
        <li>Law enforcement or regulatory authorities when required by law.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your personal information from
        unauthorized access, disclosure, alteration, or destruction. However,
        no method of transmission over the Internet is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal
        information. Contact us at [your contact email] to exercise your
        rights.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will
        be posted on this page with a revised effective date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at:
      </p>
      <p>Email: <a href="mailto:support@example.com" className="text-blue-500">support@example.com</a></p>
      <p>Phone: +123-456-7890</p>
    </div>
  );
}

export default PrivacyPolicy;
