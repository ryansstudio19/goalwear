import React, { useState } from 'react';
import { 
  AlertCircle, 
  KeyRound, 
  MailWarning, 
  User, 
  UserCheck, 
  UserX, 
  Lock, 
  ShieldAlert, 
  AlertOctagon, 
  Clock, 
  ExternalLink, 
  WifiOff, 
  ServerCrash, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';
import { formatAuthError } from '../utils/authErrorMap';

/**
 * Dynamic icon selector for Firebase Auth error categories
 */
function getErrorIcon(iconName, size = 18, color) {
  const iconProps = { size, color, style: { flexShrink: 0 } };
  switch (iconName) {
    case 'KeyRound':
      return <KeyRound {...iconProps} />;
    case 'MailWarning':
      return <MailWarning {...iconProps} />;
    case 'User':
      return <User {...iconProps} />;
    case 'UserCheck':
      return <UserCheck {...iconProps} />;
    case 'UserX':
      return <UserX {...iconProps} />;
    case 'Lock':
      return <Lock {...iconProps} />;
    case 'ShieldAlert':
      return <ShieldAlert {...iconProps} />;
    case 'AlertOctagon':
      return <AlertOctagon {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'ExternalLink':
      return <ExternalLink {...iconProps} />;
    case 'WifiOff':
      return <WifiOff {...iconProps} />;
    case 'ServerCrash':
      return <ServerCrash {...iconProps} />;
    case 'Info':
      return <Info {...iconProps} />;
    case 'AlertCircle':
    default:
      return <AlertCircle {...iconProps} />;
  }
}

/**
 * Centralized error message display component for Firebase Auth & registration workflows.
 * Reads technical error codes and presents clear, human-readable instructions with actionable steps.
 *
 * @param {object} props
 * @param {Error|string|object|null} props.error - The error object, code string, or error message
 * @param {('signup'|'signin')} [props.mode='signup'] - The current auth mode context
 * @param {function} [props.onAction] - Callback when user clicks a suggested action button
 * @param {function} [props.onDismiss] - Callback when user dismisses the error
 * @param {string} [props.id='auth-error-message-display'] - Unique DOM ID
 */
export default function AuthErrorMessage({
  error,
  mode = 'signup',
  onAction,
  onDismiss,
  id = 'auth-error-message-display',
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!error) return null;

  const errorData = formatAuthError(error, mode);
  if (!errorData) return null;

  // Severity color schemes
  const isWarning = errorData.severity === 'warning';
  const isInfo = errorData.severity === 'info';

  const theme = isWarning
    ? {
        border: 'rgba(245, 158, 11, 0.45)',
        bg: 'rgba(30, 22, 10, 0.88)',
        accent: '#f59e0b',
        badgeBg: 'rgba(245, 158, 11, 0.15)',
        badgeText: '#fbbf24',
        glow: '0 0 20px rgba(245, 158, 11, 0.18)',
        instructionBg: 'rgba(245, 158, 11, 0.08)',
        instructionBorder: 'rgba(245, 158, 11, 0.25)',
      }
    : isInfo
    ? {
        border: 'rgba(59, 130, 246, 0.45)',
        bg: 'rgba(10, 20, 35, 0.88)',
        accent: '#3b82f6',
        badgeBg: 'rgba(59, 130, 246, 0.15)',
        badgeText: '#60a5fa',
        glow: '0 0 20px rgba(59, 130, 246, 0.18)',
        instructionBg: 'rgba(59, 130, 246, 0.08)',
        instructionBorder: 'rgba(59, 130, 246, 0.25)',
      }
    : {
        border: 'rgba(239, 68, 68, 0.45)',
        bg: 'rgba(30, 10, 15, 0.88)',
        accent: '#ef4444',
        badgeBg: 'rgba(239, 68, 68, 0.15)',
        badgeText: '#f87171',
        glow: '0 0 20px rgba(239, 68, 68, 0.18)',
        instructionBg: 'rgba(239, 68, 68, 0.08)',
        instructionBorder: 'rgba(239, 68, 68, 0.25)',
      };

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: `${theme.glow}, 0 8px 24px rgba(0, 0, 0, 0.4)`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.25s ease',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Bar: Icon, Title, and Dismiss */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              backgroundColor: theme.badgeBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getErrorIcon(errorData.iconName, 18, theme.accent)}
          </div>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                margin: 0,
                fontSize: '0.94rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                color: '#ffffff',
                lineHeight: 1.25,
                textTransform: 'none',
              }}
            >
              {errorData.title}
            </h4>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: theme.badgeText,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginTop: '2px',
              }}
            >
              {errorData.code}
            </div>
          </div>
        </div>

        {/* Dismiss Button with min 44px touch area */}
        {onDismiss && (
          <button
            id="auth-error-dismiss-btn"
            type="button"
            onClick={onDismiss}
            style={{
              width: '44px',
              height: '44px',
              margin: '-6px -6px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'color 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Dismiss error notice"
            title="Dismiss notice"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Description Text */}
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '0.84rem',
          lineHeight: 1.5,
          color: '#e2e8f0',
        }}
      >
        {errorData.description}
      </p>

      {/* Actionable Human Instruction Box */}
      {errorData.instruction && (
        <div
          style={{
            backgroundColor: theme.instructionBg,
            borderLeft: `3px solid ${theme.accent}`,
            borderRadius: '6px',
            padding: '10px 12px',
            marginBottom: errorData.action ? '14px' : '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: theme.badgeText,
              marginBottom: '4px',
            }}
          >
            <Sparkles size={12} />
            <span>How to resolve</span>
          </div>
          <div
            style={{
              fontSize: '0.82rem',
              lineHeight: 1.45,
              color: '#f8fafc',
            }}
          >
            {errorData.instruction}
          </div>
        </div>
      )}

      {/* Suggested Action Button */}
      {errorData.action && onAction && (
        <div style={{ marginTop: '10px', marginBottom: '8px' }}>
          <button
            id={`auth-error-action-${errorData.action.type}`}
            type="button"
            onClick={() => onAction(errorData.action.type, errorData)}
            style={{
              width: '100%',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: theme.accent,
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.84rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${theme.accent}33`,
              touchAction: 'manipulation',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.opacity = '0.94';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.opacity = '1';
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>{errorData.action.label}</span>
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Technical Code Accordion */}
      <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
        <button
          id="auth-error-details-toggle"
          type="button"
          onClick={() => setShowTechnicalDetails((prev) => !prev)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '6px 0',
            minHeight: '34px',
            color: '#94a3b8',
            fontSize: '0.74rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            touchAction: 'manipulation',
          }}
        >
          {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{showTechnicalDetails ? 'Hide technical details' : 'View technical details'}</span>
        </button>

        {showTechnicalDetails && (
          <div
            style={{
              marginTop: '6px',
              padding: '8px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.74rem',
              color: '#cbd5e1',
              wordBreak: 'break-all',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ color: theme.badgeText, marginBottom: '2px' }}>
              <strong>Code:</strong> {errorData.code}
            </div>
            <div>
              <strong>Original Message:</strong> {errorData.rawMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
