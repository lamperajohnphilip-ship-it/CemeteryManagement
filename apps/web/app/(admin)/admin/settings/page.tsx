'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('Jasaan');
  const [emailAddress, setEmailAddress] = useState('admin@jasaan.gov.ph');
  const [contactNumber, setContactNumber] = useState('+63 88 888 0000');
  const [department, setDepartment] = useState('MEEDO - Municipal Environment & Natural Resources Office');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [editingField, setEditingField] = useState<string | null>(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const startEdit = (field: string) => setEditingField(field);

  const handleUpdateField = () => {
    handleUpdateProfile();
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.emailAddress) setEmailAddress(parsed.emailAddress);
        if (parsed.contactNumber) setContactNumber(parsed.contactNumber);
        if (parsed.department) setDepartment(parsed.department);
      } catch (e) {}
    }
  };

  const [alertInfo, setAlertInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.emailAddress) setEmailAddress(parsed.emailAddress);
        if (parsed.contactNumber) setContactNumber(parsed.contactNumber);
        if (parsed.department) setDepartment(parsed.department);
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlertInfo({ message, type });
    setTimeout(() => {
      setAlertInfo(null);
    }, 3000);
  };

  const handleUpdateProfile = () => {
    if (!firstName || !lastName || !emailAddress) {
      showAlert('Name and email are required fields', 'error');
      return;
    }
    const profile = { firstName, lastName, emailAddress, contactNumber, department };
    localStorage.setItem('adminProfile', JSON.stringify(profile));
    showAlert('Profile updated successfully!', 'success');
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('Please fill in all password fields', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showAlert('New passwords do not match', 'error');
      return;
    }
    
    if (newPassword.length < 8) {
      showAlert('Password must be at least 8 characters', 'error');
      return;
    }
    
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      showAlert('Password must include uppercase, lowercase, and a number', 'error');
      return;
    }
    
    try {
      const { updateAdminPassword } = await import('../../../actions/settings');
      const result = await updateAdminPassword(emailAddress, currentPassword, newPassword);
      
      if (result.success) {
        showAlert('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setEditingField(null);
      } else {
        showAlert(result.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      showAlert('An error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <div className={styles.pageHeader}>
        <h3>Settings</h3>
      </div>

      {alertInfo && (
        <div className={`${styles.alert} ${alertInfo.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          {alertInfo.message}
        </div>
      )}

      <div className={styles.settingsGrid}>
        <div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h4>Admin Account Information</h4>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.profileSection}>
                <div className={styles.profileAvatar}>{firstName.charAt(0)}{lastName.charAt(0)}</div>
                <div className={styles.profileInfo}>
                  <h2>{firstName} {lastName}</h2>
                  <p>Super Administrator · {department}</p>
                  <button className={styles.changeAvatarBtn} onClick={() => alert('Avatar change feature coming soon')}>Change Avatar</button>
                </div>
              </div>

              {/* Name Row */}
              {editingField === 'name' ? (
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{marginBottom: 0}}>
                      <label className={styles.formLabel}>FIRST NAME</label>
                      <input type="text" className={styles.formInput} value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className={styles.formGroup} style={{marginBottom: 0}}>
                      <label className={styles.formLabel}>LAST NAME</label>
                      <input type="text" className={styles.formInput} value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.btnGold} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={handleUpdateField}>Save</button>
                    <button className={styles.btnOutline} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <div className={styles.displayInfo}>
                    <span className={styles.displayLabel}>Name</span>
                    <span className={styles.displayValue}>{firstName} {lastName}</span>
                  </div>
                  <button className={styles.btnEditSmall} onClick={() => startEdit('name')}>Edit</button>
                </div>
              )}

              {/* Contacts Row */}
              {editingField === 'contacts' ? (
                <div className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>EMAIL ADDRESS</label>
                    <input type="email" className={styles.formInput} value={emailAddress} onChange={e => setEmailAddress(e.target.value)} />
                  </div>
                  <div className={styles.formGroup} style={{marginBottom: 0}}>
                    <label className={styles.formLabel}>CONTACT NUMBER</label>
                    <input type="text" className={styles.formInput} value={contactNumber} onChange={e => setContactNumber(e.target.value)} />
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.btnGold} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={handleUpdateField}>Save</button>
                    <button className={styles.btnOutline} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <div className={styles.displayInfo}>
                    <span className={styles.displayLabel}>Contacts</span>
                    <div className={styles.displayValue}>Phone: {contactNumber}</div>
                    <div className={`${styles.displayValue} ${styles.subValue}`}>Email: {emailAddress}</div>
                  </div>
                  <button className={styles.btnEditSmall} onClick={() => startEdit('contacts')}>Edit</button>
                </div>
              )}

              {/* Department Row */}
              {editingField === 'department' ? (
                <div className={styles.editForm}>
                  <div className={styles.formGroup} style={{marginBottom: 0}}>
                    <label className={styles.formLabel}>DEPARTMENT / OFFICE</label>
                    <input type="text" className={styles.formInput} value={department} onChange={e => setDepartment(e.target.value)} />
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.btnGold} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={handleUpdateField}>Save</button>
                    <button className={styles.btnOutline} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <div className={styles.displayInfo}>
                    <span className={styles.displayLabel}>Department</span>
                    <span className={styles.displayValue}>{department}</span>
                  </div>
                  <button className={styles.btnEditSmall} onClick={() => startEdit('department')}>Edit</button>
                </div>
              )}

              {/* Password Row */}
              {editingField === 'password' ? (
                <div className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CURRENT PASSWORD</label>
                    <input type="password" className={styles.formInput} placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>NEW PASSWORD</label>
                    <input type="password" className={styles.formInput} placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                  <div className={styles.formGroup} style={{marginBottom: 0}}>
                    <label className={styles.formLabel}>CONFIRM NEW PASSWORD</label>
                    <input type="password" className={styles.formInput} placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                  <div className={styles.passwordRequirements}>
                    <p>Password must be at least 8 characters and include uppercase, lowercase, and a number.</p>
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.btnGold} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={handleUpdatePassword}>Update Password</button>
                    <button className={styles.btnOutline} style={{padding: '8px 16px', fontSize: '0.8rem'}} onClick={() => setEditingField(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <div className={styles.displayInfo}>
                    <span className={styles.displayLabel}>Security</span>
                    <span className={styles.displayValue}>Change Account Password</span>
                  </div>
                  <button className={styles.btnEditSmall} onClick={() => startEdit('password')}>Edit</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h4>System Appearance</h4>
            </div>
            <div className={styles.cardBody}>
              <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                Select the system color theme for the administration dashboard panels and logs.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => handleThemeChange('dark')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px 12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    cursor: 'pointer',
                    gap: '8px',
                    transition: 'all 0.2s',
                    background: theme === 'dark' ? 'rgba(200, 168, 75, 0.08)' : 'transparent',
                    borderColor: theme === 'dark' ? '#C8A84B' : 'var(--admin-border)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🌙</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme === 'dark' ? '#E2C97E' : 'var(--admin-text-main)' }}>Dark Mode</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>Original Theme</span>
                </button>

                <button
                  onClick={() => handleThemeChange('light')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px 12px',
                    borderRadius: '10px',
                    border: '1px solid',
                    cursor: 'pointer',
                    gap: '8px',
                    transition: 'all 0.2s',
                    background: theme === 'light' ? 'rgba(161, 98, 7, 0.08)' : 'transparent',
                    borderColor: theme === 'light' ? 'var(--admin-gold)' : 'var(--admin-border)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>☀️</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme === 'light' ? 'var(--admin-gold)' : 'var(--admin-text-main)' }}>Light Mode</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>Elegant Light</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h4>Active Sessions</h4>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.sessionItem}>
                <div className={styles.sessionDevice}>
                  <span className={styles.sessionIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
                  </span>
                  <div className={styles.sessionDetails}>
                    <h5>Chrome · Windows 11</h5>
                    <p>Current session: Jasaan, PH</p>
                  </div>
                </div>
                <span className={styles.sessionBadge}>Current</span>
              </div>

              <div className={styles.sessionItem}>
                <div className={styles.sessionDevice}>
                  <span className={styles.sessionIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                  </span>
                  <div className={styles.sessionDetails}>
                    <h5>Mobile · Android</h5>
                    <p>Feb 20, 2026 · Cagayan de Oro</p>
                  </div>
                </div>
                <button className={styles.btnOutline} style={{ padding: '4px 12px', fontSize: '0.7rem' }} onClick={() => alert('Session terminated')}>Terminate</button>
              </div>

              <div className={styles.sessionItem}>
                <div className={styles.sessionDevice}>
                  <span className={styles.sessionIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
                  </span>
                  <div className={styles.sessionDetails}>
                    <h5>Firefox · macOS</h5>
                    <p>Feb 18, 2026 · Manila, PH</p>
                  </div>
                </div>
                <button className={styles.btnOutline} style={{ padding: '4px 12px', fontSize: '0.7rem' }} onClick={() => alert('Session terminated')}>Terminate</button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h4>Quick Links</h4>
            </div>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className={styles.btnOutline} style={{ width: '100%', textAlign: 'left' }} onClick={() => alert('Navigating to Audit Log')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> View Audit Log
                  </span>
                </button>
                <button className={styles.btnOutline} style={{ width: '100%', textAlign: 'left' }} onClick={() => alert('Initializing Data Backup')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Backup Data
                  </span>
                </button>
                <button className={styles.btnOutline} style={{ width: '100%', textAlign: 'left' }} onClick={() => alert('Viewing System Logs')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> System Logs
                  </span>
                </button>
                <button className={styles.btnOutline} style={{ width: '100%', textAlign: 'left' }} onClick={() => alert('Navigating to Permission Settings')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Permission Settings
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
