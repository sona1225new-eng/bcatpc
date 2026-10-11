const sanitizeHtml = require('sanitize-html');

/**
 * Strips malicious scripts and dangerous attributes while preserving rich formatting.
 */
const cleanHtml = (dirtyHtml) => {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'blockquote', 'pre', 'code',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'img', 'figure', 'figcaption',
      'a', 'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      th: ['colspan', 'rowspan', 'style', 'scope'],
      td: ['colspan', 'rowspan', 'style'],
      span: ['style', 'class'],
      div: ['style', 'class'],
      p: ['style', 'class'],
      h1: ['style', 'class'],
      h2: ['style', 'class'],
      h3: ['style', 'class'],
      h4: ['style', 'class'],
      h5: ['style', 'class'],
      h6: ['style', 'class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['data', 'http', 'https'],
    },
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
        'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce secure link targets
        if (attribs.target === '_blank') {
          attribs.rel = 'noopener noreferrer';
        }
        return { tagName, attribs };
      },
    },
  });
};

module.exports = { cleanHtml };
