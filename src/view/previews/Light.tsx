import React from 'react';
import type { UrlButton } from '../../types';

export default function Dark({
  userName,
  bio,
  urlButtons,
}: {
  userName: string;
  bio: string;
  urlButtons: UrlButton[];
}) {
  const containerBoxStyles: React.CSSProperties = {
    justifyContent: 'center',
    border: '1px solid #252525',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    padding: '32px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: window.innerWidth >= 768 ? '17px' : '12px',
    width: '100%',
  };

  const userNameStyles: React.CSSProperties = {
    fontSize: window.innerWidth >= 768 ? '29.58px' : '24px',
    fontWeight: 'bold',
    fontFamily: '"Helvetica Neue", sans-serif',
    lineHeight: 1.5,
    color: '#252525',
  };

  const bioStyles: React.CSSProperties = {
    fontSize: window.innerWidth >= 768 ? '14px' : '12px',
    fontFamily: '"Helvetica Neue", sans-serif',
    lineHeight: 1.5,
    color: '#252525',
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: '#252525',
    color: '#FFFFFF',
    padding: window.innerWidth >= 768 ? '15px' : '8px',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    lineHeight: 1.5,
    fontFamily: '"Helvetica Neue", sans-serif',
  };
  return (
    <div style={containerBoxStyles}>
      <h1 style={userNameStyles}>{userName}</h1>
      <div>
        {bio?.split('\n').map((line, index) => (
          <p style={bioStyles} key={index}>
            {line || '\u00A0'}{' '}
          </p>
        ))}
      </div>
      {urlButtons?.map((item) => (
        <a
          key={item?.id}
          style={buttonStyles}
          href={item?.url}
          target='_blank'
          rel='noopener noreferrer'
        >
          {item?.title}
        </a>
      ))}
    </div>
  );
}
