import React from 'react';

export function PrivacyPolicy() {
  React.useEffect(() => {
    document.title = "Privacy Policy | CalcWise - Secure & Private Calculations";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Read about CalcWise's rigorous data privacy standards. We process calculations natively in your local browser sandbox to ensure your sensitive inputs never traverse the web.");
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <h1 className="text-4xl font-display font-extrabold text-heading">Privacy Policy</h1>
      <p className="text-sm text-hint italic">Last updated: May 31, 2026</p>
      <div className="prose prose-slate max-w-none text-body">
        <p className="mb-4">
          At CalcWise, we take your privacy exceptionally seriously. We understand that mathematical tools often involve inputting deeply meaningful, private, or sensitive financial information. This comprehensive, exhaustive Privacy Policy document intricately explains exactly how we collect, securely use, meticulously protect, and cautiously manage any potentially identifying information whenever you visit, interact with, or utilize our web-based calculator suite across global jurisdictions.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Comprehensive Data Collection Practices</h2>
        <p className="mb-4">
          We firmly and resolutely absolutely do not require you to create an account, register an email, or provide any personally identifying information whatsoever to use any of our core, basic, or advanced calculators. The majority of the mathematical calculations you actively perform are fundamentally run completely locally inside your own browser environment using standard JavaScript technologies. Furthermore, they are absolutely not automatically saved, transmitted, or synchronized to our remote private servers unless there is a completely explicit, user-initiated action explicitly stated. For instance, any "Save to History" or bookmarking features predominantly strictly rely on entirely local storage implementations embedded strictly within your unique local device architecture.
        </p>
        <p className="mb-8">
          However, as is standard practice across digital platforms globally, we do automatically collect certain non-personally identifiable technical diagnostic and analytics information whenever you actively visit, interactively use, or generally navigate through the Site. This automatically harvested diagnostic information profoundly does not reveal your specific real-world identity (like your precise name, residential address, personal phone number, or exact contact information). Instead, it exclusively includes generalized device metrics and operational usage information. Such structural metrics include your anonymized IP address, broad browser classifications, specific hardware device characteristics, exact underlying operating system identifiers, generalized language preferences, external referring URLs that directed you here, technical device name, generalized generalized geographic country or generalized location parameters, timestamps indicating precisely when and exactly how you interact with our expansive Site, alongside other critical operational technical systems telemetry data required to keep the platform reliably online.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Advanced Cookies and Tracking Methodologies</h2>
        <p className="mb-8">
          We selectively, responsibly utilize industry-standard digital cookies and closely related technical tracking methodologies (including, but strictly not limited to, transparent web navigational beacons and tracking pixels) to accurately access or persistently store configuration preferences. This enables you to persistently maintain chosen configuration preferences (like selected dark themes, favorite core currencies, or actively pinned calculators) seamlessly between your diverse browsing sessions. Specific granular information regarding exactly how we technically deploy such ubiquitous technologies, alongside exactly how you comprehensively retain total authoritative control to refuse or actively block certain cookies entirely, is transparently set out in robustly detailed form inside our comprehensively documented <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> document.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Global Privacy Law Compliance & Individual Rights</h2>
        <p className="mb-4">
          We strictly adhere to all relevant and globally impactful data privacy regulations, including the comprehensively protective General Data Protection Regulation (GDPR) mandated across the European Union, the deeply robust California Consumer Privacy Act (CCPA), and similar stringent statutory legal frameworks worldwide. Under these comprehensive legislative frameworks, provided we actually retained actively identifiable data connected to you, you would fundamentally maintain absolute, irrevocable, and unalienable legal rights to:
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-4">
          <li><strong>Right to Formal Access:</strong> To definitively request completely exact, unredacted, comprehensive copies of any personal or demographic data we structurally hold regarding your individual profiles.</li>
          <li><strong>Right to Immediate Erasure:</strong> To legally mandate the immediate, permanent, irreversible deletion and complete obliteration of any personal information contained across any of our structural systems.</li>
          <li><strong>Right to Strict Rectification:</strong> To comprehensively necessitate the rapid correction of absolutely any incorrect, actively false, or woefully outdated personal data elements securely held.</li>
          <li><strong>Right to Data Portability:</strong> To legally systematically request the active, secure transfer of any provided user data explicitly to another entirely independent organizational entity under standardized, easily machine-readable universal formats.</li>
        </ul>
        <p className="mb-8">
          Because our underlying architectural system emphatically declines to store personal identity profiles, such rigorous legal requests are typically moot—we cannot reveal, rectify, or port data we completely refuse to structurally collect in the fundamental first place! This profound reality is exactly our intended objective. We actively believe the simplest, most remarkably secure method of proactively preventing massive data breaches is to intentionally refuse the collection of highly sensitive target data structures entirely.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Structural Data Security Measures</h2>
        <p className="mb-8">
          Although we actively avoid harvesting your private personal information, we still incredibly earnestly invest extremely significant financial resources, complex structural engineering cycles, and profound technical architecture into heavily securing our digital platform interfaces. We meticulously deploy hardened modern cryptographic protocols (explicitly including advanced HTTPS with TLS encryption tunnels everywhere), rapidly action automated digital security patching systems to eliminate server-side vulnerabilities, continuously execute sophisticated firewall defensive heuristics, and perform rigorous, regular programmatic vulnerability testing. Our fundamental baseline infrastructure actively utilizes several world-class cloud operational security providers guaranteeing compliance with strictly severe, incredibly robust SOC 2 and ISO 27001 data center physical and logical security compliance standard requirements.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-8 mb-4">Significant Future Changes to this Policy</h2>
        <p className="mb-8">
          We firmly retain the explicit, unilateral legal operational right to continuously update, thoroughly modify, explicitly expand, or completely overhaul this incredibly detailed privacy notice organically from time to time as fundamentally necessary due to rapidly shifting global legal privacy compliance mandates, evolving technical internet architectures, or strategically necessary expansions across our corporate operational business methodologies. The formally updated version will definitively be rapidly indicated by an prominently clearly updated "Last comprehensively updated" timestamp actively visible at the highest top section of this formal document, and the newly updated formal legal structural version will decisively become effective identically as soon as it logically completely becomes publicly accessible globally. We emphatically strongly encourage you to continuously review this exact comprehensive privacy notice immensely frequently specifically to remain intensely fully deeply informed regarding exactly how we are constantly actively proactively structurally absolutely protecting your profoundly critically profoundly sensitive information.
        </p>
      </div>
    </div>
  );
}
