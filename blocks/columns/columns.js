function embedYoutube(url, autoplay, background) {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', 'video/mp4');
  video.append(sourceEl);

  return video;
}

const loadVideoEmbed = (block, link, autoplay, background) => {
  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  if (isYoutube) {
    const url = new URL(link);
    const embedWrapper = embedYoutube(url, autoplay, background);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else {
    const videoEl = getVideoElement(link, autoplay, background);
    block.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  }
};

function isVideoLink(link) {
    try {
        if (!link) return false;
        // Check for regular video files
        const regularVideoCheck = link.match(/\.(mp4|mov|wmv|avi|mkv|webm)$/i) !== null;

        // Check for YouTube URLs
        const youtubeCheck = (
          link.includes('youtube.com') ||
          link.includes('youtu.be') ||
          link.includes('youtube-nocookie.com')
        );

        // Combined check
        const isVideo = regularVideoCheck || youtubeCheck;

        // Log the type of video for debugging
        if (isVideo) {
            console.log('Video type:', {
                isRegularVideo: regularVideoCheck,
                isYouTube: youtubeCheck,
                url: link
            });
        }

        return isVideo;

    } catch (error) {
        console.error('Error checking video link:', error);
        return false;
    }
}

export default function decorate(block) {
  // Read column widths configuration
  // The columnWidths field can be in a config div with data-aue-prop or as a child div
  const readConfigValue = (fieldName) => {
    // Try to find by data-aue-prop first (Universal Editor structure)
    const fieldDiv = block.querySelector(`[data-aue-prop="${fieldName}"]`);
    if (fieldDiv) {
      const p = fieldDiv.querySelector('p');
      if (p) return p.textContent?.trim() || '';
      return fieldDiv.textContent?.trim() || '';
    }
    // Fallback: check by index (columnWidths is typically the 3rd config field after columns and rows)
    // Structure: div:nth-child(1) = columns, div:nth-child(2) = rows, div:nth-child(3) = columnWidths
    const configDiv = block.querySelector(':scope > div:nth-child(3) > div');
    if (configDiv) {
      const p = configDiv.querySelector('p');
      return p?.textContent?.trim() || configDiv.textContent?.trim() || '';
    }
    return '';
  };

  const columnWidthsStr = readConfigValue('columnWidths');
  
  // Parse column widths (comma-separated percentages)
  let columnWidths = null;
  if (columnWidthsStr) {
    const widths = columnWidthsStr.split(',').map(w => {
      const num = parseFloat(w.trim());
      return isNaN(num) ? null : num;
    }).filter(w => w !== null);
    
    if (widths.length > 0) {
      // Normalize to ensure they sum to 100
      const sum = widths.reduce((a, b) => a + b, 0);
      if (sum > 0) {
        columnWidths = widths.map(w => (w / sum) * 100);
      } else {
        columnWidths = widths;
      }
    }
  }

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    // Skip config divs (they have data-aue-prop attributes)
    if (row.getAttribute('data-aue-prop')) {
      return; // This is a config field, skip it
    }
    
    row.classList.add('columns-row');
    
    // Apply custom widths if specified
    if (columnWidths && columnWidths.length > 0) {
      [...row.children].forEach((col, index) => {
        if (index < columnWidths.length) {
          const width = columnWidths[index];
          col.style.flexBasis = `${width}%`;
          col.style.flexGrow = '0';
          col.style.flexShrink = '0';
          col.style.width = `${width}%`;
          col.setAttribute('data-column-width', width);
        }
      });
    }
    
    //const firstChild = row.querySelector(':scope > div:first-child');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
     // const videoBlock = col.querySelector('div[data-aue-model="video"]');

      const linkavl = col.querySelector('a')?.href;
      const videoBlock = linkavl ? isVideoLink(linkavl) : false;
      
      if (videoBlock) {
        const videoWrapper = col.closest('div');
        if (videoWrapper) {
          // Add video specific classes
          videoWrapper.classList.add('columns-video-col');
          
          // Get video link from button container
          const videoLink = col.querySelector('a');
          if (videoLink) {
            const videoUrl = videoLink.getAttribute('href');
            
            // Create video container
            const videoContainer = document.createElement('div');
            videoContainer.className = 'columns-video-container';
            
            // Load video with appropriate embed
            loadVideoEmbed(
              videoContainer, 
              videoUrl,
              col.dataset.autoplay === 'true',
              col.dataset.background === 'true'
            );

            // Replace button container with video container
            const buttonContainer = videoLink.closest('div');
            if (buttonContainer) {
              buttonContainer.replaceWith(videoContainer);
            }
          }
        }
      }
    });
  });
}
