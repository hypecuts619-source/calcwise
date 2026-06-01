import React from 'react';

export function About() {
  React.useEffect(() => {
    document.title = "About Us & Our Core Mission | CalcWise";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Learn about CalcWise's mission to democratize global data literacy. Read about our four core pillars: universal utility, absolute educational transparency, privacy-by-design, and zero fee paywalls.");
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <h1 className="text-4xl font-display font-extrabold text-heading">About CalcWise</h1>
      <div className="prose prose-slate max-w-none text-body">
        <p className="text-xl leading-relaxed mb-4">
          CalcWise is your definitive, comprehensive, and widely respected source for free, highly accurate, and globally adapted calculators. From intricate finance models to vital health metrics, complex math algorithms, and everyday conversions, we make advanced mathematical concepts elegantly simple, highly accessible, and totally understandable for absolutely everyone across the globe.
        </p>
        <p className="mb-4">
          At our core, we believe that understanding the world through numbers should not require a PhD in mathematics or finance. In modern society, everyday people face a relentless barrage of mathematical dilemmas—from negotiating the labyrinthine details of mortgage rates, amortizations, and compound interest, to optimizing fitness routines through metabolic rate analysis and caloric expenditure tracking. In every one of these scenarios, the ability to rapidly convert raw data into actionable insights represents a massive advantage. We built CalcWise to democratize that advantage.
        </p>
        
        <h2 className="text-2xl font-bold text-heading mt-12 mb-4">Our Deep-Rooted Mission</h2>
        <p className="mb-4">
          We firmly believe that math should never serve as an intimidating barrier to making profoundly informed, highly deliberate, and exceptionally confident decisions in your life. Whether you are actively trying to figure out your exact monthly mortgage payments with varying interest rates in the United States, carefully calculating value-added tax (VAT) compliance in Europe, running engineering calculations for construction material yields, or simply determining your body mass index to chart a healthy lifestyle course, you fundamentally need tools that are meticulously reliable, incredibly fast, and wonderfully easy to use.
        </p>
        <p className="mb-8">
          Our unyielding mission is to architect, develop, and universally distribute the world's absolute most accessible, highly intuitive, and deeply comprehensive suite of mathematical calculators. We actively strip away the overwhelming visual clutter, intensely focus on seamless usability, and systematically provide rich contextual help mechanisms so you clearly understand not merely the "what" (the ultimate final number result), but importantly, also the "how" (the sophisticated formulas, equations, and logic structurally supporting it behind the scenes).
        </p>

        <h2 className="text-2xl font-bold text-heading mt-12 mb-4">Why Select CalcWise? Our Core Pillars</h2>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Global Adaptation & Universal Utility:</strong> We architecturally support an expansive array of multiple global currencies, localized formatting standards, and regional metric versus imperial systems. This intentional internationalization explicitly makes our powerful tools immeasurably useful no matter exactly where you live, travel, or conduct business globally.</li>
          <li><strong>Total Educational Transparency:</strong> We emphatically show you the underlying formulas, step-by-step methodologies, and structural logic behind our robust calculations. We are not just giving you a black box output answer; we are building profound trust through radical educational transparency, acting as your quantitative tutor.</li>
          <li><strong>Uncompromising Privacy First Architecture:</strong> Your profoundly personal calculations categorically remain your very own private data. We absolutely do not surreptitiously intercept, harvest, or perpetually store highly sensitive personal or financial information on our centralized backend servers. Our client-heavy execution models strongly guarantee immense data privacy standards for all global individuals.</li>
          <li><strong>Radically Free Forever:</strong> Our unbelievably expansive core suite of dynamic calculators is fundamentally completely free to utilize without restrictive paywalls, recurring subscription traps, or forced user account registrations.</li>
        </ul>

        <h2 className="text-2xl font-bold text-heading mt-12 mb-4">The Driving Force: Our Exceptional Team</h2>
        <p className="mb-4">
          CalcWise wasn't merely assembled; it is continuously, lovingly crafted by a dedicated, multidisciplinary team of elite software developers, visionary user experience designers, seasoned quantitative financial experts, and rigorous data science specialists who are collectively obsessed with dramatically increasing global data literacy. When we looked at the chaotic landscape of digital calculators scattered across the internet, we saw a fragmented nightmare of outdated interfaces, broken scripts, aggressive advertisements, and zero educational context.
        </p>
        <p className="mb-8">
          We knew society urgently deserved significantly better. We proactively committed our technical expertise, boundless creative energy, and significant professional resources to systematically continually expanding our robust toolsets, rigorously refining our graphical user interfaces, and ensuring mathematical precision across several hundreds of distinct computational permutations.
        </p>

        <h2 className="text-2xl font-bold text-heading mt-12 mb-4">Our Envisioned Future</h2>
        <p className="mb-8">
          Looking squarely onto the horizon, our roadmap for the upcoming future is boldly expansive. As we rigorously continuously monitor emerging global trends in decentralized finance, sophisticated modern construction techniques, holistic nutritional sciences, and advanced globalized commerce, we plan to relentlessly release novel calculation tools tailored to these rapidly evolving industries. CalcWise will ceaselessly evolve as the premier quantitative utility companion embedded into your daily digital habits.
        </p>
        
        <p className="mt-12 text-sm text-hint italic">
          We deeply value your crucial insights. If you possess innovative suggestions, explicit feature requests, or happen to meticulously spot an incredibly rare technical issue embedded within any of our hundreds of distinct calculators, please profoundly do not hesitate to kindly reach out to our dedicated support infrastructure immediately!
        </p>
      </div>
    </div>
  );
}
