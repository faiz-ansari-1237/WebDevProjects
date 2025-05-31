// src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled component for the main navigation container
const NavContainer = styled(motion.nav)`
  position: fixed; /* Keep navbar fixed at the top */
  top: 0;
  left: 0;
  width: 100%;
  padding: var(--spacing-medium) var(--spacing-large); /* Padding from CSS variables */
  background: var(--color-glass-background); /* Frosted glass background */
  backdrop-filter: blur(10px); /* Apply blur for glassmorphism effect */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  border-bottom: 1px solid var(--color-glass-border); /* Subtle border */
  z-index: 100; /* Ensure it's on top of other content */
  display: flex;
  justify-content: space-between; /* Space out logo and links */
  align-items: center;
`;

// Styled component for the logo/site title
const Logo = styled(motion.div)`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 0 0 5px rgba(88, 166, 255, 0.3); /* Reduced subtle glow for logo */
  cursor: pointer; /* Set to pointer, will pick up global hover effect */
  transition: text-shadow 0.3s ease;

  &:hover {
    text-shadow: 0 0 10px var(--color-accent), 0 0 15px var(--color-secondary-accent); /* Slightly more glow on hover */
    /* Cursor handled by global hover rule */
  }
`;

// Styled component for the navigation links list
const NavLinks = styled.ul`
  list-style: none; /* Remove bullet points */
  display: flex;
  gap: var(--spacing-large); /* Space between links */

  @media (max-width: 768px) {
    /* Hide links on small screens for now, we'll add a mobile menu later */
    display: none;
  }
`;

// Styled component for individual navigation link items
const NavItem = styled(motion.li)`
  position: relative; /* For active indicator positioning */
`;

// Styled component for the actual navigation link (anchor tag)
const NavLink = styled(motion.a)`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  color: var(--color-text);
  padding: 5px 0;
  position: relative;
  transition: color 0.3s ease;
  /* Cursor handled by global body rule for default and global hover rule for hover */

  &:hover {
    color: var(--color-accent);
    text-decoration: none; /* Override default underline on hover for custom effect */
    /* Cursor handled by global hover rule */
  }

  &.active {
    color: var(--color-accent);
    font-weight: 700;
  }
`;

// Styled component for the active link indicator
const ActiveIndicator = styled(motion.span)`
  position: absolute;
  bottom: -5px; /* Position below the link */
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-secondary-accent));
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(88, 166, 255, 0.5); /* Subtle glowing effect */
`;

// Framer Motion variants for Navbar entry animation
const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Navbar Component
 * Provides a fixed, futuristic navigation bar with animated links and an active indicator.
 */
export const Navbar = () => {
  // State to manage the active link
  const [activeLink, setActiveLink] = useState('home');

  // Dummy function for navigation - in a real app, you'd use React Router or similar
  const handleNavLinkClick = (sectionId) => {
    setActiveLink(sectionId);
    // Smooth scroll to section (for single-page layout)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to update active link based on scroll position (for single-page sites)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'gallery', 'about', 'contact']; // Define your section IDs
      const scrollPosition = window.scrollY + window.innerHeight / 2; // Check middle of viewport

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            setActiveLink(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <NavContainer
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <Logo onClick={() => handleNavLinkClick('home')}>Cosmic Canvas</Logo>
      <NavLinks>
        <NavItem>
          <NavLink
            onClick={() => handleNavLinkClick('home')}
            className={activeLink === 'home' ? 'active' : ''}
          >
            Home
            {activeLink === 'home' && <ActiveIndicator layoutId="activeLink" />}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => handleNavLinkClick('gallery')}
            className={activeLink === 'gallery' ? 'active' : ''}
          >
            Gallery
            {activeLink === 'gallery' && <ActiveIndicator layoutId="activeLink" />}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => handleNavLinkClick('about')}
            className={activeLink === 'about' ? 'active' : ''}
          >
            About
            {activeLink === 'about' && <ActiveIndicator layoutId="activeLink" />}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => handleNavLinkClick('contact')}
            className={activeLink === 'contact' ? 'active' : ''}
          >
            Contact
            {activeLink === 'contact' && <ActiveIndicator layoutId="activeLink" />}
          </NavLink>
        </NavItem>
      </NavLinks>
    </NavContainer>
  );
};
