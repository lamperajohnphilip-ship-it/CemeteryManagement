'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  // Clear any existing session when landing on the login page to ensure security and prevent auto-logins
  useEffect(() => {
    localStorage.removeItem('adminProfile');
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsPending(true);
    setErrorMsg('');

    try {
      const { loginAdmin } = await import('../../actions/auth');
      const result = await loginAdmin(email, password);

      if (result.success) {
        localStorage.setItem('adminProfile', JSON.stringify({ emailAddress: result.email, name: result.name }));
        // Use replace so Back button from /admin does NOT return to login
        router.replace('/admin');
      } else {
        setErrorMsg(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during login.');
    } finally {
      setIsPending(false);
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
            />
            <span className={styles.fiIco} onClick={() => setShowPassword(!showPassword)}>👁</span>
          </div>
        </div>

        <div className={styles.frow}>
          <label className={styles.fchk}>
            <input type="checkbox" /> <span>Remember this device</span>
          </label>
          <a href="#" className={styles.flink}>Forgot password?</a>
        </div>

        <button className={styles.btnPrimary} onClick={handleLogin}>Sign In to Portal</button>

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
    </div>
  );
}
