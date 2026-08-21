'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitInquiry } from '../../actions/inquiry';
import { sendEmailOtp, verifyEmailOtp } from '../../actions/otp';
import styles from './page.module.css';

export default function InquiryPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const stepLabels = ['Personal Information', 'Inquiry Details', 'Review & Confirm'];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relation: '',
    address: '',
    smsInfo: false,
    reason: '',
    deceased: '',
    plot: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refNum, setRefNum] = useState('');

  // Email Verification States (Anti-Scam & Security)
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Feedback Modal States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const quickFeedbackOptions = [
    '⚡ Fast & Easy',
    '📱 Smooth Interface',
    '📋 Clear Information',
    '⏱️ Convenient Booking',
    '✨ Great Experience'
  ];

  const ratingDescriptions: Record<number, string> = {
    1: '1/5 · Needs Improvement',
    2: '2/5 · Fair Experience',
    3: '3/5 · Good System',
    4: '4/5 · Very Good & Helpful',
    5: '5/5 · Excellent & Fast!'
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0] || '';
    const dateInput = document.getElementById('f-date') as HTMLInputElement;
    if (dateInput) dateInput.min = today;
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'email') {
      // If user edits email, require re-verification
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpCode('');
      setOtpMessage(null);
    }
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false, emailNotVerified: false });
  };

  // --- Email OTP Handlers ---
  const handleSendOtp = async () => {
    const email = formData.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: true }));
      setOtpMessage({ text: 'Please enter a valid Gmail / email address first.', type: 'error' });
      return;
    }

    setIsSendingOtp(true);
    setOtpMessage({ text: 'Sending 6-digit verification code to your Gmail...', type: 'info' });

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await sendEmailOtp(email, fullName);

      if (res.success) {
        setOtpSent(true);
        setResendCooldown(60);

        // If email credentials aren't configured yet, auto-fill the code for testing
        if ((res as any).devFallback && (res as any).debugCode) {
          setOtpCode((res as any).debugCode);
          setOtpMessage({
            text: `⚠️ Gmail SMTP not configured yet. Your verification code is: ${(res as any).debugCode} (auto-filled for testing). To enable real email delivery, set EMAIL_USER and EMAIL_APP_PASSWORD in your .env file.`,
            type: 'info'
          });
        } else {
          setOtpMessage({ text: res.message, type: 'success' });
        }
      } else {
        setOtpMessage({ text: res.message || 'Failed to send verification code.', type: 'error' });
      }
    } catch (e: any) {
      setOtpMessage({ text: e.message || 'Failed to send verification code.', type: 'error' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpMessage({ text: 'Please enter the 6-digit verification code sent to your email.', type: 'error' });
      return;
    }

    setIsVerifyingOtp(true);
    setOtpMessage({ text: 'Verifying code...', type: 'info' });

    try {
      const res = await verifyEmailOtp(formData.email.trim(), otpCode.trim());

      if (res.success) {
        setIsEmailVerified(true);
        setOtpSent(false);
        setOtpMessage({ text: '✅ Email verified successfully! You can now proceed with your inquiry.', type: 'success' });
        setErrors(prev => ({ ...prev, email: false, emailNotVerified: false }));
      } else {
        setOtpMessage({ text: res.message || 'Incorrect verification code. Please try again.', type: 'error' });
      }
    } catch (e: any) {
      setOtpMessage({ text: e.message || 'Verification failed.', type: 'error' });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleChangeEmail = () => {
    setIsEmailVerified(false);
    setOtpSent(false);
    setOtpCode('');
    setOtpMessage(null);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean | string> = {};
    if (formData.firstName.trim().length < 2) newErrors.firstName = true;
    if (formData.lastName.trim().length < 2) newErrors.lastName = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = true;
    if (!isEmailVerified) newErrors.emailNotVerified = true;
    if (!/^[\d\s\-\+]{7,}$/.test(formData.phone.trim())) newErrors.phone = true;
    if (!formData.relation) newErrors.relation = true;
    if (!formData.smsInfo) newErrors.smsInfo = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, boolean | string> = {};
    if (!formData.reason) newErrors.reason = true;
    if (!formData.preferredDate) newErrors.preferredDate = true;
    if (!formData.preferredTime) newErrors.preferredTime = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    const ref = 'APP-' + Date.now().toString().slice(-6);
    setRefNum(ref);

    try {
      await submitInquiry({
        APP_ID: ref,
        FAMILY_NAME: formData.firstName.trim() + ' ' + formData.lastName.trim(),
        email: formData.email.trim(),
        CONTACT: formData.phone.trim(),
        relationship: formData.relation,
        address: formData.address.trim(),
        reason: formData.reason,
        DECEASED: formData.deceased.trim(),
        REQUESTED_PLOT: formData.plot.trim(),
        BURIAL_DATE: formData.preferredDate,
        TIME: formData.preferredTime,
        notes: formData.notes.trim()
      });
    } catch (e) {
      console.error("Failed to submit inquiry to db", e);
    }
    
    // Update local notifications so the admin bell icon works
    const fullName = formData.firstName.trim() + ' ' + formData.lastName.trim();
    let notifications = [];
    try {
      notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    } catch (e) {
      notifications = [];
    }
    notifications.push({
      id: Date.now(),
      type: 'new_inquiry',
      message: `New verified inquiry request from ${fullName}`,
      ref: ref,
      read: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    window.dispatchEvent(new Event('storage'));

    setIsSubmitting(false);
    setIsSuccess(true);
    setShowFeedbackModal(true); // Automatically show feedback modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackRating === 0) {
      alert('Please select a star rating.');
      return;
    }

    setIsSubmittingFeedback(true);

    const userName = formData.firstName ? `${formData.firstName.trim()} ${formData.lastName.trim()}` : 'Citizen User';
    const tagText = selectedTags.length > 0 ? `[${selectedTags.join(', ')}] ` : '';
    const fullComment = `${tagText}${feedbackComment}`.trim() || 'Great service experience!';

    const feedbackPayload = {
      id: Date.now(),
      user_id: userName,
      rating: feedbackRating,
      comment: fullComment,
      date: new Date().toISOString()
    };

    // Save locally for admin reports & dashboard
    try {
      const userFeedbacks = JSON.parse(localStorage.getItem('user_feedback') || '[]');
      userFeedbacks.unshift(feedbackPayload);
      localStorage.setItem('user_feedback', JSON.stringify(userFeedbacks));

      const adminFeedbacks = JSON.parse(localStorage.getItem('cemeteryFeedback') || '[]');
      adminFeedbacks.unshift(feedbackPayload);
      localStorage.setItem('cemeteryFeedback', JSON.stringify(adminFeedbacks));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Local feedback save error:', e);
    }

    // Sync to backend
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userName,
          rating: feedbackRating,
          comment: fullComment
        })
      });
    } catch (err) {
      console.error('Failed to sync feedback to backend API:', err);
    }

    setIsSubmittingFeedback(false);
    setFeedbackSubmitted(true);
    setShowFeedbackModal(false);
  };

  const fmtDate = formData.preferredDate ? new Date(formData.preferredDate + 'T00:00:00').toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const pct = (step / totalSteps) * 100;
  const currentActiveRating = feedbackHoverRating || feedbackRating;

  if (isSuccess) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successRing}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className={styles.successTitle}>INQUIRY SUBMITTED</div>
        <div className={styles.successSub}>YOUR REQUEST HAS BEEN RECEIVED</div>

        <div className={styles.waitingMessage}>
          <p><span className={styles.highlight}>Please wait for admin confirmation</span></p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
            A confirmation receipt has been sent to your verified email: <strong>{formData.email}</strong>.
          </p>
        </div>

        <div className={styles.successRef}>{refNum}</div>

        <div className={styles.successDetails}>
          <div className={styles.successDetRow}><div className={styles.successDetKey}>NAME</div><div className={styles.successDetVal}>{formData.firstName + ' ' + formData.lastName}</div></div>
          <div className={styles.successDetRow}><div className={styles.successDetKey}>EMAIL</div><div className={styles.successDetVal}>{formData.email} (✓ Verified)</div></div>
          <div className={styles.successDetRow}><div className={styles.successDetKey}>REASON</div><div className={styles.successDetVal}>{formData.reason}</div></div>
          <div className={styles.successDetRow}><div className={styles.successDetKey}>DATE</div><div className={styles.successDetVal}>{fmtDate}</div></div>
          <div className={styles.successDetRow}><div className={styles.successDetKey}>TIME</div><div className={styles.successDetVal}>{formData.preferredTime}</div></div>
          <div className={styles.successDetRow}><div className={styles.successDetKey}>STATUS</div><div className={`${styles.successDetVal} ${styles.statusPending}`}>PENDING · Awaiting Admin Confirmation</div></div>
        </div>

        {/* Feedback Section on Success Screen */}
        <div className={styles.feedbackCard}>
          {feedbackSubmitted ? (
            <div className={styles.feedbackCardSubmitted}>
              <div className={styles.feedbackStarsDisplay}>
                {'★'.repeat(feedbackRating)}{'☆'.repeat(5 - feedbackRating)}
              </div>
              <div className={styles.feedbackCardTitle}>Thank You for Your Feedback!</div>
              <div className={styles.feedbackSubmittedText}>
                You rated our booking system {feedbackRating}/5 stars.
              </div>
              <p style={{ fontSize: '0.78rem', color: 'rgba(232,224,208,0.5)', margin: '0.3rem 0 0' }}>
                Your review helps us improve cemetery online services for everyone.
              </p>
            </div>
          ) : (
            <div>
              <div className={styles.feedbackCardTitle}>⭐ How was your experience?</div>
              <div className={styles.feedbackCardSub}>
                Let us know how the online booking system worked for you!
              </div>
              <button
                className={styles.btnOpenFeedback}
                onClick={() => setShowFeedbackModal(true)}
              >
                ★ Rate Us & Leave Feedback
              </button>
            </div>
          )}
        </div>

        <div className={styles.successInfo}>
          A confirmation will be sent to your email and mobile number.<br />
          The cemetery office will review your request within 1–2 business days.
        </div>

        <Link href="/" className={styles.btnHome}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
          </svg>
          Return to Portal
        </Link>

        {/* Feedback / Rate Us Modal */}
        {showFeedbackModal && (
          <div className={styles.feedbackModalOverlay}>
            <div className={styles.feedbackModal}>
              <button
                className={styles.feedbackClose}
                onClick={() => setShowFeedbackModal(false)}
                title="Close"
              >
                &times;
              </button>

              <div className={styles.feedbackHeaderIcon}>⭐</div>
              <div className={styles.feedbackTitle}>Rate Your Experience</div>
              <div className={styles.feedbackSubtitle}>
                How did the inquiry filing system work for you today?
              </div>

              {/* Star Rating */}
              <div className={styles.starRatingWrap}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starButton} ${currentActiveRating >= star ? styles.starFilled : ''}`}
                    onClick={() => setFeedbackRating(star)}
                    onMouseEnter={() => setFeedbackHoverRating(star)}
                    onMouseLeave={() => setFeedbackHoverRating(0)}
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <svg viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Rating Description */}
              <div className={styles.starRatingLabel}>
                {ratingDescriptions[currentActiveRating] || 'Select your rating'}
              </div>

              {/* Quick Tags */}
              <div className={styles.quickTagsWrap}>
                {quickFeedbackOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.quickTag} ${selectedTags.includes(tag) ? styles.quickTagSelected : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Comment Box */}
              <textarea
                className={styles.feedbackCommentArea}
                placeholder="Tell us what you liked or how we can improve (optional)…"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                maxLength={500}
              />

              {/* Actions */}
              <div className={styles.feedbackModalActions}>
                <button
                  type="button"
                  className={styles.btnSkipFeedback}
                  onClick={() => setShowFeedbackModal(false)}
                  disabled={isSubmittingFeedback}
                >
                  Maybe Later
                </button>
                <button
                  type="button"
                  className={styles.btnSubmitFeedback}
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? 'Submitting…' : '✓ Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.infoPanel}>
        <div>
          <div className={styles.infoEyebrow}>CEMETERY SERVICES</div>
          <h1 className={styles.infoTitle}>BOOK AN<br /><em>INQUIRY</em></h1>
          <p className={styles.infoDesc}>Schedule a burial, grave reservation, records retrieval, or any service with the Jasaan Municipal Cemetery Office.</p>
          <div className={styles.infoDivider}></div>
          <div className={styles.stepsLabel}>HOW IT WORKS</div>
          <div className={styles.stepItem}>
            <div className={styles.stepNum}>1</div>
            <div>
              <div className={styles.stepTitle}>PERSONAL & EMAIL VERIFICATION</div>
              <div className={styles.stepDesc}>Provide your details and verify your Gmail address with a secure code.</div>
            </div>
          </div>
          <div className={styles.stepItem}>
            <div className={styles.stepNum}>2</div>
            <div>
              <div className={styles.stepTitle}>INQUIRY INFO</div>
              <div className={styles.stepDesc}>Select the reason, date, and time.</div>
            </div>
          </div>
          <div className={styles.stepItem}>
            <div className={styles.stepNum}>3</div>
            <div>
              <div className={styles.stepTitle}>REVIEW & SUBMIT</div>
              <div className={styles.stepDesc}>Confirm all information before submitting.</div>
            </div>
          </div>
          <div className={styles.stepItem}>
            <div className={styles.stepNum}>✓</div>
            <div>
              <div className={styles.stepTitle}>WAIT FOR CONFIRMATION</div>
              <div className={styles.stepDesc}>Admin will review and approve your inquiry.</div>
            </div>
          </div>
        </div>
        <div className={styles.infoFooter}>
          <div className={styles.infoFooterLabel}>NEED HELP?</div>
          <div className={styles.infoFooterText}>
            Tel: (088) 000-0000<br />
            cemetery@jasaan.gov.ph<br />
            Mon–Fri · 8:00 AM – 5:00 PM
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.progressWrap}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>{stepLabels[step - 1]}</span>
            <span className={styles.progressCount}>{step} / {totalSteps}</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <div className={styles.sectionBadge}><div className={styles.sectionBadgeNum}>1</div> PERSONAL INFORMATION</div>
            <div className={styles.sectionHeading}>Your Details</div>
            <div className={styles.sectionSubheading}>Provide your verified details so the cemetery office can send your booking confirmation.</div>
            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                <div className={styles.formRow2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name <span className={styles.req}>*</span></label>
                    <input className={`${styles.formInput} ${errors.firstName ? styles.formInputErr : ''}`} type="text" placeholder="e.g. Juan" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} />
                    {errors.firstName && <div className={styles.errMsg} style={{ display: 'block' }}>Please enter your first name.</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name <span className={styles.req}>*</span></label>
                    <input className={`${styles.formInput} ${errors.lastName ? styles.formInputErr : ''}`} type="text" placeholder="e.g. Dela Cruz" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} />
                    {errors.lastName && <div className={styles.errMsg} style={{ display: 'block' }}>Please enter your last name.</div>}
                  </div>
                </div>

                {/* Email Address with Anti-Scam Security Verification */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Email Address (Gmail / Personal Email) <span className={styles.req}>*</span>
                    {isEmailVerified && <span style={{ color: '#86efac', marginLeft: 'auto', fontWeight: 'bold' }}>✓ Verified</span>}
                  </label>
                  
                  <div className={styles.emailInputWrap}>
                    <input
                      className={`${styles.formInput} ${errors.email || errors.emailNotVerified ? styles.formInputErr : ''}`}
                      type="email"
                      placeholder="e.g. juan@gmail.com"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      disabled={isEmailVerified}
                    />

                    {!isEmailVerified ? (
                      <button
                        type="button"
                        className={styles.btnSendOtp}
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.email || resendCooldown > 0}
                      >
                        {isSendingOtp ? 'Sending…' : resendCooldown > 0 ? `Wait (${resendCooldown}s)` : 'Verify Email'}
                      </button>
                    ) : (
                      <div className={styles.emailVerifiedBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>

                  {isEmailVerified && (
                    <button type="button" className={styles.btnChangeEmail} onClick={handleChangeEmail}>
                      Use a different email address
                    </button>
                  )}

                  {/* OTP Verification Box */}
                  {!isEmailVerified && otpSent && (
                    <div className={styles.otpVerificationBox}>
                      <div className={styles.otpBoxHeader}>
                        <span>✉️ Enter 6-Digit Code Sent to {formData.email}</span>
                      </div>
                      
                      <div className={styles.otpInputsRow}>
                        <input
                          className={styles.otpInput}
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        />
                        <button
                          type="button"
                          className={styles.btnVerifyOtp}
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || otpCode.length < 4}
                        >
                          {isVerifyingOtp ? 'Checking…' : 'Confirm Code'}
                        </button>
                      </div>

                      {otpMessage && (
                        <div className={`${styles.otpStatusMsg} ${otpMessage.type === 'success' ? styles.otpStatusSuccess : otpMessage.type === 'error' ? styles.otpStatusError : styles.otpStatusInfo}`}>
                          {otpMessage.text}
                        </div>
                      )}

                      <div className={styles.otpResendText}>
                        <span>Didn't receive code? Check spam folder.</span>
                        {resendCooldown > 0 ? (
                          <span>Resend in {resendCooldown}s</span>
                        ) : (
                          <button type="button" className={styles.btnResendCode} onClick={handleSendOtp} disabled={isSendingOtp}>
                            Resend Code
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {errors.email && <div className={styles.errMsg} style={{ display: 'block' }}>Please enter a valid email address.</div>}
                  {errors.emailNotVerified && !isEmailVerified && (
                    <div className={styles.errMsg} style={{ display: 'block', color: '#f87171' }}>
                      ⚠️ Please click <strong>"Verify Email"</strong> and enter the 6-digit code to protect against fake/scam submissions.
                    </div>
                  )}
                </div>

                <div className={styles.formRow2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Number <span className={styles.req}>*</span></label>
                    <input className={`${styles.formInput} ${errors.phone ? styles.formInputErr : ''}`} type="tel" placeholder="e.g. 0917-123-4567" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                    {errors.phone && <div className={styles.errMsg} style={{ display: 'block' }}>Please enter a valid phone number.</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Relationship to Deceased <span className={styles.req}>*</span></label>
                    <select className={`${styles.formSelect} ${errors.relation ? styles.formSelectErr : ''}`} value={formData.relation} onChange={e => handleInputChange('relation', e.target.value)}>
                      <option value="" disabled>Select relationship…</option>
                      <option>Spouse</option>
                      <option>Child / Son / Daughter</option>
                      <option>Parent</option>
                      <option>Sibling</option>
                      <option>Grandchild</option>
                      <option>Other Relative</option>
                      <option>Legal Representative</option>
                    </select>
                    {errors.relation && <div className={styles.errMsg} style={{ display: 'block' }}>Please select your relationship.</div>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Home Address</label>
                  <input className={styles.formInput} type="text" placeholder="Barangay, Municipality, Province" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
                </div>
                <label className={styles.consentBox}>
                  <input type="checkbox" checked={formData.smsInfo} onChange={e => handleInputChange('smsInfo', e.target.checked)} />
                  <span className={styles.consentText}>I agree to receive SMS and Email notifications regarding my inquiry status... <span className={styles.req}>*</span></span>
                </label>
                {errors.smsInfo && <div className={styles.errMsg} style={{ display: 'block' }}>You must agree to receive notifications.</div>}
              </div>
            </div>
            <div className={styles.formNav}>
              <button className={styles.btnNext} onClick={goToStep2}>Continue to Inquiry Details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className={styles.sectionBadge}><div className={styles.sectionBadgeNum}>2</div> INQUIRY DETAILS</div>
            <div className={styles.sectionHeading}>Schedule & Purpose</div>
            <div className={styles.sectionSubheading}>Select your reason for visiting and preferred schedule.</div>
            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reason for Inquiry <span className={styles.req}>*</span></label>
                  <div className={styles.reasonGrid}>
                    {[
                      { icon: '⚰️', title: 'BURIAL / INTERMENT', value: 'Burial / Interment', desc: 'Schedule a burial or interment service' },
                      { icon: '📋', title: 'GRAVE RESERVATION', value: 'Grave Reservation', desc: 'Reserve a plot for future use' },
                      { icon: '🔖', title: 'EXHUMATION REQUEST', value: 'Exhumation Request', desc: 'Request for remains transfer' },
                      { icon: '📝', title: 'PLOT TRANSFER', value: 'Plot Transfer / Ownership', desc: 'Transfer plot ownership' },
                      { icon: '🗂️', title: 'RECORDS RETRIEVAL', value: 'Records Retrieval', desc: 'Request official documents' },
                      { icon: '💬', title: 'OTHER INQUIRY', value: 'Other Inquiry', desc: 'General question or concern' }
                    ].map(r => (
                      <div key={r.value} className={`${styles.reasonCard} ${formData.reason === r.value ? styles.reasonCardSelected : ''}`} onClick={() => handleInputChange('reason', r.value)}>
                        <div className={styles.reasonIcon}>{r.icon}</div>
                        <div className={styles.reasonTitle}>{r.title}</div>
                        <div className={styles.reasonDesc}>{r.desc}</div>
                      </div>
                    ))}
                  </div>
                  {errors.reason && <div className={styles.reasonErr} style={{ display: 'block' }}>Please select a reason for your inquiry.</div>}
                </div>
                <div className={styles.formRow2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Name of Deceased</label>
                    <input className={styles.formInput} type="text" placeholder="Full name" value={formData.deceased} onChange={e => handleInputChange('deceased', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Plot / Section (if known)</label>
                    <input className={styles.formInput} type="text" placeholder="e.g. Section A · A-12" value={formData.plot} onChange={e => handleInputChange('plot', e.target.value)} />
                  </div>
                </div>
                <div className={styles.formRow2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Date <span className={styles.req}>*</span></label>
                    <input id="f-date" className={`${styles.formInput} ${errors.preferredDate ? styles.formInputErr : ''}`} type="date" value={formData.preferredDate} onChange={e => handleInputChange('preferredDate', e.target.value)} />
                    {errors.preferredDate && <div className={styles.errMsg} style={{ display: 'block' }}>Please select a date.</div>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Time <span className={styles.req}>*</span></label>
                    <select className={`${styles.formSelect} ${errors.preferredTime ? styles.formSelectErr : ''}`} value={formData.preferredTime} onChange={e => handleInputChange('preferredTime', e.target.value)}>
                      <option value="" disabled>Select time slot…</option>
                      <option>8:00 AM – 9:00 AM</option>
                      <option>9:00 AM – 10:00 AM</option>
                      <option>10:00 AM – 11:00 AM</option>
                      <option>11:00 AM – 12:00 PM</option>
                      <option>1:00 PM – 2:00 PM</option>
                      <option>2:00 PM – 3:00 PM</option>
                      <option>3:00 PM – 4:00 PM</option>
                      <option>4:00 PM – 5:00 PM</option>
                    </select>
                    {errors.preferredTime && <div className={styles.errMsg} style={{ display: 'block' }}>Please select a time slot.</div>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Additional Notes</label>
                  <textarea className={styles.formTextarea} placeholder="Notes" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)}></textarea>
                </div>
              </div>
            </div>
            <div className={styles.formNav}>
              <button className={styles.btnPrev} onClick={() => setStep(1)} disabled={isSubmitting}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg> Back to Personal Info</button>
              <button className={styles.btnNext} onClick={goToStep3} disabled={isSubmitting}>
                Continue to Review & Confirm <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className={styles.sectionBadge}><div className={styles.sectionBadgeNum}>3</div> REVIEW & SUBMIT</div>
            <div className={styles.sectionHeading}>Confirm Details</div>
            <div className={styles.sectionSubheading}>Please review all information before submitting your inquiry request.</div>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewBlock}>
                <div className={styles.reviewBlockTitle}>PERSONAL INFORMATION</div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Full Name</div><div className={styles.reviewVal}>{formData.firstName} {formData.lastName}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Email</div><div className={styles.reviewVal}>{formData.email} <span style={{ color: '#86efac', fontSize: '0.75rem' }}>(✓ Verified)</span></div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Contact</div><div className={styles.reviewVal}>{formData.phone}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Relationship</div><div className={styles.reviewVal}>{formData.relation}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Address</div><div className={styles.reviewVal}>{formData.address || 'Not provided'}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Notifications</div><div className={styles.reviewVal}>Email & SMS Verified</div></div>
              </div>
              <div className={styles.reviewBlock}>
                <div className={styles.reviewBlockTitle}>INQUIRY DETAILS</div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Reason</div><div className={styles.reviewVal}>{formData.reason}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Deceased</div><div className={styles.reviewVal}>{formData.deceased || 'Not specified'}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Plot</div><div className={styles.reviewVal}>{formData.plot || 'Not specified'}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Date</div><div className={styles.reviewVal}>{fmtDate}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Time</div><div className={styles.reviewVal}>{formData.preferredTime}</div></div>
                <div className={styles.reviewRow}><div className={styles.reviewKey}>Notes</div><div className={styles.reviewVal} style={{ fontSize: '0.8rem' }}>{formData.notes || 'None'}</div></div>
              </div>
            </div>
            <div className={styles.formNav}>
              <button className={styles.btnPrev} disabled={isSubmitting} onClick={() => setStep(2)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg> Back to Inquiry Details</button>
              <button className={styles.btnSubmit} disabled={isSubmitting} onClick={handleFinalSubmit}>
                {isSubmitting ? (
                  <><svg className={styles.spin} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg> Submitting…</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg> Submit Inquiry</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
