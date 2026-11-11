/**
 * Certifications specialization & nested course modal controller:
 * - Preserves exact verified diploma/course PNGs, dates, and missing-image distinctions
 * - Shows verified Coursera URL strictly for the single course certificate containing it
 * - Uses safe DOM element creation and shared Portfolio overlay focus lifecycle
 */
(function () {
  'use strict';

  var SPECIALIZATIONS = {
    'ibm-agents': {
      issuer: 'IBM · Coursera',
      title: 'Building AI Agents and Agentic Workflows',
      kind: 'Specialization Diploma',
      date: 'Oct 26, 2026',
      image: 'assets/certificates/Building%20AI%20agents%20and%20agentic%20workflows%20specialization.png',
      alt: 'IBM Coursera Specialization Certificate for Building AI Agents and Agentic Workflows awarded to Shadi Ashraf Adli on October 26, 2026',
      description:
        'Three-course specialization covering AI agent fundamentals, stateful LangChain and LangGraph workflows, agentic RAG, and multi-agent patterns using CrewAI, AutoGen, and IBM BeeAI.',
      verifyUrl: null,
      courses: [
        {
          id: 'ibm-course-1',
          title: 'Fundamentals of Building AI Agents',
          kind: 'Course 1 of 3 · Component',
          date: 'Included in Specialization',
          image: null,
          alt: '',
          description:
            'Core concepts of LLM-powered AI agents, prompt reasoning patterns, tool usage, and structured workflow basics within the IBM specialization.',
          verifyUrl: null,
          statusText: 'Covered by Diploma · No individual image file'
        },
        {
          id: 'ibm-course-2',
          title: 'Agentic AI with LangChain and LangGraph',
          kind: 'Course 2 of 3 · Component',
          date: 'Included in Specialization',
          image: null,
          alt: '',
          description:
            'Guided labs constructing stateful LangGraph agents with memory, conditional edges, reflexion loops, and agentic RAG patterns.',
          verifyUrl: null,
          statusText: 'Covered by Diploma · No individual image file'
        },
        {
          id: 'ibm-course-3',
          title: 'Agentic AI with LangGraph, CrewAI, AutoGen and BeeAI',
          kind: 'Course Certificate (3 of 3)',
          date: 'Oct 26, 2026',
          image: 'assets/certificates/Agentic%20AI%20with%20LangGraph,%20CrewAI,%20AutoGen%20and%20BeeAI.png',
          alt: 'IBM Coursera Course Certificate for Agentic AI with LangGraph, CrewAI, AutoGen and BeeAI awarded to Shadi Ashraf Adli on October 26, 2026',
          description:
            'Multi-agent collaboration patterns implemented in guided coursework using LangGraph, CrewAI, AutoGen (AG2), and IBM BeeAI.',
          verifyUrl: 'https://coursera.org/verify/DEWLLR59LFD2',
          statusText: 'Course Image Attached · Coursera Verify URL'
        }
      ]
    },
    'learnquest-vibe': {
      issuer: 'LearnQuest · Coursera',
      title: 'Vibe Coding and Agentic Engineering',
      kind: 'Specialization Diploma',
      date: 'Nov 1, 2026',
      image: 'assets/certificates/Vibe%20coding%20and%20agentic%20AI%20specialization.png',
      alt: 'LearnQuest Coursera Specialization Certificate for Vibe Coding and Agentic Engineering awarded to Shadi Ashraf Adli on November 1, 2026',
      description:
        'Three-course specialization focused on building, debugging, and shipping full-stack web applications with AI coding assistants, prompt engineering, third-party APIs, and code quality practices.',
      verifyUrl: null,
      courses: [
        {
          id: 'lq-course-1',
          title: 'Foundations of AI-Assisted Web Development',
          kind: 'Course Certificate (1 of 3)',
          date: 'Oct 28, 2026',
          image: 'assets/certificates/Foundations%20of%20AI-Assisted%20Web%20Development.png',
          alt: 'LearnQuest Coursera Course Certificate for Foundations of AI-Assisted Web Development awarded to Shadi Ashraf Adli on October 28, 2026',
          description:
            'Prompt engineering, structured task decomposition, and foundational workflows using AI coding assistants.',
          verifyUrl: null,
          statusText: 'Course Image Attached · Oct 28, 2026'
        },
        {
          id: 'lq-course-2',
          title: 'Build Real-World Applications with AI',
          kind: 'Course Certificate (2 of 3)',
          date: 'Oct 30, 2026',
          image: 'assets/certificates/build%20real%20world%20apps%20with%20AI.png',
          alt: 'LearnQuest Coursera Course Certificate for Build Real-World Applications with AI awarded to Shadi Ashraf Adli on October 30, 2026',
          description:
            'Applying AI coding workflows to third-party API integration, persistence, and end-to-end application features.',
          verifyUrl: null,
          statusText: 'Course Image Attached · Oct 30, 2026'
        },
        {
          id: 'lq-course-3',
          title: 'Scale and Professionalize AI-Built Projects',
          kind: 'Course Certificate (3 of 3)',
          date: 'Nov 1, 2026',
          image: 'assets/certificates/Scale%20and%20Professionalize%20AI-Built%20Projects.png',
          alt: 'LearnQuest Coursera Course Certificate for Scale and Professionalize AI-Built Projects awarded to Shadi Ashraf Adli on November 1, 2026',
          description:
            'Debugging, code quality review, maintainability, technical documentation, and application readiness practices.',
          verifyUrl: null,
          statusText: 'Course Image Attached · Nov 1, 2026'
        }
      ]
    }
  };

  function initCertificates() {
    var runtime = window.Portfolio;
    var modalEl = document.getElementById('certificate-modal');
    if (!modalEl || !runtime) return;

    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-cert-open]'));
    if (triggers.length === 0) return;

    var issuerEl = document.getElementById('cert-modal-issuer');
    var titleEl = document.getElementById('cert-modal-title');
    var imageEl = document.getElementById('cert-modal-image');
    var emptyEl = document.getElementById('cert-modal-empty');
    var kindEl = document.getElementById('cert-modal-kind');
    var dateEl = document.getElementById('cert-modal-date');
    var descEl = document.getElementById('cert-modal-desc');
    var verifyBoxEl = document.getElementById('cert-modal-verify');
    var verifyLinkEl = document.getElementById('cert-modal-verify-link');
    var backBtn = document.getElementById('cert-back-to-spec');
    var courseListEl = document.getElementById('cert-course-list');

    var defaultEmptyText = emptyEl ? emptyEl.textContent : '';
    var currentSpecId = null;
    var currentCourseId = null;

    function showEmptyMessage(message) {
      if (imageEl) {
        imageEl.hidden = true;
        imageEl.removeAttribute('src');
        imageEl.alt = '';
      }
      if (emptyEl) {
        emptyEl.textContent = message || defaultEmptyText;
        emptyEl.hidden = false;
      }
    }

    function renderCredentialView(spec, item, isCourse) {
      if (issuerEl) issuerEl.textContent = spec.issuer;
      if (titleEl) titleEl.textContent = item.title;
      if (kindEl) kindEl.textContent = item.kind;
      if (dateEl) dateEl.textContent = item.date;
      if (descEl) descEl.textContent = item.description;

      if (backBtn) {
        backBtn.hidden = !isCourse;
      }

      if (verifyBoxEl && verifyLinkEl) {
        if (item.verifyUrl) {
          verifyLinkEl.href = item.verifyUrl;
          verifyBoxEl.hidden = false;
        } else {
          verifyLinkEl.removeAttribute('href');
          verifyBoxEl.hidden = true;
        }
      }

      if (item.image && imageEl) {
        if (emptyEl) {
          emptyEl.textContent = defaultEmptyText;
          emptyEl.hidden = true;
        }
        imageEl.hidden = false;
        imageEl.alt = item.alt || item.title;
        imageEl.onload = function () {
          if (emptyEl) emptyEl.hidden = true;
          imageEl.hidden = false;
        };
        imageEl.onerror = function () {
          showEmptyMessage('Unable to load the certificate image file.');
        };
        imageEl.src = item.image;
      } else {
        showEmptyMessage(defaultEmptyText);
      }
    }

    function renderCourseButtons(spec) {
      if (!courseListEl) return;
      courseListEl.textContent = '';

      for (var i = 0; i < spec.courses.length; i += 1) {
        (function (course) {
          var li = document.createElement('li');
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cert-course-btn';
          btn.setAttribute('data-course-id', course.id);
          var isSelected = currentCourseId === course.id;
          if (isSelected) {
            btn.classList.add('is-active');
            btn.setAttribute('aria-pressed', 'true');
          } else {
            btn.setAttribute('aria-pressed', 'false');
          }

          var nameSpan = document.createElement('span');
          nameSpan.className = 'cert-course-name';
          nameSpan.textContent = course.title;

          var statusSpan = document.createElement('span');
          statusSpan.className = 'cert-course-status';
          statusSpan.textContent = course.statusText;

          btn.appendChild(nameSpan);
          btn.appendChild(statusSpan);

          btn.addEventListener('click', function () {
            currentCourseId = course.id;
            renderCredentialView(spec, course, true);
            syncActiveCourseButtons();
          });

          li.appendChild(btn);
          courseListEl.appendChild(li);
        })(spec.courses[i]);
      }
    }

    function syncActiveCourseButtons() {
      if (!courseListEl) return;
      var buttons = courseListEl.querySelectorAll('.cert-course-btn');
      for (var i = 0; i < buttons.length; i += 1) {
        var btn = buttons[i];
        var active = btn.getAttribute('data-course-id') === currentCourseId;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      }
    }

    function openSpecializationModal(specId, triggerEl) {
      var spec = SPECIALIZATIONS[specId];
      if (!spec) return;

      currentSpecId = specId;
      currentCourseId = null;

      renderCredentialView(spec, spec, false);
      renderCourseButtons(spec);

      runtime.openOverlay({
        element: modalEl,
        bodyClass: 'modal-open',
        triggerEl: triggerEl,
        trapSelector: '.modal-dialog',
        closeSelector: '[data-modal-close]',
        initialFocusSelector: '.icon-close-btn',
        onAfterClose: function () {
          if (imageEl) {
            imageEl.hidden = true;
            imageEl.removeAttribute('src');
            imageEl.alt = '';
          }
          if (verifyLinkEl) {
            verifyLinkEl.removeAttribute('href');
          }
          if (verifyBoxEl) {
            verifyBoxEl.hidden = true;
          }
          if (emptyEl) {
            emptyEl.textContent = defaultEmptyText;
            emptyEl.hidden = true;
          }
          currentSpecId = null;
          currentCourseId = null;
        }
      });
    }

    for (var t = 0; t < triggers.length; t += 1) {
      triggers[t].addEventListener('click', function (event) {
        var trigger = event.currentTarget;
        var specId = trigger.getAttribute('data-cert-open');
        openSpecializationModal(specId, trigger);
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (!currentSpecId || !SPECIALIZATIONS[currentSpecId]) return;
        currentCourseId = null;
        renderCredentialView(SPECIALIZATIONS[currentSpecId], SPECIALIZATIONS[currentSpecId], false);
        syncActiveCourseButtons();
        if (courseListEl) {
          var firstCourseBtn = courseListEl.querySelector('.cert-course-btn');
          if (firstCourseBtn) firstCourseBtn.focus();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertificates);
  } else {
    initCertificates();
  }
})();
