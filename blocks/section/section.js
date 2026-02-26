/**
 * Section block: allows a section to be nested inside another section.
 * Treats the block as a nested section: applies wrapper/metadata logic,
 * applySectionItemWidths, then decorates and loads inner blocks.
 */

import {
  applySectionItemWidths,
  decorateBlock,
  loadBlock,
  readBlockConfig,
  toCamelCase,
  toClassName,
} from '../../scripts/aem.js';

export default async function decorate(block) {
  // 1. Apply same wrapper logic as decorateSections to block's children
  const wrappers = [];
  let defaultContent = false;
  [...block.children].forEach((e) => {
    if ((e.tagName === 'DIV' && e.className) || !defaultContent) {
      const wrapper = document.createElement('div');
      wrappers.push(wrapper);
      defaultContent = e.tagName !== 'DIV' || !e.className;
      if (defaultContent) wrapper.classList.add('default-content-wrapper');
    }
    wrappers[wrappers.length - 1].append(e);
  });
  wrappers.forEach((wrapper) => block.append(wrapper));
  block.classList.add('section');

  // 2. Process section metadata (e.g. style, sec-item-widths)
  const sectionMeta = block.querySelector('div.section-metadata');
  if (sectionMeta) {
    const meta = readBlockConfig(sectionMeta);
    Object.keys(meta).forEach((key) => {
      if (key === 'style') {
        const styles = (meta.style || '')
          .split(',')
          .filter((style) => style)
          .map((style) => toClassName(style.trim()));
        styles.forEach((style) => block.classList.add(style));
      } else {
        block.dataset[toCamelCase(key)] = meta[key];
      }
    });
    sectionMeta.parentNode.remove();
  }

  applySectionItemWidths(block);

  // 3. Decorate inner blocks (direct div children of default-content-wrapper)
  const dcw = block.querySelector(':scope > .default-content-wrapper');
  if (dcw) {
    dcw.querySelectorAll(':scope > div').forEach((el) => {
      if (el.classList?.length) decorateBlock(el);
    });
  }

  // 4. Load all blocks inside this section block
  const innerBlocks = [...block.querySelectorAll('div.block')];
  for (let i = 0; i < innerBlocks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await loadBlock(innerBlocks[i]);
  }
}
