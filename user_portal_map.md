# 🗺️ Cemetery Management System - User Portal Navigation & File Path Map

This guide outlines the complete routing, directory structure, and file paths for both the **Next.js Web Portal** and **React Native Mobile App** modules. Use this map to navigate the codebase easily when modifying specific features.

---

## 📂 Navigation & Routing Map

| Navigation Section | 🌐 Next.js Web File Path | 🔗 Route URL | 📱 React Native Mobile Screen |
| :--- | :--- | :--- | :--- |
| **DASHBOARD** | `apps/web/app/(user)/dashboard/page.tsx` | `/dashboard` | `apps/mobile/src/screens/Dashboard.tsx` |
| **INQUIRIES** | `apps/web/app/(user)/inquiries/page.tsx` | `/inquiries` | `apps/mobile/src/screens/Inquiries.tsx` |
| **GRAVE MAPPING** | `apps/web/app/(user)/grave-mapping/page.tsx` | `/grave-mapping` | `apps/mobile/src/screens/GraveMapping.tsx` |
| **ANNOUNCEMENTS** | `apps/web/app/(user)/announcements/page.tsx` | `/announcements` | `apps/mobile/src/screens/Announcements.tsx` |
| **ABOUT US** | `apps/web/app/(user)/about-us/page.tsx` | `/about-us` | `apps/mobile/src/screens/AboutUs.tsx` |
| **ADMIN LOG** | `apps/web/app/(admin)/admin-log/page.tsx` | `/admin-log` | *(Hidden in Mobile App)* |

---

## 🏛️ Component-Level Mapping Details

### 1. 🏛️ DASHBOARD (Home Search Page)
- **Purpose**: Home page where users search for deceased records, open profiles, and submit star rating feedbacks.
- **Web Content**:
  - Main Page: `apps/web/app/(user)/dashboard/page.tsx` (Renamed and moved to its own directory)
  - Style Sheet: `apps/web/app/(user)/dashboard/page.module.css`
  - Redirection Page: `apps/web/app/(user)/page.tsx` (Redirects root `/` requests to `/dashboard`)
- **Mobile Container**:
  - Wrapper Screen: `apps/mobile/src/screens/Dashboard.tsx` (Renders `/dashboard` web viewport)

### 2. 📋 INQUIRIES (Scheduling Wizard)
- **Purpose**: 3-step dynamic wizard form to submit cemetery inquiries, relationship details, and burial requests.
- **Web Content**:
  - Main Page: `apps/web/app/(user)/inquiries/page.tsx`
  - Style Sheet: `apps/web/app/(user)/inquiries/page.module.css`
  - DB Action: `apps/web/app/actions/inquiry.ts` (Writes directly to the PostgreSQL database)
- **Mobile Container**:
  - Wrapper Screen: `apps/mobile/src/screens/Inquiries.tsx` (Renders `/inquiries` web viewport)

### 3. 🗺️ GRAVE MAPPING (Interactive 3D Viewer)
- **Purpose**: Interactive WebGL Three.js grid canvas zooming to coordinates saved in session storage.
- **Web Content**:
  - Main Page: `apps/web/app/(user)/grave-mapping/page.tsx`
  - 3D Script: `apps/web/public/mapping-script.js` (Three.js pinpointing and camera animations)
- **Mobile Container**:
  - Wrapper Screen: `apps/mobile/src/screens/GraveMapping.tsx` (Renders `/grave-mapping` web viewport)

### 4. 📢 ANNOUNCEMENTS (Bulletins Feed)
- **Purpose**: Announcement bulletin list filtered by category (General, Events, System Updates).
- **Web Content**:
  - Main Page: `apps/web/app/(user)/announcements/page.tsx`
  - Style Sheet: `apps/web/app/(user)/announcements/page.module.css`
- **Mobile Container**:
  - Wrapper Screen: `apps/mobile/src/screens/Announcements.tsx` (Renders `/announcements` web viewport)

### 5. ℹ️ ABOUT US (Information Page)
- **Purpose**: General information regarding Jasaan Cemetery, system features, and municipality portal overview.
- **Web Content**:
  - Main Page: `apps/web/app/(user)/about-us/page.tsx`
  - Style Sheet: `apps/web/app/(user)/about-us/page.module.css`
- **Mobile Container**:
  - Wrapper Screen: `apps/mobile/src/screens/AboutUs.tsx` (Renders `/about-us` web viewport)

### 6. 🛡️ ADMIN LOG (Authentication Screen)
- **Purpose**: Sign-in portal for MEEDO municipal staff.
- **Web Content**:
  - Main Page: `apps/web/app/(admin)/admin-log/page.tsx`
  - Style Sheet: `apps/web/app/(admin)/admin-log/page.module.css`
  - DB Action: `apps/web/app/actions/auth.ts` (Validates staff credentials)
- **Mobile Container**:
  - *Completely excluded* from the mobile application for absolute security.

---

## 🧭 Shared Navigation UI Components

### 🌐 Next.js Web Navigation
- **File**: `apps/web/components/Navigation.tsx`
- **Style**: `apps/web/components/Navigation.module.css`
- **Behavior**: Renders the slide-out hamburger sidebar drawer. Suppresses rendering if the User Agent is `CemeteryManagementMobile` (to prevent overlapping headers in the app).

### 📱 React Native Mobile Navigation
- **File**: `apps/mobile/App.tsx`
- **Behavior**: Serves as the app's state router, sliding drawer, native safe-area header, and layout container.
