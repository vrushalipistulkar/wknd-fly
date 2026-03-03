/**
 * Application Form block – credit card (or similar) application.
 * Sections: Personal Information, Address, Employment & Income, Disclosures, Submit.
 * Similar to DSN credit-card-application style (e.g. securfinancial2).
 */

function collectApplicationFormData(block) {
  const data = {};
  block.querySelectorAll('input, select, textarea').forEach((el) => {
    const name = el.getAttribute('name');
    if (!name) return;
    if (el.type === 'checkbox') {
      data[name] = el.checked;
    } else {
      data[name] = el.value || '';
    }
  });
  return data;
}

function renderPersonalInfoSection(container) {
  const section = document.createElement('div');
  section.className = 'application-form-section';
  section.innerHTML = `
    <h3 class="application-form-section-title">Personal Information</h3>
    <p class="application-form-description">Please enter your legal name and contact details as they appear on your identification.</p>
    <div class="application-form-fields">
      <label>First Name <span class="application-form-required">*</span><input type="text" name="firstName" required></label>
      <label>Middle Name (optional)<input type="text" name="middleName"></label>
      <label>Last Name <span class="application-form-required">*</span><input type="text" name="lastName" required></label>
      <label>Date of Birth <span class="application-form-required">*</span><input type="text" name="dateOfBirth" placeholder="MM/DD/YYYY" required></label>
      <label>Email <span class="application-form-required">*</span><input type="email" name="email" required></label>
      <label>Phone Number <span class="application-form-required">*</span><input type="tel" name="phone" inputmode="numeric" maxlength="20" placeholder="Digits only" required></label>
    </div>
  `;
  container.appendChild(section);
}

function renderAddressSection(container) {
  const section = document.createElement('div');
  section.className = 'application-form-section';
  section.innerHTML = `
    <h3 class="application-form-section-title">Address</h3>
    <p class="application-form-description">Your current residential address.</p>
    <div class="application-form-fields">
      <label>Street Address <span class="application-form-required">*</span><input type="text" name="streetAddress" required></label>
      <label>Apt / Suite (optional)<input type="text" name="addressLine2"></label>
      <label>City <span class="application-form-required">*</span><input type="text" name="city" required></label>
      <label>State / Province <span class="application-form-required">*</span><input type="text" name="state" required></label>
      <label>ZIP / Postal Code <span class="application-form-required">*</span><input type="text" name="zipCode" required></label>
      <label>Country <span class="application-form-required">*</span><select name="country" required><option value="">Select</option><option value="US">United States</option><option value="CA">Canada</option><option value="MX">Mexico</option><option value="GB">United Kingdom</option><option value="OTHER">Other</option></select></label>
    </div>
  `;
  container.appendChild(section);
}

function renderEmploymentSection(container) {
  const section = document.createElement('div');
  section.className = 'application-form-section';
  section.innerHTML = `
    <h3 class="application-form-section-title">Employment & Income</h3>
    <p class="application-form-description">Employment and income information helps us evaluate your application.</p>
    <div class="application-form-fields">
      <label>Employment Status <span class="application-form-required">*</span><select name="employmentStatus" required><option value="">Select</option><option value="employed">Employed</option><option value="self-employed">Self-Employed</option><option value="retired">Retired</option><option value="student">Student</option><option value="other">Other</option></select></label>
      <label>Employer Name<input type="text" name="employerName"></label>
      <label>Job Title / Occupation<input type="text" name="jobTitle"></label>
      <label>Annual Income <span class="application-form-required">*</span><input type="text" name="annualIncome" inputmode="numeric" placeholder="e.g. 75000" required></label>
      <label>Other Monthly Income (optional)<input type="text" name="otherIncome" inputmode="numeric" placeholder="e.g. 500"></label>
    </div>
  `;
  container.appendChild(section);
}

function renderDisclosuresSection(container) {
  const section = document.createElement('div');
  section.className = 'application-form-section';
  section.innerHTML = `
    <h3 class="application-form-section-title">Disclosures</h3>
    <p class="application-form-description">By submitting this application, you agree to the terms and conditions and authorize us to verify the information provided.</p>
    <div class="application-form-fields">
      <label class="application-form-checkbox"><input type="checkbox" name="agreeTerms" required> I have read and agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a> <span class="application-form-required">*</span></label>
      <label class="application-form-checkbox"><input type="checkbox" name="agreeCreditCheck"> I authorize a credit check and verification of the information I have provided</label>
    </div>
  `;
  container.appendChild(section);
}

function restrictNumericFields(block) {
  const numericNames = ['phone', 'annualIncome', 'otherIncome'];
  numericNames.forEach((name) => {
    const el = block.querySelector(`[name="${name}"]`);
    if (!el) return;
    el.addEventListener('input', () => {
      const digits = el.value.replace(/\D/g, '');
      if (el.value !== digits) el.value = digits;
    });
  });
}

function formatDateOfBirthInput(block) {
  const el = block.querySelector('[name="dateOfBirth"]');
  if (!el) return;
  el.addEventListener('input', () => {
    const digits = el.value.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (digits.length > 0) formatted = digits.slice(0, 2);
    if (digits.length > 2) formatted += `/${digits.slice(2, 4)}`;
    if (digits.length > 4) formatted += `/${digits.slice(4, 8)}`;
    if (el.value !== formatted) el.value = formatted;
  });
}

export default function decorate(block) {
  block.classList.add('application-form-block');
  const wrapper = document.createElement('div');
  wrapper.className = 'application-form-wrapper';

  const header = document.createElement('div');
  header.className = 'application-form-header';
  header.innerHTML = '<h1 class="application-form-title">Credit Card Application</h1><p class="application-form-subtitle">Complete the form below to apply. Fields marked with * are required.</p>';
  wrapper.appendChild(header);

  const main = document.createElement('div');
  main.className = 'application-form-main';
  renderPersonalInfoSection(main);
  renderAddressSection(main);
  renderEmploymentSection(main);
  renderDisclosuresSection(main);

  const submitSection = document.createElement('div');
  submitSection.className = 'application-form-section application-form-submit-section';
  submitSection.innerHTML = `
    <button type="submit" class="application-form-submit-btn">Submit Application</button>
    <p class="application-form-note">You will receive a confirmation once your application has been received.</p>
  `;
  main.appendChild(submitSection);

  const form = document.createElement('form');
  form.className = 'application-form-form';
  form.appendChild(main);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = collectApplicationFormData(block);
    // eslint-disable-next-line no-console
    console.log('Application form data:', data);
    const msg = block.querySelector('.application-form-success-msg');
    if (msg) msg.remove();
    const success = document.createElement('p');
    success.className = 'application-form-success-msg';
    success.textContent = 'Thank you. Your application has been submitted successfully.';
    success.setAttribute('role', 'status');
    submitSection.insertBefore(success, submitSection.firstChild);
  });

  wrapper.appendChild(form);
  block.appendChild(wrapper);

  restrictNumericFields(block);
  formatDateOfBirthInput(block);
}
