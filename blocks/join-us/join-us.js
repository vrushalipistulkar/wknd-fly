/**
 * Join Us block – form visible by default (like sign-in).
 * On click of JOIN US button, show green success popup: "Thank you for joining WKND Fly Club..."
 * All fields optional.
 */

function showSuccessPopup(container, onDone) {
  const overlay = document.createElement('div');
  overlay.className = 'join-us-success-overlay';
  overlay.setAttribute('aria-live', 'polite');
  overlay.innerHTML = `
    <div class="join-us-success-popup join-us-success-visible">
      <span class="join-us-success-icon" aria-hidden="true"></span>
      <p class="join-us-success-text">Thank you for joining WKND Fly Club. Check your email, new exciting travels are ahead of you!</p>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.classList.add('join-us-success-overlay-visible');
  setTimeout(() => {
    overlay.classList.remove('join-us-success-overlay-visible');
    setTimeout(() => {
      overlay.remove();
      if (onDone) onDone();
    }, 300);
  }, 3500);
}

export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'join-us-content';

  wrapper.innerHTML = `
    <h2 id="join-us-title" class="join-us-title">JOIN WKND FLY CLUB</h2>
    <form class="join-us-form" novalidate>
      <div class="join-us-field">
        <label for="join-us-first">First Name</label>
        <input type="text" id="join-us-first" name="firstName" autocomplete="given-name">
      </div>
      <div class="join-us-field">
        <label for="join-us-last">Last Name</label>
        <input type="text" id="join-us-last" name="lastName" autocomplete="family-name">
      </div>
      <div class="join-us-field">
        <label for="join-us-email">Email</label>
        <input type="email" id="join-us-email" name="email" autocomplete="email">
      </div>
      <div class="join-us-field">
        <label for="join-us-phone">Phone number</label>
        <input type="tel" id="join-us-phone" name="phone" autocomplete="tel">
      </div>
      <div class="join-us-consent">
        <input type="checkbox" id="join-us-consent" name="consent" class="join-us-toggle">
        <label for="join-us-consent" class="join-us-toggle-label">
          I want to join WKND Fly Club and I have read and understand the Privacy and Cookies Policy. I want to receive personalized communication by email.
        </label>
      </div>
      <button type="submit" class="join-us-submit">JOIN US</button>
    </form>
  `;

  const form = wrapper.querySelector('.join-us-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showSuccessPopup(block);
  });

  block.replaceChildren(wrapper);
}
