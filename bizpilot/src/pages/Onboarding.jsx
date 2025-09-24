import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PRODUCT_CATEGORIES = [
  'Software / SaaS','Mobile App','AI / Machine Learning','Web Platform / Marketplace','E-commerce / Retail','FinTech / Payments','HealthTech / MedTech','EdTech / Learning','GreenTech / Sustainability','AgriTech / FoodTech','Hardware / IoT / Robotics','AR / VR / Metaverse','Media / Entertainment / Gaming','Travel / Hospitality','Social Impact / Nonprofit'
]

const TARGET_MARKETS = [
  'B2C – Mass Consumers','B2B – Small Businesses / Startups','B2B – Enterprise / Corporates','B2G – Government / NGOs','Students / Education Sector','Healthcare Professionals / Hospitals','Freelancers / Creators','Developers / Tech Teams','Rural / Underserved Communities','Luxury / Premium Customers'
]

function AISpinner() {
  return (
    <div className="ai-spinner">
      <div className="loader">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
      <div className="label">Generating your dashboard…</div>
    </div>
  )
}

export default function Onboarding(){
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [budget, setBudget] = useState('<1k')
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0])
  const [market, setMarket] = useState(TARGET_MARKETS[0])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if(!title.trim()) e.title = 'Title is required'
    if(!desc.trim()) e.desc = 'Short description is required'
    if(!budget) e.budget = 'Please choose a budget range'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if(!validate()) return
    setLoading(true)
    // simulate upload + ai generation
    await new Promise(r => setTimeout(r, 1800))
    // optionally send to backend here using fetch
    await new Promise(r => setTimeout(r, 1200))
    // redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="onboarding-layout single-card fade-in">
      <div className="onboarding-panel wide-centered">
        <div className="panel-accent" />
        <header className="onboarding-header">
          <h1>Tell us about your idea</h1>
          <p>This helps us tailor your experience and generate starter assets.</p>
          <div className="progress-track" aria-hidden>
            <div className="progress-bar" />
          </div>
        </header>
        <div className="subtle-divider" />
        <form onSubmit={submit} className="onboard-form modern two-col">
          <div className="input-shell full">
            <label>Title {errors.title && <span className="form-err">— {errors.title}</span>}</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. AI-powered personal finance coach" />
          </div>

            <div className="input-shell full">
              <label>Short description {errors.desc && <span className="form-err">— {errors.desc}</span>}</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="One or two lines summarizing the core value proposition." />
            </div>

            <div className="input-shell">
              <label>Budget range {errors.budget && <span className="form-err">— {errors.budget}</span>}</label>
              <select value={budget} onChange={e=>setBudget(e.target.value)}>
                <option value="<1k">&lt; $1k</option>
                <option value="1k-10k">$1k–10k</option>
                <option value="10k-50k">$10k–50k</option>
                <option value="50k-100k">$50k–100k</option>
                <option value="100k-500k">$100k–500k</option>
                <option value="500k-1M">$500k–$1M</option>
                <option value=">1M">&gt; $1M</option>
              </select>
            </div>

            <div className="input-shell">
              <label>Product category</label>
              <select value={category} onChange={e=>setCategory(e.target.value)}>
                {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="input-shell">
              <label>Target market</label>
              <select value={market} onChange={e=>setMarket(e.target.value)}>
                {TARGET_MARKETS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="input-shell full">
              <label>Upload pitch deck (PDF)</label>
              <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} />
              <small>Optional — max 10MB. We only parse text for insights.</small>
            </div>

            <div className="form-actions compact full">
              <button className="btn" type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit & Generate'}</button>
            </div>
        </form>
        {loading && <AISpinner />}
      </div>
    </div>
  )
}
