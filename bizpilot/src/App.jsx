import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import Payment from './pages/Payment.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import NotFound from './pages/NotFound.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GenerateIdea from './pages/GenerateIdea.jsx'
import ScrollTop from './components/ui/ScrollTop.jsx'
import Community from './pages/Community.jsx'
import IdeaDetails from './pages/IdeaDetails.jsx'

function Container({ children }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">{children}</main>
      <ScrollTop />
      <Footer />
    </div>
  )
}

function Page({ title }) {
  return (
    <div className="container page py-12">
      <h1 className="page-title">{title}</h1>
      <p className="page-sub">Stub page. Content coming soon.</p>
    </div>
  )
}

export default function App() {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Landing />} />
  <Route path="/pricing" element={<Page title="Pricing" />} />
        <Route path="/about" element={<Page title="About" />} />
        <Route path="/contact" element={<Page title="Contact" />} />
        <Route path="/explore" element={<Page title="Explore" />} />
  <Route path="/auth/login" element={<Login />} />
  <Route path="/auth/signup" element={<Signup />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/onboarding" element={<Onboarding />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/dashboard/generate" element={<GenerateIdea />} />
  <Route path="/idea/:id" element={<IdeaDetails />} />
  <Route path="/community" element={<Community />} />
  <Route path="/404" element={<NotFound />} />
  <Route path="/payment" element={<Payment />} />
  <Route path="/payment-success" element={<Page title="Payment success" />} />
  <Route path="/payment-fail" element={<Page title="Payment failed" />} />
  <Route path="/payment-cancel" element={<Page title="Payment cancelled" />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Container>
  )
}
