/**
 * GoalWear Centralized Firebase Auth Error Handler & Mapping Utility
 * Translates technical Firebase Auth & Firestore error codes into human-readable,
 * actionable instructions for users during sign-up and authentication workflows.
 */

export const FIREBASE_AUTH_ERROR_MAP = {
  // --- SIGN-UP SPECIFIC ERRORS ---
  'auth/email-already-in-use': {
    code: 'auth/email-already-in-use',
    title: 'Account Already Exists',
    description: 'An account is already registered with this email address.',
    instruction: 'If this is your account, switch to Sign In or reset your password. You can also sign in with Google if you registered with that provider.',
    severity: 'warning',
    iconName: 'UserCheck',
    action: {
      label: 'Switch to Sign In',
      type: 'switch_to_signin',
    },
  },

  'auth/weak-password': {
    code: 'auth/weak-password',
    title: 'Password Too Weak',
    description: 'The chosen password does not meet security requirements.',
    instruction: 'Please create a stronger password with at least 6 characters. For better protection, include a combination of letters, numbers, and symbols.',
    severity: 'error',
    iconName: 'KeyRound',
    action: null,
  },

  'auth/invalid-email': {
    code: 'auth/invalid-email',
    title: 'Invalid Email Address',
    description: 'The email address format you entered is incorrect.',
    instruction: 'Please double-check your email address for typos or missing characters (e.g. name@example.com).',
    severity: 'error',
    iconName: 'MailWarning',
    action: null,
  },

  'auth/missing-name': {
    code: 'auth/missing-name',
    title: 'Full Name Required',
    description: 'Your name is required to personalize your account and jersey delivery.',
    instruction: 'Please enter your first and last name in the Full Name field above.',
    severity: 'error',
    iconName: 'User',
    action: null,
  },

  'auth/operation-not-allowed': {
    code: 'auth/operation-not-allowed',
    title: 'Sign-Up Method Disabled',
    description: 'Email and password sign-ups are currently not enabled on this authentication provider.',
    instruction: 'Please try signing up using Google Sign-In below, or contact GoalWear support if you need assistance.',
    severity: 'warning',
    iconName: 'ShieldAlert',
    action: {
      label: 'Sign in with Google',
      type: 'google_signin',
    },
  },

  // --- GENERAL AUTHENTICATION & LOGIN ERRORS ---
  'auth/user-not-found': {
    code: 'auth/user-not-found',
    title: 'Account Not Found',
    description: 'We could not find a GoalWear account with that email address.',
    instruction: 'Please verify that your email is spelled correctly, or switch to Create Account to join the squad.',
    severity: 'warning',
    iconName: 'UserX',
    action: {
      label: 'Create an Account',
      type: 'switch_to_signup',
    },
  },

  'auth/wrong-password': {
    code: 'auth/wrong-password',
    title: 'Incorrect Password',
    description: 'The password you entered does not match our records.',
    instruction: 'Please verify that Caps Lock is turned off and try re-entering your password.',
    severity: 'error',
    iconName: 'Lock',
    action: null,
  },

  'auth/invalid-credential': {
    code: 'auth/invalid-credential',
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect.',
    instruction: 'Please double-check your email address and password. If you forgot your password, please contact support.',
    severity: 'error',
    iconName: 'ShieldAlert',
    action: null,
  },

  'auth/user-disabled': {
    code: 'auth/user-disabled',
    title: 'Account Suspended',
    description: 'This account has been deactivated by a system administrator.',
    instruction: 'If you believe this is a mistake, please reach out to customer support at support@goalwear.com.',
    severity: 'error',
    iconName: 'AlertOctagon',
    action: null,
  },

  'auth/too-many-requests': {
    code: 'auth/too-many-requests',
    title: 'Too Many Attempts',
    description: 'Access to this account has been temporarily disabled due to multiple failed sign-in attempts.',
    instruction: 'Please wait 5 to 10 minutes before trying again to protect your account, or sign in via Google.',
    severity: 'warning',
    iconName: 'Clock',
    action: {
      label: 'Sign in with Google',
      type: 'google_signin',
    },
  },

  // --- GOOGLE & POP-UP ERRORS ---
  'auth/popup-closed-by-user': {
    code: 'auth/popup-closed-by-user',
    title: 'Sign-In Canceled',
    description: 'The Google Sign-In window was closed before authorization was finished.',
    instruction: 'To sign in with Google, tap the Google button again and keep the window open until you receive confirmation.',
    severity: 'info',
    iconName: 'AlertCircle',
    action: {
      label: 'Try Google Sign-In Again',
      type: 'google_signin',
    },
  },

  'auth/popup-blocked': {
    code: 'auth/popup-blocked',
    title: 'Pop-Up Window Blocked',
    description: 'Your mobile browser blocked the authentication pop-up window.',
    instruction: 'Please allow pop-ups for this site in your browser settings, or sign up with your email and password above.',
    severity: 'warning',
    iconName: 'ExternalLink',
    action: null,
  },

  'auth/account-exists-with-different-credential': {
    code: 'auth/account-exists-with-different-credential',
    title: 'Different Sign-In Method',
    description: 'An account already exists with the same email using a different sign-in method.',
    instruction: 'Please sign in using the original method (email/password or Google) used when the account was first created.',
    severity: 'warning',
    iconName: 'ShieldAlert',
    action: {
      label: 'Sign in with Google',
      type: 'google_signin',
    },
  },

  // --- NETWORK & SYSTEM ERRORS ---
  'auth/network-request-failed': {
    code: 'auth/network-request-failed',
    title: 'Network Connection Error',
    description: 'Unable to reach the authentication server.',
    instruction: 'Please check your internet or Wi-Fi connection, disable any restrictive VPN or proxy, and try again.',
    severity: 'warning',
    iconName: 'WifiOff',
    action: {
      label: 'Try Again',
      type: 'retry',
    },
  },

  'permission-denied': {
    code: 'permission-denied',
    title: 'Access Permission Error',
    description: 'The database rejected the registration attempt due to security rule constraints.',
    instruction: 'Your registration request could not be saved. Please refresh the page and try again, or sign in with Google.',
    severity: 'error',
    iconName: 'ShieldAlert',
    action: {
      label: 'Try Again',
      type: 'retry',
    },
  },

  'unavailable': {
    code: 'unavailable',
    title: 'Service Temporarily Unavailable',
    description: 'The database server is momentarily unreachable.',
    instruction: 'Please verify your network connection or wait a moment before trying again.',
    severity: 'warning',
    iconName: 'ServerCrash',
    action: {
      label: 'Try Again',
      type: 'retry',
    },
  },
};

/**
 * Extracts the Firebase error code from an Error object, code string, or raw error message.
 * @param {Error|string|object} error - The error to analyze
 * @returns {string|null} - The identified Firebase error code or null
 */
export function extractAuthErrorCode(error) {
  if (!error) return null;

  // 1. Direct code property
  if (typeof error === 'object' && error.code && typeof error.code === 'string') {
    return error.code.trim();
  }

  const errorString = typeof error === 'string' 
    ? error 
    : (error.message || error.toString() || '');

  // 2. Regex search for standard auth/ or permission codes
  const authCodeMatch = errorString.match(/auth\/[a-z0-9-]+/i);
  if (authCodeMatch) {
    return authCodeMatch[0].toLowerCase();
  }

  const permissionMatch = errorString.match(/permission-denied|PERMISSION_DENIED/i);
  if (permissionMatch) {
    return 'permission-denied';
  }

  const networkMatch = errorString.match(/network-request-failed|network error|failed to fetch/i);
  if (networkMatch) {
    return 'auth/network-request-failed';
  }

  // 3. Heuristic text matching
  const lower = errorString.toLowerCase();

  if (lower.includes('already exists') || lower.includes('already in use') || lower.includes('email-already')) {
    return 'auth/email-already-in-use';
  }
  if ((lower.includes('password') && (lower.includes('weak') || lower.includes('least 6') || lower.includes('short') || lower.includes('characters')))) {
    return 'auth/weak-password';
  }
  if (lower.includes('invalid email') || lower.includes('valid email')) {
    return 'auth/invalid-email';
  }
  if (lower.includes('full name') || lower.includes('enter your name')) {
    return 'auth/missing-name';
  }
  if (lower.includes('incorrect password') || lower.includes('wrong password') || lower.includes('wrong-password')) {
    return 'auth/wrong-password';
  }
  if (lower.includes('invalid credential') || lower.includes('invalid-credential')) {
    return 'auth/invalid-credential';
  }
  if (
    lower.includes('user not found') || 
    lower.includes('no user record') || 
    lower.includes('no account found') || 
    lower.includes('account not found') || 
    lower.includes('not found with this email')
  ) {
    return 'auth/user-not-found';
  }
  if (lower.includes('too many') || lower.includes('throttled')) {
    return 'auth/too-many-requests';
  }
  if (lower.includes('popup closed') || lower.includes('closed-by-user')) {
    return 'auth/popup-closed-by-user';
  }
  if (lower.includes('popup blocked')) {
    return 'auth/popup-blocked';
  }
  if (lower.includes('permission') || lower.includes('permission_denied')) {
    return 'permission-denied';
  }
  if (lower.includes('offline') || lower.includes('client is offline') || lower.includes('unavailable')) {
    return 'unavailable';
  }

  return null;
}

/**
 * Returns a human-readable error descriptor with instructions and recovery actions.
 * @param {Error|string|object} error - The error to format
 * @param {string} [contextMode='signup'] - The workflow context ('signup' | 'signin')
 * @returns {object} - Structured error details with human instructions
 */
export function formatAuthError(error, contextMode = 'signup') {
  if (!error) return null;

  const rawMessage = typeof error === 'string' 
    ? error 
    : (error.message || 'An unexpected error occurred during authentication.');

  const code = extractAuthErrorCode(error);

  if (code && FIREBASE_AUTH_ERROR_MAP[code]) {
    const template = FIREBASE_AUTH_ERROR_MAP[code];
    return {
      ...template,
      rawMessage,
      code,
    };
  }

  // Clean raw message of technical prefixes like "Firebase: Error ("
  const cleanMessage = rawMessage
    .replace(/^Firebase:\s*/i, '')
    .replace(/^Error:\s*/i, '')
    .replace(/\s*\([^)]*\)\.?$/, '')
    .trim();

  // Fallback for unmapped errors
  return {
    code: code || 'auth/unknown-error',
    title: contextMode === 'signup' ? 'Sign-Up Failed' : 'Authentication Failed',
    description: cleanMessage || 'An unexpected issue occurred while processing your request.',
    instruction: 'Please double-check all form fields and try submitting again. If the issue continues, try signing in with Google or contact support.',
    severity: 'error',
    iconName: 'AlertCircle',
    action: {
      label: 'Try with Google',
      type: 'google_signin',
    },
    rawMessage,
  };
}
