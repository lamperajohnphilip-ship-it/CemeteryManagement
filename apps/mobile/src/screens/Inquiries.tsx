import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { themeColors, Theme } from '../../App';

interface ScreenProps {
  baseUrl: string;
  theme?: Theme;
}

export default function Inquiries({ baseUrl, theme = 'dark' }: ScreenProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
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
    preferredDate: '', // Format: YYYY-MM-DD
    preferredTime: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refNum, setRefNum] = useState('');

  // OTP Email Verification States (Mobile View)
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    const email = formData.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: true }));
      setOtpMessage({ text: 'Please enter a valid email address first.', type: 'error' });
      return;
    }

    setIsSendingOtp(true);
    setOtpMessage({ text: 'Sending 6-digit verification code to your Gmail…', type: 'info' });

    try {
      const applicantName = `${formData.firstName} ${formData.lastName}`.trim() || undefined;
      const res = await fetch(`${baseUrl}/api/email/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: applicantName }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setResendCooldown(45);
        setOtpMessage({
          text: data.message || `A 6-digit verification code has been sent to ${email}. Check your inbox and spam folder.`,
          type: 'success',
        });
      } else {
        setOtpMessage({
          text: data.message || 'Failed to send verification code. Please check your email.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setOtpMessage({
        text: err?.message || 'Error communicating with verification service.',
        type: 'error',
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const email = formData.email.trim();
    const cleanCode = otpCode.trim().replace(/\s+/g, '');

    if (!cleanCode || cleanCode.length !== 6) {
      setOtpMessage({ text: 'Please enter the 6-digit verification code.', type: 'error' });
      return;
    }

    setIsVerifyingOtp(true);
    setOtpMessage({ text: 'Verifying code…', type: 'info' });

    try {
      const res = await fetch(`${baseUrl}/api/email/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: cleanCode }),
      });
      const data = await res.json();

      if (data.success) {
        setIsEmailVerified(true);
        setOtpMessage({
          text: '✅ Email verified successfully! You can now proceed with your inquiry.',
          type: 'success',
        });
        setErrors(prev => ({ ...prev, email: false, emailNotVerified: false }));
      } else {
        setOtpMessage({
          text: data.message || 'Incorrect verification code. Please try again.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setOtpMessage({
        text: err?.message || 'Error verifying code. Please try again.',
        type: 'error',
      });
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

  // Feedback states on inquiry finish
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const quickFeedbackOptions = [
    'Fast & Easy',
    'Clear Instructions',
    'Helpful Support',
    'Smooth Booking'
  ];

  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const relationships = [
    'Spouse',
    'Child / Son / Daughter',
    'Parent',
    'Sibling',
    'Grandchild',
    'Other Relative',
    'Legal Representative'
  ];

  const timeSlots = [
    '8:00 AM – 9:00 AM',
    '9:00 AM – 10:00 AM',
    '10:00 AM – 11:00 AM',
    '11:00 AM – 12:00 PM',
    '1:00 PM – 2:00 PM',
    '2:00 PM – 3:00 PM',
    '3:00 PM – 4:00 PM',
    '4:00 PM – 5:00 PM'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field === 'email') {
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpCode('');
      setOtpMessage(null);
    }
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false, emailNotVerified: false });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) newErrors.firstName = true;
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) newErrors.lastName = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = true;
    if (!/^[\d\s\-\+]{7,}$/.test(formData.phone.trim())) newErrors.phone = true;
    if (!formData.relation) newErrors.relation = true;
    if (!formData.smsInfo) newErrors.smsInfo = true;
    if (!isEmailVerified) {
      newErrors.emailNotVerified = true;
      setOtpMessage({
        text: 'Please verify your email address with the 6-digit code before proceeding.',
        type: 'error',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.reason) newErrors.reason = true;
    if (!formData.preferredDate.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(formData.preferredDate.trim())) newErrors.preferredDate = true;
    if (!formData.preferredTime) newErrors.preferredTime = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const ref = 'APP-' + Date.now().toString().slice(-6);
    setRefNum(ref);

    try {
      const response = await fetch(`${baseUrl}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          APP_ID: ref,
          FAMILY_NAME: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email,
          CONTACT: formData.phone,
          relationship: formData.relation,
          address: formData.address,
          reason: formData.reason,
          DECEASED: formData.deceased,
          REQUESTED_PLOT: formData.plot,
          BURIAL_DATE: formData.preferredDate,
          TIME: formData.preferredTime,
          notes: formData.notes
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert('Failed to submit inquiry: ' + (result.message || 'Unknown error'));
      }
    } catch (e) {
      console.error('Inquiry submit error on mobile:', e);
      alert('Failed to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeedbackTag = (tag: string) => {
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
    const userName = `${formData.firstName.trim()} ${formData.lastName.trim()}` || 'Citizen User';
    const tagText = selectedTags.length > 0 ? `[${selectedTags.join(', ')}] ` : '';
    const fullComment = `${tagText}${feedbackComment}`.trim() || 'Great service experience!';

    try {
      await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userName,
          rating: feedbackRating,
          comment: fullComment,
        }),
      });
    } catch (err) {
      console.error('Error syncing feedback on mobile:', err);
    } finally {
      setIsSubmittingFeedback(false);
      setFeedbackSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setFeedbackRating(5);
    setFeedbackComment('');
    setSelectedTags([]);
    setFeedbackSubmitted(false);
    setIsEmailVerified(false);
    setOtpSent(false);
    setOtpCode('');
    setOtpMessage(null);
    setResendCooldown(0);
    setStep(1);
    setIsSuccess(false);
  };

  const progressPercent = (step / totalSteps) * 100;

  if (isSuccess) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.appBg }]} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.successCard, { backgroundColor: colors.cardBg, borderColor: colors.gold }]}>
          <View style={[styles.successRing, { borderColor: colors.gold }]}>
            <Text style={[styles.successRingCheck, { color: colors.gold }]}>✓</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>INQUIRY SUBMITTED</Text>
          <Text style={[styles.successSub, { color: colors.textMuted }]}>YOUR REQUEST HAS BEEN RECEIVED</Text>

          <View style={[styles.waitingMessage, { backgroundColor: colors.appBg, borderColor: colors.goldBorder }]}>
            <Text style={[styles.waitingHighlight, { color: colors.gold }]}>Please wait for admin confirmation</Text>
            <Text style={[styles.waitingDesc, { color: colors.boneMuted }]}>You will receive a notification once your inquiry is confirmed.</Text>
          </View>

          <Text style={[styles.successRef, { color: colors.gold, backgroundColor: colors.goldHover }]}>{refNum}</Text>

          <View style={[styles.successDetails, { backgroundColor: colors.appBg }]}>
            <View style={styles.successDetRow}>
              <Text style={styles.successDetKey}>NAME</Text>
              <Text style={[styles.successDetVal, { color: colors.text }]}>{`${formData.firstName} ${formData.lastName}`}</Text>
            </View>
            <View style={styles.successDetRow}>
              <Text style={styles.successDetKey}>EMAIL</Text>
              <Text style={[styles.successDetVal, { color: colors.text }]}>{formData.email}</Text>
            </View>
            <View style={styles.successDetRow}>
              <Text style={styles.successDetKey}>CATEGORY</Text>
              <Text style={[styles.successDetVal, { color: colors.text }]}>{formData.reason}</Text>
            </View>
            <View style={styles.successDetRow}>
              <Text style={styles.successDetKey}>DATE</Text>
              <Text style={[styles.successDetVal, { color: colors.text }]}>{formData.preferredDate}</Text>
            </View>
            <View style={styles.successDetRow}>
              <Text style={styles.successDetKey}>TIME</Text>
              <Text style={[styles.successDetVal, { color: colors.text }]}>{formData.preferredTime}</Text>
            </View>
            <View style={styles.successDetRow}>
              <Text style={styles.successDetKey}>STATUS</Text>
              <Text style={[styles.successDetVal, { color: '#facc15', fontWeight: 'bold' }]}>PENDING</Text>
            </View>
          </View>

          {/* Inquiry Completion User Feedback Section */}
          <View style={[styles.feedbackBox, { backgroundColor: colors.appBg, borderColor: colors.goldBorder }]}>
            {feedbackSubmitted ? (
              <View style={styles.feedbackSubmittedBox}>
                <Text style={styles.feedbackSubmittedStars}>{'★'.repeat(feedbackRating)}{'☆'.repeat(5 - feedbackRating)}</Text>
                <Text style={[styles.feedbackSubmittedTitle, { color: colors.gold }]}>Thank You for Your Feedback!</Text>
                <Text style={[styles.feedbackSubmittedDesc, { color: colors.boneMuted }]}>
                  You rated our booking service {feedbackRating}/5 stars. Your review helps us improve cemetery online services for everyone.
                </Text>
              </View>
            ) : (
              <View>
                <Text style={[styles.feedbackTitle, { color: colors.gold }]}>⭐ Rate Your Experience</Text>
                <Text style={[styles.feedbackSub, { color: colors.boneMuted }]}>How was your inquiry booking process?</Text>

                {/* Stars */}
                <View style={styles.feedbackStarsRow}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity
                      key={star}
                      style={styles.feedbackStarBtn}
                      onPress={() => setFeedbackRating(star)}
                    >
                      <Text style={[styles.feedbackStarText, feedbackRating >= star && styles.feedbackStarActive]}>
                        ⭐
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quick Tags */}
                <View style={styles.feedbackTagsRow}>
                  {quickFeedbackOptions.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.feedbackTag,
                          { backgroundColor: colors.cardBg, borderColor: colors.divider },
                          isSelected && [styles.feedbackTagSelected, { borderColor: colors.gold, backgroundColor: colors.goldHover || 'rgba(200, 168, 75, 0.15)' }]
                        ]}
                        onPress={() => toggleFeedbackTag(tag)}
                      >
                        <Text style={[
                          styles.feedbackTagText,
                          { color: colors.boneMuted },
                          isSelected && [styles.feedbackTagTextSelected, { color: colors.gold }]
                        ]}>
                          {isSelected ? '✓ ' : ''}{tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Comment Input */}
                <TextInput
                  style={[styles.feedbackInput, { backgroundColor: colors.cardBg, borderColor: colors.inputBorder, color: colors.text }]}
                  placeholder="Additional thoughts or suggestions? (optional)"
                  placeholderTextColor={colors.boneDim}
                  value={feedbackComment}
                  onChangeText={setFeedbackComment}
                  multiline={true}
                  numberOfLines={2}
                />

                {/* Submit Feedback Button */}
                <TouchableOpacity
                  style={[styles.feedbackSubmitBtn, { backgroundColor: colors.gold }]}
                  onPress={handleFeedbackSubmit}
                  disabled={isSubmittingFeedback}
                >
                  <Text style={[styles.feedbackSubmitBtnText, { color: colors.stone }]}>
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={[styles.successInfo, { color: colors.boneMuted }]}>
            A confirmation will be sent to your email and mobile number. The cemetery office will review your request within 1–2 business days.
          </Text>

          <TouchableOpacity style={[styles.btnHome, { borderColor: colors.gold }]} onPress={resetForm}>
            <Text style={[styles.btnHomeText, { color: colors.gold }]}>Return to Form</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.appBg }]} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      {/* Progress Tracker */}
      <View style={styles.progressWrap}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.text }]}>{stepLabels[step - 1]}</Text>
          <Text style={[styles.progressCount, { color: colors.gold }]}>{step} / {totalSteps}</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
          <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: colors.gold }]} />
        </View>
      </View>

      {/* Step 1 */}
      {step === 1 && (
        <View style={styles.formPanel}>
          <View style={styles.sectionBadge}>
            <Text style={[styles.sectionBadgeNum, { backgroundColor: colors.gold, color: colors.stone }]}>1</Text>
            <Text style={[styles.sectionBadgeText, { color: colors.gold }]}>PERSONAL INFORMATION</Text>
          </View>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Your Details</Text>
          <Text style={[styles.sectionSubheading, { color: colors.boneMuted }]}>Tell us who you are so we can follow up on your inquiry.</Text>

          <View style={[styles.formCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>First Name <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }, errors.firstName && styles.formInputErr]}
                placeholder="e.g. Juan"
                placeholderTextColor={colors.boneDim}
                value={formData.firstName}
                onChangeText={(val) => handleInputChange('firstName', val)}
              />
              {errors.firstName && <Text style={styles.errMsg}>Please enter your first name.</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Last Name <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }, errors.lastName && styles.formInputErr]}
                placeholder="e.g. Dela Cruz"
                placeholderTextColor={colors.boneDim}
                value={formData.lastName}
                onChangeText={(val) => handleInputChange('lastName', val)}
              />
              {errors.lastName && <Text style={styles.errMsg}>Please enter your last name.</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.formLabel, { color: colors.textMuted }]}>
                  Email Address <Text style={[styles.req, { color: colors.gold }]}>*</Text>
                </Text>
                {isEmailVerified && (
                  <Text style={styles.verifiedHeaderBadge}>✓ Verified</Text>
                )}
              </View>

              <View style={styles.emailRow}>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text, flex: 1, marginBottom: 0 },
                    (errors.email || errors.emailNotVerified) && styles.formInputErr,
                    isEmailVerified && { opacity: 0.7 }
                  ]}
                  placeholder="e.g. juan@gmail.com"
                  placeholderTextColor={colors.boneDim}
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(val) => handleInputChange('email', val)}
                  autoCapitalize="none"
                  editable={!isEmailVerified}
                />

                {!isEmailVerified ? (
                  <TouchableOpacity
                    style={[
                      styles.btnVerifyAction,
                      { backgroundColor: colors.gold },
                      (isSendingOtp || !formData.email || resendCooldown > 0) && styles.btnDisabled
                    ]}
                    onPress={handleSendOtp}
                    disabled={isSendingOtp || !formData.email || resendCooldown > 0}
                    activeOpacity={0.8}
                  >
                    {isSendingOtp ? (
                      <ActivityIndicator size="small" color={colors.stone} />
                    ) : (
                      <Text style={[styles.btnVerifyActionText, { color: colors.stone }]}>
                        {resendCooldown > 0 ? `Wait (${resendCooldown}s)` : otpSent ? 'Resend' : 'Verify'}
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btnChangeEmail} onPress={handleChangeEmail}>
                    <Text style={[styles.btnChangeEmailText, { color: colors.gold }]}>Change</Text>
                  </TouchableOpacity>
                )}
              </View>

              {errors.email && <Text style={styles.errMsg}>Please enter a valid email address.</Text>}
              {errors.emailNotVerified && !isEmailVerified && (
                <Text style={styles.errMsg}>Please verify your email before proceeding.</Text>
              )}

              {/* OTP Message Banner */}
              {otpMessage && (
                <View style={[
                  styles.otpBanner,
                  otpMessage.type === 'success' && styles.otpBannerSuccess,
                  otpMessage.type === 'error' && styles.otpBannerError,
                  otpMessage.type === 'info' && styles.otpBannerInfo,
                ]}>
                  <Text style={[
                    styles.otpBannerText,
                    otpMessage.type === 'success' && { color: '#86efac' },
                    otpMessage.type === 'error' && { color: '#fca5a5' },
                    otpMessage.type === 'info' && { color: '#fde047' },
                  ]}>
                    {otpMessage.text}
                  </Text>
                </View>
              )}

              {/* OTP Input Card */}
              {!isEmailVerified && otpSent && (
                <View style={[styles.otpCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
                  <Text style={[styles.otpCardTitle, { color: colors.gold }]}>✉️ Enter 6-Digit Code</Text>
                  <Text style={[styles.otpCardDesc, { color: colors.boneMuted }]}>
                    Check your Gmail inbox or spam folder for your 6-digit verification code.
                  </Text>
                  <View style={styles.otpInputRow}>
                    <TextInput
                      style={[styles.otpDigitInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }]}
                      placeholder="123456"
                      placeholderTextColor={colors.boneDim}
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otpCode}
                      onChangeText={(val) => setOtpCode(val.replace(/\D/g, ''))}
                    />
                    <TouchableOpacity
                      style={[
                        styles.btnSubmitOtp,
                        { backgroundColor: colors.gold },
                        (isVerifyingOtp || otpCode.length !== 6) && styles.btnDisabled
                      ]}
                      onPress={handleVerifyOtp}
                      disabled={isVerifyingOtp || otpCode.length !== 6}
                      activeOpacity={0.8}
                    >
                      {isVerifyingOtp ? (
                        <ActivityIndicator size="small" color={colors.stone} />
                      ) : (
                        <Text style={[styles.btnSubmitOtpText, { color: colors.stone }]}>Confirm</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Contact Number <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }, errors.phone && styles.formInputErr]}
                placeholder="e.g. 09171234567"
                placeholderTextColor={colors.boneDim}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(val) => handleInputChange('phone', val)}
              />
              {errors.phone && <Text style={styles.errMsg}>Please enter a valid contact number.</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Relationship to Deceased <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
              <TouchableOpacity
                style={[styles.dropdownTrigger, { backgroundColor: colors.appBg, borderColor: colors.inputBorder }, errors.relation && styles.dropdownTriggerErr]}
                onPress={() => setShowRelationDropdown(!showRelationDropdown)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownTriggerText, { color: colors.text }, !formData.relation && { color: colors.boneDim }]}>
                  {formData.relation || 'Select relationship...'}
                </Text>
                <Text style={[styles.dropdownTriggerArrow, { color: colors.gold }]}>▼</Text>
              </TouchableOpacity>

              {showRelationDropdown && (
                <View style={[styles.dropdownContainer, { backgroundColor: colors.appBg, borderColor: colors.goldBorder }]}>
                  {relationships.map((rel) => (
                    <TouchableOpacity
                      key={rel}
                      style={[styles.dropdownItem, { borderBottomColor: colors.divider }]}
                      onPress={() => {
                        handleInputChange('relation', rel);
                        setShowRelationDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.text }]}>{rel}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.relation && <Text style={styles.errMsg}>Please select your relationship.</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Home Address</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="Barangay, Municipality, Province"
                placeholderTextColor={colors.boneDim}
                value={formData.address}
                onChangeText={(val) => handleInputChange('address', val)}
              />
            </View>

            <TouchableOpacity
              style={styles.consentBox}
              onPress={() => handleInputChange('smsInfo', !formData.smsInfo)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, { borderColor: colors.gold }, formData.smsInfo && { backgroundColor: colors.gold }]}>
                {formData.smsInfo && <Text style={[styles.checkboxCheck, { color: colors.stone }]}>✓</Text>}
              </View>
              <Text style={[styles.consentText, { color: colors.boneMuted }]}>
                I agree to receive SMS notifications regarding my inquiry status. <Text style={[styles.req, { color: colors.gold }]}>*</Text>
              </Text>
            </TouchableOpacity>
            {errors.smsInfo && <Text style={styles.errMsg}>You must agree to receive SMS notifications.</Text>}
          </View>

          <TouchableOpacity style={[styles.btnNext, { backgroundColor: colors.gold }]} onPress={goToStep2}>
            <Text style={[styles.btnNextText, { color: colors.stone }]}>Continue to Inquiry Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <View style={styles.formPanel}>
          <View style={styles.sectionBadge}>
            <Text style={[styles.sectionBadgeNum, { backgroundColor: colors.gold, color: colors.stone }]}>2</Text>
            <Text style={[styles.sectionBadgeText, { color: colors.gold }]}>INQUIRY DETAILS</Text>
          </View>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Schedule & Purpose</Text>
          <Text style={[styles.sectionSubheading, { color: colors.boneMuted }]}>Select your reason for visiting and preferred schedule.</Text>

          <View style={[styles.formCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
            <Text style={[styles.formLabel, { color: colors.textMuted }]}>Inquiry Category <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
            <View style={styles.reasonGrid}>
              {[
                { icon: '💳', title: 'PAYMENT', value: 'Payment Inquiries', desc: 'Payment-related concerns' },
                { icon: '⚰️', title: 'BURIAL', value: 'Burial', desc: 'Schedule a burial' },
                { icon: '📜', title: 'CERTIFICATE', value: 'Certificate for Transfer', desc: 'Transfer certificate' },
                { icon: '💬', title: 'OTHER', value: 'Other Inquiries', desc: 'General question' }
              ].map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.reasonCard, { backgroundColor: colors.appBg, borderColor: colors.goldBorder }, formData.reason === r.value && { backgroundColor: colors.gold, borderColor: colors.gold }]}
                  onPress={() => handleInputChange('reason', r.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reasonIcon}>{r.icon}</Text>
                  <Text style={[styles.reasonCardTitle, { color: colors.gold }, formData.reason === r.value && { color: colors.stone }]}>{r.title}</Text>
                  <Text style={[styles.reasonDesc, { color: colors.boneDim }, formData.reason === r.value && { color: colors.stone }]}>{r.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.reason && <Text style={[styles.errMsg, { marginTop: 10 }]}>Please select an inquiry category.</Text>}

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Name of Deceased</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={colors.boneDim}
                value={formData.deceased}
                onChangeText={(val) => handleInputChange('deceased', val)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Plot / Section (if known)</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="e.g. Section A · A-12"
                placeholderTextColor={colors.boneDim}
                value={formData.plot}
                onChangeText={(val) => handleInputChange('plot', val)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Preferred Date (YYYY-MM-DD) <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }, errors.preferredDate && styles.formInputErr]}
                placeholder="e.g. 2026-06-15"
                placeholderTextColor={colors.boneDim}
                value={formData.preferredDate}
                onChangeText={(val) => handleInputChange('preferredDate', val)}
              />
              {errors.preferredDate && <Text style={styles.errMsg}>Please enter date in format YYYY-MM-DD.</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Preferred Time <Text style={[styles.req, { color: colors.gold }]}>*</Text></Text>
              <TouchableOpacity
                style={[styles.dropdownTrigger, { backgroundColor: colors.appBg, borderColor: colors.inputBorder }, errors.preferredTime && styles.dropdownTriggerErr]}
                onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownTriggerText, { color: colors.text }, !formData.preferredTime && { color: colors.boneDim }]}>
                  {formData.preferredTime || 'Select time slot...'}
                </Text>
                <Text style={[styles.dropdownTriggerArrow, { color: colors.gold }]}>▼</Text>
              </TouchableOpacity>

              {showTimeDropdown && (
                <View style={[styles.dropdownContainer, { backgroundColor: colors.appBg, borderColor: colors.goldBorder }]}>
                  {timeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.dropdownItem, { borderBottomColor: colors.divider }]}
                      onPress={() => {
                        handleInputChange('preferredTime', slot);
                        setShowTimeDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.text }]}>{slot}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.preferredTime && <Text style={styles.errMsg}>Please select a time slot.</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textMuted }]}>Additional Notes</Text>
              <TextInput
                style={[styles.formInput, { height: 80, textAlignVertical: 'top', paddingTop: 10, backgroundColor: colors.appBg, borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="Enter notes..."
                placeholderTextColor={colors.boneDim}
                multiline={true}
                numberOfLines={3}
                value={formData.notes}
                onChangeText={(val) => handleInputChange('notes', val)}
              />
            </View>
          </View>

          <View style={styles.formNav}>
            <TouchableOpacity style={[styles.btnPrev, { borderColor: colors.divider }]} onPress={() => setStep(1)}>
              <Text style={[styles.btnPrevText, { color: colors.text }]}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnNext, { flex: 1, marginTop: 0, backgroundColor: colors.gold }]} onPress={goToStep3}>
              <Text style={[styles.btnNextText, { color: colors.stone }]}>Review Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <View style={styles.formPanel}>
          <View style={styles.sectionBadge}>
            <Text style={[styles.sectionBadgeNum, { backgroundColor: colors.gold, color: colors.stone }]}>3</Text>
            <Text style={[styles.sectionBadgeText, { color: colors.gold }]}>REVIEW & SUBMIT</Text>
          </View>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Confirm Details</Text>
          <Text style={[styles.sectionSubheading, { color: colors.boneMuted }]}>Please review all information before submitting your inquiry request.</Text>

          <View style={styles.reviewGrid}>
            <View style={[styles.reviewBlock, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
              <Text style={[styles.reviewBlockTitle, { color: colors.gold, borderBottomColor: colors.goldBorder }]}>PERSONAL INFORMATION</Text>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Full Name</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.firstName} {formData.lastName}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Email</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.email}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Contact</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.phone}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Relationship</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.relation}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Address</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.address || 'Not provided'}</Text>
              </View>
            </View>

            <View style={[styles.reviewBlock, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
              <Text style={[styles.reviewBlockTitle, { color: colors.gold, borderBottomColor: colors.goldBorder }]}>INQUIRY DETAILS</Text>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Inquiry Category</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.reason}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Deceased</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.deceased || 'Not specified'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Plot</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.plot || 'Not specified'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Date</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.preferredDate}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Time</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.preferredTime}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewKey, { color: colors.textMuted }]}>Notes</Text>
                <Text style={[styles.reviewVal, { color: colors.text }]}>{formData.notes || 'None'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formNav}>
            <TouchableOpacity style={[styles.btnPrev, { borderColor: colors.divider }]} onPress={() => setStep(2)} disabled={isSubmitting}>
              <Text style={[styles.btnPrevText, { color: colors.text }]}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnSubmit, { flex: 1, backgroundColor: colors.gold }]} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color={colors.stone} size="small" />
              ) : (
                <Text style={[styles.btnSubmitText, { color: colors.stone }]}>Submit Inquiry</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressWrap: {
    marginBottom: 30,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressCount: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.goldBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  formPanel: {
    flex: 1,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionBadgeNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    color: colors.stone,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 8,
  },
  sectionBadgeText: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 22,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 6,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  sectionSubheading: {
    fontSize: 13,
    color: colors.boneMuted,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    color: colors.boneMuted,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  req: {
    color: colors.gold,
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  formInputErr: {
    borderColor: '#f87171',
  },
  dropdownTrigger: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTriggerErr: {
    borderColor: '#f87171',
  },
  dropdownTriggerText: {
    color: colors.text,
    fontSize: 13,
  },
  dropdownTriggerArrow: {
    color: colors.gold,
    fontSize: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 4,
    maxHeight: 180,
    overflow: 'scroll',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dropdownItemText: {
    color: colors.text,
    fontSize: 13,
  },
  consentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.gold,
  },
  checkboxCheck: {
    color: colors.stone,
    fontSize: 11,
    fontWeight: 'bold',
  },
  consentText: {
    color: colors.boneMuted,
    fontSize: 11,
    flex: 1,
  },
  errMsg: {
    color: '#f87171',
    fontSize: 11,
    marginTop: 4,
  },
  btnNext: {
    height: 48,
    backgroundColor: colors.gold,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnNextText: {
    color: colors.stone,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  reasonCard: {
    width: '48%',
    backgroundColor: colors.appBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  reasonCardSelected: {
    // Styling handled inline
  },
  reasonIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  reasonCardTitle: {
    fontSize: 9,
    color: colors.gold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reasonDesc: {
    fontSize: 9,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: 2,
  },
  formNav: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  btnPrev: {
    width: 80,
    height: 48,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrevText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewGrid: {
    gap: 20,
    marginBottom: 24,
  },
  reviewBlock: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  reviewBlockTitle: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
    paddingBottom: 6,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  reviewKey: {
    color: colors.boneDim,
    fontSize: 12,
  },
  reviewVal: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  btnSubmit: {
    height: 48,
    backgroundColor: colors.gold,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSubmitText: {
    color: colors.stone,
    fontSize: 14,
    fontWeight: 'bold',
  },
  successCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  successRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successRingCheck: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 22,
    color: colors.text,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.boneDim,
    marginTop: 4,
    marginBottom: 24,
  },
  waitingMessage: {
    backgroundColor: colors.appBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  waitingHighlight: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  waitingDesc: {
    color: colors.boneMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  successRef: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gold,
    letterSpacing: 1.5,
    backgroundColor: colors.goldBorder,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 24,
  },
  successDetails: {
    width: '100%',
    backgroundColor: colors.appBg,
    borderRadius: 6,
    padding: 16,
    gap: 8,
    marginBottom: 24,
  },
  successDetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successDetKey: {
    color: colors.boneDim,
    fontSize: 11,
    fontWeight: 'bold',
  },
  successDetVal: {
    color: colors.text,
    fontSize: 12,
  },
  successInfo: {
    fontSize: 11,
    color: colors.boneDim,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 30,
  },
  btnHome: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnHomeText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  feedbackBox: {
    width: '100%',
    backgroundColor: colors.appBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 4,
  },
  feedbackSub: {
    fontSize: 11,
    color: colors.boneDim,
    textAlign: 'center',
    marginBottom: 12,
  },
  feedbackStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  feedbackStarBtn: {
    padding: 4,
  },
  feedbackStarText: {
    fontSize: 24,
    opacity: 0.35,
  },
  feedbackStarActive: {
    opacity: 1,
  },
  feedbackTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 12,
  },
  feedbackTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.cardBg,
  },
  feedbackTagSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldHover || 'rgba(200, 168, 75, 0.15)',
  },
  feedbackTagText: {
    fontSize: 11,
    color: colors.boneMuted,
  },
  feedbackTagTextSelected: {
    color: colors.gold,
    fontWeight: 'bold',
  },
  feedbackInput: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 6,
    padding: 10,
    color: colors.text,
    fontSize: 12,
    minHeight: 50,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  feedbackSubmitBtn: {
    backgroundColor: colors.gold,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackSubmitBtnText: {
    color: colors.stone,
    fontWeight: 'bold',
    fontSize: 13,
  },
  feedbackSubmittedBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  feedbackSubmittedStars: {
    fontSize: 20,
    color: colors.gold,
    marginBottom: 6,
  },
  feedbackSubmittedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  feedbackSubmittedDesc: {
    fontSize: 11,
    color: colors.boneDim,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifiedHeaderBadge: {
    color: '#86efac',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emailRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnVerifyAction: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  btnVerifyActionText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnChangeEmail: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  btnChangeEmailText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  otpBanner: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  otpBannerSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  otpBannerError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  otpBannerInfo: {
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
  },
  otpBannerText: {
    fontSize: 12,
    lineHeight: 16,
  },
  otpCard: {
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  otpCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  otpCardDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  otpInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  otpDigitInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    letterSpacing: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnSubmitOtp: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSubmitOtpText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
