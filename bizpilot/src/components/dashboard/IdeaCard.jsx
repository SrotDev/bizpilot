import { useNavigate } from 'react-router-dom'

export default function IdeaCard({ idea, variant = 'primary', hideSubtitle = false, wrapTitle = false, disableNavigation = false }){
  const navigate = useNavigate()
  
  // Add slight variations based on variant
  const getVariantLabel = () => {
    switch(variant) {
      case 'alternative': return 'Alternative Approach'
      case 'premium': return 'Premium Version'
      default: return 'Core Concept'
    }
  }

  const getVariantBorder = () => {
    switch(variant) {
      case 'alternative': return 'rgba(34, 197, 94, 0.2)'
      case 'premium': return 'rgba(245, 158, 11, 0.2)'
      default: return 'rgba(124, 58, 237, 0.2)'
    }
  }
  return (
    <div
      className={`idea-card-compact card ${disableNavigation ? 'is-static' : 'is-clickable'}`}
      onClick={() => { if(!disableNavigation) navigate('/idea/' + idea.id) }}
      role={disableNavigation ? 'group' : 'button'}
      tabIndex={disableNavigation ? -1 : 0}
      style={{ '--hover-border': getVariantBorder(), cursor: disableNavigation ? 'default' : 'pointer' }}
      aria-disabled={disableNavigation || undefined}
    >
      <div className="idea-card-header">
        <div className="idea-card-meta">
          <span className="idea-card-archetype">{idea.model_archetype}</span>
        </div>
      </div>
      <div className="idea-card-content">
        <h4 className={`idea-card-title prominent ${wrapTitle ? 'wrap' : ''}`}>{idea.groupTitle || idea.id}</h4>
        {!hideSubtitle && <div className="idea-card-sub">{idea.groupDescription || ''}</div>}
        <div className="idea-card-summary">
          {idea.summary}
        </div>
        <div className="idea-card-stats">
          <div className="stat-item">
            <div className="stat-label">Market Size</div>
            <div className="stat-value">{idea.quick_stats.market_size}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Growth Potential</div>
            <div className="stat-value">{idea.quick_stats.growth_potential}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Target Audience</div>
            <div className="stat-value">{idea.quick_stats.target_audience}</div>
          </div>
        </div>
      </div>
      <div className="idea-card-footer">
        <div className="idea-card-id">#{idea.id}</div>
        <div className="idea-card-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
