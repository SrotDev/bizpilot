import React from 'react'

const faqs = [
  { q: 'Is there a free tier?', a: 'Yes — our Free tier lets you create up to 5 idea projects per month and access basic market signals. It\'s great for testing a few concepts before upgrading.' },
  { q: 'Can I export my plan?', a: 'Absolutely — you can export your idea summary, assumptions, and the simple operational roadmap as a PDF for sharing, or as CSV/JSON to import into spreadsheets or other tools.' },
  { q: 'How accurate are the market signals?', a: 'We surface lightweight market indicators (search interest, competitive density, quick TAM estimates) to help you prioritize. These are quick signals for early validation — for deep due diligence you should supplement with specialist research.' },
  { q: 'Do you offer team plans?', a: 'Yes — Pro includes unlimited ideas and collaboration features. Enterprise adds SSO, audit logs, and a dedicated onboarding flow. Contact sales for volume licensing.' },
  { q: 'Can I iterate on an idea later?', a: 'Yes — every project is versioned so you can fork or regenerate alternative scenarios, re-run simulations with different assumptions, and track changes over time.' },
]

export default function FAQList(){
  return (
    <div className="faq-list">
      {faqs.map((f,i)=> (
        <details key={i} className="faq-item">
          <summary>{f.q}</summary>
          <p className="page-sub">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
