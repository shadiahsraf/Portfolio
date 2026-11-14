# Shadi Ashraf Adli Mehany
**Junior Solutions Engineer | Python & Django | PostgreSQL | System Integration & Automation**  
Assiut, Egypt · +20 114 422 7242 · [shadiadli3@gmail.com](mailto:shadiadli3@gmail.com)  
[LinkedIn: linkedin.com/in/shadi-ashraf-0643a02a9](https://www.linkedin.com/in/shadi-ashraf-0643a02a9/) · [GitHub: github.com/shadiahsraf](https://github.com/shadiahsraf)

---

## PROFESSIONAL SUMMARY
Motivated and analytical Junior Solutions Engineer with practical experience building database-driven backend applications, automating business workflows, and implementing enterprise system integrations. Independently developed and maintains **Boys Center**, a production Django and PostgreSQL platform deployed for ~500 active youth members, featuring live Odoo ERP synchronization over XML-RPC, tokenized QR attendance workflows, and automated PDF/Excel reporting. Engineered the REST API backend for **BOCHA Workspace** using Django REST Framework with JWT authentication, per-user data isolation, and 27 passing automated tests. Fourth-year Computer Science student at Assiut University (GPA 3.5, Class of 2027) with proven problem-solving abilities, Linux server administration experience, and a strong commitment to operational efficiency.

---

## TECHNICAL SKILLS

- **Programming & Backend:** Python, Django, Django REST Framework, Django ORM, Object-Oriented Programming, Business Logic, Error Handling & Logging
- **APIs & System Integration:** REST APIs, Odoo ERP Integration (XML-RPC / OdooRPC), HTTP/HTTPS, JSON, YAML, Webhooks, API Testing (Bruno, Postman), cURL
- **Databases & Data Management:** PostgreSQL, SQL, SQLite, Database Design & Relational Modeling, Query Optimization (`select_related`, `prefetch_related`, `Count`, `Avg`), Transactions (`@transaction.atomic`), Schema Migrations
- **Workflow Automation & Reporting:** Automated PDF Generation (ReportLab), Formatted Excel Exports (openpyxl), QR Code Verification Pipelines, Scheduled Batch Jobs (Cron / Django Management Commands)
- **Environment & Server Operations:** Linux (Ubuntu/Debian), SSH, Bash Scripting, Nginx (Reverse Proxy & SSL/TLS Configuration), Gunicorn, Git & GitHub, Production Troubleshooting, Docker (Basic Familiarity)
- **Frontend & UI Integration:** JavaScript (ES6+), TypeScript, React 19, Alpine.js, Tailwind CSS, Responsive Design, State Management (Zustand)
- **AI & Advanced Automation (Applied):** Gemini Function Calling, User-Scoped Tool Integration, Exponential Backoff & Retry Logic, Structured JSON Parsing

---

## PROJECT EXPERIENCE

### Boys Center — Youth & Sports Club Management Platform
*Independent Developer & System Owner | Production System*  
**GitHub:** [github.com/shadiahsraf/boys_center](https://github.com/shadiahsraf/boys_center) · **Live Demo:** [sports.boyscenter.online](http://sports.boyscenter.online/)  
**Technologies:** Python, Django, PostgreSQL, Odoo ERP (XML-RPC), Linux, Nginx, ReportLab, openpyxl, Alpine.js, PWA

- **Enterprise ERP Integration:** Engineered an environment-driven Odoo connector (`odoo_client.py`) supporting both `odoorpc` and Python standard `xmlrpc.client`, implementing idempotent member synchronization via custom Django management commands with `--dry-run` and `--full` reconciliation modes.
- **Data Reconciliation & Conflict Prevention:** Designed multi-tier matching logic (`odoo_id` → `email` → `member_code`) with change detection (`write_date`) and protected field policies (`NEVER_OVERWRITE`), preventing remote batch syncs from overriding local roles, passwords, or permissions.
- **Production Database Architecture:** Designed and manages a production PostgreSQL database serving ~500 active members with native UUID keys, JSON role fields, and relational constraints, eliminating database concurrency locks during peak check-in hours.
- **Automated Reporting Engines:** Automated operational reporting pipelines with ReportLab and openpyxl, delivering on-demand formatted PDF attendance summaries and multi-column styled Excel workbooks to club leadership.
- **Operational Workflow Automation:** Implemented token-validated QR-code attendance with expiring session tokens, duplicate check-in guards, and automatic late-arrival flags, governed by 5-role Role-Based Access Control (Admin, Coach Manager, Coach, Parent, Youth) and comprehensive action audit trails.
- **Production Deployment & Reliability:** Deployed and maintains the live system on Linux with Nginx reverse proxy, Gunicorn WSGI, HTTPS redirects, HSTS, CSRF protection, and ongoing server monitoring and troubleshooting.

### BOCHA Workspace — API-Driven Productivity & Automation Platform
*Personal Project (In Active Development)*  
**GitHub:** [github.com/shadiahsraf/BOCHA-Workspace](https://github.com/shadiahsraf/BOCHA-Workspace)  
**Technologies:** Python, Django REST Framework, PostgreSQL, JWT Authentication, Google OAuth, React 19, TypeScript, Zustand, Gemini API

- **REST API Architecture:** Developed a modular Django REST Framework backend with token pair authentication (JWT access/refresh) and Google OAuth integration, serving structured endpoints for tasks, projects, notes, and activity telemetry.
- **Data Isolation & Automated Testing:** Enforced strict tenant-scoped data filtering ensuring complete per-user isolation, validated with 27 automated API test methods covering authentication, permissions, and CRUD operations.
- **Integration Resilience & Backoff Algorithms:** Built an asynchronous retry pipeline featuring exponential backoff and jitter (`safe_gemini_call_async`) to handle HTTP 429 rate-limiting and 503 service unavailability with automatic model fallback.
- **Tool-Calling Integration:** Implemented user-scoped Python tools (`LifeOSToolbox`) allowing autonomous functions to safely query and mutate workspace records through authenticated Django ORM interfaces.

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
