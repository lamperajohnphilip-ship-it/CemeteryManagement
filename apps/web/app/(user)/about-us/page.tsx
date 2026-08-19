'use client';

import Image from 'next/image';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.aboutHeader}>
        <div className={styles.aboutEyebrow}>ETERNAL REST — JASAAN</div>
        <h1 className={styles.aboutTitle}>ABOUT <em>OUR</em> SYSTEM</h1>
        <div className={styles.aboutDivider}></div>
      </div>

      <div className={styles.aboutDescription}>
        <p>The <span className={styles.highlight}>Eternal Rest Cemetery Management System</span> is a comprehensive digital platform designed to streamline and modernize the management of the Jasaan Municipal Cemetery. Our system provides an efficient, transparent, and accessible way for families and administrators to manage burial records, inquiries, payments, and cemetery information.</p>
        <p>Developed with the community in mind, we aim to preserve the dignity of remembrance while embracing technology to serve the people of Jasaan and Misamis Oriental better.</p>
      </div>

      <div className={styles.missionVision}>
        <div className={styles.missionCard}>
          <div className={styles.cardIcon}>🎯</div>
          <div className={styles.cardTitle}>Our Mission</div>
          <div className={styles.cardText}>To provide a seamless, dignified, and efficient cemetery management experience that honors the departed while serving the living with compassion, transparency, and respect.</div>
        </div>
        <div className={styles.visionCard}>
          <div className={styles.cardIcon}>👁️</div>
          <div className={styles.cardTitle}>Our Vision</div>
          <div className={styles.cardText}>To become the model for digital cemetery management in the Philippines, combining traditional values with modern technology to serve communities better.</div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>SYSTEM <span>FEATURES</span></h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>⚰️</div>
            <div className={styles.featureTitle}>Deceased Inventory</div>
            <div className={styles.featureDesc}>Complete digital registry of all burial records with payment tracking and status updates.</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📅</div>
            <div className={styles.featureTitle}>Inquiry System</div>
            <div className={styles.featureDesc}>Online booking for burial services, plot reservations, and records retrieval.</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>💰</div>
            <div className={styles.featureTitle}>Payment Records</div>
            <div className={styles.featureDesc}>Integrated payment tracking with status indicators (Paid, Partial, Not Yet Paid).</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🗺️</div>
            <div className={styles.featureTitle}>Grave Mapping</div>
            <div className={styles.featureDesc}>Visual layout of cemetery plots for easy location and management.</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📢</div>
            <div className={styles.featureTitle}>Announcements</div>
            <div className={styles.featureDesc}>Push notifications and announcements for families and visitors.</div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📱</div>
            <div className={styles.featureTitle}>SMS Notifications</div>
            <div className={styles.featureDesc}>Real-time SMS updates for inquiry confirmations and reminders.</div>
          </div>
        </div>
      </div>

      <div className={styles.developersSection}>
        <h2 className={styles.developersTitle}>MEET THE DEVELOPERS</h2>
        <div className={styles.developersGrid}>
          <div className={styles.developerCard}>
            <div className={styles.developerImage}>
              <Image src="/Jp.jpg" alt="Developer 1" width={120} height={120} />
            </div>
            <div className={styles.developerName}>John Philip Lampera</div>
            <div className={styles.developerRole}>System Developer</div>
            <div className={styles.developerDesc}>Full-stack developer specializing in cemetery management systems.</div>
          </div>
          <div className={styles.developerCard}>
            <div className={styles.developerImage}>
              <Image src="/jehsel.jpg" alt="Developer 2" width={120} height={120} />
            </div>
            <div className={styles.developerName}>Jehsel B. Pasion</div>
            <div className={styles.developerRole}>UI/UX Designer</div>
            <div className={styles.developerDesc}>Creating intuitive and dignified user experiences for families.</div>
          </div>
          <div className={styles.developerCard}>
            <div className={styles.developerImage}>
              <Image src="/lydnie.jpg" alt="Developer 3" width={120} height={120} />
            </div>
            <div className={styles.developerName}>Lyndie U. Valerio</div>
            <div className={styles.developerRole}>Database Manager</div>
            <div className={styles.developerDesc}>Ensuring data integrity and system reliability.</div>
          </div>
          <div className={styles.developerCard}>
            <div className={styles.developerImage}>
              <Image src="/diane.jpg" alt="Developer 4" width={120} height={120} />
            </div>
            <div className={styles.developerName}>Gracel Diane Bioyo</div>
            <div className={styles.developerRole}>Project Leader</div>
            <div className={styles.developerDesc}>Coordinating development with community needs.</div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerText}>Eternal Rest · Jasaan &nbsp;|&nbsp; Municipality of Jasaan Cemetery Portal &nbsp;|&nbsp; About Us</div>
      </footer>
    </div>
  );
}
