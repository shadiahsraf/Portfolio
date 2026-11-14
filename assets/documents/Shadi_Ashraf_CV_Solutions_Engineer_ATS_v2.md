# Shadi Ashraf Adli Mehany
**Junior Solutions Engineer | Python & Django | PostgreSQL | REST APIs | System Integration & Automation**  
Assiut, Egypt · +20 114 422 7242 · [shadiadli3@gmail.com](mailto:shadiadli3@gmail.com)  
[LinkedIn: linkedin.com/in/shadi-ashraf-0643a02a9](https://www.linkedin.com/in/shadi-ashraf-0643a02a9/) · [GitHub: github.com/shadiahsraf](https://github.com/shadiahsraf)

---

## PROFESSIONAL SUMMARY
Analytical and proactive Junior Solutions Engineer with practical production experience architecting database-driven backend applications, troubleshooting enterprise systems, and automating business workflows. Independently engineered and operates **Boys Center**, a live Django and PostgreSQL platform deployed for ~500 active youth members, featuring bidirectional Odoo ERP synchronization over XML-RPC, operational reporting pipelines (PDF/Excel), and tokenized QR attendance workflows. Architected the REST API backend for **BOCHA Workspace** using Django REST Framework with JWT authentication, tenant-scoped data isolation, Bruno/Postman endpoint validation, and 27 passing automated tests. Fourth-year Computer Science student at Assiut University (GPA 3.5, Class of 2027) with hands-on Linux administration skills, a disciplined approach to technical problem-solving, and a dedication to improving operational efficiency.

---

## TECHNICAL SKILLS

- **Programming & Backend:** Python, Django, Django REST Framework, Django ORM, Object-Oriented Architecture, Business Logic, Defensive Error Handling & Logging
- **APIs & Enterprise Integration:** REST APIs, Odoo ERP Integration (XML-RPC / OdooRPC), HTTP/HTTPS Protocol, JSON, YAML (Docker Compose / Configuration), Webhooks, API Testing (Bruno, Postman), cURL
- **Databases & Data Management:** PostgreSQL, SQL, SQLite, Relational Schema Modeling, Query Optimization (`select_related`, `prefetch_related`, `Count`, `Avg`), Concurrency Control (`@transaction.atomic`, `select_for_update`), Schema Migrations
- **Workflow Automation & Internal Tooling:** Automated PDF Generation (ReportLab), Formatted Multi-Sheet Excel Exports (openpyxl), QR Code Verification Engines, Scheduled Batch Jobs (Cron / Django Management Commands)
- **Systems & Production Operations:** Linux (Ubuntu/Debian), SSH, Bash Scripting, Nginx (Reverse Proxy & SSL/TLS Configuration), Gunicorn WSGI, Git & GitHub, Root-Cause Troubleshooting & Incident Analysis, Docker Fundamentals
- **Frontend & UI Literacy:** JavaScript (ES6+), TypeScript, React 19, Alpine.js, Tailwind CSS, Responsive Design, State Management (Zustand)
- **Applied AI & Automation:** Tool Calling / Function Execution, User-Scoped Context Grounding, Exponential Backoff & Jitter (`safe_gemini_call_async`), Structured JSON Extraction

---

## PROJECT EXPERIENCE

### Boys Center — Youth & Sports Club Management Platform
*Independent Developer & System Owner | Production System*  
**GitHub:** [github.com/shadiahsraf/boys_center](https://github.com/shadiahsraf/boys_center) · **Live Demo:** [sports.boyscenter.online](http://sports.boyscenter.online/)  
**Technologies:** Python, Django, PostgreSQL, Odoo ERP (XML-RPC), Linux, Nginx, Gunicorn, ReportLab, openpyxl, Alpine.js, PWA

- **Enterprise ERP Integration & Automation:** Built a resilient bidirectional integration layer with Odoo ERP (`users/odoo_client.py`) utilizing XML-RPC (`xmlrpc.client` & `odoorpc`), automating member synchronization via custom Django management commands with `--dry-run` validation and `--full` reconciliation modes.
- **Data Reconciliation & Conflict Prevention:** Engineered multi-tier entity resolution logic (`odoo_id` → `email` → `member_code`) with change detection (`write_date`), safe AST domain filtering (`ast.literal_eval`), and protected field policies (`NEVER_OVERWRITE`), preventing automated syncs from overwriting local roles, passwords, or permissions.
- **Production PostgreSQL Database Architecture:** Designed and administers a normalized production PostgreSQL database serving ~500 active members with native UUID primary keys, JSON metadata fields, and relational constraints, implementing atomic transactions (`select_for_update`) to eliminate database concurrency locks during peak hours.
- **Operational Reporting & Internal Tools:** Automated operational reporting pipelines with ReportLab and openpyxl, eliminating manual recordkeeping by generating dynamic, branded PDF attendance summaries and multi-column styled Excel audit workbooks for club managers.
- **Workflow Automation & Access Control:** Implemented token-validated QR-code check-ins with expiring session tokens, duplicate scan guards, and automatic late-arrival calculation, governed by a 5-role Role-Based Access Control model (Admin, Coach Manager, Coach, Parent, Youth) and comprehensive audit logs.
- **Linux Operations & Uptime Maintenance:** Self-managed deployment on Linux (Ubuntu VPS) configured with Nginx reverse proxy, Gunicorn WSGI, SSL/TLS certificates, security hardening, and ongoing production troubleshooting and database backups.

### BOCHA Workspace — REST API Architecture & Workflow Platform
*Personal Project (In Active Development)*  
**GitHub:** [github.com/shadiahsraf/BOCHA-Workspace](https://github.com/shadiahsraf/BOCHA-Workspace)  
**Technologies:** Python, Django REST Framework, PostgreSQL, JWT Authentication, Google OAuth, Bruno, Postman, React 19, TypeScript, Zustand, Gemini API

- **RESTful API Architecture & Authentication:** Architected a modular backend using Django REST Framework providing structured REST endpoints for tasks, projects, notes, and activity telemetry, secured with JWT token pair authentication (access/refresh lifecycle) and Google OAuth integration.
- **Tenant Isolation & Comprehensive Testing:** Enforced strict tenant-scoped data filtering to guarantee complete cross-user isolation, validated through Bruno/Postman collections and 27 automated unit/integration test methods covering authentication lifecycles, permission rules, and CRUD payloads.
- **Integration Resilience & Backoff Algorithms:** Developed an asynchronous integration wrapper featuring exponential backoff with full jitter (`safe_gemini_call_async`) to handle HTTP 429 rate limits and 503 service unavailability with automatic model fallback, ensuring continuous API reliability.
- **Automated Tool Execution Layer:** Implemented user-scoped Python tools (`LifeOSToolbox`) allowing autonomous assistant pipelines to safely query, filter, and mutate workspace data through authenticated, schema-validated Django ORM interfaces.

---

## EDUCATION

### Assiut University, Faculty of Computers and Information
**Bachelor of Science in Computer Science** | Expected Graduation: 2027 | **GPA: 3.5 / 4.0**  
*Core Academic Coursework:* Data Structures, Algorithms, Database Systems, Software Engineering, Operating Systems, Computer Networks, Object-Oriented Analysis & Design, Distributed Computing.

---

## CERTIFICATIONS & TECHNICAL SPECIALIZATIONS

- **Building AI Agents & Agentic Workflows Specialization** — IBM (Coursera) | October 2026  
  *Focus:* Multi-step automated workflows, tool calling, API integration, and structured decision pipelines.
- **Modern AI-Assisted Software Engineering & Web Development Specialization** — LearnQuest (Coursera) | November 2026  
  *Focus:* Enterprise software best practices, API integrations, third-party database connections, automated debugging, and code quality.
