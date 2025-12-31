# AeThex Foundation — Guardian's Hub (Accurate Overview)

> Purpose: This document is written to be **accurate**, **investor/partner-legible**, and **safe to ship** in-repo.
> It avoids overstating OAuth/OIDC/DAO status until those components are fully enforced in production.

---

## Project Identity

- **Name:** AeThex Foundation (Guardian's Hub)
- **Primary Domain:** `aethex.foundation`
- **Role in AeThex:** Independent **governance + identity authority**
- **Core Product:** **AeThex Passport** (authentication + identity layer)
- **Status:** Active development (Phase 1: Identity + Foundation hub)

---

## What the Foundation Is (and Is Not)

### The Foundation **is**
- The **custodian of identity policy** for the AeThex ecosystem
- The **authentication authority** for AeThex properties via Passport
- The publisher of **standards, policies, and enforcement rules**
- The owner of the **trusted-client / access registry** (what can integrate with Passport)

### The Foundation **is not**
- A commercial product company (that's **AeThex Corp**)
- A studio shipping games/tools as products (that's **AeThex Studio/Labs**)
- A general "everything portal" for all AeThex initiatives

**Design principle:** Identity and legitimacy must be governed independently of commercial incentives.

---

## The Axiom Model (Separation of Powers)

AeThex is designed to prevent a common failure mode: **identity becomes a monetized product**.

Under the Axiom Model:

- **AeThex Foundation** — governs identity, authentication policy, legitimacy, and enforcement
- **AeThex Studio (Labs)** — experiments, pilots, reference implementations, open templates
- **AeThex Corporation** — builds and sells products/services, enterprise delivery and support

**Why this matters:** When the same entity controls identity *and* revenue, trust is eventually compromised.
The Foundation exists to keep identity policy enforceable and independent.

---

## AeThex Passport (What It Is Today)

### Current state (truthful)
Passport is an authentication and identity layer implemented using:
- **Supabase Auth** (primary auth provider)
- Application-level session handling + identity profile data
- OAuth-based social login integrations (e.g., Discord/Google/GitHub) as configured

### Roadmap state (do not overclaim)
Passport is designed to evolve toward:
- **OAuth2 / OpenID Connect (OIDC) compatibility** for external AeThex properties
- A formal **Trusted Client Registry**
- Stronger enforcement controls (client access rules, revocation, rotation policies)

> Until OAuth2/OIDC is fully standards-compliant and externally verified, we describe Passport as
> "Supabase-backed authentication with a roadmap toward OAuth2/OIDC provider compliance."

---

## Enforcement (Revocation) — How "Authority" Becomes Real

Authority is only credible if it is enforceable.

The Foundation's enforcement model is based on:
- **Trusted Client Registry:** which AeThex properties/apps are authorized to use Passport
- **Policy gating:** requirements for approved clients (security, privacy, trust behavior)
- **Revocation capability:** removal of an app/property from the trusted list if it violates standards

> Implementation note: "revocation" is only claimed as active once it is wired into production
> access controls (not just documented).

---

## What Lives on `aethex.foundation`

The Foundation domain should remain focused and institutional:

### Recommended information architecture
- **Passport**
  - What it is, how it works, supported login methods
- **Standards / Policies**
  - Identity policy, privacy posture, security posture, enforcement rules
- **Registry**
  - Trusted clients, certified/approved integrations, public status
- **Governance**
  - How decisions are made, how standards change, transparency reporting
- **Programs** (optional, minimal)
  - Foundation-sponsored initiatives that support the mission (not product marketing)
  - Workforce development as mission-aligned programming (see below)

### What should NOT live here
- Product pages, pricing, sales offers (belongs on `aethex.dev`)
- Tool demos and experimental builds (belongs on `aethex.studio`)
- Broad "everything hub" sections that dilute the Foundation's authority

---

## Technology Stack (High-Level)

### Frontend
- React + TypeScript
- Vite
- TailwindCSS (and UI component system as configured)

### Backend
- Node/Express (TypeScript)
- Supabase (Auth + Postgres)
- Email/notifications as configured

### Optional Web3 / Governance (only claim what is deployed)
- Solidity contracts / governance tooling may exist in repo
- On-chain governance is described as **planned or in-progress** unless deployed + active

---

## Workforce Development & Public Benefit (Mission-Aligned Programming)

AeThex Foundation supports workforce development initiatives that are aligned with our core governance mission. These programs focus on building **digital competency in identity infrastructure, authentication standards, and trusted system participation**.

### Our workforce development efforts include:

- **Open educational workshops** covering identity governance principles, authentication protocols, and standards implementation
- **Mentorship and skill-building cohorts** designed to prepare individuals for participation in identity systems and trust infrastructure
- **Applied learning resources** such as curriculum modules, case studies, and reference implementations that demonstrate best practices in compliant identity management

These nonprofit programs are structured to support ecosystem participants — from creators and developers to educators and policymakers — in gaining expertise that directly supports the governance, adoption, and responsible stewardship of digital identity standards.

### Institutional positioning

> "Workforce development is part of our public benefit programming, supporting education and skills in identity governance and trust infrastructure."

**Key principles:**
- Workforce programming is **secondary and supportive** to our core identity governance mission
- Programs are **nonprofit in nature** — not commercial services or revenue vehicles
- Content focuses on **competencies required for trusted identity systems** participation
- Designed to **increase ecosystem capacity** for compliant identity management

---

## Security Notes (Repo Hygiene)

- **Never commit secrets** (Discord client secrets, bot tokens, service role keys, etc.)
- Treat any secrets pasted into chat/logs as compromised and rotate them.
- Keep `.env.example` as keys-only placeholders (no live values).

---

## Practical Next Steps (Recommended)

1. **Publish a Foundation "Trusted Client Policy"** (short, clear)
2. Stand up a **Trusted Client Registry page** (even if initially small/manual)
3. Implement enforceable **client gating** in production (revocation is real only then)
4. Keep Foundation scope tight; move Labs/Corp content to their domains

---

## One-Sentence Positioning (Use Everywhere)

**AeThex Foundation is the independent governance and authentication authority for user-owned digital identity across the AeThex ecosystem.**
