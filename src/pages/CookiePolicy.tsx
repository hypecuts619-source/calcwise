import React from 'react';

export function CookiePolicy() {
  React.useEffect(() => {
    document.title = "Cookie Policy | CalcWise - Cookie Consent & Local Storage";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Understand how CalcWise responsibly deploys essential operational cookies and browser local storage configurations under global CCPA & GDPR guidelines.");
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <h1 className="text-4xl font-display font-extrabold text-heading">Cookie Policy</h1>
      <p className="text-sm text-hint italic">Last updated: May 31, 2026</p>
      <div className="prose prose-slate max-w-none text-body">
        <p className="mb-4">
          This comprehensive Cookie Policy explains how CalcWise uses cookies and similar digital tracking technologies across our web properties. Our goal is to maintain absolute transparency regarding what data we handle and how we utilize local storage mechanisms to improve your experience.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Understanding Digital Cookies</h2>
        <p className="mb-4">
          Cookies are small, encrypted text files that are temporarily or persistently placed on your computer, smartphone, or other digital devices whenever you access a website. They serve as a foundational technology of the modern internet, enabling websites to recognize your specific hardware or browser session over time. This recognition allows web applications to deliver a customized, uninterrupted user experience without requiring you to constantly verify your identity or re-enter your preferred configuration settings. 
        </p>
        <p className="mb-8">
          Along with standard HTTP cookies, we also consider "Local Storage" under this policy. Modern browsers support Web Storage API (localStorage and sessionStorage), which allows developers to store slightly larger amounts of data natively within the browser cache rather than transmitting it over the network to the server with every single request. Many of our features, such as caching your previous calculator inputs, rely predominantly on local storage rather than traditional HTTP cookies. This enhances privacy by keeping your mathematical variables strictly on your physical machine.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Categories of Cookies We Utilize</h2>
        <p className="mb-4">
          In order to deliver an exceptionally robust and user-friendly mathematical experience, we classify our local storage and cookie usage into three primary functional areas:
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li>
            <strong>Essential Operational Cookies:</strong> These are technically mandatory data structures necessary just to map out the bare minimum functionality of the website. Without these, our load balancers and core network routing frameworks would fail. Because they are vital to the structural integrity of the application, these cannot be disabled.
          </li>
          <li>
            <strong>Preference & Customization Cookies:</strong> We utilize this local storage category to securely remember your localized environmental preferences. For example, if you toggle the application to "Dark Theme" viewing mode, or set your preferred default currency to the Euro (€) instead of the US Dollar ($), we write a small key-value pair to your browser. This successfully ensures that whenever you return for a new calculation session, the application automatically boots into your preferred state without redundant manual configuration.
          </li>
          <li>
            <strong>Aggregated Analytical Telemetry:</strong> We engage with carefully selected, privacy-respecting basic analytical service frameworks to anonymously measure aggregate site traffic. This helps our engineering team quickly identify which specific mathematical calculators are the most heavily utilized (e.g., perhaps the Mortgage Calculator is experiencing a surge in usage in the UK), and helps us rapidly recognize widespread technical rendering crashes across certain mobile operating system versions. This generalized traffic data does not uniquely identify your individual identity.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Cookie Consent Mechanism and Granular Control</h2>
        <p className="mb-4">
          Depending heavily upon your specific geographic location (most notably regarding IP addresses located dynamically within the European Economic Area under GDPR frameworks, or California under CCPA parameters), you may clearly observe a dedicated Cookie Consent notification banner upon your very first initialization of the CalcWise platform. This specialized compliance banner actively empowers you to manually opt-in or strictly opt-out of all non-essential Tracking and Analytical cookies before any permanent data generation dynamically occurs.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Managing Preferences via Your Browser</h2>
        <p className="mb-8">
          Furthermore, absolutely every major contemporary web browser actively provides advanced internal technical mechanisms empowering you to strictly control, immediately delete, or permanently block HTTP cookies at the very highest software execution level. If you navigate directly into the profound security or privacy privacy settings tabs within browsers such as Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge, you will definitively locate powerful interfaces designed to automatically wipe all cached cookies upon exit. Just deliberately be absolutely aware that actively triggering such aggressive digital countermeasures will comprehensively delete all of your localized personalization settings across CalcWise, fundamentally resetting your entire visual theme preferences and locally locally cached mathematical history arrays completely.
        </p>
      </div>
    </div>
  );
}
