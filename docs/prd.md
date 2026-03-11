# 🧭 Product Requirements Document (PRD)
## Project: Personal Finance + Blog Platform  
**Author:** James Gilmore  
**Version:** 1.0  
**Date:** October 2025  

---

## 1. 🎯 Overview

This project is a **Next.js web app** that serves as both a **personal blog** and a **financial health tracker**.  
It enables the creator (James) to:

- Write and publish blog posts publicly.  
- Maintain a private, authenticated dashboard to manage content and track finances.  
- Eventually integrate automated insights and subscriptions.

---

## 2. 💡 Core Goals

1. **Publish & Manage Blog Content**
   - Write, edit, and publish blog posts with a rich text editor (TipTap).  
   - Display blogs in a clean, SEO-friendly public feed.  
   - Each blog has its own dedicated page.  

2. **Track Financial Health**
   - Private dashboard with personal metrics (net worth, savings rate, goals).  
   - Simple chart and data entry view (can evolve into automation later).  

3. **Monetize & Automate**
   - Stripe for paid subscriptions (premium newsletter, reports, or future tools).  
   - Resend for transactional + newsletter emails.  
   - OpenAI for automated summaries or writing assistance.  

---

## 3. 🧱 Core Pages

| Page | Description | Access | Notes |
|------|--------------|--------|-------|
| **Landing Page** | Public homepage introducing James, the blog, and the FIRE/finance journey. | Public | Should include CTA → “Read Blog” / “Join Dashboard.” |
| **Blogs** | Lists all published blog posts in reverse chronological order. | Public | Includes tags, estimated read time, and featured image. |
| **Blog Page** | Individual post with title, author, publish date, and body. | Public | Uses clean typography, markdown or TipTap rendering. |
| **Dashboard** | Private interface for managing blogs and financial data. | Authenticated | Tabs: “Posts,” “Finance,” “Settings.” |
| **Auth (Login/Signup)** | Handles user authentication via Supabase. | Public | Uses Supabase Auth with email/password or OAuth. |

---

## 4. ⚙️ Tech Stack

| Category | Technology | Purpose |
|-----------|-------------|----------|
| Frontend | **Next.js (App Router)** | Core framework and routing |
| Backend | **Supabase** | Auth, Database, Storage |
| Payments | **Stripe** | Subscription + donation handling |
| Email | **Resend** | Transactional and marketing emails |
| AI | **OpenAI API** | Post summaries, tone adjustments, future assistants |
| Hosting | **Vercel** | Deployment and hosting |
| Editor | **TipTap** | Rich text editing for blog creation |

---

## 5. 🔐 Auth & Permissions

- **Supabase Auth** manages login, logout, and session state.  
- Roles:
  - **Admin (You)** – full access to dashboard and publishing.  
  - **Public Users** – read-only access to blog content.  
- Protected routes implemented via `middleware.ts` (Next.js 14+).  

---

## 6. 🧩 Core Features by Area

### 📝 Blog System
- CRUD for posts (Create, Read, Update, Delete).  
- TipTap editor with title, body, tags, and thumbnail.  
- Autosave draft mode.  
- SEO fields (meta title, description, slug).  
- Markdown rendering on blog page.  

### 💰 Financial Dashboard (Phase 1)
- Manual data entry: cash, investments, liabilities.  
- Auto-calculated metrics: total net worth, monthly savings rate.  
- Simple charts (line graph for progress).  
- Optional note field for reflections.

### 💵 Stripe Integration
- Connect for subscriptions or donations.  
- Protected endpoints for webhooks.  
- Stripe customer data synced with Supabase profiles.

### 📬 Email Integration
- Welcome email (Resend).  
- Optional newsletter blast via Resend + Supabase table.

### 🤖 OpenAI Integration
- Blog summary generation (e.g., “Summarize in 3 lines”).  
- Style/tone enhancement (e.g., “Make it more conversational”).  
- Future expansion: AI-generated finance summaries.

---

## 7. 🎨 Design Guidelines

- Clean, modern, minimalist aesthetic.  
- Dark mode ready.  
- Sans-serif typography (e.g., Inter or Satoshi).  
- Finance dashboard and blog share consistent color palette and layout grid.  
- Use Tailwind CSS for rapid styling.  

---

## 8. 🚀 MVP Deliverables

| Phase | Feature | Description |
|-------|----------|-------------|
| **1. Core App Setup** | Next.js + Supabase integration | Project scaffold, routing, Supabase client setup |
| **2. Auth** | Sign up / sign in / logout | Supabase Auth + middleware protection |
| **3. Blog CRUD** | Blog system with TipTap | Dashboard CRUD + public blog rendering |
| **4. Finance Tracker (MVP)** | Manual entry + display | Add balances and chart total |
| **5. Stripe** | Checkout + webhook | Subscription/payment flow |
| **6. Resend** | Welcome + summary emails | Email templates triggered via Supabase events |
| **7. AI Assist** | Summarize blog post | OpenAI endpoint for summaries |

---

## 9. 🧩 Future Enhancements

- Import financial data from CSV or Plaid API.  
- Multi-user version (family or couple accounts).  
- AI-powered wealth analysis.  
- Blog newsletter scheduling.  
- CMS-like analytics for post views and subscribers.  

---

## 10. 🧭 Success Metrics

- ✅ Successful deployment on Vercel.  
- ✅ Authentication and role-based access working.  
- ✅ Create, edit, and publish blog posts.  
- ✅ Dashboard displays accurate net worth and chart.  
- ✅ Stripe and Resend integrations functional.  

---
