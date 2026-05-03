import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import RevealOnScroll from '../components/RevealOnScroll'
import PricingHero from '../components/pricing/PricingHero'
import PricingCompare from '../components/pricing/PricingCompare'
import PricingFaq from '../components/pricing/PricingFaq'
import PricingCta from '../components/pricing/PricingCta'

export default function Pricing() {
  const [billing, setBilling] = useState('monthly')

  return (
    <div className="akili">
      <Nav />
      <PricingHero billing={billing} setBilling={setBilling} />
      <RevealOnScroll>
        <PricingCompare />
      </RevealOnScroll>
      <RevealOnScroll>
        <PricingFaq />
      </RevealOnScroll>
      <RevealOnScroll direction="scale">
        <PricingCta />
      </RevealOnScroll>
      <Footer />
    </div>
  )
}
