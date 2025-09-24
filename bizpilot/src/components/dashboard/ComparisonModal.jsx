import { useState } from 'react'
import { X } from 'lucide-react'
import { useToast } from '../ui/Toast'

export default function ComparisonModal({ open, onClose, ideas = [] }) {
  const [selectedCard1, setSelectedCard1] = useState('')
  const [selectedCard2, setSelectedCard2] = useState('')
  const toast = useToast()

  const handleCompare = () => {
    if (!selectedCard1 || !selectedCard2) {
      toast.push('Please select two different idea cards to compare', { type: 'error' })
      return
    }
    if (selectedCard1 === selectedCard2) {
      toast.push('Please select two different idea cards', { type: 'error' })
      return
    }
    localStorage.setItem('bizpilot_compare', JSON.stringify([selectedCard1, selectedCard2]))
    toast.push('Comparison ready!', { type: 'success' })
    onClose()
  }

  if (!open) return null

  // Flatten all idea cards (primary, alternative, premium) for dropdowns
  const allCards = []
  ideas.forEach(idea => {
    ['primary', 'alternative', 'premium'].forEach(variant => {
      allCards.push({
        id: `${idea.id}__${variant}`,
        label: `${idea.groupTitle || idea.id} (${variant.charAt(0).toUpperCase() + variant.slice(1)})`,
        summary: idea.summary,
        model_archetype: idea.model_archetype,
        variant,
        group: idea
      })
    })
  })

  return (
    <div className="modal-overlay glassy" onClick={onClose}>
      <div className="comparison-modal enhanced" onClick={e => e.stopPropagation()}>
        <div className="modal-header tight">
          <h3 className="modal-title gradient-text">Compare Idea Cards</h3>
          <button className="modal-close subtle" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="modal-lead">Pick two cards. We'll show summaries and highlight structural differences.</p>
        <div className="comparison-grid">
          <div className="compare-column">
            <label className="form-label small">First Card</label>
            <select className="form-select modern" value={selectedCard1} onChange={e=>setSelectedCard1(e.target.value)}>
              <option value="">Select an idea card...</option>
              {allCards.map(card => (
                <option key={card.id} value={card.id} disabled={card.id===selectedCard2}>{card.label} · {card.model_archetype}</option>
              ))}
            </select>
            <div className="preview-shell">
              {selectedCard1 ? (() => {
                const [, variant] = selectedCard1.split('__')
                const card = allCards.find(c => c.id === selectedCard1)
                return (
                  <div className="preview-card solid">
                    <div className="preview-head"><span className="variant-pill {variant}">{variant?.toUpperCase()}</span><span className="preview-title">{card?.group?.groupTitle || card?.group?.id}</span></div>
                    <div className="preview-body">{card?.summary}</div>
                  </div>
                )
              })() : <div className="preview-placeholder">No card selected</div>}
            </div>
          </div>
          <div className="vs-col"><div className="vs-circle">vs</div></div>
          <div className="compare-column">
            <label className="form-label small">Second Card</label>
            <select className="form-select modern" value={selectedCard2} onChange={e=>setSelectedCard2(e.target.value)}>
              <option value="">Select an idea card...</option>
              {allCards.map(card => (
                <option key={card.id} value={card.id} disabled={card.id===selectedCard1}>{card.label} · {card.model_archetype}</option>
              ))}
            </select>
            <div className="preview-shell">
              {selectedCard2 ? (() => {
                const [, variant] = selectedCard2.split('__')
                const card = allCards.find(c => c.id === selectedCard2)
                return (
                  <div className="preview-card solid">
                    <div className="preview-head"><span className="variant-pill {variant}">{variant?.toUpperCase()}</span><span className="preview-title">{card?.group?.groupTitle || card?.group?.id}</span></div>
                    <div className="preview-body">{card?.summary}</div>
                  </div>
                )
              })() : <div className="preview-placeholder">No card selected</div>}
            </div>
          </div>
        </div>
        <div className="diff-hint">Detailed attribute-level comparison will appear in a future enhancement.</div>
        <div className="modal-actions spaced">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!selectedCard1||!selectedCard2||selectedCard1===selectedCard2} onClick={handleCompare}>Compare</button>
        </div>
      </div>
    </div>
  )
}
