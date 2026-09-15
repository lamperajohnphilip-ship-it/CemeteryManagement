'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // ── Password Reset State ──────────────────────────────────────────────────
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsPending(true);
    setErrorMsg('');

    try {
      const { loginAdmin } = await import('../../actions/auth');
      const result = await loginAdmin(email, password, rememberMe);

      if (result.success && result.admin) {
        // Safe display cache only; security is enforced via HTTP-only cookie
        localStorage.setItem(
          'adminProfile',
          JSON.stringify({
            emailAddress: result.admin.email,
            name: result.admin.name,
            role: result.admin.role,
          })
        );
        router.replace('/admin');
      } else {
        setErrorMsg(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during login. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleRequestReset = async () => {
    if (!resetEmail.trim()) {
      setResetError('Please enter your administrator email.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    setResetMsg('');
    try {
      const { requestPasswordReset } = await import('../../actions/auth');
      const res = await requestPasswordReset(resetEmail);
      if (res.success) {
        setResetMsg(res.message);
        setResetStep('verify');
      } else {
        setResetError(res.message || 'Failed to request reset code.');
      }
    } catch (e: any) {
      setResetError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!resetCode.trim() || !newPassword) {
      setResetError('Please provide the recovery code and a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setResetError('New password must be at least 8 characters long.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      const { resetPasswordWithToken } = await import('../../actions/auth');
      const res = await resetPasswordWithToken(resetEmail, resetCode, newPassword);
      if (res.success) {
        setResetMsg(res.message);
        setTimeout(() => {
          setShowResetModal(false);
          setResetStep('request');
          setResetCode('');
          setNewPassword('');
          setResetMsg('');
        }, 2500);
      } else {
        setResetError(res.message || 'Password reset failed.');
      }
    } catch (e: any) {
      setResetError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBg}></div>

      <div className={styles.loginLeft}>
        <Link href="/" className={styles.backLink}>
          &larr; Back to Dashboard
        </Link>
        <div className={styles.emblem}>
          <div className={styles.emblemSeal}><span>⚱</span></div>
          <div className={styles.emblemText}>
            <h1>Jasaan Cemetery</h1>
            <p>Municipality of Jasaan · Misamis Oriental</p>
          </div>
        </div>
        <div className={styles.tagline}>
          <h2>Preserving <em>Memory.</em><br />Dignifying <em>Rest.</em></h2>
          <p>A centralized digital platform for managing burial records, grave locations, inquiry scheduling, grave rent monitoring, and family SMS communications for the Municipality of Jasaan.</p>
        </div>
      </div>

      <div className={styles.loginRight}>
        <div className={styles.formHead}>
          <span className={styles.labelTag}>🛡 Admin Access Only</span>
          <h3>Administrator<br />Sign In</h3>
          <p>Authorized cemetery administrators (MEEDO staff) only.</p>
        </div>

        <div className={styles.fg}>
          <label>Admin Email / ID</label>
          <div className={styles.fi}>
            <input
              type="email"
              placeholder="admin@jasaan.gov.ph"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              disabled={isPending}
            />
            <span className={styles.fiIco}>✉</span>
          </div>
        </div>

        <div className={styles.fg}>
          <label>Password</label>
          <div className={styles.fi}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
              disabled={isPending}
            />
            <span
              className={styles.fiIco}
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
            >
              👁
            </span>
          </div>
        </div>

        <div className={styles.frow}>
          <label className={styles.fchk}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{' '}
            <span>Remember this device</span>
          </label>
          <button
            type="button"
            className={styles.flink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => {
              setResetEmail(email || '');
              setShowResetModal(true);
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          className={styles.btnPrimary}
          onClick={handleLogin}
          disabled={isPending}
        >
          {isPending ? 'Verifying Credentials…' : 'Sign In to Portal'}
        </button>

        {errorMsg && (
          <div className={styles.loginError}>
            <span>⚠</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className={styles.loginNotice}>
          <span>⚠</span>
          <span>This system is restricted to authorized MEEDO/municipal cemetery administrators. Unauthorized access is prohibited.</span>
        </div>
      </div>

      {/* ── Password Recovery Modal ── */}
      {showResetModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#14120B',
              border: '1px solid #D4AF37',
              borderRadius: 12,
              padding: 24,
              maxWidth: 420,
              width: '100%',
              color: '#F5F5F0',
            }}
          >
            <h3 style={{ color: '#D4AF37', margin: '0 0 8px 0', fontSize: '1.25rem' }}>
              Admin Account Recovery
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#A09885', margin: '0 0 16px 0' }}>
              {resetStep === 'request'
                ? 'Enter your registered administrator email address to receive a 6-digit verification code.'
                : 'Enter the 6-digit recovery code sent to your email and your new password.'}
            </p>

            {resetStep === 'request' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="email"
                  placeholder="admin@jasaan.gov.ph"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: '#0D0C07',
                    border: '1px solid #332E22',
                    color: '#FFF',
                    fontSize: '0.9rem',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    style={{
                      padding: '8px 14px',
                      background: 'transparent',
                      border: '1px solid #443D2D',
                      color: '#CCC',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestReset}
                    disabled={resetLoading}
                    style={{
                      padding: '8px 16px',
                      background: '#D4AF37',
                      color: '#0A0800',
                      border: 'none',
                      fontWeight: 600,
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {resetLoading ? 'Sending…' : 'Send Code'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text"
                  placeholder="6-Digit Recovery Code"
                  value={resetCode}
                  maxLength={6}
                  onChange={(e) => setResetCode(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: '#0D0C07',
                    border: '1px solid #332E22',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    letterSpacing: 3,
                    textAlign: 'center',
                  }}
                />
                <input
                  type="password"
                  placeholder="New Password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: '#0D0C07',
                    border: '1px solid #332E22',
                    color: '#FFF',
                    fontSize: '0.9rem',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setResetStep('request')}
                    style={{
                      padding: '8px 14px',
                      background: 'transparent',
                      border: '1px solid #443D2D',
                      color: '#CCC',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    disabled={resetLoading}
                    style={{
                      padding: '8px 16px',
                      background: '#D4AF37',
                      color: '#0A0800',
                      border: 'none',
                      fontWeight: 600,
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {resetLoading ? 'Resetting…' : 'Reset Password'}
                  </button>
                </div>
              </div>
            )}

            {resetMsg && (
              <div style={{ marginTop: 12, padding: 8, background: '#1A2A1A', color: '#4ADE80', fontSize: '0.85rem', borderRadius: 4 }}>
                {resetMsg}
              </div>
            )}
            {resetError && (
              <div style={{ marginTop: 12, padding: 8, background: '#2A1414', color: '#F87171', fontSize: '0.85rem', borderRadius: 4 }}>
                {resetError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
