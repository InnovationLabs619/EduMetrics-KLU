# EduMetrics-KLU System Architecture

## Overview
EduMetrics-KLU is a high-integrity SWEAR Analysis & Student Assessment Portal. It features a Tri-Panel Assessment UI, Digital Signature Verification, and Automated Admin Workflows.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons.
- **Backend API**: Node.js (Express) Integration.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: JWT-based session management.
- **Integrations**: Google Sheets (Apps Script), Nodemailer (Email), Puppeteer/jsPDF (PDF Generation).

## Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Client (Browser)"]
        UI[User Interface (Next.js)]
        Auth[Auth Module (JWT)]
        Sig[Signature Canvas]
        
        UI --> Auth
        UI --> Sig
    end

    subgraph Backend ["Backend (Node.js/Express)"]
        API[API Gateway]
        AuthSvc[Auth Service]
        AssessSvc[Assessment Service]
        PDFSvc[PDF Generation Service]
        EmailSvc[Email Service]
        
        API --> AuthSvc
        API --> AssessSvc
        AssessSvc --> PDFSvc
        AssessSvc --> EmailSvc
    end

    subgraph Database ["Data Storage"]
        DB[(PostgreSQL)]
        Schema[Prisma ORM]
        
        AuthSvc --> Schema
        AssessSvc --> Schema
        Schema --> DB
    end

    subgraph External ["External Services"]
        GSheets[Google Sheets (via Webhook)]
        SMTP[SMTP Server (Nodemailer)]
        
        AssessSvc --> GSheets
        EmailSvc --> SMTP
    end

    Client -->|HTTPS/JSON| API
```

## Data Flow
1.  **Student Login**: Authenticates via Roll Number, Name Cluster, & Group Name. Token issued.
2.  **Assessment**: Student completes 3 panels (Strengths, Eligibility, Resources).
3.  **Submission**:
    *   Data sent to Backend API.
    *   Validated by Assessment Service.
    *   Stored in PostgreSQL via Prisma.
    *   Digital Signature (Base64) saved.
4.  **Post-Submission Automation**:
    *   Row pushed to Google Sheets via Webhook.
    *   PDF Receipt generated.
    *   Email with PDF attachment sent to Admin/Student.

## Component Details
### Frontend
-   **Tri-Panel UI**: Orchestrates the 3-step assessment flow.
-   **State Management**: Zustand/Context for tracking assessment progress.

### Backend
-   **Express Server**: Handles API requests, validation, and orchestration of services.
-   **Prisma Client**: Type-safe database interactions.

### Security
-   **JWT**: Stateless authentication.
-   **Input Validation**: Zod for schema validation on both client and server.
