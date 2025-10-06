import React, { useEffect, useRef } from 'react';

interface ShadowDOMCardProps {
  title: string;
  playerName: string;
  date: string;
  testId: string;
}

const ShadowDOMCard: React.FC<ShadowDOMCardProps> = ({ title, playerName, date, testId }) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (shadowHostRef.current && !shadowRootRef.current) {
      // Create shadow DOM only if it doesn't exist
      shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'open' });
      
      // Create styles for shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-family: 'Roboto', sans-serif;
        }
        .title {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 12px;
          color: #333;
        }
        .player-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 8px;
          color: #1976d2;
        }
        .date {
          font-size: 0.875rem;
          color: #666;
        }
      `;
      
      shadowRootRef.current.appendChild(style);
    }

    // Update content when props change
    if (shadowRootRef.current) {
      // Clear existing content except style
      const styleElement = shadowRootRef.current.querySelector('style');
      shadowRootRef.current.innerHTML = '';
      if (styleElement) {
        shadowRootRef.current.appendChild(styleElement);
      }
      
      // Create card content
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-testid', testId);
      
      const titleElement = document.createElement('div');
      titleElement.className = 'title';
      titleElement.textContent = title;
      
      const playerElement = document.createElement('div');
      playerElement.className = 'player-name';
      playerElement.textContent = playerName;
      
      const dateElement = document.createElement('div');
      dateElement.className = 'date';
      dateElement.textContent = new Date(date).toLocaleDateString();
      
      card.appendChild(titleElement);
      card.appendChild(playerElement);
      card.appendChild(dateElement);
      
      shadowRootRef.current.appendChild(card);
    }
  }, [title, playerName, date, testId]);

  return <div ref={shadowHostRef} />;
};

export default ShadowDOMCard;
