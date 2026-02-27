/**
 * Image block: applies style variant (e.g. rounded-corner) from config or data attribute.
 */
import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  const style = (config.style || '').trim().toLowerCase();
  if (style === 'rounded-corner') {
    block.classList.add('rounded-corner');
  }
  /* If style comes from editor as data-aue-prop="style" text content */
  const styleEl = block.querySelector('[data-aue-prop="style"]');
  if (styleEl) {
    const styleVal = (styleEl.textContent || '').trim().toLowerCase();
    if (styleVal === 'rounded-corner') {
      block.classList.add('rounded-corner');
      styleEl.style.display = 'none';
    }
  }
}
