import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp, oauthLogin } from '../lib/auth.js'
import Captcha from '../components/auth/Captcha.jsx'
import Button from '../components/ui/Button.jsx'
import axios from 'axios'
import { API_URL } from '../config.js'

export default function Signup(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [err,setErr] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      if(!captchaToken) return setErr('Please verify captcha')
      const res = await axios.post(`${API_URL}/api/verify-recaptcha`, { token: captchaToken })
      if(!res.data || res.data.success !== true) return setErr('Captcha verification failed')
      await signUp({name,email,password})
      nav('/')
    }catch(err){ setErr(err.message) }
  }

  const [captchaToken, setCaptchaToken] = React.useState(null)

  async function handleCaptcha(token){
    if(token === true) { setCaptchaToken('placeholder'); return }
    setCaptchaToken(token)
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="page-title">Create account</h1>
        <form onSubmit={submit}>
          <div className="form-row">
            <label>Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>

          <div style={{marginTop:8}}>
            <Captcha onVerify={handleCaptcha} />
          </div>

          {err && <div style={{color:'salmon',marginTop:8}}>{err}</div>}

          <div style={{marginTop:12}}>
            <Button type="submit">Create account</Button>
          </div>
        </form>

        <div style={{marginTop:14, color:'var(--text-secondary)'}}>
          <small>Already have an account? <a href="/login" style={{color:'var(--brand-gradient)', textDecoration:'none'}}>Sign in instead!</a></small>
        </div>
        <div style={{marginTop:18}}>
          <div className="small-muted" style={{marginBottom:8}}>Or continue with</div>
          <div style={{display:'flex',gap:8}}>
            <Button onClick={()=> { window.location.href = `${API_URL}/api/auth/google` }}>Google</Button>
            <Button onClick={()=> { window.location.href = `${API_URL}/api/auth/github` }}>GitHub</Button>
            <Button onClick={()=> { window.location.href = `${API_URL}/api/auth/linkedin` }}>LinkedIn</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
