// src/App.jsx
import React, { useState } from 'react'; // Import useState
import { Layout } from './components/common/Layout';
import { Navbar } from './components/common/Navbar'; // Import the Navbar
import { HeroSection } from './components/hero/HeroSection';
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence and motion for transitions

/**
 * App Component
 * The main application component that orchestrates the layout and sections.
 */
function App() {
  // State to control whether the full site content is visible
  const [showFullSite, setShowFullSite] = useState(false);

  // Callback function to be passed to HeroSection to trigger full site visibility
  const handleExploreClick = () => {
    setShowFullSite(true);
    // After showing the full site, scroll to the top of the page (or a designated "home" anchor)
    // This ensures the user isn't left looking at the faded hero section from before.
    setTimeout(() => { // Small delay to allow fade out to start
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Layout>
      {/* Conditionally render the Navbar only after the full site is shown */}
      <AnimatePresence>
        {showFullSite && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Main content sections */}
      <AnimatePresence mode="wait"> {/* Use mode="wait" to ensure exit animation completes before new content enters */}
        {!showFullSite ? (
          // Show only the HeroSection initially
          <motion.section
            key="hero-initial" // Unique key for AnimatePresence
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }} // Fade out HeroSection
            style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <HeroSection onExploreClick={handleExploreClick} />
          </motion.section>
        ) : (
          // Show the full site content after "Explore" is clicked
          <motion.div
            key="full-site-content" // Unique key for AnimatePresence
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }} // Fade in full content
          >
            {/* The 'home' section is now empty or can contain different content
                after the initial hero animation. */}
            <section id="home" style={{ minHeight: '100vh', paddingTop: '80px' /* Account for fixed navbar */ }}>
              {/* You can add a subtle background or a small intro here if desired,
                  but the main HeroSection content is gone. */}
            </section>

            {/* Placeholder sections for navigation.
                In a real app, these would be separate, fully-fleshed components.
                Added min-height for visibility and scroll testing. */}
            <section id="gallery" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '50px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontSize: '3rem' }}>Gallery Section (Coming Soon!)</h2>
            </section>

            <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: '50px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontSize: '3rem' }}>About Us (More Info Here)</h2>
            </section>

            <section id="contact" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '50px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontSize: '3rem' }}>Contact (Get in Touch)</h2>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
