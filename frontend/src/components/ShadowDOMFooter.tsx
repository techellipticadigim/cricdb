import React, { useEffect, useRef } from 'react';

const ShadowDOMFooter: React.FC = () => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (shadowHostRef.current && !shadowRootRef.current) {
      // Create shadow DOM only if it doesn't exist
      shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'open' });
      
      // Create styles for shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        .footer {
          padding: 16px;
          text-align: center;
          background-color: #f5f5f5;
          border-top: 1px solid #e0e0e0;
          font-family: 'Roboto', sans-serif;
          margin-top: auto;
        }
        .footer-text {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }
        .footer-link {
          color: #1976d2;
          text-decoration: none;
          font-weight: bold;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
      `;
      
      shadowRootRef.current.appendChild(style);
    }

    // Update content
    if (shadowRootRef.current) {
      // Clear existing content except style
      const styleElement = shadowRootRef.current.querySelector('style');
      shadowRootRef.current.innerHTML = '';
      if (styleElement) {
        shadowRootRef.current.appendChild(styleElement);
      }
      
      // Create footer content
      const footer = document.createElement('div');
      footer.className = 'footer';
      footer.setAttribute('data-testid', 'shadow-footer');
      
      const footerText = document.createElement('p');
      footerText.className = 'footer-text';
      
      const textNode = document.createTextNode('Powered by ');
      const link = document.createElement('a');
      link.href = 'https://techelliptica.com';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'footer-link';
      link.textContent = 'TechElliptica';
      
      footerText.appendChild(textNode);
      footerText.appendChild(link);
      footer.appendChild(footerText);
      
      shadowRootRef.current.appendChild(footer);
    }
  }, []);

  return <div ref={shadowHostRef} style={{ width: '100%', marginTop: 'auto' }} />;
};

export default ShadowDOMFooter;

