import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement, BarElement, ArcElement, PointElement, CategoryScale, LinearScale, RadialLinearScale,
  Tooltip, Legend, Title
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import MonteCarloChart from '../components/charts/MonteCarloChart.jsx'

ChartJS.register(LineElement, BarElement, ArcElement, PointElement, CategoryScale, LinearScale, RadialLinearScale, Tooltip, Legend, Title, annotationPlugin)

// Helper to safely access nested arrays/objects
const safe = (v, d) => (v === undefined || v === null) ? d : v
// Lightweight date formatter
const formatDateTime = (iso) => {
  if(!iso) return '—'
  try { return new Date(iso).toLocaleString(undefined, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) } catch { return iso }
}

// IdeaDetails Page
// Responsibilities:
//  - Fetch (or receive) full idea analytics payload by id
//  - Render compact analytic panels & multiple chart types (line, bar, pie, doughnut, radar, monte carlo histogram)
//  - Provide graceful fallback if sections missing
// Integration notes:
//  - Replace localStorage lookup with fetch(`/api/ideas/${id}`) when backend is ready.
//  - Expect backend to mirror structure of example JSON (charts keyed under chart + montecarlo_chart).
//  - For large datasets consider lazy loading heavy charts via intersection observer.
const DUMMY_IDEA = {
  id: '814318e1-dd67-48d4-9a68-ab56947117d0',
  generation_status: 'completed',
  startup_idea: 'AI-Driven Recipe Recommendation and Grocery Delivery',
  summary: 'Platform that recommends recipes based on dietary restrictions, preferences, and available ingredients, with integrated grocery delivery.',
  tagline: null,
  model_type: 'other',
  problem_statement: 'Busy individuals and families struggle to consistently plan nutritious meals that respect their dietary preferences and restrictions while minimizing waste.',
  solution: 'An AI engine that converts pantry + preference + dietary data into adaptive recipe plans and synced grocery deliveries with substitution intelligence.',
  quick_stats: {
    market_size: 'Medium',
    growth_potential: 'Medium',
    target_audience: 'Busy professionals, families, individuals with dietary needs'
  },
  model_archetype: 'E-commerce platform with AI recommendation engine',
  market_analysis: {
    total_addressable_market: '$50 Billion',
    serviceable_available_market: '$5 Billion',
    growth_rate: '12%',
    trends: [
      'Growing demand for personalized nutrition',
      'Increased adoption of online grocery delivery',
      'Rising awareness of food allergies and dietary restrictions',
      'Focus on sustainable and healthy eating habits'
    ],
    target_audience: [
      'Busy professionals',
      'Families with young children',
      'Individuals with dietary restrictions (gluten-free, vegan, etc.)',
      'Health-conscious consumers'
    ]
  },
  competitor_analysis: [
    {
      name: 'HelloFresh',
      products_services: [ 'Meal kit delivery service' ],
      market_share: '35%',
      strengths: [ 'Established brand recognition','Wide variety of recipes','Efficient delivery network' ],
      weaknesses: [ 'Limited customization options','Higher price point','Not suitable for all dietary restrictions' ]
    },
    {
      name: 'Blue Apron',
      products_services: [ 'Meal kit delivery service' ],
      market_share: '20%',
      strengths: [ 'Focus on high-quality ingredients','Chef-designed recipes','Sustainable sourcing practices' ],
      weaknesses: [ 'Smaller recipe selection','Can be time-consuming to prepare meals','Limited dietary options' ]
    },
    {
      name: 'Instacart',
      products_services: [ 'Grocery delivery service' ],
      market_share: '40%',
      strengths: [ 'Wide selection of groceries','Fast delivery times','Convenient mobile app' ],
      weaknesses: [ 'No recipe recommendations','Can be expensive with delivery fees and markups','Relies on third-party shoppers' ]
    }
  ],
  product_service: {},
  business_model: {
    revenue_streams: [
      'Subscription fees (premium features, personalized plans)',
      'Grocery delivery fees',
      'Affiliate commissions (partnering with food brands)',
      'Advertising (non-intrusive ads for relevant products)'
    ],
    cost_structure: [
      'AI development and maintenance ($5,000 - $15,000)',
      'Platform development and hosting ($3,000 - $10,000)',
      'Marketing and advertising ($2,000 - $10,000)',
      'Grocery delivery logistics ($0 - outsourced)',
      'Customer support ($1,000 - $5,000)'
    ],
    key_partnerships: [
      'Local grocery stores',
      'Food bloggers and influencers',
      'Dietitians and nutritionists',
      'Delivery services (e.g., DoorDash, Instacart)'
    ],
    customer_segments: [
      'Busy professionals seeking convenient meal solutions',
      'Families with dietary restrictions or picky eaters',
      'Individuals with specific health goals (weight loss, muscle gain)',
      'People looking to reduce food waste'
    ]
  },
  go_to_market: {
    positioning: 'Premium convenience with AI-personalized nutrition planning',
    acquisition_channels: ['Content marketing','Partnerships with nutritionists','Influencer collaborations','SEO long-tail (diet constraints)','Referral program'],
    launch_plan: ['Closed beta (100 users)','Iterate on personalization engine','Expand to 5 grocery partners','Public launch with PR push'],
    pricing_strategy: 'Freemium core + $12/mo Pro + % fee on grocery basket fulfillment'
  },
  traction: {
    waitlist_signups: 1250,
    beta_users: 110,
    activation_rate: '62%',
    avg_session_time: '7m 12s',
    early_nps: 47,
    testimonials: [ 'Meal planning stress is gone','Love the substitution suggestions','Helped reduce my weekly waste' ]
  },
  financial_projection: {
    year1: { revenue: 45000, expenses: 72000, burn: -27000 },
    year2: { revenue: 180000, expenses: 150000, burn: 30000 },
    year3: { revenue: 520000, expenses: 380000, burn: 140000 },
    assumptions: [ '5% weekly growth first 9 months','Churn stabilizes at 3.5% monthly','ARPU improves with Pro upsell' ]
  },
  roadmap: [
    { phase: 'Q1 2025', milestone: 'Develop MVP with basic recipe recommendation and grocery list generation' },
    { phase: 'Q2 2025', milestone: 'Launch beta program with 100 users and gather feedback' },
    { phase: 'Q3 2025', milestone: 'Integrate with local grocery stores for delivery service' },
    { phase: 'Q4 2025', milestone: 'Public launch and marketing campaign targeting key customer segments' }
  ],
  team: [],
  risks_opportunities: {
    risks: [ 'Large incumbents accelerate personalization','Grocery partner API instability','Nutrition regulation changes' ],
    mitigations: [ 'Differentiate via dynamic pantry ingestion','Abstract provider layer with retry logic','Advisory board with nutrition experts' ],
    opportunities: [ 'White-label engine for meal kit brands','Enterprise wellness partnerships','Regional expansion (EU focus)' ]
  },
  ask_funding: {
    round: 'Pre-Seed',
    amount: '$500k',
    use_of_funds: [ 'AI model refinement','Mobile app build-out','Channel experimentation','Founding hires (ML + Growth)' ],
    runway_months: 16
  },
  chart: {
    user_growth: { type: 'line', data: { labels:['Q1','Q2','Q3','Q4'], datasets:[ { label:'Active Users', data:[1000,5000,15000,30000] } ] } },
    revenue_vs_expenses: { type: 'bar', data: { labels:['Q1','Q2','Q3','Q4'], datasets:[ { label:'Revenue', data:[5000,15000,30000,60000] }, { label:'Expenses', data:[4000,8000,20000,35000] } ] } },
    market_segments: { type: 'pie', data: { labels:['Busy Professionals','Families','Health-Conscious Individuals'], datasets:[ { label:'Market Share (%)', data:[40,35,25] } ] } },
    retention_rate: { type: 'doughnut', data: { labels:['Retained','Churned'], datasets:[ { label:'User Retention', data:[75,25] } ] } },
    funding_allocation: { type: 'radar', data: { labels:['Marketing','R&D','Operations','Hiring','Infrastructure'], datasets:[ { label:'Allocation (%)', data:[35,25,20,10,10] } ] } }
  },
  data_for_montecarlo_simulation: {
    production_cost: { min:2, max:5 },
    selling_price: { min:7, max:12 },
    demand: { min:1000, max:5000 }
  },
  montecarlo_chart: {
    type: 'bar',
    data: {
      labels: [
        '$2543-$4713','$4713-$6883','$6883-$9052','$9052-$11222','$11222-$13391','$13391-$15561','$15561-$17731','$17731-$19900','$19900-$22070','$22070-$24240','$24240-$26409','$26409-$28579','$28579-$30748','$30748-$32918','$32918-$35088','$35088-$37257','$37257-$39427','$39427-$41596','$41596-$43766','$43766-$45936'
      ],
      datasets: [ {
        label: 'Profit ($)',
        data: [12,54,88,118,77,90,81,88,81,67,58,53,27,28,25,22,18,7,4,2],
        backgroundColor: 'skyblue',
        borderColor: 'black',
        borderWidth: 1
      } ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Monte Carlo Profit ($)' },
        legend: { display: true, position: 'top' },
        annotation: { annotations: {
          p10: { type:'line', scaleID:'x', value:'$6883-$9052', borderColor:'orange', borderWidth:2, label:{ enabled:true, content:'P10' } },
          p50: { type:'line', scaleID:'x', value:'$15561-$17731', borderColor:'red', borderWidth:2, label:{ enabled:true, content:'P50' } },
          p90: { type:'line', scaleID:'x', value:'$30748-$32918', borderColor:'green', borderWidth:2, label:{ enabled:true, content:'P90' } }
        } }
      },
      scales: { x:{ title:{ display:true, text:'Profit ($)' } }, y:{ title:{ display:true, text:'Frequency' }, beginAtZero:true } }
    },
    plugins: [ 'annotation' ]
  },
  premium_locked: false,
  regeneration_allowed: true,
  tags: ['nutrition','ai','grocery','personalization'],
  created_at: '2025-09-23T22:27:32.560551Z',
  updated_at: '2025-09-23T23:18:15.312929Z',
  idea: '23757c05-7d6b-472e-8670-048566c331b5'
}

// Fallback synthetic chart datasets used when idea.chart or specific charts are missing
const DUMMY_CHARTS = {
  user_growth: { type:'line', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets:[
    { label:'Active Users', data:[120,180,260,380,560,820,1100,1450,1800,2200,2650,3100], borderColor:'#818cf8', backgroundColor:'rgba(129,140,248,0.25)', tension:.35, fill:true },
    { label:'MAU', data:[100,160,230,350,500,760,980,1300,1600,1950,2400,2800], borderColor:'#34d399', backgroundColor:'rgba(52,211,153,0.20)', tension:.35, fill:true }
  ] } },
  revenue_vs_expenses: { type:'bar', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets:[
    { label:'Revenue', data:[800,1200,1700,2500,3400,4800,6400,7600,8800,10400,12100,14000], backgroundColor:'#34d399' },
    { label:'Expenses', data:[1500,1600,1700,1900,2100,2300,2500,2700,2950,3200,3500,3800], backgroundColor:'#f472b6' }
  ] } },
  market_segments: { type:'pie', data:{ labels:['Segment A','Segment B','Segment C','Segment D'], datasets:[{ label:'Market Share (%)', data:[40,27,18,15], backgroundColor:['#6366f1','#8b5cf6','#ec4899','#10b981'] }] } },
  retention_rate: { type:'doughnut', data:{ labels:['Retained','Churned','Reactivated'], datasets:[{ label:'User Retention', data:[68,22,10], backgroundColor:['#10b981','#ef4444','#6366f1'] }] } },
  funding_allocation: { type:'radar', data:{ labels:['Marketing','R&D','Ops','Hiring','Infra','Support'], datasets:[
    { label:'Planned (%)', data:[28,30,14,16,8,4], backgroundColor:'rgba(167,139,250,0.35)', borderColor:'#a78bfa' },
    { label:'Actual (%)', data:[25,32,15,14,9,5], backgroundColor:'rgba(52,211,153,0.25)', borderColor:'#34d399' }
  ] } }
}

const DUMMY_MONTE_CARLO = {
  type: 'bar',
  data: {
    labels: Array.from({length: 24}, (_,i)=>`$${(i*1200+2000)}-$${(i*1200+3199)}`),
    datasets: [{ label:'Profit ($)', data: [2,4,9,14,22,30,42,55,68,79,88,94,90,84,70,55,42,30,20,13,8,4,2,1], backgroundColor:'rgba(129,140,248,0.55)', borderColor:'#818cf8', borderWidth:1 }]
  },
  options: { responsive:true, plugins:{ title:{ display:true, text:'Monte Carlo Profit ($)' }, legend:{ display:true }, annotation:{ annotations:{} } }, scales:{ x:{ title:{ display:true, text:'Profit Bins ($)' }, ticks:{ color:'#d1d5db' } }, y:{ beginAtZero:true, title:{ display:true, text:'Frequency' }, ticks:{ color:'#d1d5db' } } } }
}

export default function IdeaDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated fetch: look into localStorage or build from example schema placeholder
    const raw = localStorage.getItem('bizpilot_ideas')
    let data = raw ? JSON.parse(raw) : []
    let found = data.find(i => i.id === id)
    if(!found){
      // fallback to dummy if id matches or if user specifically opened unknown id
      if(id === 'dummy' || id === DUMMY_IDEA.id) found = DUMMY_IDEA
    }
    setIdea(found || null)
    setLoading(false)
  }, [id])

  const charts = useMemo(() => {
    if(!idea) return {}
    const c = idea.chart || {}
    const build = (cfg) => ({
      data: cfg.data,
      options: {
        responsive:true,
        plugins:{
          legend:{ labels:{ color:'#d1d5db' } },
          title:{ display:true, text: cfg.title || cfg.data?.datasets?.[0]?.label || '', color:'#f3f4f6', font:{ weight:'600', size:14 } }
        },
        scales: cfg.hideScales ? {} : {
          x: { ticks:{ color:'#9ca3af' }, grid:{ color:'rgba(255,255,255,0.08)' } },
          y: { ticks:{ color:'#9ca3af' }, grid:{ color:'rgba(255,255,255,0.08)' } }
        }
      }
    })
    return {
      user_growth: build({ ...(c.user_growth || DUMMY_CHARTS.user_growth), title:'Active Users Growth' }),
      revenue_vs_expenses: build({ ...(c.revenue_vs_expenses || DUMMY_CHARTS.revenue_vs_expenses), title:'Revenue vs Expenses' }),
      market_segments: build({ ...(c.market_segments || DUMMY_CHARTS.market_segments), title:'Market Segments', hideScales:true }),
      retention_rate: build({ ...(c.retention_rate || DUMMY_CHARTS.retention_rate), title:'Retention Rate', hideScales:true }),
      funding_allocation: build({ ...(c.funding_allocation || DUMMY_CHARTS.funding_allocation), title:'Funding Allocation', hideScales:true })
    }
  }, [idea])

  if(loading) return <div className="container page py-12"><div className="loader big"/></div>
  if(!idea) return <div className="container page py-12"><p>Idea not found.</p><button className="btn" onClick={()=>navigate('/dashboard')}>Back</button></div>

  const stats = safe(idea.quick_stats, {})
  const market = safe(idea.market_analysis, {})
  const competitors = safe(idea.competitor_analysis, [])
  const business = safe(idea.business_model, {})
  const monteCarlo = idea?.montecarlo_chart
  const roadmap = safe(idea.roadmap, [])
  const simSpec = safe(idea.data_for_montecarlo_simulation, {})
  const tags = safe(idea.tags, [])

  const emptyObjPlaceholder = (obj, msg = 'Not yet generated') => (!obj || Object.keys(obj).length === 0) ? <p style={{opacity:.6,fontSize:'.75rem'}}>{msg}</p> : <pre style={{whiteSpace:'pre-wrap', fontSize:'.7rem', lineHeight:1.4, background:'rgba(255,255,255,0.03)', padding:'.6rem .7rem', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)'}}>{JSON.stringify(obj,null,2)}</pre>

  return (
    <div className="idea-details-layout fade-in">
      <div className="idea-details-hero">
        <div className="idea-details-hero-inner">
          <div style={{display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap'}}>
            <button className="btn btn-ghost small" onClick={()=>navigate('/dashboard')}>← Back</button>
            { (idea.id === DUMMY_IDEA.id) && <div className="status-badge">Test Data</div> }
          </div>
          <h1 className="idea-details-title">{idea.groupTitle || idea.startup_idea || 'Untitled Idea'}</h1>
          <p className="idea-details-tagline">{idea.summary}</p>
          <div className="idea-meta-grid compact">
            <div className="meta-block">
              <span>Market Size</span><strong>{stats.market_size}</strong>
            </div>
            <div className="meta-block">
              <span>Growth Potential</span><strong>{stats.growth_potential}</strong>
            </div>
            <div className="meta-block">
              <span>Target Audience</span><strong>{stats.target_audience}</strong>
            </div>
            <div className="meta-block">
              <span>Archetype</span><strong>{idea.model_archetype}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="idea-sections">
        {/* 1. Problem, Solution & Tags */}
        <div className="section-cluster">
          <h4 className="cluster-title">Problem, Solution & Tags</h4>
          <div className="analytics-grid">
            <section className="analytics-panel span-2">
              <h3>Problem Statement</h3>
              <p>{idea.problem_statement || 'No problem statement provided yet.'}</p>
            </section>
            <section className="analytics-panel span-2">
              <h3>Solution</h3>
              <p>{idea.solution || 'No solution statement provided yet.'}</p>
            </section>
            <section className="analytics-panel">
              <h3>Tags</h3>
              <div className="tag-chips">
                {tags.map(t => <span key={t} className="chip">{t}</span>)}
                {tags.length === 0 && <p style={{opacity:.6}}>No tags.</p>}
              </div>
            </section>
          </div>
        </div>

        {/* 2. Market Intelligence */}
        <div className="section-cluster">
          <h4 className="cluster-title">Market Intelligence</h4>
          <div className="analytics-grid">
            <section className="analytics-panel">
              <h3>Market Trends</h3>
              <ul className="mini-list">
                {safe(market.trends, []).map(t => <li key={t}>{t}</li>)}
              </ul>
            </section>
            <section className="analytics-panel">
              <h3>Target Audience</h3>
              <ul className="mini-tags">
                {safe(market.target_audience, []).map(a => <li key={a}>{a}</li>)}
              </ul>
            </section>
            <section className="analytics-panel span-2">
              <h3>Competitor Snapshot</h3>
              <div className="competitors-inline">
                {competitors.slice(0,3).map(c => (
                  <div className="competitor-card" key={c.name}>
                    <h4>{c.name}</h4>
                    <div className="comp-meta"><span>Share</span><strong>{c.market_share}</strong></div>
                    <div className="comp-sub">Strengths</div>
                    <ul>{c.strengths.slice(0,3).map(s=> <li key={s}>{s}</li>)}</ul>
                    <div className="comp-sub">Weaknesses</div>
                    <ul>{c.weaknesses.slice(0,2).map(s=> <li key={s}>{s}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 3. Market Metrics */}
        <div className="section-cluster">
          <h4 className="cluster-title">Market Metrics</h4>
          <div className="analytics-grid">
            <section className="analytics-panel">
              <h3>Key Figures</h3>
              <div className="metric-pills">
                {market.total_addressable_market && <span className="metric-pill">TAM: {market.total_addressable_market}</span>}
                {market.serviceable_available_market && <span className="metric-pill">SAM: {market.serviceable_available_market}</span>}
                {market.growth_rate && <span className="metric-pill">Growth: {market.growth_rate}</span>}
                {stats.market_size && <span className="metric-pill">Size: {stats.market_size}</span>}
                {stats.growth_potential && <span className="metric-pill">Potential: {stats.growth_potential}</span>}
              </div>
            </section>
            <section className="analytics-panel">
              <h3>Segments Share</h3>
              {charts.market_segments && <Pie {...charts.market_segments} />}
            </section>
          </div>
        </div>

  {/* 4. Growth & Performance (charts only) */}
        <div className="section-cluster">
          <h4 className="cluster-title">Growth & Performance</h4>
          <div className="analytics-grid">
            <section className="analytics-panel">
              <h3>Growth</h3>
              {charts.user_growth && <Line {...charts.user_growth} />}
            </section>
            <section className="analytics-panel">
              <h3>Revenue vs Expenses</h3>
              {charts.revenue_vs_expenses && <Bar {...charts.revenue_vs_expenses} />}
            </section>
            <section className="analytics-panel">
              <h3>Retention</h3>
              {charts.retention_rate && <Doughnut {...charts.retention_rate} />}
            </section>
            <section className="analytics-panel">
              <h3>Funding Allocation</h3>
              {charts.funding_allocation && <Radar {...charts.funding_allocation} />}
            </section>
            {/* Monte Carlo moved to Execution & Simulation row */}
          </div>
        </div>

        {/* 5. Business Model (full width) */}
        <div className="section-cluster">
          <h4 className="cluster-title">Business Model Architecture</h4>
          <div className="analytics-grid">
            <section className="analytics-panel full-row">
              <h3>Business Model</h3>
              <div className="bm-columns">
                <div>
                  <h5>Revenue Streams</h5>
                  <ul className="mini-list tight">{safe(business.revenue_streams, []).map(r=> <li key={r}>{r}</li>)}</ul>
                </div>
                <div>
                  <h5>Cost Structure</h5>
                  <ul className="mini-list tight">{safe(business.cost_structure, []).map(r=> <li key={r}>{r}</li>)}</ul>
                </div>
                <div>
                  <h5>Key Partnerships</h5>
                  <ul className="mini-list tight">{safe(business.key_partnerships, []).map(r=> <li key={r}>{r}</li>)}</ul>
                </div>
                <div>
                  <h5>Customer Segments</h5>
                  <ul className="mini-list tight">{safe(business.customer_segments, []).map(r=> <li key={r}>{r}</li>)}</ul>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 6. Execution & Simulation (Gantt + side-by-side) */}
        <div className="section-cluster">
          <h4 className="cluster-title">Execution & Simulation</h4>
          <div className="analytics-grid">
            <section className="analytics-panel full-row">
              <h3>Roadmap (Gantt)</h3>
              <div className="gantt-wrapper">
                <div className="gantt-grid">
                  {roadmap.map((r, idx) => {
                    const quarter = (r.phase.match(/Q(\d)/)?.[1]) || (idx+1)
                    const startPct = (quarter-1) * 25
                    const widthPct = 22
                    return (
                      <div className="gantt-row" key={r.phase + r.milestone}>
                        <div className="gantt-phase-label" style={{color:'#fff', fontWeight:600, fontSize:'.98rem', minWidth:'80px'}}>{r.phase}</div>
                        <div className="gantt-track">
                          <div className="gantt-bar" style={{ left:startPct+'%', width:widthPct+'%', color:'#fff', background:'linear-gradient(90deg, #6366f1 60%, #818cf8 100%)', fontWeight:700, fontSize:'1rem', padding:'4px 14px', borderRadius:'10px', boxShadow:'0 2px 12px 0 rgba(129,140,248,0.18)', border:'2px solid #818cf8', textShadow:'0 2px 8px rgba(30,32,60,0.22)' }}>{r.milestone}</div>
                        </div>
                      </div>
                    )
                  })}
                  {roadmap.length === 0 && <p style={{opacity:.6}}>No roadmap defined yet.</p>}
                </div>
                <div className="gantt-legend"><span style={{color:'#bfc3d6'}}>Each bar approximates its quarter position</span></div>
              </div>
            </section>
            <section className="analytics-panel full-row">
              <div className="simulation-flex-row" style={{display:'flex', gap:'2.5rem'}}>
                {Object.keys(simSpec).length > 0 && (
                  <div className="sim-panel" style={{flex:'0 0 20%', maxWidth:'20%'}}>
                    <h3>Simulation Inputs</h3>
                    <div className="simulation-spec">
                      {Object.entries(simSpec).map(([k,v]) => (
                        <div className="spec" key={k}>
                          <span>{k.replace(/_/g,' ')}</span>
                          <strong>{v.min} – {v.max}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="sim-panel" style={{flex:'1 1 80%'}}>
                  <h3>Monte Carlo Simulation</h3>
                  <MonteCarloChart config={monteCarlo || DUMMY_MONTE_CARLO} />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 7. (Tags moved earlier) */}

        {/* 8. Additional Strategy Sections */}
        <div className="section-cluster">
          <h4 className="cluster-title">Additional Strategy Sections</h4>
          <div className="analytics-grid">
            <section className="analytics-panel">
              <h3>Product / Service</h3>
              {emptyObjPlaceholder(idea.product_service)}
            </section>
            <section className="analytics-panel">
              <h3>Go To Market</h3>
              {emptyObjPlaceholder(idea.go_to_market)}
            </section>
            <section className="analytics-panel">
              <h3>Traction</h3>
              {emptyObjPlaceholder(idea.traction)}
            </section>
            <section className="analytics-panel">
              <h3>Financial Projection</h3>
              {emptyObjPlaceholder(idea.financial_projection)}
            </section>
            <section className="analytics-panel">
              <h3>Risks & Opportunities</h3>
              {emptyObjPlaceholder(idea.risks_opportunities)}
            </section>
            <section className="analytics-panel">
              <h3>Funding / Ask</h3>
              {emptyObjPlaceholder(idea.ask_funding)}
            </section>
          </div>
        </div>

        {/* 9. Metadata Footer */}
        {/* Metadata footer removed as requested */}
      </div>
    </div>
  )
}
