import React from 'react';

const PasswordStrengthMeter = ({ password = '' }) => {
  // Calculate score from 0 to 4
  const getStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: 'None', color: 'none' };
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', class: 'weak', hint: 'Add numbers or uppercase letters' };
      case 2:
      case 3:
        return { score: 2, label: 'Moderate', class: 'medium', hint: 'Add symbols or make it longer' };
      case 4:
        return { score: 3, label: 'Strong', class: 'strong', hint: 'Great password!' };
      default:
        return { score: 0, label: 'Too short', class: 'weak', hint: 'Minimum 6 characters' };
    }
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="strength-meter-container">
      <div className="strength-bars">
        <div className={`strength-bar ${strength.score >= 1 ? strength.class : ''}`} />
        <div className={`strength-bar ${strength.score >= 2 ? strength.class : ''}`} />
        <div className={`strength-bar ${strength.score >= 3 ? strength.class : ''}`} />
      </div>
      <div className="strength-text">
        <span>Password strength: <strong>{strength.label}</strong></span>
        <span>{strength.hint}</span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
