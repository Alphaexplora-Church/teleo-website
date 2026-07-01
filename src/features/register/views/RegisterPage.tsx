// features/register/views/RegisterPage.tsx
// Placeholder — registration workflow

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeleoLogo from '../../../shared/components/TeleoLogo';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="teleo-shell">
      <div className="placeholder-container">
        <TeleoLogo size={80} />
        <h2 className="placeholder-title">Create Account</h2>
        <p className="placeholder-subtitle">Registration flow coming soon.</p>
        <button
          type="button"
          className="btn-outline"
          style={{ marginTop: '24px' }}
          onClick={() => navigate('/welcome')}
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
