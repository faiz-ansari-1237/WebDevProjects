// src/components/hero/HeroSection.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';

// Styled component for the hero section wrapper
const HeroWrapper = styled.section`
  position: relative; /* Needed for z-index to work with absolute positioned children */
  height: 100vh; /* Full viewport height */
  width: 100%; /* Ensure it takes full width */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden; /* Hide any overflowing content */
  padding: var(--spacing-large); /* Use CSS variable for padding */
  z-index: 1; /* Ensures content is above the background */
`;

// Styled component for the content wrapper (text and button)
const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2; /* Ensures text is on top of other elements */
`;

// Styled component for the main title
const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 6rem); /* Responsive font size */
  font-weight: 700;
  margin-bottom: var(--spacing-medium); /* Use CSS variable for margin */
  color: var(--color-accent); /* Use CSS variable for color */
  letter-spacing: 2px;
`;

// Styled component for the tagline
const Tagline = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.8rem); /* Responsive font size */
  margin-bottom: var(--spacing-large); /* Use CSS variable for margin */
  color: var(--color-text); /* Use CSS variable for color */
`;

// Styled component for the call to action button
const CallToAction = styled(motion.button)`
  /* Inherits styles from global index.css button rules */
`;

// Framer Motion variants for text animation
const textVariants = {
  hidden: { opacity: 0, y: 50 }, // Initial state: invisible and slightly below
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }, // Final state: visible and in place
};

// Framer Motion variants for staggering child animations
const staggerContainerVariants = {
  hidden: { opacity: 0 }, // Container starts invisible
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Each child animates with a 0.2 second delay after the previous one
    },
  },
};

/**
 * HeroSection Component
 * Displays the main hero content with an animated particle background.
 * Uses Framer Motion for text and button animations.
 *
 * @param {object} props - Component props.
 * @param {function} props.onExploreClick - Callback function to be called when the "Explore" button is clicked.
 */
export const HeroSection = ({ onExploreClick }) => {
  return (
    <HeroWrapper>
      {/* Three.js Particle Background */}
      <ParticleBackground />

      {/* Content overlaying the background */}
      <ContentWrapper
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <Title variants={textVariants}>
          Cosmic Canvas
        </Title>
        <Tagline variants={textVariants}>
          Unveiling the Future of Concept Art
        </Tagline>
        <CallToAction variants={textVariants} onClick={onExploreClick}>
          Explore the Gallery
        </CallToAction>
      </ContentWrapper>
    </HeroWrapper>
  );
};
