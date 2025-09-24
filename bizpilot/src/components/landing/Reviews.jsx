import React from 'react'
import Card from '../ui/Card.jsx'
import { Star } from 'lucide-react'

const reviews = [
  { name: 'Aisha', text: 'BizPilot helped me validate my SaaS idea in days. The guided prompts are excellent and saved me weeks of research.', avatar: 'https://i.pravatar.cc/80?img=47', rating: 5 },
  { name: 'Liam', text: 'The simulations surfaced risks I hadn\'t thought of and the charts are clear for presentations.', avatar: 'https://i.pravatar.cc/80?img=12', rating: 4 },
  { name: 'Priya', text: 'Love the exportable plan and simple charts. Great for sharing with cofounders.', avatar: 'https://i.pravatar.cc/80?img=32', rating: 5 },
]

function Stars({n=5}){
  return <div className="stars">{Array.from({length: n}).map((_,i)=> <Star key={i} size={14} style={{color:'#ffd166',marginRight:4}} />)}</div>
}

export default function Reviews(){
  return (
    <div className="reviews-grid">
      {reviews.map((r,i)=> (
        <Card key={i} className="review-card review-card--glassy">
          <div className="review-top">
            <img className="review-avatar" src={r.avatar} alt={r.name} />
            <div>
              <strong>{r.name}</strong>
              <Stars n={r.rating} />
            </div>
          </div>
          <p className="page-sub">{r.text}</p>
        </Card>
      ))}
    </div>
  )
}
