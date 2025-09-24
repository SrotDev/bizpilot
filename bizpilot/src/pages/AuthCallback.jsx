import React, {useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveUser } from '../lib/auth.js'

export default function AuthCallback(){
  const nav = useNavigate()
  const { search } = useLocation()
  useEffect(()=>{
    const params = new URLSearchParams(search)
    const oauth = params.get('oauth')
    if(oauth){
      try{
        const payload = JSON.parse(decodeURIComponent(oauth))
        // normalize to simple user model
        const user = { email: payload.profile.email || (payload.profile.login + '@example.com'), name: payload.profile.name || payload.profile.login || '', provider: payload.provider }
        saveUser(user)
        nav('/profile')
      }catch(e){ console.error(e); nav('/') }
    }else nav('/')
  }, [])
  return <div style={{padding:40}}>Signing you in…</div>
}
