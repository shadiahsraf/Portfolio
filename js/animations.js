/**
 * Restrained GSAP & ScrollTrigger progressive-enhancement choreography:
 * - Never hides content before verifying gsap + ScrollTrigger availability
 * - Adds html.js-anim-ready only after successful initialization
 * - Respects prefers-reduced-motion initially and on live OS preference changes
 */
(function () {
  'use strict';

  function initAnimations() {
    var runtime = window.Portfolio;
    var rootEl = document.documentElement;
    var activeTweens = [];
    var activeTriggers = [];
    var isInitialized = false;

    function getAnimatedTargets() {
      return document.querySelectorAll('[data-hero-anim], [data-reveal]');
    }

    function teardownAnimations() {
      for (var i = 0; i < activeTriggers.length; i += 1) {
        if (activeTriggers[i] && typeof activeTriggers[i].kill === 'function') {
          activeTriggers[i].kill();
        }
      }
      activeTriggers = [];

      for (var j = 0; j < activeTweens.length; j += 1) {
        if (activeTweens[j] && typeof activeTweens[j].kill === 'function') {
          activeTweens[j].kill();
        }
      }
      activeTweens = [];

      if (window.gsap) {
        try {
          window.gsap.set(getAnimatedTargets(), { clearProps: 'opacity,transform,willChange' });
        } catch (err) {
          // Safe fallback: remove inline properties directly if GSAP cleanup fails
        }
      }

      var targets = getAnimatedTargets();
      for (var k = 0; k < targets.length; k += 1) {
        targets[k].style.opacity = '';
        targets[k].style.transform = '';
      }

      rootEl.classList.remove('js-anim-ready');
      isInitialized = false;
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

        var heroEls = Array.prototype.slice.call(document.querySelectorAll('[data-hero-anim]'));
        var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

        if (heroEls.length > 0) {
          var heroTween = gsap.from(heroEls, {
            y: 16,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'opacity,transform'
          });
          activeTweens.push(heroTween);
        }

        for (var i = 0; i < revealEls.length; i += 1) {
          var el = revealEls[i];
          var rect = el.getBoundingClientRect();
          // Skip ScrollTrigger delay for elements already inside the initial viewport fold
          if (rect.top < window.innerHeight * 0.92) {
            var foldTween = gsap.from(el, {
              y: 14,
              opacity: 0,
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'opacity,transform'
            });
            activeTweens.push(foldTween);
          } else {
            var scrollTween = gsap.from(el, {
              y: 18,
              opacity: 0,
              duration: 0.52,
              ease: 'power2.out',
              clearProps: 'opacity,transform',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true
              }
            });
            activeTweens.push(scrollTween);
            if (scrollTween.scrollTrigger) {
              activeTriggers.push(scrollTween.scrollTrigger);
            }
          }
        }

        rootEl.classList.add('js-anim-ready');
        isInitialized = true;
      } catch (err) {
        teardownAnimations();
      }
    }

    startAnimations();

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
