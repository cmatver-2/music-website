// ============================================================
// contact.js — Contact Form Validation
// ============================================================
// CONCEPTS COVERED:
// 1. Form validation — checking input before submission
// 2. Regular Expressions (RegEx) — pattern matching
// 3. Preventing default form behavior
// 4. Real-time vs submit-time validation
// 5. Word counting
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  const form       = document.getElementById('contact-form');
  if (!form) return; // Exit if no form on page

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const phoneInput   = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const wordCounter  = document.getElementById('word-counter');

  // ── WORD COUNTER (real-time) ─────────────────────────────
  // CONCEPT: We count words by splitting on whitespace.
  // "hello world".split(/\s+/) → ["hello", "world"] → length 2
  if (messageInput) {
    messageInput.addEventListener('input', function () {
      const words = countWords(messageInput.value);
      wordCounter.textContent = `${words} / 200 words`;

      // Turn counter red when near limit
      if (words > 180) {
        wordCounter.classList.add('warning');
      } else {
        wordCounter.classList.remove('warning');
      }
    });
  }

  function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    // split on 1 or more whitespace characters, filter empty strings
    return trimmed.split(/\s+/).filter(Boolean).length;
  }

  // ── PHONE: Only allow numeric input ─────────────────────
  // CONCEPT: We intercept keypress events and block non-numeric keys.
  if (phoneInput) {
    phoneInput.addEventListener('keypress', function (e) {
      // e.key gives us the character the user typed
      // /[0-9]/ is a RegEx that matches any digit 0–9
      // If the key is NOT a digit, we prevent it from being typed
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // Cancel the keystroke
      }
    });

    // Also handle paste events — remove non-digits from pasted text
    phoneInput.addEventListener('paste', function (e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const digits = pasted.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
      phoneInput.value = digits;
    });
  }

  // ── VALIDATION FUNCTIONS ────────────────────────────────
  // Each function returns true if valid, false if invalid.
  // It also shows/hides the error message.

  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      showError('name-error', nameInput, 'Name is required.');
      return false;
    }
    if (val.length < 2) {
      showError('name-error', nameInput, 'Name must be at least 2 characters.');
      return false;
    }
    clearError('name-error', nameInput);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      showError('email-error', emailInput, 'Email is required.');
      return false;
    }
    // CONCEPT: Regular Expression for email validation
    // This checks for: characters @ characters . characters
    // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //   ^         = start of string
    //   [^\s@]+   = one or more characters that aren't spaces or @
    //   @         = literal @ symbol
    //   [^\s@]+   = domain name
    //   \.        = literal dot (. has special meaning in regex, \ escapes it)
    //   [^\s@]+$  = extension (com, org, etc.) until end of string
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      showError('email-error', emailInput, 'Please enter a valid email (e.g. you@example.com).');
      return false;
    }
    clearError('email-error', emailInput);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    if (!val) {
      showError('phone-error', phoneInput, 'Phone number is required.');
      return false;
    }
    // Must be exactly 10 digits
    // /^\d{10}$/ means: start, exactly 10 digits, end
    // \d = any digit (same as [0-9])
    // {10} = exactly 10 times
    if (!/^\d{10}$/.test(val)) {
      showError('phone-error', phoneInput, 'Phone must be exactly 10 digits (numbers only).');
      return false;
    }
    clearError('phone-error', phoneInput);
    return true;
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) {
      showError('message-error', messageInput, 'Message is required.');
      return false;
    }
    const words = countWords(val);
    if (words > 200) {
      showError('message-error', messageInput, `Message too long: ${words} words. Maximum is 200 words.`);
      return false;
    }
    clearError('message-error', messageInput);
    return true;
  }

  // ── HELPER: Show/hide error messages ────────────────────
  function showError(errorId, inputEl, message) {
    const errEl = document.getElementById(errorId);
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add('visible');
    }
    if (inputEl) inputEl.classList.add('error');
  }

  function clearError(errorId, inputEl) {
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.classList.remove('visible');
    if (inputEl) inputEl.classList.remove('error');
  }

  // ── REAL-TIME VALIDATION (on blur) ──────────────────────
  // CONCEPT: 'blur' fires when the user leaves (unfocuses) a field.
  // We validate each field as soon as the user moves away from it.
  // This gives immediate feedback without being annoying while typing.
  if (nameInput)    nameInput.addEventListener('blur',  validateName);
  if (emailInput)   emailInput.addEventListener('blur', validateEmail);
  if (phoneInput)   phoneInput.addEventListener('blur', validatePhone);
  if (messageInput) messageInput.addEventListener('blur', validateMessage);

  // Clear error when user starts typing again
  [nameInput, emailInput, phoneInput, messageInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () {
      input.classList.remove('error');
      // We don't hide the error message here — blur handles that
    });
  });

  // ── FORM SUBMIT ─────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    // CONCEPT: e.preventDefault() stops the form from actually
    // submitting to a server (which would reload the page).
    // We handle everything in JavaScript instead.
    e.preventDefault();

    // Run all validations; they return true/false
    // CONCEPT: & evaluates all (to show all errors at once)
    // Don't use && here because it short-circuits (stops at first false)
    const nameOk    = validateName();
    const emailOk   = validateEmail();
    const phoneOk   = validatePhone();
    const messageOk = validateMessage();

    const allValid = nameOk && emailOk && phoneOk && messageOk;

    if (!allValid) {
      showToast('⚠️ Please fix the errors before submitting.', 'error');
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ── All valid! Simulate sending ──────────────────────
    // In a real app, you'd send this to a server with fetch()
    const submitBtn  = form.querySelector('.submit-btn');
    const btnText    = form.querySelector('.btn-text');
    const btnLoading = form.querySelector('.btn-loading');

    // Show loading state
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    // Simulate a network request with setTimeout
    setTimeout(function () {
      showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success', 5000);
      form.reset();
      if (wordCounter) wordCounter.textContent = '0 / 200 words';
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }, 1500);
  });

});
