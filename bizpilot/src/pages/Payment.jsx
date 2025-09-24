import React, {useState} from 'react'
import axios from 'axios'
import { API_URL } from '../config.js'
import Button from '../components/ui/Button.jsx'
import { useNavigate } from 'react-router-dom'

export default function Payment(){
  const [loading,setLoading] = useState(false)
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function start(){
    setErr('')
    setLoading(true)
    try{
      const res = await axios.post(`${API_URL}/api/payments/sslcommerz/create`, { amount: 500, currency: 'BDT', purpose: 'Pro subscription' })
      if(res.data && res.data.checkoutUrl){
        // open checkout in a new tab to preserve SPA state
        window.open(res.data.checkoutUrl, '_blank')
      }else{
        setErr((res.data && res.data.message) || 'Payment initiation failed')
      }
    }catch(e){
      setErr(e.response?.data?.message || 'Payment initiation failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container page">
      <h1 className="page-title">Payments (SSLCommerz)</h1>
      <p className="page-sub">This page demonstrates how to start an SSLCommerz checkout from the frontend. Your backend must call SSLCommerz's API with merchant credentials and return a redirect URL.</p>
      <div style={{marginTop:12}}>
        <Button onClick={start} disabled={loading}>{loading ? 'Starting...' : 'Pay BDT 500 (SSLCommerz)'}</Button>
      </div>
      {err && <div style={{marginTop:12,color:'salmon'}}>{err}</div>}
      {/* Development helper: simulate a successful payment when backend/gateway isn't available */}
      {import.meta.env && import.meta.env.DEV && err && (
        <div style={{marginTop:8}}>
          <Button onClick={()=>nav('/payment-success')} variant="ghost">Simulate payment success</Button>
        </div>
      )}
      <div style={{marginTop:12,color:'var(--text-secondary)'}}>
        <strong>Backend notes:</strong>
        <ul>
          <li>Implement POST /api/payments/sslcommerz/create</li>
          <li>Call SSLCommerz Create Session API with merchant credentials and amount in BDT</li>
          <li>Return the checkout URL to the frontend and redirect the user there</li>
          <li>Handle IPN / callbacks server-side to verify payment success</li>
        </ul>
      </div>
    </div>
  )
}
