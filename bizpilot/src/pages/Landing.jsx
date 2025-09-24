import { motion } from "framer-motion";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { LineChart, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureMockup from "../components/landing/FeatureMockup.jsx";
import Reviews from "../components/landing/Reviews.jsx";
import FAQList from "../components/landing/FAQList.jsx";
import ContactSection from "../components/landing/ContactSection.jsx";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section id="home" className="container hero">
  {/* Decorative static glow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="hero-badge">
            <Sparkles size={14} className="feature-icon" /> New: Idea simulations
          </span>
          <h1 className="hero-title">Turn ideas into businesses with AI</h1>
          <p className="hero-sub">
            BizPilot helps you move from raw ideas to structured plans by guiding you through ideation, quick market analysis, and simple operational planning with clear, step-by-step AI support.
          </p>
          <div className="btn-group">
            <Link to="/auth/signup"><Button>Start Your Journey 🚀</Button></Link>
            <Link to="/explore"><Button variant="ghost">Explore Ideas</Button></Link>
          </div>
        </motion.div>

        {/* Decorative glow (kept as fallback) */}
        <div className="hero-glow-wrapper">
          <div className="hero-glow" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container section features-section">
        <motion.h2 className="section-title" {...fadeUp}>Why BizPilot</motion.h2>
        <div className="features-grid">
          {[{
            icon: Sparkles, title: 'AI Ideation', desc: 'Generate and refine business ideas instantly.'
          },{ icon: LineChart, title: 'Market Insights', desc: 'Charts and KPIs to validate your model.'
          },{ icon: Users, title: 'Team Ready', desc: 'Collaborate with teammates on shared workspaces.' }].map((f, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: 0.05 * i }}>
              <Card className="feature-card">
                <f.icon className="feature-icon" />
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container section pricing-section">
        <motion.h2 className="section-title" {...fadeUp}>Pricing</motion.h2>
        <div className="pricing-grid">
          <motion.div {...fadeUp}>
            <Card className="pricing-card">
              <h3 className="pricing-title">Free</h3>
              <ul className="pricing-list">
                <li>• 5 ideas/month</li><li>• Basic charts</li><li>• Solo use</li>
              </ul>
              <Link to="/auth/signup"><Button className="full-width">Get Started</Button></Link>
            </Card>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
            <Card className="pricing-card pricing-card--featured">
              <h3 className="pricing-title">Pro</h3>
              <ul className="pricing-list">
                <li>• Unlimited ideas</li><li>• Simulations & advanced charts</li><li>• Regenerate models</li>
              </ul>
              <Link to="/auth/signup"><Button className="full-width">Go Pro</Button></Link>
            </Card>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="pricing-card">
              <h3 className="pricing-title">Enterprise</h3>
              <ul className="pricing-list">
                <li>• Team workspaces</li><li>• SSO & audit</li><li>• Priority support</li>
              </ul>
              <Link to="/contact"><Button className="full-width">Contact Sales</Button></Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="container section cta-section">
        <motion.div className="cta-card" initial={{ opacity: 0, scale: .98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h3 className="cta-title">Ready to build your next business?</h3>
          <p className="cta-sub">Start free. Upgrade when you’re ready.</p>
          <Link to="/auth/signup"><Button className="mt-4">Create Free Account</Button></Link>
        </motion.div>
      </section>

      {/* Feature mockup + overview */}
      <section id="overview" className="container section overview-section">
        <motion.h2 className="section-title" {...fadeUp}>Product overview</motion.h2>
        <FeatureMockup />
      </section>

      {/* Reviews */}
      <section id="reviews" className="container section reviews-section">
        <motion.h2 className="section-title" {...fadeUp}>What builders say</motion.h2>
        <Reviews />
      </section>

      {/* About */}
      <section id="about" className="container section about-section">
        <motion.h2 className="section-title" {...fadeUp}>About BizPilot</motion.h2>
        <div className="about-grid">
          <Card className="about-card">
            <h3>What is BizPilot?</h3>
            <p className="page-sub">BizPilot is a lightweight product that helps early-stage builders move from raw ideas to actionable plans. We combine AI-guided idea exploration, quick market checks, and simple operational simulations so you can validate concepts before investing time and money.</p>
          </Card>

          <Card className="about-card">
            <h3>Mission</h3>
            <p className="page-sub">Our mission is to reduce the friction of starting a product. We want to make it easy for anyone with an idea to evaluate market fit, identify risks, and produce a short operational roadmap they can use to take the next step.</p>
          </Card>

          <Card className="about-card">
            <h3>Vision</h3>
            <p className="page-sub">We envision BizPilot as the go-to co-pilot for creators at the very first stage of building. By lowering barriers and making strategy feel accessible, we want to empower more diverse voices to bring new products into the world—faster, smarter, and with greater confidence.</p>
          </Card>

          <Card className="about-card">
            <h3>Approach</h3>
            <p className="page-sub">We use a pragmatic approach: guided prompts built on best-practice frameworks, lightweight data signals for market validation, and exportable outputs for investor or teammate communication. Focus on speed, clarity, and actionability.</p>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container section faq-section">
        <motion.h2 className="section-title" {...fadeUp}>Frequently asked</motion.h2>
        <FAQList />
      </section>

      {/* Contact / Map */}
      <section id="contact" className="container section contact-section">
        <motion.h2 className="section-title" {...fadeUp}>Contact</motion.h2>
        <ContactSection />
      </section>
    </>
  );
}
