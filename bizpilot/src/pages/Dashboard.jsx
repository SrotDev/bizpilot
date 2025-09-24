import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import IdeaList from '../components/dashboard/IdeaList'
import ComparisonModal from '../components/dashboard/ComparisonModal'

export default function Dashboard(){
  const navigate = useNavigate()
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [ideas, setIdeas] = useState([])

  // Listen for comparison modal trigger and get current ideas
  useEffect(() => {
    const handleShowCompare = (event) => {
      setIdeas(event.detail?.ideas || [])
      setShowCompareModal(true)
    }
    
    window.addEventListener('show-compare-modal', handleShowCompare)
    return () => window.removeEventListener('show-compare-modal', handleShowCompare)
  }, [])

  return (
    <div className="dashboard-shell">
      <div className="container" style={{maxWidth:'1200px', margin:'0 auto', padding:'0 1rem'}}>
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Manage your AI-generated business ideas and compare different concepts</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-ghost" onClick={() => window.dispatchEvent(new CustomEvent('open-compare'))}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Compare Ideas
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/generate')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Generate New Idea
            </button>
          </div>
        </div>

        <section className="dashboard-content">
          <IdeaList ideas={undefined} community={false} hideSubtitle={true} wrapTitle={true} />
        </section>
      </div>
      
      <ComparisonModal 
        open={showCompareModal} 
        onClose={() => setShowCompareModal(false)}
        ideas={ideas}
      />
    </div>
  )
}
