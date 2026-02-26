import { getMetadata } from '../../scripts/aem.js';
import { isAuthorEnvironment, moveInstrumentation } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/aem.js';

/**
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const config = readBlockConfig(block) || {};

  const enableUnderline = (config.enableunderline ?? block.querySelector(':scope div:nth-child(3) > div')?.textContent?.trim() ?? 'true').toString();
  const layoutStyle = config.herolayout ?? block.querySelector(':scope div:nth-child(4) > div')?.textContent?.trim() ?? 'overlay';
  const ctaStyle = config.ctastyle ?? block.querySelector(':scope div:nth-child(5) > div')?.textContent?.trim() ?? 'default';
  const backgroundStyle = config.backgroundstyle ?? block.querySelector(':scope div:nth-child(6) > div')?.textContent?.trim() ?? 'default';

  if (layoutStyle) {
    block.classList.add(`${layoutStyle}`);
  }

  if (backgroundStyle) {
    block.classList.add(`${backgroundStyle}`);
  }

  if (enableUnderline.toLowerCase() === 'false') {
    block.classList.add('removeunderline');
  }

  const buttonContainer = block.querySelector('p.button-container');
  if (buttonContainer) {
    buttonContainer.classList.add(`cta-${ctaStyle || 'default'}`);
  }

  const ctaStyleParagraph = block.querySelector('p[data-aue-prop="ctastyle"]');
  if (ctaStyleParagraph) {
    ctaStyleParagraph.style.display = 'none';
  }

  const underlineDiv = block.querySelector(':scope div:nth-child(3)');
  if (underlineDiv) underlineDiv.style.display = 'none';
  const layoutStyleDiv = block.querySelector(':scope div:nth-child(4)');
  if (layoutStyleDiv) layoutStyleDiv.style.display = 'none';
  const ctaStyleDiv = block.querySelector(':scope div:nth-child(5)');
  if (ctaStyleDiv) ctaStyleDiv.style.display = 'none';
  const backgroundStyleDiv = block.querySelector(':scope div:nth-child(6)');
  if (backgroundStyleDiv) backgroundStyleDiv.style.display = 'none';

  /* Banner-like: alignment, vertical alignment, full width (keys may be hyphenated from readBlockConfig) */
  const alignment = (config.alignment || 'center').toLowerCase();
  const verticalAlignment = (config.verticalalignment || config['vertical-alignment'] || 'middle').toLowerCase();
  block.classList.add(`hero--alignment-${alignment}`);
  block.classList.add(`hero--verticalalignment-${verticalAlignment}`);
  const isFullWidth = config.isfullwidth === 'true' || config.isfullwidth === true || config['full-width'] === 'true';
  if (isFullWidth) {
    block.classList.add('hero--fullwidth');
  }

  if (config.height && String(config.height).trim()) {
    block.style.height = String(config.height).trim();
  }
  const textWrapper = block.querySelector(':scope > div:nth-child(2)') || block;
  if (textWrapper && config.color && String(config.color).trim()) {
    textWrapper.style.color = String(config.color).trim();
  }

  if (config.link && String(config.link).trim()) {
    block.dataset.sectionLink = String(config.link).trim();
  }

  const ctaLink = block.querySelector('p.button-container a, .button-container a');
  if (ctaLink) {
    const eventType = config.buttoneventtype ?? config['button-event-type'];
    if (eventType && String(eventType).trim()) ctaLink.dataset.buttonEventType = String(eventType).trim();
    const webhookUrl = config.buttonwebhookurl ?? config['button-webhook-url'];
    if (webhookUrl && String(webhookUrl).trim()) ctaLink.dataset.buttonWebhookUrl = String(webhookUrl).trim();
    const formId = config.buttonformid ?? config['button-form-id'];
    if (formId && String(formId).trim()) ctaLink.dataset.buttonFormId = String(formId).trim();
    const buttonData = config.buttondata ?? config['button-data'];
    if (buttonData && String(buttonData).trim()) ctaLink.dataset.buttonData = String(buttonData).trim();
  }
}
