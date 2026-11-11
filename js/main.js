/**
 * Core portfolio runtime:
 * - Shared single-active-overlay manager (modals + navigation drawer focus/Escape isolation)
 * - Background inert/aria-hidden management while overlays are open
 * - Dynamic prefers-reduced-motion query helper
 * - Direct contact email clipboard copy action
 */
(function () {
  'use strict';

  var FOCUSABLE_SELECTOR = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    'details summary',
    '[tabindex]'
  ].join(', ');

  var motionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  var activeOverlay = null;
  var activeBackdropEl = null;
  var savedInertStates = [];

  /**
   * Returns true if an element is visibly rendered and keyboard-focusable.
   * Excludes disabled, aria-disabled, negative-tabindex, and hidden ancestors.
   */
  function isFocusableElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.disabled || el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-disabled') === 'true') return false;
    var tabIndex = el.getAttribute('tabindex');
    if (tabIndex === '-1') return false;
    if (el.closest('[hidden], [inert], [aria-hidden="true"]')) return false;

    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (el.getClientRects().length === 0) return false;
    return true;
  }

  /**
   * Collects focusable controls within a container in DOM order.
   */
  function getFocusableElements(container) {
    if (!container) return [];
    var candidates = container.querySelectorAll(FOCUSABLE_SELECTOR);
    var result = [];
    for (var i = 0; i < candidates.length; i += 1) {
      if (isFocusableElement(candidates[i])) {
        result.push(candidates[i]);
      }
    }
    return result;
  }

  /**
   * Resolves a safe focus target, ensuring it still exists and is visible.
   */
  function isElementVisibleForFocus(el) {
    if (!el || !document.body.contains(el)) return false;
    if (el.closest('[hidden], [inert]')) return false;
    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return el.getClientRects().length > 0;
  }

  /**
   * Marks body children outside the active overlay as inert and aria-hidden
   * so background content cannot receive pointer, keyboard, or AT focus.
   */
  function applyBackgroundInert(overlayEl) {
    restoreBackgroundInert();
    var children = document.body.children;
    for (var i = 0; i < children.length; i += 1) {
      var child = children[i];
      if (
        child === overlayEl ||
        child.contains(overlayEl) ||
        child.tagName === 'SCRIPT' ||
        child.tagName === 'STYLE'
      ) {
        continue;
      }
      savedInertStates.push({
        el: child,
        hadInert: child.hasAttribute('inert'),
        prevAriaHidden: child.getAttribute('aria-hidden')
      });
      child.setAttribute('inert', '');
      child.setAttribute('aria-hidden', 'true');
    }
  }

  function restoreBackgroundInert() {
    for (var i = 0; i < savedInertStates.length; i += 1) {
      var entry = savedInertStates[i];
      if (!entry.hadInert) {
        entry.el.removeAttribute('inert');
      }
      if (entry.prevAriaHidden === null) {
        entry.el.removeAttribute('aria-hidden');
      } else {
        entry.el.setAttribute('aria-hidden', entry.prevAriaHidden);
      }
    }
    savedInertStates = [];
  }

  function getActiveContainer(entry) {
    if (!entry) return null;
    if (entry.trapSelector) {
      var inner = entry.element.querySelector(entry.trapSelector);
      if (inner) return inner;
    }
    return entry.element;
  }

  function trapFocusOnTab(event, entry) {
    var container = getActiveContainer(entry);
    var focusables = getFocusableElements(container);
    if (focusables.length === 0) {
      event.preventDefault();
      if (container && container.focus) {
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
      return;
    }

    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    var current = document.activeElement;

    if (!container.contains(current)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey) {
      if (current === first || current === container) {
        event.preventDefault();
        last.focus();
      }
    } else if (current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
   * Single global keyboard dispatcher so only the currently active overlay
   * responds to Escape, Tab trapping, or overlay-specific arrow navigation.
   */
  function handleGlobalKeyDown(event) {
    if (!activeOverlay) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeActiveOverlay({ reason: 'escape' });
      return;
    }

    if (event.key === 'Tab') {
      trapFocusOnTab(event, activeOverlay);
      return;
    }

    if (typeof activeOverlay.onKeyDown === 'function') {
      activeOverlay.onKeyDown(event);
    }
  }

  function handleOverlayClick(event) {
    if (!activeOverlay) return;
    var closeSelector = activeOverlay.closeSelector || '[data-modal-close]';
    var closeTrigger = event.target.closest(closeSelector);
    if (closeTrigger && activeOverlay.element.contains(closeTrigger)) {
      event.preventDefault();
      closeActiveOverlay({ reason: 'trigger' });
    }
  }

  function openOverlay(options) {
    if (!options || !options.element) return;

    if (activeOverlay && activeOverlay.element !== options.element) {
      closeActiveOverlay({ reason: 'replaced', restoreFocus: false });
    }

    var el = options.element;
    var bodyClass = options.bodyClass || 'modal-open';
    var opener =
      options.triggerEl ||
      (document.activeElement && document.activeElement !== document.body
        ? document.activeElement
        : null);

    activeOverlay = {
      id: el.id || '',
      element: el,
      bodyClass: bodyClass,
      opener: opener,
      trapSelector: options.trapSelector || null,
      closeSelector: options.closeSelector || '[data-modal-close]',
      fallbackFocusSelector: options.fallbackFocusSelector || '.brand-mark',
      onKeyDown: typeof options.onKeyDown === 'function' ? options.onKeyDown : null,
      onAfterClose: typeof options.onAfterClose === 'function' ? options.onAfterClose : null
    };

    el.removeAttribute('hidden');
    el.classList.add('is-open');
    document.body.classList.add(bodyClass);
    applyBackgroundInert(el);

    activeBackdropEl = el;
    el.addEventListener('click', handleOverlayClick);

    var focusTarget = null;
    if (options.initialFocusSelector) {
      focusTarget = el.querySelector(options.initialFocusSelector);
    }
    if (!focusTarget || !isFocusableElement(focusTarget)) {
      var focusables = getFocusableElements(getActiveContainer(activeOverlay));
      focusTarget = focusables.length > 0 ? focusables[0] : null;
    }
    if (focusTarget) {
      window.requestAnimationFrame(function () {
        if (activeOverlay && activeOverlay.element === el) {
          focusTarget.focus();
        }
      });
    }
  }

  function closeActiveOverlay(opts) {
    if (!activeOverlay) return;

    var entry = activeOverlay;
    var settings = opts || {};
    var shouldRestore = settings.restoreFocus !== false;

    activeOverlay = null;
    if (activeBackdropEl) {
      activeBackdropEl.removeEventListener('click', handleOverlayClick);
      activeBackdropEl = null;
    }

    entry.element.classList.remove('is-open');
    entry.element.setAttribute('hidden', '');
    document.body.classList.remove(entry.bodyClass);
    restoreBackgroundInert();

    if (entry.onAfterClose) {
      entry.onAfterClose(settings);
    }

    if (shouldRestore) {
      var target = settings.nextFocusEl || entry.opener;
      if (target && isElementVisibleForFocus(target)) {
        target.focus();
      } else {
        var fallback = document.querySelector(entry.fallbackFocusSelector);
        if (fallback && isElementVisibleForFocus(fallback)) {
          fallback.focus();
        }
      }
    }
  }

  function isOverlayOpen(element) {
    return Boolean(activeOverlay && (!element || activeOverlay.element === element));
  }

  function prefersReducedMotion() {
    return Boolean(motionQuery && motionQuery.matches);
  }

  function onReducedMotionChange(callback) {
    if (!motionQuery || typeof callback !== 'function') return function () {};
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', callback);
      return function () {
        motionQuery.removeEventListener('change', callback);
      };
    }
    if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(callback);
      return function () {
        motionQuery.removeListener(callback);
      };
    }
    return function () {};
  }

  /**
   * Direct email clipboard copy interaction with fallback and accessible status feedback.
   */
  function initEmailCopy() {
    var copyBtn = document.getElementById('copy-email-btn');
    var feedbackEl = document.getElementById('copy-feedback');
    if (!copyBtn || !feedbackEl) return;

    var clearTimerId = null;

    function announceStatus(message) {
      feedbackEl.textContent = message;
      if (clearTimerId) {
        window.clearTimeout(clearTimerId);
      }
      clearTimerId = window.setTimeout(function () {
        feedbackEl.textContent = '';
      }, 3200);
    }

    function legacyCopy(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (e) {
        copied = false;
      }
      document.body.removeChild(textarea);
      return copied;
    }

    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-copy-email') || '';
      if (!email) return;

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard
          .writeText(email)
          .then(function () {
            announceStatus('Copied to clipboard');
          })
          .catch(function () {
            announceStatus(
              legacyCopy(email)
                ? 'Copied to clipboard'
                : 'Copy unavailable — please use Email link'
            );
          });
      } else {
        announceStatus(
          legacyCopy(email)
            ? 'Copied to clipboard'
            : 'Copy unavailable — please use Email link'
        );
      }
    });
  }

  document.addEventListener('keydown', handleGlobalKeyDown);

  function init() {
    initEmailCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Portfolio = Object.freeze({
    openOverlay: openOverlay,
    closeActiveOverlay: closeActiveOverlay,
    isOverlayOpen: isOverlayOpen,
    getFocusableElements: getFocusableElements,
    prefersReducedMotion: prefersReducedMotion,
    onReducedMotionChange: onReducedMotionChange
  });
})();
