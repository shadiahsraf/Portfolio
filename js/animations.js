/**
 * Header Scroll Progress & Restrained GSAP Choreography:
 * - Updates root --scroll-progress [0..1] via passive scroll/resize listeners and rAF batching
 * - Keeps hero monochrome portrait immediately visible (opacity: 1) and never blocks content
 * - Coordinates masked hero display lines, grouped grids, and restrained case-study reveals
 * - Progressively enhances only when gsap + ScrollTrigger exist and honors live reduced-motion toggles
 */
(function () {
  'use strict';

  var hasInitializedModule = false;

  /**
   * Synchronizes --scroll-progress on <html> using requestAnimationFrame batching
   * so reading layout geometry and writing CSS variables never interleave or thrash.
   */
  function initHeaderScrollProgress(rootEl) {
    if (!rootEl) return;

    var rafId = null;
    var lastProgressValue = null;

    function updateScrollProgress() {
      rafId = null;

      var scrollTop = window.scrollY || window.pageYOffset || rootEl.scrollTop || 0;
      var maxScroll = Math.max(0, rootEl.scrollHeight - window.innerHeight);

      var progress;
      if (maxScroll <= 0 || scrollTop <= 0) {
        progress = 0;
      } else if (scrollTop >= maxScroll - 0.75) {
        progress = 1;
      } else {
        progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      }

      var formatted = progress === 0 ? '0' : progress === 1 ? '1' : progress.toFixed(4);
      if (formatted !== lastProgressValue) {
        lastProgressValue = formatted;
        rootEl.style.setProperty('--scroll-progress', formatted);
      }
    }

    function scheduleScrollProgressUpdate() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateScrollProgress);
    }

    function cancelPendingProgressFrame() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    updateScrollProgress();

    window.addEventListener('scroll', scheduleScrollProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollProgressUpdate, { passive: true });
    window.addEventListener('load', scheduleScrollProgressUpdate, { passive: true });
    window.addEventListener('pageshow', scheduleScrollProgressUpdate);
    window.addEventListener('pagehide', cancelPendingProgressFrame);
  }

  function initGsapChoreography(rootEl) {
    var runtime = window.Portfolio;
    var activeTweens = [];
    var activeTimelines = [];
    var activeTriggers = [];
    var trackedNodes = [];
    var isInitialized = false;
    var hasEverTornDown = false;
    var scrollBehaviorPatched = false;
    var savedScrollBehavior = '';

    function addTrackedNode(el) {
      if (el && trackedNodes.indexOf(el) === -1) {
        trackedNodes.push(el);
      }
    }

    function registerTimeline(tl) {
      if (!tl) return;
      activeTimelines.push(tl);
      if (tl.scrollTrigger) {
        activeTriggers.push(tl.scrollTrigger);
      }
    }

    function registerTween(tw) {
      if (!tw) return;
      activeTweens.push(tw);
      if (tw.scrollTrigger) {
        activeTriggers.push(tw.scrollTrigger);
      }
    }

    function getAllAnimatedNodes() {
      var baseTargets = Array.prototype.slice.call(
        document.querySelectorAll('[data-hero-anim], [data-reveal]')
      );
      var combined = baseTargets.slice();
      for (var i = 0; i < trackedNodes.length; i += 1) {
        if (combined.indexOf(trackedNodes[i]) === -1) {
          combined.push(trackedNodes[i]);
        }
      }
      return combined;
    }

    function teardownAnimations() {
      for (var i = 0; i < activeTriggers.length; i += 1) {
        if (activeTriggers[i] && typeof activeTriggers[i].kill === 'function') {
          activeTriggers[i].kill();
        }
      }
      activeTriggers = [];

      for (var t = 0; t < activeTimelines.length; t += 1) {
        if (activeTimelines[t] && typeof activeTimelines[t].kill === 'function') {
          activeTimelines[t].kill();
        }
      }
      activeTimelines = [];

      for (var j = 0; j < activeTweens.length; j += 1) {
        if (activeTweens[j] && typeof activeTweens[j].kill === 'function') {
          activeTweens[j].kill();
        }
      }
      activeTweens = [];

      var nodes = getAllAnimatedNodes();
      if (window.gsap && nodes.length > 0) {
        try {
          window.gsap.set(nodes, { clearProps: 'opacity,transform,willChange,clipPath' });
        } catch (err) {
          // Safe fallback handled below
        }
      }

      for (var k = 0; k < nodes.length; k += 1) {
        nodes[k].style.opacity = '';
        nodes[k].style.transform = '';
        nodes[k].style.willChange = '';
        nodes[k].style.clipPath = '';
      }

      trackedNodes = [];
      rootEl.classList.remove('js-anim-ready');
      isInitialized = false;
      hasEverTornDown = true;
    }

    function ensureScrollBehaviorGuard(ScrollTrigger) {
      if (scrollBehaviorPatched) return;
      scrollBehaviorPatched = true;
      ScrollTrigger.addEventListener('refreshInit', function () {
        savedScrollBehavior = rootEl.style.scrollBehavior;
        rootEl.style.scrollBehavior = 'auto';
      });
      ScrollTrigger.addEventListener('refresh', function () {
        rootEl.style.scrollBehavior = savedScrollBehavior || '';
      });
    }

    function animateHeroSequence(gsap) {
      var colophon = document.querySelector('.hero-colophon[data-hero-anim]');
      var primaryLine = document.querySelector('.hero-title-line--primary[data-hero-anim]');
      var secondaryLine = document.querySelector('.hero-title-line--secondary[data-hero-anim]');
      var heroCopy = document.querySelector('.hero-copy[data-hero-anim]');
      var heroTrace = document.querySelector('.hero-trace[data-hero-anim]');

      var heroTargets = [colophon, primaryLine, secondaryLine, heroCopy, heroTrace].filter(Boolean);
      if (heroTargets.length === 0) return;
      heroTargets.forEach(addTrackedNode);

      // Avoid animating hero off-screen when reduced-motion is re-enabled mid-scroll
      if ((window.scrollY || 0) > 180) {
        return;
      }

      var isCompactViewport = window.innerHeight <= 790;
      var lineOffsetPercent = isCompactViewport ? 72 : 92;
      var lineDuration = isCompactViewport ? 0.44 : 0.54;
      var bodyDuration = isCompactViewport ? 0.42 : 0.5;

      var heroTl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          clearProps: 'opacity,transform,willChange'
        }
      });

      if (colophon) {
        heroTl.from(
          colophon,
          { y: 10, opacity: 0, duration: 0.36 },
          0
        );
      }

      var titleLines = [primaryLine, secondaryLine].filter(Boolean);
      if (titleLines.length > 0) {
        heroTl.from(
          titleLines,
          {
            yPercent: lineOffsetPercent,
            opacity: 0,
            duration: lineDuration,
            stagger: 0.08
          },
          0.04
        );
      }

      if (heroCopy) {
        heroTl.from(
          heroCopy,
          { y: 14, opacity: 0, duration: bodyDuration },
          0.14
        );
      }

      if (heroTrace) {
        heroTl.from(
          heroTrace,
          { y: 14, opacity: 0, duration: bodyDuration },
          0.2
        );
      }

      registerTimeline(heroTl);

      // Restrained desktop-only optical drift on portrait container on scroll (never lowers opacity)
      if (window.innerWidth > 960) {
        var portraitImg = document.querySelector('.hero-portrait-frame .portrait-media img');
        var heroSection = document.getElementById('hero');
        if (portraitImg && heroSection) {
          addTrackedNode(portraitImg);
          registerTween(
            gsap.to(portraitImg, {
              yPercent: 3.5,
              ease: 'none',
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6
              }
            })
          );
        }
      }
    }

    function animateBatchOrScroll(gsap, containerSelector, itemSelector, handledSet, options) {
      var opts = options || {};
      var container = document.querySelector(containerSelector);
      if (!container) return;

      var items = Array.prototype.slice.call(container.querySelectorAll(itemSelector));
      if (items.length === 0) return;

      for (var i = 0; i < items.length; i += 1) {
        handledSet.push(items[i]);
        addTrackedNode(items[i]);
      }

      var rect = container.getBoundingClientRect();
      if (rect.bottom <= 0) {
        return;
      }

      var config = {
        y: opts.y !== undefined ? opts.y : 14,
        opacity: 0,
        duration: opts.duration !== undefined ? opts.duration : 0.46,
        stagger: opts.stagger !== undefined ? opts.stagger : 0.07,
        ease: 'power2.out',
        clearProps: 'opacity,transform,willChange'
      };

      if (rect.top < window.innerHeight * 0.92) {
        if (!hasEverTornDown) {
          registerTween(gsap.from(items, config));
        }
      } else {
        config.scrollTrigger = {
          trigger: container,
          start: opts.start || 'top 89%',
          once: true
        };
        registerTween(gsap.from(items, config));
      }
    }

    function animateCaseStudies(gsap, handledSet) {
      var studies = Array.prototype.slice.call(document.querySelectorAll('.case-study[data-reveal]'));
      for (var i = 0; i < studies.length; i += 1) {
        var cs = studies[i];
        handledSet.push(cs);
        addTrackedNode(cs);

        var rect = cs.getBoundingClientRect();
        if (rect.bottom <= 0) {
          continue;
        }

        var useScrollTrigger = rect.top >= window.innerHeight * 0.92;
        if (!useScrollTrigger && hasEverTornDown) {
          continue;
        }

        var header = cs.querySelector('.case-study-header');
        var details = cs.querySelector('.case-study-details');
        var stage = cs.querySelector('.project-stage');
        var textBlocks = [header, details].filter(Boolean);
        textBlocks.forEach(addTrackedNode);
        if (stage) addTrackedNode(stage);

        var tlOptions = useScrollTrigger
          ? {
              scrollTrigger: {
                trigger: cs,
                start: 'top 88%',
                once: true
              }
            }
          : {};

        var tl = gsap.timeline(tlOptions);

        if (textBlocks.length > 0) {
          tl.from(
            textBlocks,
            {
              y: 14,
              opacity: 0,
              duration: 0.46,
              stagger: 0.07,
              ease: 'power2.out',
              clearProps: 'opacity,transform,willChange'
            },
            0
          );
        }

        if (stage) {
          // Keep screenshot frame readable (opacity starts at 0.55) with subtle scale settle
          tl.from(
            stage,
            {
              y: 14,
              scale: 0.988,
              opacity: 0.55,
              duration: 0.52,
              ease: 'power2.out',
              clearProps: 'opacity,transform,willChange'
            },
            0.05
          );

          // Restrained scroll-scrubbed optical settle inside overflow-hidden .stage-viewport
          var stageImg = stage.querySelector('.stage-viewport img');
          if (stageImg) {
            addTrackedNode(stageImg);
            registerTween(
              gsap.fromTo(
                stageImg,
                { yPercent: -1.6, scale: 1.032 },
                {
                  yPercent: 1.6,
                  scale: 1.0,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: stage,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.75
                  }
                }
              )
            );
          }
        }

        registerTimeline(tl);
      }
    }

    function animateSections(gsap) {
      var handled = [];

      animateBatchOrScroll(gsap, '.editorial-split', '[data-reveal]', handled, {
        y: 14,
        stagger: 0.08
      });
      animateBatchOrScroll(gsap, '.skills-rule-grid', '.skill-column[data-reveal]', handled, {
        y: 14,
        stagger: 0.06
      });
      animateCaseStudies(gsap, handled);
      animateBatchOrScroll(gsap, '.agent-comparison-grid', '.dark-panel[data-reveal]', handled, {
        y: 14,
        stagger: 0.08
      });
      animateBatchOrScroll(gsap, '.cert-ledger', '.cert-row[data-reveal]', handled, {
        y: 14,
        stagger: 0.08
      });
      animateBatchOrScroll(gsap, '.contact-layout', '[data-reveal]', handled, {
        y: 14,
        stagger: 0.08
      });

      var remaining = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
      for (var i = 0; i < remaining.length; i += 1) {
        var el = remaining[i];
        if (handled.indexOf(el) !== -1) continue;

        addTrackedNode(el);
        var rect = el.getBoundingClientRect();
        if (rect.bottom <= 0) {
          continue;
        }

        var tweenCfg = {
          y: 14,
          opacity: 0,
          duration: 0.48,
          ease: 'power2.out',
          clearProps: 'opacity,transform,willChange'
        };

        if (rect.top < window.innerHeight * 0.92) {
          if (!hasEverTornDown) {
            registerTween(gsap.from(el, tweenCfg));
          }
        } else {
          tweenCfg.scrollTrigger = {
            trigger: el,
            start: 'top 90%',
            once: true
          };
          registerTween(gsap.from(el, tweenCfg));
        }
      }
    }

    function startAnimations() {
      if (isInitialized) return;
      if (runtime && runtime.prefersReducedMotion()) return;
      if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
        return;
      }

      var gsap = window.gsap;
      var ScrollTrigger = window.ScrollTrigger;

      try {
        gsap.registerPlugin(ScrollTrigger);
        ensureScrollBehaviorGuard(ScrollTrigger);
        animateHeroSequence(gsap);
        animateSections(gsap);

        rootEl.classList.add('js-anim-ready');
        if (gsap && ScrollTrigger) {
          gsap.utils.toArray('.cert-exhibition-stage').forEach(function (stage) {
            var stageRect = stage.getBoundingClientRect();
            if (stageRect.bottom <= 0 || stageRect.top < window.innerHeight * 0.92 && hasEverTornDown) {
              return;
            }
            addTrackedNode(stage);
            registerTween(
              gsap.fromTo(
                stage,
                {
                  clipPath: 'inset(0% 0% 6% 0% round 6px)',
                  y: 18
                },
                {
                  clipPath: 'inset(0% 0% 0% 0% round 6px)',
                  y: 0,
                  duration: 0.72,
                  ease: 'power3.out',
                  clearProps: 'clipPath,transform',
                  scrollTrigger: {
                    trigger: stage,
                    start: 'top 86%',
                    once: true
                  }
                }
              )
            );
          });

          gsap.utils.toArray('.edu-stat').forEach(function (stat, idx) {
            var statRect = stat.getBoundingClientRect();
            if (statRect.bottom <= 0 || statRect.top < window.innerHeight * 0.92 && hasEverTornDown) {
              return;
            }
            addTrackedNode(stat);
            registerTween(
              gsap.fromTo(
                stat,
                { y: 18, opacity: 0.25 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.55,
                  delay: idx * 0.08,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: stat,
                    start: 'top 88%',
                    once: true
                  }
                }
              )
            );
          });
        }

        isInitialized = true;
      } catch (err) {
        teardownAnimations();
      }
    }

    startAnimations();

    window.addEventListener(
      'load',
      function () {
        if (isInitialized && window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      },
      { passive: true }
    );

    if (runtime && typeof runtime.onReducedMotionChange === 'function') {
      runtime.onReducedMotionChange(function (event) {
        if (event && event.matches) {
          teardownAnimations();
        } else if (!isInitialized) {
          startAnimations();
        }
      });
    }
  }

  function initSkillsFilter() {
    var gridEl = document.getElementById('skills-architecture');
    var btns = Array.prototype.slice.call(document.querySelectorAll('[data-skill-filter]'));
    if (!gridEl || btns.length === 0) return;

    var blocks = Array.prototype.slice.call(gridEl.querySelectorAll('[data-skill-domain]'));

    function applyFilter(domain) {
      gridEl.setAttribute('data-active-domain', domain);

      for (var b = 0; b < btns.length; b += 1) {
        var btn = btns[b];
        var active = btn.getAttribute('data-skill-filter') === domain;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      }

      for (var i = 0; i < blocks.length; i += 1) {
        var block = blocks[i];
        var blockDomain = block.getAttribute('data-skill-domain');
        var isMatch = domain === 'all' || blockDomain === domain;
        block.classList.toggle('is-filter-match', domain !== 'all' && isMatch);
        block.classList.toggle('is-filter-dimmed', domain !== 'all' && !isMatch);
      }
    }

    for (var k = 0; k < btns.length; k += 1) {
      btns[k].addEventListener('click', function (event) {
        var nextDomain = event.currentTarget.getAttribute('data-skill-filter') || 'all';
        applyFilter(nextDomain);
      });
    }
  }

  function initAnimationsModule() {
    if (hasInitializedModule) return;
    hasInitializedModule = true;

    var rootEl = document.documentElement;
    initSkillsFilter();
    initHeaderScrollProgress(rootEl);
    initGsapChoreography(rootEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimationsModule);
  } else {
    initAnimationsModule();
  }
})();
