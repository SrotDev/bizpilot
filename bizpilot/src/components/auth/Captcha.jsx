import React, { useEffect, useState } from 'react'
import { RECAPTCHA_SITE_KEY } from '../../config.js'

export default function Captcha({onVerify, action='auth'}){
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(!RECAPTCHA_SITE_KEY) return
    // load the grecaptcha script if not present
    if(typeof window !== 'undefined' && !window.grecaptcha){
      const s = document.createElement('script')
      s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
      s.async = true
      document.head.appendChild(s)
    }
  }, [])

  async function verify(){
    if(!RECAPTCHA_SITE_KEY){
      return onVerify && onVerify(true)
    }
    setLoading(true)
    try{
      // wait for grecaptcha to be available
      await new Promise((res)=>{
        const t = setInterval(()=>{ if(window.grecaptcha){ clearInterval(t); res() } }, 200)
        setTimeout(()=>{ clearInterval(t); res() }, 5000)
      })
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
      // send token to server for verification or directly pass to parent
      onVerify && onVerify(token)
    }catch(e){
      console.error('recaptcha failed', e)
      onVerify && onVerify(null)
    }finally{ setLoading(false) }
  }

  if(!RECAPTCHA_SITE_KEY){
    return (
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{padding:'6px 10px',background:'rgba(255,255,255,0.03)',borderRadius:6}}>I'm not a robot</div>
        <button className="btn btn-ghost" onClick={()=> onVerify && onVerify(true)}>Verify</button>
      </div>
    )
  }

  return (
    <div>
      <button className="btn btn-ghost" onClick={verify} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
    </div>
  )
}
