import React from "react";

const MetricCard = ({ title, value, subtitle, type }) => {
  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '35px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const getGradient = () => {
    switch(type) {
      case 'daily':
        return 'linear-gradient(90deg, #667eea, #764ba2)';
      case 'hourly':
        return 'linear-gradient(90deg, #f093fb, #f5576c)';
      case 'tertiary':
        return 'linear-gradient(90deg, #ffeaa7, #fdcb6e)';
      default:
        return 'linear-gradient(90deg, #667eea, #764ba2)';
    }
  };

  const getTextGradient = () => {
    switch(type) {
      case 'daily':
        return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'hourly':
        return 'linear-gradient(135deg, #f093fb, #f5576c)';
      case 'tertiary':
        return 'linear-gradient(135deg, #ffeaa7, #fdcb6e)';
      default:
        return 'linear-gradient(135deg, #667eea, #764ba2)';
    }
  };

  const beforeStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: getGradient(),
  };

  const titleStyle = {
    fontSize: '1.1rem',
    color: '#4a5568',
    marginBottom: '15px',
    fontWeight: '600',
  };

  const valueStyle = {
    fontSize: '3.5rem',
    background: getTextGradient(),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '20px 0',
    fontWeight: '800',
  };

  const subtitleStyle = {
    color: '#718096',
    fontSize: '0.95rem',
    fontWeight: '500',
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={beforeStyle}></div>
      <h3 style={titleStyle}>{title}</h3>
      <h1 style={valueStyle}>{value?.toLocaleString() || 0}</h1>
      <p style={subtitleStyle}>{subtitle}</p>
    </div>
  );
};

export default MetricCard;
