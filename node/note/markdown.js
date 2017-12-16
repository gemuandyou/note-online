var hljs = require('highlightjs');

var md = require('markdown-it')({
	html: true, // Enable HTML tags in source
	xhtmlOut:     false,        // Use '/' to close single tags (<br />).
	// This is only for full CommonMark compatibility.
	breaks:       false,        // Convert '\n' in paragraphs into <br>
	linkify:      false,        // Autoconvert URL-like text to links

	// Double + single quotes replacement pairs, when typographer enabled,
	// and smartquotes on. Could be either a String or an Array.
	//
	// For example, you can use '«»„“' for Russian, '„“‚‘' for German,
	// and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
	quotes: '“”‘’',
	// syntax highlight
	highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

module.exports = {
	/**
	 * 将markdown文本渲染成HTML
	 */
	renderToHtml: (text) => {
		return md.render(text);
	}
};
