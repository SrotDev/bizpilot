import React from 'react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

export default function FeatureMockup(){
  return (
    <div className="mockup-grid">
      <div className="mockup-left">
        <h3 className="mockup-title">Build, simulate, and validate</h3>
        <p className="page-sub">A guided canvas to ideate, run simple simulations, and export your plan.</p>
        <div style={{marginTop:16}}>
          <Button>Try demo</Button>
        </div>
      </div>
      <div className="mockup-right">
        <Card className="mockup-card">
          {/* simple static mockup */}
          <div className="mockup-window">
            <div className="mockup-header">
              <div className="mock-dot" />
              <div className="mock-dot" />
              <div className="mock-dot" />
            </div>
            <div className="mock-body">
              <div className="mock-chart" />
              <div className="mock-list">
                <div className="mock-item" />
                <div className="mock-item" />
                <div className="mock-item" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
