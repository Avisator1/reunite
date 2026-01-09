import React from 'react'
import LostAndFoundHero from '../components/Hero'
import ComparisonSection from '../components/Compare'
import FeaturesSection from '../components/FeatureSection'
import KeyboardShortcutHelper from '../components/KeyboardShortcut'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
        <LostAndFoundHero />
        <ComparisonSection />
        <FeaturesSection />
        <FAQ />
        <Footer />
        <KeyboardShortcutHelper />
    </div>
  )
}

export default Home