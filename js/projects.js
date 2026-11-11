/**
 * Featured Projects controller:
 * - Reads existing gallery structure and verified WebP paths directly from [data-gallery] HTML hooks
 * - Provides configurable Boys Center live website button control
 * - Handles inline thumbnail stage switching (click + Left/Right keyboard arrows)
 * - Drives accessible full-screen screenshot lightbox (#project-lightbox) via Portfolio.openOverlay
 */
(function () {
  'use strict';

  /**
   * Toggle enabled to true once the external server URL is verified live.
   */
  var LIVE_DEMO_CONFIG = {
    'boys-center': {
      enabled: false,
      url: 'https://sports.boyscenter.online/ar/',
      liveLabel: 'Live Website',
      disabledLabel: 'Live Website · Pending Verification',
      disabledTitle: 'Availability pending server verification'
    }
  };

  /**
   * Descriptive stage captions and alt text keyed cleanly by project ID & index,
   * complementing image paths and short button labels read directly from HTML.
   */
  var SHOT_DESCRIPTIONS = {
    'boys-center': [
      {
        caption: 'Youth Player Dashboard (Profile, Stats & Attendance)',
        alt: 'Boys Center youth dashboard displaying member code, session attendance count, and evaluation scores'
      },
      {
        caption: 'Club & Team Leaderboard',
        alt: 'Boys Center youth leaderboard showing season points and top-ranked club players'
      },
      {
        caption: 'Match Schedules & League Results',
        alt: 'Boys Center youth matches view displaying scheduled fixtures and recorded scores'
      },
      {
        caption: 'Youth Events & Activity Registrations',
        alt: 'Boys Center events page displaying upcoming club activities and schedules'
      },
      {
        caption: 'Squads & Team Rosters',
        alt: 'Boys Center teams view presenting club squads and coach assignments'
      },
      {
        caption: 'Club News & Announcements',
        alt: 'Boys Center club news page highlighting updates and announcements for members'
      }
    ],
    'bocha-workspace': [
      {
        caption: 'Workspace Overview Dashboard & Statistics',
        alt: 'BOCHA Workspace overview dashboard displaying task statistics, priority items, and active project progress'
      },
      {
        caption: 'Gemini Function-Calling AI Assistant',
        alt: 'BOCHA Workspace AI assistant interface for tool-calling task and project actions'
      },
      {
        caption: 'Tasks Kanban & Status Workflow',
        alt: 'BOCHA Workspace tasks Kanban board organized by workflow status'
      },
      {
        caption: 'Projects & Computed Completion Progress',
        alt: 'BOCHA Workspace projects view showing project cards and computed completion progress'
      },
      {
        caption: 'Schedule & Calendar View',
        alt: 'BOCHA Workspace calendar view organizing dated tasks and deadlines'
      },
      {
        caption: 'GTD Quick Capture Inbox',
        alt: 'BOCHA Workspace GTD inbox view for capturing and processing incoming items'
      },
      {
        caption: 'Settings, Theme Switching & 5-Pillar Bio',
        alt: 'BOCHA Workspace settings and bio configuration supporting light and dark themes'
      }
    ]
  };

  function padTwo(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function formatCounter(index, total) {
    return padTwo(index + 1) + ' / ' + padTwo(total);
  }

  /**
   * Builds/syncs the configurable Boys Center live button inside [data-live-slot].
   */
  function hydrateLiveSlots() {
    var projectIds = Object.keys(LIVE_DEMO_CONFIG);
    for (var i = 0; i < projectIds.length; i += 1) {
      var projectId = projectIds[i];
      var cfg = LIVE_DEMO_CONFIG[projectId];
      var slot = document.querySelector('[data-live-slot="' + projectId + '"]');
      if (!slot || !cfg) continue;

      slot.textContent = '';

      if (cfg.enabled && cfg.url) {
        var link = document.createElement('a');
        link.className = 'btn btn-outline btn-sm';
        link.href = cfg.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = cfg.liveLabel + ' ';
        var arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '\u2197';
        link.appendChild(arrow);
        slot.appendChild(link);
      } else {
        var disabledBtn = document.createElement('button');
        disabledBtn.type = 'button';
        disabledBtn.className = 'btn btn-muted btn-sm is-disabled';
        disabledBtn.disabled = true;
        if (cfg.disabledTitle) {
          disabledBtn.title = cfg.disabledTitle;
        }
        disabledBtn.textContent = cfg.disabledLabel;
        slot.appendChild(disabledBtn);
      }
    }
  }

  /**
   * Extracts ordered screenshot metadata directly from existing HTML gallery markup.
   */
  function readGalleryFromDom(stageEl) {
    var projectId = stageEl.getAttribute('data-gallery') || '';
    var articleEl = stageEl.closest('.case-study');
    var titleEl = articleEl ? articleEl.querySelector('.case-study-title') : null;
    var projectTitle = titleEl ? titleEl.textContent.trim() : projectId;

    var stageImage = stageEl.querySelector('[data-stage-image]');
    var stageCaption = stageEl.querySelector('[data-stage-caption]');
    var expandBtn = stageEl.querySelector('[data-lightbox-open]');
    var thumbsWrap = stageEl.querySelector('[data-stage-thumbs]');
    var thumbBtns = Array.prototype.slice.call(stageEl.querySelectorAll('.thumb-btn'));
    var extraMeta = SHOT_DESCRIPTIONS[projectId] || [];

    var shots = thumbBtns.map(function (btn, idx) {
      var img = btn.querySelector('img');
      var labelEl = btn.querySelector('span');
      var src = img ? img.getAttribute('src') : '';
      var label = labelEl ? labelEl.textContent.trim() : 'Screenshot ' + (idx + 1);
      var meta = extraMeta[idx] || {};
      return {
        index: idx,
        src: src,
        label: label,
        caption: meta.caption || label,
        alt: meta.alt || projectTitle + ' — ' + label
      };
    });

    return {
      projectId: projectId,
      projectTitle: projectTitle,
      stageEl: stageEl,
      stageImage: stageImage,
      stageCaption: stageCaption,
      expandBtn: expandBtn,
      thumbsWrap: thumbsWrap,
      thumbBtns: thumbBtns,
      shots: shots,
      activeIndex: 0
    };
  }

  function initProjects() {
    hydrateLiveSlots();

    var runtime = window.Portfolio;
    var stageEls = Array.prototype.slice.call(document.querySelectorAll('[data-gallery]'));
    if (stageEls.length === 0) return;

    var galleries = {};

    var lightboxEl = document.getElementById('project-lightbox');
    var lightboxTitleEl = document.getElementById('lightbox-title');
    var lightboxCounterEl = document.getElementById('lightbox-counter');
    var lightboxImageEl = document.getElementById('lightbox-image');
    var lightboxCaptionEl = document.getElementById('lightbox-caption');
    var lightboxPrevBtn = document.getElementById('lightbox-prev');
    var lightboxNextBtn = document.getElementById('lightbox-next');

    var lightboxStageEl = lightboxEl ? lightboxEl.querySelector('.lightbox-stage') : null;
    var lightboxErrorEl = null;
    var currentLightbox = { projectId: null, index: 0 };

    function ensureLightboxErrorEl() {
      if (!lightboxStageEl) return null;
      if (!lightboxErrorEl) {
        lightboxErrorEl = document.createElement('p');
        lightboxErrorEl.className = 'lightbox-fallback';
        lightboxErrorEl.style.color = 'var(--text-on-dark)';
        lightboxErrorEl.style.padding = '2rem';
        lightboxErrorEl.style.textAlign = 'center';
        lightboxErrorEl.hidden = true;
        lightboxStageEl.appendChild(lightboxErrorEl);
      }
      return lightboxErrorEl;
    }

    function selectGalleryShot(gallery, index) {
      if (!gallery || gallery.shots.length === 0) return;
      var total = gallery.shots.length;
      var targetIdx = ((index % total) + total) % total;
      var shot = gallery.shots[targetIdx];
      gallery.activeIndex = targetIdx;

      for (var i = 0; i < gallery.thumbBtns.length; i += 1) {
        var btn = gallery.thumbBtns[i];
        var isCurrent = i === targetIdx;
        btn.classList.toggle('is-active', isCurrent);
        btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      }

      if (gallery.stageCaption) {
        gallery.stageCaption.textContent = formatCounter(targetIdx, total) + ' \u2014 ' + shot.caption;
      }

      if (gallery.stageImage && shot.src) {
        var reduceMotion = runtime && runtime.prefersReducedMotion();
        if (gallery.stageImage.getAttribute('src') !== shot.src) {
          if (!reduceMotion) {
            gallery.stageImage.classList.add('is-switching');
          }
          gallery.stageImage.alt = shot.alt;
          gallery.stageImage.onload = function () {
            gallery.stageImage.classList.remove('is-switching');
          };
          gallery.stageImage.onerror = function () {
            gallery.stageImage.classList.remove('is-switching');
            if (gallery.stageCaption) {
              gallery.stageCaption.textContent =
                formatCounter(targetIdx, total) + ' \u2014 Unable to load image: ' + shot.caption;
            }
          };
          gallery.stageImage.src = shot.src;
          if (gallery.stageImage.complete) {
            gallery.stageImage.classList.remove('is-switching');
          }
        } else {
          gallery.stageImage.alt = shot.alt;
        }
      }
    }

    function renderLightboxShot(gallery, index) {
      if (!gallery || !lightboxEl || gallery.shots.length === 0) return;
      var total = gallery.shots.length;
      var targetIdx = ((index % total) + total) % total;
      var shot = gallery.shots[targetIdx];

      currentLightbox.projectId = gallery.projectId;
      currentLightbox.index = targetIdx;

      if (lightboxTitleEl) {
        lightboxTitleEl.textContent = gallery.projectTitle;
      }
      if (lightboxCounterEl) {
        lightboxCounterEl.textContent = formatCounter(targetIdx, total);
      }
      if (lightboxCaptionEl) {
        lightboxCaptionEl.textContent = shot.caption;
      }

      var errorNode = ensureLightboxErrorEl();
      if (errorNode) {
        errorNode.hidden = true;
        errorNode.textContent = '';
      }

      if (lightboxImageEl && shot.src) {
        lightboxImageEl.hidden = false;
        lightboxImageEl.alt = shot.alt;
        lightboxImageEl.onload = function () {
          if (errorNode) errorNode.hidden = true;
          lightboxImageEl.hidden = false;
        };
        lightboxImageEl.onerror = function () {
          lightboxImageEl.hidden = true;
          if (errorNode) {
            errorNode.textContent = 'Preview image could not be loaded: ' + shot.caption;
            errorNode.hidden = false;
          }
        };
        lightboxImageEl.src = shot.src;
      }
    }

    function openLightbox(projectId, triggerEl) {
      var gallery = galleries[projectId];
      if (!gallery || !lightboxEl || !runtime) return;

      renderLightboxShot(gallery, gallery.activeIndex);
      runtime.openOverlay({
        element: lightboxEl,
        bodyClass: 'modal-open',
        triggerEl: triggerEl,
        trapSelector: '.modal-dialog',
        closeSelector: '[data-modal-close]',
        initialFocusSelector: '.icon-close-btn',
        onKeyDown: function (event) {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stepLightbox(-1);
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            stepLightbox(1);
          }
        },
        onAfterClose: function () {
          if (lightboxImageEl) {
            lightboxImageEl.hidden = true;
            lightboxImageEl.removeAttribute('src');
            lightboxImageEl.alt = '';
          }
          if (lightboxErrorEl) {
            lightboxErrorEl.hidden = true;
            lightboxErrorEl.textContent = '';
          }
        }
      });
    }

    function stepLightbox(delta) {
      if (!currentLightbox.projectId) return;
      var gallery = galleries[currentLightbox.projectId];
      if (!gallery) return;
      var nextIdx = currentLightbox.index + delta;
      renderLightboxShot(gallery, nextIdx);
      selectGalleryShot(gallery, nextIdx);
    }

    // Bind inline stage controls across all project galleries
    for (var g = 0; g < stageEls.length; g += 1) {
      (function (gallery) {
        if (!gallery.projectId) return;
        galleries[gallery.projectId] = gallery;

        for (var b = 0; b < gallery.thumbBtns.length; b += 1) {
          (function (btn, btnIndex) {
            btn.addEventListener('click', function () {
              selectGalleryShot(gallery, btnIndex);
            });

            btn.addEventListener('keydown', function (event) {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                var next = (btnIndex + 1) % gallery.thumbBtns.length;
                selectGalleryShot(gallery, next);
                gallery.thumbBtns[next].focus();
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                var prev =
                  (btnIndex - 1 + gallery.thumbBtns.length) % gallery.thumbBtns.length;
                selectGalleryShot(gallery, prev);
                gallery.thumbBtns[prev].focus();
              }
            });
          })(gallery.thumbBtns[b], b);
        }

        if (gallery.expandBtn) {
          gallery.expandBtn.addEventListener('click', function (event) {
            openLightbox(gallery.projectId, event.currentTarget);
          });
        }
      })(readGalleryFromDom(stageEls[g]));
    }

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', function () {
        stepLightbox(-1);
      });
    }
    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', function () {
        stepLightbox(1);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
  } else {
    initProjects();
  }
})();
