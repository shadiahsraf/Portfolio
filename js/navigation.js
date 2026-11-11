/**
 * Navigation controller:
 * - Sticky header scroll elevation (#site-header)
 * - Responsive navigation drawer (#mobile-drawer) preserving nav ARIA states & desktop-breakpoint sync
 * - IntersectionObserver ScrollSpy across primary and drawer links
 */
(function () {
  'use strict';

  var NAV_SECTION_IDS = [
    'about',
    'skills',
    'projects',
    'ai-agents',
    'certifications',
    'education',
    'contact'
  ];

  function initNavigation() {
    var runtime = window.Portfolio;
    var header = document.getElementById('site-header');
    var menuToggle = document.getElementById('menu-toggle');
    var mobileDrawer = document.getElementById('mobile-drawer');
    var desktopLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav .nav-link'));
    var drawerLinks = Array.prototype.slice.call(document.querySelectorAll('[data-drawer-link]'));
    var allSectionLinks = desktopLinks.concat(drawerLinks);

    // 1. Sticky Header Scroll State
    function syncHeaderScroll() {
      if (!header) return;
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    syncHeaderScroll();
    window.addEventListener('scroll', syncHeaderScroll, { passive: true });

    // 2. ScrollSpy via IntersectionObserver
    function setActiveLink(sectionId) {
      var targetHash = '#' + sectionId;
      for (var i = 0; i < allSectionLinks.length; i += 1) {
        var link = allSectionLinks[i];
        var matches = link.getAttribute('href') === targetHash;
        if (matches) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      }
    }

    var trackedSections = NAV_SECTION_IDS.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    if (trackedSections.length > 0 && typeof window.IntersectionObserver === 'function') {
      var visibleRatios = {};

      var observer = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i += 1) {
            var entry = entries[i];
            visibleRatios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
          }

          var bestId = null;
          var bestScore = 0;
          for (var j = 0; j < trackedSections.length; j += 1) {
            var sec = trackedSections[j];
            var score = visibleRatios[sec.id] || 0;
            if (score > bestScore) {
              bestScore = score;
              bestId = sec.id;
            }
          }
          if (bestId) {
            setActiveLink(bestId);
          }
        },
        {
          rootMargin: '-20% 0px -55% 0px',
          threshold: [0, 0.15, 0.4, 0.7]
        }
      );

      for (var s = 0; s < trackedSections.length; s += 1) {
        observer.observe(trackedSections[s]);
      }
    }

    // 3. Mobile Navigation Drawer
    if (!menuToggle || !mobileDrawer || !runtime) return;

    var pendingNavigationTarget = null;
    var desktopMq = typeof window.matchMedia === 'function'
      ? window.matchMedia('(min-width: 961px)')
      : null;

    function focusNavDestination(sectionEl) {
      if (!sectionEl) return;
      var hadTabIndex = sectionEl.hasAttribute('tabindex');
      var prevTabIndex = sectionEl.getAttribute('tabindex');
      if (!hadTabIndex) {
        sectionEl.setAttribute('tabindex', '-1');
      }
      sectionEl.focus({ preventScroll: true });
      if (!hadTabIndex) {
        sectionEl.addEventListener(
          'blur',
          function cleanupTabIndex() {
            sectionEl.removeAttribute('tabindex');
            sectionEl.removeEventListener('blur', cleanupTabIndex);
          },
          { once: true }
        );
      } else if (prevTabIndex !== null) {
        sectionEl.setAttribute('tabindex', prevTabIndex);
      }
    }

    function openDrawer() {
      menuToggle.setAttribute('aria-expanded', 'true');
      runtime.openOverlay({
        element: mobileDrawer,
        bodyClass: 'drawer-open',
        triggerEl: menuToggle,
        trapSelector: '.mobile-drawer-panel',
        closeSelector: '[data-drawer-close]',
        initialFocusSelector: '#drawer-close',
        fallbackFocusSelector: '.brand-mark',
        onAfterClose: function () {
          menuToggle.setAttribute('aria-expanded', 'false');
          if (pendingNavigationTarget) {
            var targetSection = pendingNavigationTarget;
            pendingNavigationTarget = null;
            window.requestAnimationFrame(function () {
              focusNavDestination(targetSection);
            });
          }
        }
      });
    }

    function closeDrawer(options) {
      if (runtime.isOverlayOpen(mobileDrawer)) {
        runtime.closeActiveOverlay(options);
      }
    }

    menuToggle.addEventListener('click', function () {
      if (runtime.isOverlayOpen(mobileDrawer)) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    for (var d = 0; d < drawerLinks.length; d += 1) {
      drawerLinks[d].addEventListener('click', function (event) {
        var href = event.currentTarget.getAttribute('href') || '';
        if (href.charAt(0) === '#') {
          var targetId = href.slice(1);
          var targetEl = document.getElementById(targetId);
          pendingNavigationTarget = targetEl || null;
          setActiveLink(targetId);
          closeDrawer({ restoreFocus: false });
          if (targetEl) {
            event.preventDefault();
            targetEl.scrollIntoView({
              behavior: runtime.prefersReducedMotion() ? 'auto' : 'smooth'
            });
          }
        } else {
          closeDrawer({ restoreFocus: false });
        }
      });
    }

    function handleDesktopBreakpoint(event) {
      if (event.matches && runtime.isOverlayOpen(mobileDrawer)) {
        // When switching to desktop width, menuToggle becomes hidden; move focus safely to brand/desktop nav.
        var firstDesktopLink = desktopLinks[0] || document.querySelector('.brand-mark');
        closeDrawer({
          restoreFocus: true,
          nextFocusEl: firstDesktopLink
        });
      }
    }

    if (desktopMq) {
      if (typeof desktopMq.addEventListener === 'function') {
        desktopMq.addEventListener('change', handleDesktopBreakpoint);
      } else if (typeof desktopMq.addListener === 'function') {
        desktopMq.addListener(handleDesktopBreakpoint);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
