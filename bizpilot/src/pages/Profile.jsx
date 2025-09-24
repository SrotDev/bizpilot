import React, {useState, useEffect} from 'react'
import { getCurrentUser, saveUser, logout } from '../lib/auth.js'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function Profile(){
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(()=>{
    const u = getCurrentUser()
    if(!u) {
      if(import.meta.env && import.meta.env.DEV){
        const devUser = { id: 'dev', email: 'dev@example.com', name: 'Developer', provider: 'dev' }
        setUser(devUser); setName(devUser.name); setEmail(devUser.email)
        return
      }
      nav('/auth/login?next=' + encodeURIComponent('/profile'))
      return
    } else { setUser(u); setName(u.name || ''); setEmail(u.email || '') }
  }, [])

  function save(){
    const updated = {...user, name}
    saveUser(updated)
    setUser(updated)
    alert('Profile saved')
  }

  function doLogout(){ logout(); nav('/') }

  function deleteAccount(){
    // local dev delete: remove stored user and redirect home
    logout(); alert('Account deleted (dev)'); nav('/')
  }

  const [confirmOpen, setConfirmOpen] = useState(false)

  function confirmDelete(){
    setConfirmOpen(true)
  }

  function doConfirmDelete(){
    setConfirmOpen(false)
    deleteAccount()
  }

  if(!user) return null

  return (
    <div className="profile-shell">
      <div className="profile-layout">
  <div className="profile-card interactive-surface">
          <div className="profile-left">
            <div className="profile-header">
              <div className="profile-avatar">{(user.name || user.email || 'U').slice(0,2).toUpperCase()}</div>
              <div>
                <h2 style={{margin:0}}>{user.name || 'Your name'}</h2>
                <div className="muted">{user.email}</div>
              </div>
            </div>

            <div style={{marginTop:16}}>
              <label className="muted">Full name</label>
              <input className="input profile-field" value={name} onChange={e=>setName(e.target.value)} />

              <label className="muted" style={{marginTop:8}}>Email</label>
              <input className="input profile-field" value={email} readOnly />

              <div className="profile-actions">
                <Button onClick={save} className="btn-primary">Save</Button>
                <Button variant="ghost" onClick={doLogout}>Sign out</Button>
              </div>
              <div className="danger-zone interactive-surface subtle">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>Danger zone</div>
                    <div className="muted">Deleting your account is permanent and cannot be undone.</div>
                  </div>
                  <div>
                    <Button variant="ghost" onClick={confirmDelete} style={{color:'salmon'}}>Delete account</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-right">
            <h3 className="page-title">Choose plan</h3>
            <div className="profile-pricing interactive-grid">
              <div className="pricing-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div className="pricing-title">Basic</div>
                    <div className="muted">Free</div>
                  </div>
                  <div>
                    <div className="pricing-choose"><Button onClick={()=>nav('/payment?amount=0')}>Select</Button></div>
                  </div>
                </div>
              </div>

              <div className="pricing-card pricing-card--featured">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div className="pricing-title">Pro</div>
                    <div className="muted">BDT 500 / month</div>
                  </div>
                  <div>
                    <div className="pricing-choose"><Button onClick={()=>nav('/payment?amount=500')} className="btn-primary">Choose</Button></div>
                  </div>
                </div>
              </div>

              <div className="pricing-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div className="pricing-title">Enterprise</div>
                    <div className="muted">Contact us</div>
                  </div>
                  <div>
                    <div className="pricing-choose"><Button variant="ghost" onClick={()=>nav('/contact')}>Contact</Button></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete account</h3>
            <p>Do you really want to delete the account? This action is irreversible.</p>
            <div className="modal-actions">
              <Button variant="ghost" onClick={()=>setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={doConfirmDelete} style={{background:'salmon', color:'#fff'}}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
