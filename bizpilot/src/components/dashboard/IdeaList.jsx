import { useState, useEffect } from 'react'
import { useToast } from '../../components/ui/Toast'
import IdeaCard from './IdeaCard'

function Modal({ open, title, children, actions }) {
  if (!open) return null
  return (
    <div className="modal-overlay">
      <div className="modal">
        {title && <h3>{title}</h3>}
        {children}
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  )
}

const SAMPLE_IDEAS = [
  {
    id: 'idea-1',
    groupTitle: 'AI-Powered Personalized Learning Platform for All Ages',
    groupDescription: 'Revolutionary learning technology that adapts to individual student needs and learning patterns.',
    summary: 'An online platform that uses AI to create personalized learning paths for students of all ages. The platform adapts to each student\'s learning style and pace, providing customized content and feedback.',
    quick_stats: {
      market_size: 'Global e-learning market',
      growth_potential: 'High, driven by increasing demand for personalized learning',
      target_audience: 'Students, parents, schools, and educational institutions'
    },
    model_archetype: 'B2C/B2B SaaS'
  },
  {
    id: 'idea-2',
    groupTitle: 'Smart Meal Planning Assistant',
    groupDescription: 'Intelligent nutrition planning that makes healthy eating convenient and personalized.',
    summary: 'A subscription-based meal planning assistant that uses dietary preferences and local grocery availability to suggest weekly plans and shopping lists.',
    quick_stats: { 
      market_size: 'Health & wellness market', 
      growth_potential: 'Medium', 
      target_audience: 'Busy professionals, families' 
    },
    model_archetype: 'B2C SaaS'
  },
  {
    id: 'idea-3',
    groupTitle: 'Healthcare Staffing Marketplace',
    groupDescription: 'On-demand healthcare professional network solving clinic staffing challenges.',
    summary: 'A marketplace connecting freelance healthcare professionals with clinics needing short-term staffing.',
    quick_stats: { 
      market_size: 'Healthcare staffing', 
      growth_potential: 'Medium-High', 
      target_audience: 'Clinics, healthcare freelancers' 
    },
    model_archetype: 'B2B Marketplace'
  }
]

export default function IdeaList({ community = false, ideas: propIdeas, hideSubtitle = false, wrapTitle = false }){
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })
  const [upgradeModal, setUpgradeModal] = useState(false)
  const [ideas, setIdeas] = useState(() => {
    if (propIdeas) return propIdeas;
    try { const raw = localStorage.getItem('bizpilot_ideas'); return raw ? JSON.parse(raw) : SAMPLE_IDEAS }
    catch(e){ return SAMPLE_IDEAS }
  })

  useEffect(() => {
    if (!community) localStorage.setItem('bizpilot_ideas', JSON.stringify(ideas))
  }, [ideas, community])

  // If parent passes ideas (community mode), keep local state synced
  useEffect(() => {
    if (propIdeas) setIdeas(propIdeas)
  }, [propIdeas])

  // Comparison modal logic only for dashboard
  useEffect(() => {
    if (community) return;
    const openCompare = () => {
      window.dispatchEvent(new CustomEvent('show-compare-modal', { detail: { ideas } }))
    }
    window.addEventListener('open-compare', openCompare)
    return () => window.removeEventListener('open-compare', openCompare)
  }, [ideas, community])

  const shareGroup = (id) => {
    const group = ideas.find(i => i.id === id)
    if (!group) return
    // Save to shared list (mock) and show confirmation
    try {
      const raw = localStorage.getItem('bizpilot_shared')
      const arr = raw ? JSON.parse(raw) : []
      arr.unshift({ ...group, sharedAt: new Date().toISOString() })
      localStorage.setItem('bizpilot_shared', JSON.stringify(arr))
      toast.push('Idea shared to community (mock).', { type: 'success' })
    } catch(e) { alert('Could not share: ' + e.message) }
  }

  const editGroup = (id) => {
    setUpgradeModal(true)
  }

  const deleteGroup = (id) => {
    setDeleteModal({ open: true, id })
  }

  function confirmDelete() {
    setIdeas(prev => prev.filter(i => i.id !== deleteModal.id))
    setDeleteModal({ open: false, id: null })
    toast.push('Idea group deleted.', { type: 'success' })
  }

  const addToDashboard = (group) => {
    try {
      const raw = localStorage.getItem('bizpilot_ideas');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(group);
      localStorage.setItem('bizpilot_ideas', JSON.stringify(arr));
      toast.push('Added to your dashboard!', { type: 'success' })
    } catch(e) { alert('Could not add: ' + e.message); }
  }

  const toast = useToast()

  return (
    <>
      <div className="idea-groups-container">
        {ideas.map(idea => (
          <div key={idea.id} className="idea-group">
            <div className="idea-group-header row">
              <h3 className="idea-group-title truncate">{idea.groupTitle || 'Business Idea Concept'}</h3>
              {community ? (
                <div className="idea-group-actions inline">
                  <span className="creator-tag">By {idea.creator || 'Unknown'}</span>
                  <button className="action-btn-add" title="Add to My Dashboard" onClick={() => addToDashboard(idea)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16,6 12,2 8,6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    Add
                  </button>
                </div>
              ) : (
                <div className="idea-group-actions inline">
                  <button className="action-btn action-btn-share" title="Share to Community" onClick={() => shareGroup(idea.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16,6 12,2 8,6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    Share
                  </button>
                  <button className="action-btn action-btn-edit" title="Edit Variables" onClick={() => editGroup(idea.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button className="action-btn action-btn-delete" title="Delete Idea Group" onClick={() => deleteGroup(idea.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="idea-group-description clamp-2">
              {idea.groupDescription || 'Explore different variations and approaches for this business concept.'}
            </p>
            <div className="idea-cards-grid">
              <IdeaCard idea={idea} variant="primary" hideSubtitle={hideSubtitle} wrapTitle={wrapTitle} disableNavigation={community} />
              <IdeaCard idea={idea} variant="alternative" hideSubtitle={hideSubtitle} wrapTitle={wrapTitle} disableNavigation={community} />
              <IdeaCard idea={idea} variant="premium" hideSubtitle={hideSubtitle} wrapTitle={wrapTitle} disableNavigation={community} />
            </div>
          </div>
        ))}
      </div>
      {/* Delete confirmation modal */}
      <Modal
        open={deleteModal.open}
        title="Delete idea group"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={()=>setDeleteModal({open:false,id:null})}>Cancel</button>,
          <button key="delete" className="btn" style={{background:'salmon',color:'#fff'}} onClick={confirmDelete}>Delete</button>
        ]}
      >
        <p>Do you really want to delete this idea group? This action is irreversible.</p>
      </Modal>
      {/* Upgrade modal for edit */}
      <Modal
        open={upgradeModal}
        title="Upgrade required"
        actions={[
          <button key="close" className="btn btn-ghost" onClick={()=>setUpgradeModal(false)}>Close</button>
        ]}
      >
        <p>You need to upgrade to the <b>Pro</b> tier pricing to unlock this feature.</p>
      </Modal>
    </>
  )
}
