// src/components/common/Layout.jsx
import React from 'react';
import styled from 'styled-components';

// Styled component for the main layout wrapper
const LayoutWrapper = styled.div`
  min-height: 100vh; /* Ensure it takes at least full viewport height */
  display: flex;
  flex-direction: column;
  /* Background color is set globally in index.css */
`;

/**
 * Layout Component
 * Provides a consistent wrapper for pages, applying global styles.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 */
export const Layout = ({ children }) => {
  return (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  );
};
