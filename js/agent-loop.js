/**
 * Interactive 6-step BOCHA Workspace Single-Agent Execution Loop Simulator:
 * - Illustrative frontend walkthrough (does not invoke Gemini or any live backend API)
 * - Uses strict state encapsulation with a single source of truth for step/run state
 * - Maintains distinct semantic active, completed, and pending visual + text/ARIA cues
 * - Preserves keyboard focus on controls, discrete sr-only live updates, and clean timer lifecycle
 */
(function () {
  'use strict';

  var STEP_INTERVAL_MS = 900;
  var FINAL_HOLD_MS = 700;
  var hasInitialized = false;

  function padTwo(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function clearStepInlineStyles(stepEl, monoEl) {
    stepEl.style.borderColor = '';
    stepEl.style.borderLeftColor = '';
    stepEl.style.borderLeftWidth = '';
    stepEl.style.backgroundColor = '';
    if (monoEl) {
      monoEl.style.color = '';
    }
  }

  function applyCompletedInlineStyles(stepEl, monoEl) {
    stepEl.style.borderColor = 'rgba(138, 184, 230, 0.36)';
    stepEl.style.borderLeftWidth = '3px';
    stepEl.style.borderLeftColor = 'var(--study-on-dark)';
    stepEl.style.backgroundColor = 'rgba(138, 184, 230, 0.08)';
    if (monoEl) {
      monoEl.style.color = 'var(--study-on-dark)';
    }
  }

  function initAgentLoopSimulator() {
    if (hasInitialized) return;

    var flowEl = document.getElementById('agent-flow');
    if (!flowEl) return;

    var stepNodes = Array.prototype.slice.call(flowEl.querySelectorAll('.agent-flow-step'));
    if (stepNodes.length === 0) return;

    hasInitialized = true;

    var runBtn = document.getElementById('agent-loop-run');
    var nextBtn = document.getElementById('agent-loop-next');
    var resetBtn = document.getElementById('agent-loop-reset');
    var statusEl = document.getElementById('agent-sim-status');
    var controlsWrap = document.querySelector('.agent-sim-controls');
    var totalSteps = stepNodes.length;

    var stepMeta = stepNodes.map(function (el, idx) {
      var monoEl = el.querySelector('.mono-label');
      var headingEl = el.querySelector('h4');
      var baseLabel = monoEl ? monoEl.textContent.trim() : 'Step ' + padTwo(idx + 1);
      var title = headingEl ? headingEl.textContent.trim() : baseLabel;
      return {
        element: el,
        monoEl: monoEl,
        baseLabel: baseLabel,
        title: title,
        number: idx + 1
      };
    });

    // Optional visual-only state banner inside .agent-sim-controls (aria-hidden so sr-only handles AT)
    var readoutEl = null;
    if (controlsWrap) {
      readoutEl = controlsWrap.querySelector('.agent-sim-readout');
      if (!readoutEl) {
        readoutEl = document.createElement('p');
        readoutEl.className = 'agent-sim-readout mono-label';
        readoutEl.setAttribute('aria-hidden', 'true');
        readoutEl.style.marginTop = '1.15rem';
        readoutEl.style.padding = '0.55rem 0.75rem';
        readoutEl.style.border = '1px solid var(--border-dark-strong)';
        readoutEl.style.borderLeft = '2px solid var(--accent-on-dark)';
        readoutEl.style.backgroundColor = 'rgba(242, 239, 233, 0.04)';
        readoutEl.style.color = 'var(--text-on-dark)';
        readoutEl.style.fontSize = '0.75rem';
        readoutEl.style.lineHeight = '1.45';
        var noteEl = controlsWrap.querySelector('.agent-sim-note');
        if (noteEl && noteEl.parentNode === controlsWrap) {
          controlsWrap.insertBefore(readoutEl, noteEl);
        } else {
          controlsWrap.appendChild(readoutEl);
        }
      }
    }

    var state = {
      currentStep: 1,
      isRunning: false,
      isCompleted: false,
      timerId: null
    };

    function clearPendingTimer() {
      if (state.timerId !== null) {
        window.clearTimeout(state.timerId);
        state.timerId = null;
      }
    }

    function announceStatus(message) {
      if (statusEl && statusEl.textContent !== message) {
        statusEl.textContent = message;
      }
    }

    function updateReadout() {
      if (!readoutEl) return;
      var activeMeta = stepMeta[state.currentStep - 1];
      var stepCounter = padTwo(state.currentStep) + ' / ' + padTwo(totalSteps);

      if (state.isCompleted) {
        readoutEl.textContent =
          'Status: Completed (' + stepCounter + ') \u2014 Illustrative walkthrough finished';
        readoutEl.style.borderLeftColor = 'var(--study-on-dark)';
        readoutEl.style.color = 'var(--study-on-dark)';
      } else if (state.isRunning) {
        readoutEl.textContent =
          'Status: Running (' + stepCounter + ') \u2014 ' + activeMeta.title;
        readoutEl.style.borderLeftColor = 'var(--accent-on-dark)';
        readoutEl.style.color = 'var(--text-on-dark)';
      } else if (state.currentStep > 1) {
        readoutEl.textContent =
          'Status: Step ' + stepCounter + ' Active \u2014 ' + activeMeta.title;
        readoutEl.style.borderLeftColor = 'var(--accent-on-dark)';
        readoutEl.style.color = 'var(--text-on-dark)';
      } else {
        readoutEl.textContent =
          'Status: Ready (' + stepCounter + ') \u2014 ' + activeMeta.title;
        readoutEl.style.borderLeftColor = 'var(--accent-on-dark)';
        readoutEl.style.color = 'var(--text-on-dark)';
      }
    }

    function updateControls() {
      if (runBtn) {
        if (state.isRunning) {
          runBtn.textContent = 'Running (' + state.currentStep + '/' + totalSteps + ')\u2026';
          runBtn.setAttribute('aria-pressed', 'true');
          runBtn.setAttribute('aria-disabled', 'true');
          runBtn.setAttribute(
            'aria-label',
            'Simulation currently running at step ' + state.currentStep + ' of ' + totalSteps
          );
        } else if (state.isCompleted) {
          runBtn.textContent = 'Run Again';
          runBtn.setAttribute('aria-pressed', 'false');
          runBtn.setAttribute('aria-disabled', 'false');
          runBtn.setAttribute('aria-label', 'Run the 6-step agent simulation again');
        } else {
          runBtn.textContent = 'Run Loop';
          runBtn.setAttribute('aria-pressed', 'false');
          runBtn.setAttribute('aria-disabled', 'false');
          runBtn.setAttribute('aria-label', 'Run automatic 6-step agent loop simulation');
        }
      }

      if (nextBtn) {
        if (state.isCompleted) {
          nextBtn.textContent = 'Step Again';
          nextBtn.setAttribute('aria-label', 'Restart walkthrough from Step 1 to step manually');
        } else {
          nextBtn.textContent = 'Next Step';
          nextBtn.setAttribute(
            'aria-label',
            'Advance to next simulation step from step ' + state.currentStep + ' of ' + totalSteps
          );
        }
      }

      if (resetBtn) {
        resetBtn.setAttribute('aria-label', 'Reset agent loop simulation to Step 1');
      }
    }

    function renderSteps() {
      for (var i = 0; i < stepMeta.length; i += 1) {
        var meta = stepMeta[i];
        var stepEl = meta.element;
        var monoEl = meta.monoEl;
        var isCompletedStep = state.isCompleted || meta.number < state.currentStep;
        var isActiveStep = !state.isCompleted && meta.number === state.currentStep;
        var isFinalRestingStep = state.isCompleted && meta.number === totalSteps;

        if (isCompletedStep) {
          stepEl.classList.remove('is-active');
          stepEl.classList.add('is-completed');
          stepEl.setAttribute('data-step-state', 'completed');
          if (isFinalRestingStep) {
            stepEl.setAttribute('aria-current', 'step');
          } else {
            stepEl.removeAttribute('aria-current');
          }
          applyCompletedInlineStyles(stepEl, monoEl);
          if (monoEl) {
            monoEl.textContent = isFinalRestingStep
              ? meta.baseLabel + ' \u00b7 Completed (Final)'
              : meta.baseLabel + ' \u00b7 Completed';
          }
        } else if (isActiveStep) {
          stepEl.classList.add('is-active');
          stepEl.classList.remove('is-completed');
          stepEl.setAttribute('data-step-state', 'active');
          stepEl.setAttribute('aria-current', 'step');
          clearStepInlineStyles(stepEl, monoEl);
          if (monoEl) {
            monoEl.textContent = meta.baseLabel + ' \u00b7 Active';
          }
        } else {
          stepEl.classList.remove('is-active', 'is-completed');
          stepEl.setAttribute('data-step-state', 'pending');
          stepEl.removeAttribute('aria-current');
          clearStepInlineStyles(stepEl, monoEl);
          if (monoEl) {
            monoEl.textContent = meta.baseLabel;
          }
        }
      }

      updateControls();
      updateReadout();

      if (flowEl && totalSteps > 0) {
        var pct = state.isCompleted
          ? 100
          : totalSteps > 1
            ? Math.round(((state.currentStep - 1) / (totalSteps - 1)) * 100)
            : 100;
        flowEl.style.setProperty('--pipeline-progress', pct + '%');
      }
    }

    function completeSimulation(prefixMessage) {
      clearPendingTimer();
      state.isRunning = false;
      state.isCompleted = true;
      state.currentStep = totalSteps;
      renderSteps();

      var finalTitle = stepMeta[totalSteps - 1].title;
      var prefix = prefixMessage ? prefixMessage + ' ' : '';
      announceStatus(
        prefix +
          'Simulation complete \u2014 all ' +
          totalSteps +
          ' steps finished: ' +
          finalTitle +
          '. Activate Run Again, Step Again, or Reset.'
      );
    }

    function scheduleAutoTick() {
      clearPendingTimer();
      if (!state.isRunning) return;

      var delay = state.currentStep >= totalSteps ? FINAL_HOLD_MS : STEP_INTERVAL_MS;
      state.timerId = window.setTimeout(function () {
        state.timerId = null;
        if (!state.isRunning) return;

        if (state.currentStep < totalSteps) {
          state.currentStep += 1;
          renderSteps();
          var meta = stepMeta[state.currentStep - 1];
          announceStatus(
            'Running \u2014 Step ' +
              state.currentStep +
              ' of ' +
              totalSteps +
              ': ' +
              meta.title +
              '.'
          );
          scheduleAutoTick();
        } else {
          completeSimulation('');
        }
      }, delay);
    }

    function handleRunClick() {
      // Prevent concurrent simulation loops while auto-run is active
      if (state.isRunning) return;

      clearPendingTimer();

      if (state.isCompleted || state.currentStep >= totalSteps) {
        state.currentStep = 1;
        state.isCompleted = false;
      }

      state.isRunning = true;
      renderSteps();

      var meta = stepMeta[state.currentStep - 1];
      announceStatus(
        'Simulation started at Step ' +
          state.currentStep +
          ' of ' +
          totalSteps +
          ': ' +
          meta.title +
          '.'
      );
      scheduleAutoTick();
    }

    function handleNextClick() {
      var interruptedRun = state.isRunning;
      clearPendingTimer();
      state.isRunning = false;

      if (state.isCompleted) {
        state.currentStep = 1;
        state.isCompleted = false;
        renderSteps();
        announceStatus(
          'Walkthrough restarted manually at Step 1 of ' +
            totalSteps +
            ': ' +
            stepMeta[0].title +
            '.'
        );
        return;
      }

      if (state.currentStep >= totalSteps) {
        completeSimulation(interruptedRun ? 'Automatic progression stopped.' : '');
        return;
      }

      state.currentStep += 1;

      if (state.currentStep === totalSteps) {
        completeSimulation(interruptedRun ? 'Automatic progression paused at final step.' : '');
        return;
      }

      renderSteps();
      var meta = stepMeta[state.currentStep - 1];
      var prefix = interruptedRun ? 'Automatic progression stopped. ' : '';
      announceStatus(
        prefix +
          'Step ' +
          state.currentStep +
          ' of ' +
          totalSteps +
          ' active: ' +
          meta.title +
          '.'
      );
    }

    function handleResetClick() {
      clearPendingTimer();
      state.isRunning = false;
      state.isCompleted = false;
      state.currentStep = 1;
      renderSteps();
      announceStatus(
        'Simulation reset \u2014 Ready at Step 1 of ' +
          totalSteps +
          ': ' +
          stepMeta[0].title +
          '.'
      );
    }

    if (runBtn) {
      runBtn.addEventListener('click', handleRunClick);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', handleNextClick);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', handleResetClick);
    }

    // Allow direct click inspection on any pipeline step card without disrupting button controls
    for (var s = 0; s < stepMeta.length; s += 1) {
      (function (metaItem) {
        var stepEl = metaItem.element;
        stepEl.addEventListener('click', function (event) {
          if (event.target && event.target.closest('a, button')) return;
          clearPendingTimer();
          state.isRunning = false;
          state.isCompleted = false;
          state.currentStep = metaItem.number;
          renderSteps();
          announceStatus(
            'Inspecting Step ' +
              metaItem.number +
              ' of ' +
              totalSteps +
              ': ' +
              metaItem.title +
              '.'
          );
        });
      })(stepMeta[s]);
    }

    window.addEventListener('pagehide', function () {
      if (state.isRunning) {
        clearPendingTimer();
        state.isRunning = false;
        renderSteps();
      }
    });

    renderSteps();
    announceStatus(
      'Simulation ready \u2014 Step 1 of ' +
        totalSteps +
        ': ' +
        stepMeta[0].title +
        ' (illustrative frontend walkthrough; no live API call executed).'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgentLoopSimulator);
  } else {
    initAgentLoopSimulator();
  }
})();
