<div align="center">

# 💈 BarberShop

### Enterprise-Grade Barbershop Management Platform

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

*A modern, full-stack web application for managing barbershops, appointments, and client relationships with real-time appointment management and OAuth authentication.*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**BarberShop** is a comprehensive, enterprise-grade platform designed to streamline barbershop operations, appointment management, and client relationships. Built with modern web technologies, it provides a seamless experience for both barbers and clients through an intuitive, responsive interface.

The platform leverages the power of **Laravel 12** on the backend and **React 18** with **TypeScript** on the frontend, connected through **Inertia.js** for a smooth SPA experience without the complexity of a traditional API.

### Key Highlights

- 👥 **Dual Role System** - Register as Client or Barber with seamless role upgrade workflow
- 📧 **Email-Based Barber Approval** - Clients can request to become barbers via email approval system
- 🔐 **Multi-Provider OAuth Authentication** (Google, GitHub, etc.)
- 📅 **Real-time Appointment Management** with conflict detection
- 🏪 **Comprehensive Saloon Management** with photo galleries and schedules
- 📊 **Interactive Analytics Dashboard** with performance metrics
- 🔔 **Real-time Notifications System** for barbers and clients
- 📱 **Fully Responsive Design** optimized for mobile and desktop
- 🎨 **Modern UI/UX** with dark mode support and smooth animations
- 🚀 **Optimized Performance** with caching, lazy loading, and automatic image optimization (WebP conversion)

---

## ✨ Features

### For Barbers

#### 🏪 Saloon Management
- **Complete Saloon Profile**: Create and manage detailed saloon information including name, description, address  and photos.
- **Opening Hours Configuration**: Set weekly schedules with customizable opening and closing times for each day
- **Exception Management**: Define vacation periods, holidays, and special closures with date ranges
- **Photo Gallery**: Upload and manage multiple high-quality images (cover photo + gallery)
- **Image Optimization**: Automatic WebP conversion and resizing for optimal performance
- **Real-time Updates**: Instant cache invalidation for immediate changes

#### 📅 Appointment Management
- **Appointment Dashboard**: View all upcoming and past appointments in a clean, organized interface
- **Status Management**: Update appointment status (confirmed, completed, cancelled)
- **Conflict Detection**: Automatic validation to prevent double-booking
- **Time Zone Support**: All appointments handled in Europe/Rome timezone
- **Client Information**: Quick access to client details and appointment history

#### 👥 Client Management
- **Client Database**: Comprehensive list of all clients with appointment history
- **Client Profiles**: Detailed view of individual clients with statistics
- **Appointment History**: Track all past and upcoming appointments per client

#### 📊 Analytics & Insights
- **Performance Dashboard**: Interactive charts showing appointment trends
- **Time-based Filters**: View data for 7, 30, or 90-day periods
- **Appointment Metrics**: Track total appointments, completion rates, and growth
- **Visual Charts**: Beautiful, responsive charts powered by Recharts

### For Clients

#### 🔍 Saloon Discovery
- **Browse Saloons**: Explore all available barbershops with detailed information
- **Search & Filter**: Find saloons by location or name
- **Photo Galleries**: View high-quality images of saloons before booking
- **Barber Profiles**: See barber information and ratings

#### 📅 Booking System
- **Easy Appointment Booking**: Select date and time
- **Real-time Availability**: See only available time slots
- **Instant Confirmation**: Immediate booking confirmation with notifications
- **Appointment Management**: View or cancel upcoming appointments

#### 📱 Personal Dashboard
- **Upcoming Appointments**: Quick overview of all scheduled appointments
- **Appointment History**: Track past visits
- **Favorite Saloons**: Save preferred barbershops for quick access
- **Profile Management**: Update personal information and preferences

### Authentication & Security

#### 🔐 Multi-Provider OAuth & Registration System
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Developer-friendly authentication
- **Traditional Login**: Email and password authentication
- **Dual Registration System**:
  - **Register as Client**: Instant access to book appointments and browse saloons
  - **Register as Barber**: Create your barbershop profile and manage appointments

#### 🔄 Client to Barber Upgrade Workflow
A unique feature that allows clients to seamlessly transition into barbers:

1. **Request Submission**:
   - Client clicks "Become a Barber" button in their dashboard
   - System sends detailed email to admin with user information

2. **Admin Approval Process**:
   - Admin receives email with user details and secure approval link
   - One-click approval via signed URL for maximum security
   - No need to log into admin panel

3. **Role Upgrade**:
   - Upon approval, user's `is_barber` flag is set to `true`
   - User role changes from client to barber instantly

4. **User Notification**:
   - User receive notification
   - Beautiful congratulatory dialog appears on next page load
   - Dialog message: "Congratulations! Your request to become a barber has been approved. You can now create your saloon and start managing appointments."

5. **New Capabilities**:
   - Full access to saloon creation and management
   - Appointment management dashboard
   - Client database and analytics
   - All barber-exclusive features unlocked

#### 🛡️ Security Features
- **CSRF Protection**: Laravel's built-in CSRF token validation
- **Role-based Access Control**: Separate permissions for barbers and clients
- **Session Management**: Secure session handling with database storage
- **Password Hashing**: Bcrypt encryption for all passwords
- - **Middleware Protection**: Custom middleware for route authorization
- `barber` middleware: Ensures only authenticated barbers can access barber-specific routes

### Notifications & Communication

#### 🔔 Real-time Notifications System
- **In-app Notifications**: Toast notifications for important events
- **Barber Approval Workflow**:
  - Email sent to admin when client requests to become barber
  - Approval confirmation email to user
  - Real-time dialog notification upon approval
- **Notification Center**: Centralized notification management
- **Mark as Read**: Track notification status
- **Persistent Dialogs**: Important messages shown via dialog modals

## 🛠 Tech Stack

### Backend
- **[Laravel 12](https://laravel.com)** - PHP framework for web artisans
- **[Inertia.js 2.0](https://inertiajs.com)** - Modern monolith architecture
- **[Laravel Breeze](https://laravel.com/docs/breeze)** - Authentication scaffolding with React + Inertia starter kit
- **[Intervention Image](https://image.intervention.io)** - Image processing and optimization (WebP conversion)
- **[Ziggy](https://github.com/tighten/ziggy)** - Laravel routes in JavaScript

### Frontend
- **[React 18.2](https://reactjs.org)** - UI library
- **[TypeScript 5.0](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[TailwindCSS 3.4](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com)** - Unstyled, accessible components
- **[Sonner](https://sonner.emilkowal.ski)** - Toast notifications
- **[Lucide React](https://lucide.dev)** - Beautiful icon library
- **[date-fns](https://date-fns.org)** - Modern date utility library
- **[React Day Picker](https://react-day-picker.js.org)** - Date picker component
- **[Zustand](https://zustand-demo.pmnd.rs)** - State management
- **[GSAP](https://greensock.com/gsap/)** - Professional-grade animation library for scroll animations
- **[React Lazy Load Image Component](https://www.npmjs.com/package/react-lazy-load-image-component)** - Lazy loading images with blur effect

### Development Tools
- **[Vite](https://vitejs.dev)** - Next generation frontend tooling
- **[Pest](https://pestphp.com)** - Testing framework
- **[Mailtrap](https://mailtrap.io)** - Email testing in development

### Database & Caching
- **MySQL** - Primary database
- **Database Cache Driver** - Session and cache storage

## 🚀 Deployment

### Production Environment

The application is deployed on **[IONOS](https://www.ionos.com)** hosting with the following configuration:

#### Infrastructure
- **Hosting Provider**: IONOS Web Hosting
- **Web Server**: Apache with mod_rewrite
- **PHP Version**: 8.2+
- **Database**: MySQL 8.0
- **SSL Certificate**: Let's Encrypt SSL certificate (HTTPS enabled)
- **Email Service**: IONOS Mail with authenticated SMTP

#### SSL/HTTPS Setup
- **Certificate Type**: Let's Encrypt (free, auto-renewable)
- **Force HTTPS**: Enabled via `.htaccess` redirect
- **HSTS**: HTTP Strict Transport Security enabled
- **Mixed Content**: All assets served over HTTPS
