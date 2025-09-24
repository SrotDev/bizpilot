require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const qs = require('querystring')

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Helper to read env or fallback
const env = (k)=> process.env[k]

// Google OAuth redirect (client should direct user here)
app.get('/api/auth/google', (req,res)=>{
  const clientId = env('GOOGLE_CLIENT_ID')
  const redirect = encodeURIComponent(env('GOOGLE_REDIRECT_URI'))
  const scope = encodeURIComponent('openid email profile')
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}`
  res.redirect(url)
})

// Google callback — exchange code for token and return a small user payload
app.get('/api/auth/google/callback', async (req,res)=>{
  const code = req.query.code
  try{
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
      code,
      client_id: env('GOOGLE_CLIENT_ID'),
      client_secret: env('GOOGLE_CLIENT_SECRET'),
      redirect_uri: env('GOOGLE_REDIRECT_URI'),
      grant_type: 'authorization_code'
    }), { headers: { 'content-type': 'application/x-www-form-urlencoded' }})

    const accessToken = tokenRes.data.access_token
    const profile = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + accessToken }})
    // In production: create or look up user and issue session cookie / token
    // For dev, we will redirect to a client-side callback URL with user info in query (not secure for production)
    const payload = encodeURIComponent(JSON.stringify({ provider:'google', profile: profile.data }))
    const clientUrl = env('CLIENT_APP_URL') || 'http://localhost:5173'
    res.redirect(`${clientUrl}/?oauth=${payload}`)
  }catch(err){ console.error(err); res.status(500).send('oauth failed') }
})

// GitHub flow (similar minimal implementation)
app.get('/api/auth/github', (req,res)=>{
  const clientId = env('GITHUB_CLIENT_ID')
  const redirect = encodeURIComponent(env('GITHUB_REDIRECT_URI'))
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=user:email`
  res.redirect(url)
})

app.get('/api/auth/github/callback', async (req,res)=>{
  try{
    const code = req.query.code
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: env('GITHUB_CLIENT_ID'),
      client_secret: env('GITHUB_CLIENT_SECRET'),
      code
    }, { headers: { Accept: 'application/json' }})
    const token = tokenRes.data.access_token
    const profile = await axios.get('https://api.github.com/user', { headers: { Authorization: 'token ' + token }})
    const payload = encodeURIComponent(JSON.stringify({ provider:'github', profile: profile.data }))
    const clientUrl = env('CLIENT_APP_URL') || 'http://localhost:5173'
    res.redirect(`${clientUrl}/?oauth=${payload}`)
  }catch(err){ console.error(err); res.status(500).send('oauth failed') }
})

// LinkedIn OAuth redirect
app.get('/api/auth/linkedin', (req,res)=>{
  const clientId = env('LINKEDIN_CLIENT_ID')
  const redirect = encodeURIComponent(env('LINKEDIN_REDIRECT_URI'))
  const scope = encodeURIComponent('r_liteprofile r_emailaddress')
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&scope=${scope}`
  res.redirect(url)
})

app.get('/api/auth/linkedin/callback', async (req,res)=>{
  try{
    const code = req.query.code
    const tokenRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: env('LINKEDIN_REDIRECT_URI'),
      client_id: env('LINKEDIN_CLIENT_ID'),
      client_secret: env('LINKEDIN_CLIENT_SECRET')
    }), { headers: { 'content-type': 'application/x-www-form-urlencoded' }})
    const accessToken = tokenRes.data.access_token
    // fetch basic profile and email
    const profile = await axios.get('https://api.linkedin.com/v2/me', { headers: { Authorization: 'Bearer ' + accessToken }})
    const emailRes = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', { headers: { Authorization: 'Bearer ' + accessToken }})
    const payload = encodeURIComponent(JSON.stringify({ provider:'linkedin', profile: { ...profile.data, email: emailRes.data } }))
    const clientUrl = env('CLIENT_APP_URL') || 'http://localhost:5173'
    res.redirect(`${clientUrl}/?oauth=${payload}`)
  }catch(err){ console.error(err); res.status(500).send('oauth failed') }
})

// reCAPTCHA verify endpoint: client sends token, server verifies with secret
app.post('/api/verify-recaptcha', async (req,res)=>{
  const token = req.body.token
  if(!token) return res.status(400).json({ ok:false, error:'no token' })
  try{
    const secret = env('RECAPTCHA_SECRET')
    const r = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`)
    res.json(r.data)
  }catch(err){ console.error(err); res.status(500).json({ok:false}) }
})

// SSLCommerz create session (simplified). In production use server-to-server call and proper validation.
app.post('/api/payments/sslcommerz/create', async (req,res)=>{
  const { amount, currency, purpose } = req.body
  const isSandbox = env('SSLCOMMERZ_SANDBOX') === 'true'
  const storeId = env('SSLCOMMERZ_STORE_ID')
  const storePass = env('SSLCOMMERZ_STORE_PASSWORD')
  try{
    // SSLCommerz session URL (sandbox vs live)
    const apiUrl = isSandbox ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php' : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
    // Build payload as per SSLCommerz docs — minimal required fields
    const payload = {
      store_id: storeId,
      store_passwd: storePass,
      total_amount: amount,
      currency: currency || 'BDT',
      tran_id: 'bp_' + Date.now(),
      success_url: 'http://localhost:5173/payment-success',
      fail_url: 'http://localhost:5173/payment-fail',
      cancel_url: 'http://localhost:5173/payment-cancel',
      emi_option: 0,
      cus_name: 'Test Buyer',
      cus_email: 'buyer@example.com',
      cus_add1: 'Dhaka',
      cus_phone: '01700000000'
    }

    // In real integration we would POST payload and parse response for GatewayPageURL
    // For now, return a mock checkoutUrl if storeId not set
    if(!storeId || !storePass) return res.json({ checkoutUrl: null, message: 'SSLCOMMERZ credentials not set in env' })

    const resp = await axios.post(apiUrl, payload)
    // SSLCommerz returns a JSON with GatewayPageURL
    const gatewayUrl = resp.data && resp.data.GatewayPageURL
    return res.json({ checkoutUrl: gatewayUrl })
  }catch(err){ console.error(err); res.status(500).json({ error: 'failed' }) }
})

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log('Server running on', port))
