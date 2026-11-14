"""
Script to generate Shadi_Ashraf_CV_Solutions_Engineer_ATS.pdf
Uses reportlab to generate a clean, ATS-compliant 2-page PDF.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    ListFlowable,
    ListItem,
)

OUTPUT_PDF = r"e:\portfolio_enhanced\assets\documents\Shadi_Ashraf_CV_Solutions_Engineer_ATS.pdf"

def generate_pdf():
    # 0.5 inch margins = 36 points
    margin = 36
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=letter,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin,
        title="Shadi Ashraf Adli Mehany — Junior Solutions Engineer CV (ATS)",
        author="Shadi Ashraf Adli Mehany",
        subject="Junior Solutions Engineer Application — DataScience Middle East FZCO",
        keywords="Solutions Engineer, Backend, Python, Django, PostgreSQL, REST APIs, Odoo, XML-RPC, System Integration, Linux, Automation"
    )

    styles = getSampleStyleSheet()

    # Custom styles
    # Name style
    name_style = ParagraphStyle(
        'CVName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=23,
        alignment=1, # Center
        textColor=colors.HexColor('#0f172a'),
    )

    # Subtitle / Headline
    headline_style = ParagraphStyle(
        'CVHeadline',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        alignment=1, # Center
        textColor=colors.HexColor('#1e293b'),
    )

    # Contact info
    contact_style = ParagraphStyle(
        'CVContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        alignment=1, # Center
        textColor=colors.HexColor('#334155'),
    )

    # Section Heading
    section_style = ParagraphStyle(
        'CVSection',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True,
    )

    # Body text
    body_style = ParagraphStyle(
        'CVBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=colors.HexColor('#1e293b'),
        alignment=4, # Justified
    )

    # Job / Project Title
    item_title_style = ParagraphStyle(
        'CVItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#0f172a'),
        keepWithNext=True,
    )

    # Sub-item meta (role, dates, links)
    meta_style = ParagraphStyle(
        'CVMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#475569'),
        keepWithNext=True,
    )

    # Bullet point text
    bullet_style = ParagraphStyle(
        'CVBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.75,
        leading=12.2,
        textColor=colors.HexColor('#1e293b'),
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3,
    )

    story = []

    # 1. Header
    story.append(Paragraph("Shadi Ashraf Adli Mehany", name_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Junior Solutions Engineer | Python &amp; Django | PostgreSQL | System Integration &amp; Automation", headline_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph(
        'Assiut, Egypt &nbsp;|&nbsp; +20 114 422 7242 &nbsp;|&nbsp; '
        '<a href="mailto:shadiadli3@gmail.com" color="#0284c7">shadiadli3@gmail.com</a><br/>'
        'LinkedIn: <a href="https://www.linkedin.com/in/shadi-ashraf-0643a02a9/" color="#0284c7">linkedin.com/in/shadi-ashraf-0643a02a9</a> &nbsp;|&nbsp; '
        'GitHub: <a href="https://github.com/shadiahsraf" color="#0284c7">github.com/shadiahsraf</a>',
        contact_style
    ))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=5))

    # 2. Professional Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
    story.append(Paragraph(
        "Motivated and analytical Junior Solutions Engineer with hands-on experience building database-driven backend "
        "applications, automating business workflows, and implementing enterprise system integrations. Independently developed "
        "and maintains <b>Boys Center</b>, a production Django and PostgreSQL platform deployed for ~500 active youth members, "
        "featuring live Odoo ERP synchronization over XML-RPC, tokenized QR attendance workflows, and automated PDF/Excel reporting. "
        "Engineered the REST API backend for <b>BOCHA Workspace</b> using Django REST Framework with JWT authentication, per-user data "
        "isolation, and 27 passing automated tests. Fourth-year Computer Science student at Assiut University (GPA 3.5, Class of 2027) "
        "with proven analytical problem-solving skills, Linux server administration experience, and a strong commitment to operational efficiency.",
        body_style
    ))
    story.append(Spacer(1, 3))

    # 3. Technical Skills
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#cbd5e1'), spaceBefore=3, spaceAfter=4))
    story.append(Paragraph("TECHNICAL SKILLS", section_style))
    
    skills_data = [
        ("Programming & Backend", "Python, Django, Django REST Framework, Django ORM, Object-Oriented Programming, Business Logic, Error Handling & Logging"),
        ("APIs & System Integration", "REST APIs, Odoo ERP Integration (XML-RPC / OdooRPC), HTTP/HTTPS, JSON, YAML, Webhooks, API Testing (Bruno, Postman), cURL"),
        ("Databases & Data Management", "PostgreSQL, SQL, SQLite, Database Design & Relational Modeling, Query Optimization (select_related, prefetch_related, Count, Avg), Transactions (@transaction.atomic), Schema Migrations"),
        ("Workflow Automation & Reporting", "Automated PDF Generation (ReportLab), Formatted Excel Exports (openpyxl), QR Code Verification Pipelines, Scheduled Batch Jobs (Cron / Django Management Commands)"),
        ("Environment & Server Operations", "Linux (Ubuntu/Debian), SSH, Bash Scripting, Nginx (Reverse Proxy & SSL/TLS Configuration), Gunicorn, Git & GitHub, Production Troubleshooting, Docker (Basic Familiarity)"),
        ("Frontend & UI Integration", "JavaScript (ES6+), TypeScript, React 19, Alpine.js, Tailwind CSS, Responsive Web Design, State Management (Zustand)"),
        ("AI & Advanced Automation (Applied)", "Gemini Function Calling, User-Scoped Tool Integration, Exponential Backoff & Retry Logic, Structured JSON Parsing")
    ]

    for category, details in skills_data:
        story.append(Paragraph(f"<b>{category}:</b> {details}", body_style))
        story.append(Spacer(1, 1.5))

    story.append(Spacer(1, 2))

    # 4. Project Experience
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#cbd5e1'), spaceBefore=3, spaceAfter=4))
    story.append(Paragraph("PROJECT EXPERIENCE", section_style))

    # Project 1: Boys Center
    story.append(Paragraph("Boys Center: Youth &amp; Sports Club Management Platform", item_title_style))
    story.append(Paragraph(
        'Independent Developer &amp; System Owner &nbsp;|&nbsp; Production System<br/>'
        'GitHub: <a href="https://github.com/shadiahsraf/boys_center" color="#0284c7">github.com/shadiahsraf/boys_center</a> &nbsp;|&nbsp; '
        'Live Demo: <a href="https://sports.boyscenter.online/ar" color="#0284c7">sports.boyscenter.online/ar</a><br/>'
        '<b>Technologies:</b> Python, Django, PostgreSQL, Odoo ERP (XML-RPC), Linux, Nginx, ReportLab, openpyxl, Alpine.js, PWA',
        meta_style
    ))
    story.append(Spacer(1, 2.5))

    boys_bullets = [
        "<b>Enterprise ERP Integration:</b> Engineered an environment-driven Odoo connector (<code>odoo_client.py</code>) supporting both <code>odoorpc</code> and Python standard <code>xmlrpc.client</code>, implementing idempotent member synchronization via custom Django management commands with <code>--dry-run</code> and <code>--full</code> reconciliation modes.",
        "<b>Data Reconciliation & Conflict Prevention:</b> Designed multi-tier matching logic (<code>odoo_id</code> &rarr; <code>email</code> &rarr; <code>member_code</code>) with change detection (<code>write_date</code>) and protected field policies (<code>NEVER_OVERWRITE</code>), preventing remote batch syncs from overriding local roles, passwords, or permissions.",
        "<b>Production Database Architecture:</b> Designed and manages a production PostgreSQL database serving ~500 active members with native UUID keys, JSON role fields, and relational constraints, eliminating database concurrency locks during peak check-in hours.",
        "<b>Automated Reporting Engines:</b> Automated operational reporting pipelines with ReportLab and openpyxl, delivering on-demand formatted PDF attendance summaries and multi-column styled Excel workbooks to club leadership.",
        "<b>Operational Workflow Automation:</b> Implemented token-validated QR-code attendance with expiring session tokens, duplicate check-in guards, and automatic late-arrival flags, governed by 5-role Role-Based Access Control (Admin, Coach Manager, Coach, Parent, Youth) and comprehensive action audit trails.",
        "<b>Production Deployment & Reliability:</b> Deployed and maintains the live system on Linux with Nginx reverse proxy, Gunicorn WSGI, HTTPS redirects, HSTS, CSRF protection, and ongoing server monitoring and troubleshooting."
    ]

    for b in boys_bullets:
        story.append(Paragraph(f"&bull;&nbsp; {b}", bullet_style))

    story.append(Spacer(1, 4))

    # Project 2: BOCHA Workspace
    story.append(Paragraph("BOCHA Workspace: API-Driven Productivity &amp; Automation Platform", item_title_style))
    story.append(Paragraph(
        'Personal Project (In Active Development)<br/>'
        'GitHub: <a href="https://github.com/shadiahsraf/BOCHA-Workspace" color="#0284c7">github.com/shadiahsraf/BOCHA-Workspace</a><br/>'
        '<b>Technologies:</b> Python, Django REST Framework, PostgreSQL, JWT Authentication, Google OAuth, React 19, TypeScript, Zustand, Gemini API',
        meta_style
    ))
    story.append(Spacer(1, 2.5))

    bocha_bullets = [
        "<b>REST API Architecture:</b> Developed a modular Django REST Framework backend with token pair authentication (JWT access/refresh) and Google OAuth integration, serving structured endpoints for tasks, projects, notes, and activity telemetry.",
        "<b>Data Isolation & Automated Testing:</b> Enforced strict tenant-scoped data filtering ensuring complete per-user isolation, validated with 27 automated API test methods covering authentication, permissions, and CRUD operations.",
        "<b>Integration Resilience & Backoff Algorithms:</b> Built an asynchronous retry pipeline featuring exponential backoff and jitter (<code>safe_gemini_call_async</code>) to handle HTTP 429 rate-limiting and 503 service unavailability with automatic model fallback.",
        "<b>Tool-Calling Integration:</b> Implemented user-scoped Python tools (<code>LifeOSToolbox</code>) allowing autonomous functions to safely query and mutate workspace records through authenticated Django ORM interfaces."
    ]

    for b in bocha_bullets:
        story.append(Paragraph(f"&bull;&nbsp; {b}", bullet_style))

    story.append(Spacer(1, 4))

    # 5. Education
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#cbd5e1'), spaceBefore=3, spaceAfter=4))
    story.append(Paragraph("EDUCATION", section_style))
    story.append(Paragraph("Assiut University, Faculty of Computers and Information", item_title_style))
    story.append(Paragraph("Bachelor of Science in Computer Science &nbsp;|&nbsp; Expected Graduation: 2027 &nbsp;|&nbsp; <b>GPA: 3.5 / 4.0</b>", meta_style))
    story.append(Paragraph(
        "<b>Core Academic Coursework:</b> Data Structures, Algorithms, Database Systems, Software Engineering, "
        "Operating Systems, Computer Networks, Object-Oriented Analysis &amp; Design, Distributed Computing.",
        body_style
    ))
    story.append(Spacer(1, 3))

    # 6. Certifications & Technical Specializations
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#cbd5e1'), spaceBefore=3, spaceAfter=4))
    story.append(Paragraph("CERTIFICATIONS &amp; TECHNICAL SPECIALIZATIONS", section_style))

    story.append(Paragraph(
        "<b>Building AI Agents &amp; Agentic Workflows Specialization</b> &mdash; IBM (Coursera) &nbsp;|&nbsp; October 2026<br/>"
        "<font color='#475569'><i>Focus: Multi-step automated workflows, tool calling, API integration, and structured decision pipelines.</i></font>",
        body_style
    ))
    story.append(Spacer(1, 2))
    story.append(Paragraph(
        "<b>Modern AI-Assisted Software Engineering &amp; Web Development Specialization</b> &mdash; LearnQuest (Coursera) &nbsp;|&nbsp; November 2026<br/>"
        "<font color='#475569'><i>Focus: Enterprise software best practices, API integrations, third-party database connections, automated debugging, and code quality.</i></font>",
        body_style
    ))

    # Build document
    doc.build(story)
    print(f"PDF successfully generated at: {OUTPUT_PDF}")

if __name__ == '__main__':
    generate_pdf()
