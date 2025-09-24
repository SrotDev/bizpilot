import { useState, useEffect } from 'react';
import IdeaList from '../components/dashboard/IdeaList';

export default function Community() {
  const [search, setSearch] = useState('');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    // Always seed two sample community ideas for testing
    const arr = [
      {
        id: 'c1',
        groupTitle: 'AI-Powered Personalized Learning Platform',
        groupDescription: 'A platform for adaptive learning experiences for all ages, using AI to tailor content.',
        creator: 'Alice',
        summary: 'An online platform that uses AI to create personalized learning paths for students of all ages.',
        quick_stats: {
          market_size: 'Global e-learning market',
          growth_potential: 'High',
          target_audience: 'Students, parents, schools'
        },
        model_archetype: 'B2C/B2B SaaS'
      },
      {
        id: 'c2',
        groupTitle: 'Smart Health Tracker',
        groupDescription: 'Wearable device for real-time health monitoring and analytics.',
        creator: 'Bob',
        summary: 'A wearable device that tracks health metrics and provides actionable insights.',
        quick_stats: {
          market_size: 'Wearable health tech',
          growth_potential: 'Medium-High',
          target_audience: 'Health-conscious individuals, athletes'
        },
        model_archetype: 'B2C Hardware'
      }
    ];
    localStorage.setItem('bizpilot_community', JSON.stringify(arr));
    setIdeas(arr);
  }, []);

  // Filter idea groups by search across many fields
  const q = search.trim().toLowerCase();
  const filtered = q === '' ? ideas : ideas.filter(g => {
    let creatorMatch = false;
    const checks = [];
    if (g.groupTitle) checks.push(g.groupTitle.toLowerCase());
    if (g.groupDescription) checks.push(g.groupDescription.toLowerCase());
    if (g.creator) {
      const c = g.creator.toLowerCase();
      checks.push(c);
      if (c.includes(q)) creatorMatch = true;
    }
    if (g.summary) checks.push(g.summary.toLowerCase());
    if (g.model_archetype) checks.push(g.model_archetype.toLowerCase());
    if (g.quick_stats) {
      if (g.quick_stats.market_size) checks.push(String(g.quick_stats.market_size).toLowerCase());
      if (g.quick_stats.growth_potential) checks.push(String(g.quick_stats.growth_potential).toLowerCase());
      if (g.quick_stats.target_audience) checks.push(String(g.quick_stats.target_audience).toLowerCase());
    }
    if (Array.isArray(g.ideas)) {
      g.ideas.forEach(v => {
        if (v.groupTitle) checks.push(String(v.groupTitle).toLowerCase());
        if (v.summary) checks.push(String(v.summary).toLowerCase());
        if (v.model_archetype) checks.push(String(v.model_archetype).toLowerCase());
        if (v.quick_stats) {
          if (v.quick_stats.market_size) checks.push(String(v.quick_stats.market_size).toLowerCase());
          if (v.quick_stats.growth_potential) checks.push(String(v.quick_stats.growth_potential).toLowerCase());
          if (v.quick_stats.target_audience) checks.push(String(v.quick_stats.target_audience).toLowerCase());
        }
      })
    }
    const match = checks.some(text => text.includes(q));
    if (match) g.__creatorMatch = creatorMatch; // annotate transiently
    return match;
  });

  return (
    <div className="dashboard-shell">
      <div className="container" style={{maxWidth:'1200px', margin:'0 auto', padding:'0 1rem'}}>
        <div className="dashboard-header" style={{alignItems:'center'}}>
          <div>
            <h1 className="dashboard-title">Community</h1>
            <p className="dashboard-subtitle">Browse and add business ideas shared by others</p>
          </div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', flex:1}}>
            <div className="search-with-icon" style={{width:'100%', maxWidth:420}}>
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                className="input"
                placeholder="Search ideas, creators..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{width:'100%'}}
              />
            </div>
          </div>
        </div>
        <section className="dashboard-content">
          <IdeaList community ideas={filtered} />
        </section>
      </div>
    </div>
  );
}
