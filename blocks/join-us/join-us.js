/**
 * Join Us block – same structure as sign-in block.
 * Shows a "Join Us" button that opens a modal form (First Name, Last Name, Email, Phone, consent; all optional).
 * On submit, shows green success popup then closes modal.
 */

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'join-us-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const modal = document.createElement('div');
  modal.className = 'join-us-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'join-us-title');

  modal.innerHTML = `
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
    <button type="button" class="join-us-close" aria-label="Close">&times;</button>
  `;

  overlay.appendChild(modal);

  const close = () => {
    overlay.classList.remove('join-us-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  modal.querySelector('.join-us-close').addEventListener('click', close);

  const form = modal.querySelector('.join-us-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showSuccessPopup(overlay, close);
  });

  return overlay;
}

function showSuccessPopup(overlay, onClose) {
  const popup = document.createElement('div');
  popup.className = 'join-us-success-popup';
  popup.setAttribute('role', 'alert');
  popup.innerHTML = `
    <span class="join-us-success-icon" aria-hidden="true"></span>
    <p class="join-us-success-text">Thank you for joining WKND Fly Club. Check your email, new exciting travels are ahead of you!</p>
  `;
  overlay.appendChild(popup);
  popup.classList.add('join-us-success-visible');
  setTimeout(() => {
    popup.classList.remove('join-us-success-visible');
    setTimeout(() => {
      popup.remove();
      onClose();
    }, 300);
  }, 3500);
}

export default async function decorate(block) {
  // Same pattern as sign-in: use a wrapper and replaceChildren so block has clear structure
  const wrapper = document.createElement('div');
  wrapper.className = 'join-us-content';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'join-us-trigger';
  button.textContent = 'Join Us';
  wrapper.appendChild(button);

  block.replaceChildren(wrapper);

  const overlay = createModal();
  document.body.appendChild(overlay);

  button.addEventListener('click', () => {
    overlay.classList.add('join-us-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
}
