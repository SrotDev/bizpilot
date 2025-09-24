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
      <div className="label">Generating your business idea…</div>
    </div>
  )
}

export default function GenerateIdea(){
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
    
    // simulate AI generation
    await new Promise(r => setTimeout(r, 2000))
    
    // collect idea and append to localStorage
    try{
      const raw = localStorage.getItem('bizpilot_ideas')
      const arr = raw ? JSON.parse(raw) : []
      const id = 'idea-' + Date.now()
      const idea = {
        id,
        groupTitle: title,
        groupDescription: desc,
        summary: `${title}: ${desc} Targeting ${market} with a budget of ${budget}.`,
        quick_stats: {
          market_size: market,
          growth_potential: 'To be analyzed',
          target_audience: market
        },
        model_archetype: category.includes('B2B') ? 'B2B SaaS' : category.includes('B2C') ? 'B2C SaaS' : 'Platform'
      }
      arr.unshift(idea)
      localStorage.setItem('bizpilot_ideas', JSON.stringify(arr))
    } catch(e){}
    
    navigate('/dashboard')
  }

  return (
    <div className="idea-gen-layout single-card fade-in">
      <div className="idea-gen-panel wide-centered">
        <div className="panel-accent" />
        <header className="idea-gen-header">
          <h1>Generate New Business Idea</h1>
          <p>Tell us about your concept and we'll generate detailed business ideas with market analysis.</p>
          <div className="progress-track" aria-hidden>
            <div className="progress-bar" style={{width:'55%'}} />
          </div>
        </header>
        <div className="subtle-divider" />
        <form onSubmit={submit} className="idea-gen-form modern two-col">
          <div className="input-shell full">
            <label>Idea Title {errors.title && <span className="form-err">— {errors.title}</span>}</label>
            <input 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="e.g., AI-Powered Learning Platform"
            />
          </div>

          <div className="input-shell full">
            <label>Short description {errors.desc && <span className="form-err">— {errors.desc}</span>}</label>
            <textarea 
              value={desc} 
              onChange={e=>setDesc(e.target.value)} 
              rows={4}
              placeholder="Describe your business idea in a few sentences..."
            />
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
            <label>Upload reference document (PDF)</label>
            <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} />
            <small>Optional — include a pitch, research or requirements brief.</small>
          </div>

          <div className="form-actions compact full" style={{justifyContent:'space-between'}}>
            <button className="btn btn-ghost" type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Generating…' : 'Generate Ideas'}
            </button>
          </div>
        </form>
        {loading && <AISpinner />}
      </div>
    </div>
  )
}
