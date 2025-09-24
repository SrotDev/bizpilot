// Lightweight client-side auth mock (use real backend in production)
export function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('bp_user')) } catch(e){ return null }
}
export function saveUser(user){
  localStorage.setItem('bp_user', JSON.stringify(user))
}
export function logout(){
  localStorage.removeItem('bp_user')
}

export async function signUp({email,password,name}){
  // simple mock: reject if missing
  if(!email || !password) throw new Error('Email and password required')
  const user = { id: Date.now(), email, name: name||'', provider: 'local' }
  saveUser(user)
  return user
}

export async function signIn({email,password}){
  if(!email || !password) throw new Error('Invalid credentials')
  const user = { id: Date.now(), email, name: '', provider: 'local' }
  saveUser(user)
  return user
}

export async function oauthLogin(provider){
  // In production this should redirect to provider's OAuth URL
  const user = { id: Date.now(), email: provider + '@example.com', name: provider + ' user', provider }
  saveUser(user)
  return user
}
