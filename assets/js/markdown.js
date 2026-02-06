(() => {
  const { escapeHtml } = window.AppUtils;

  function configureMarked() {
    if (!window.marked) throw new Error("Marked.js não carregou.");
    window.marked.setOptions(window.AppConfig.marked);
  }

  function enhanceEmojis(html) {
    return html.replace(/<h([1-6])>(.+?)<\/h\1>/g, (match, level, content) => {
      const emojiMatch = content.match(/^([\u{1F300}-\u{1F9FF}])\s+(.+)$/u);
      if (!emojiMatch) return match;
      const [, emoji, text] = emojiMatch;
      return `<h${level}><span class="emoji-title">${emoji}</span>${text}</h${level}>`;
    });
  }

  function enhanceCheckboxes(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Processa todos os elementos de texto (p, li, td, th, etc.)
    const textElements = tempDiv.querySelectorAll("p, li, td, th, blockquote");
    
    textElements.forEach((el) => {
      const text = el.textContent ?? "";
      const checkboxRegex = /\(([ x])\)/g;
      if (!checkboxRegex.test(text)) return;

      let newHTML = el.innerHTML;
      // Substitui (x) por checkbox marcado
      newHTML = newHTML.replace(/\(x\)/g, `<span class="checkbox-markdown checkbox-checked" data-checked="true" title="Marcado"></span>`);
      // Substitui () ou ( ) por checkbox desmarcado
      newHTML = newHTML.replace(/\(\s*\)/g, `<span class="checkbox-markdown checkbox-unchecked" data-checked="false" title="Não marcado"></span>`);
      el.innerHTML = newHTML;
    });

    return tempDiv.innerHTML;
  }

  // Reset robusto: garante start=1 em listas após headings
  function resetListNumbering(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
      let next = h.nextElementSibling;
      while (next && next.tagName !== "OL") next = next.nextElementSibling;
      if (next && next.tagName === "OL") next.setAttribute("start", "1");
    });

    // fallback: toda OL sem start explícito, seta start=1 (evita “herdar” contador)
    tempDiv.querySelectorAll("ol").forEach((ol) => {
      if (!ol.hasAttribute("start")) ol.setAttribute("start", "1");
    });

    return tempDiv.innerHTML;
  }

  function renderMarkdown(markdownText) {
    try {
      let html = window.marked.parse(markdownText ?? "");
      html = enhanceEmojis(html);
      html = enhanceCheckboxes(html);
      html = resetListNumbering(html);
      return { ok: true, html };
    } catch (err) {
      return {
        ok: false,
        html: `<div class="alert alert-danger">Erro ao renderizar Markdown: ${escapeHtml(err?.message ?? err)}</div>`,
      };
    }
  }

  window.MarkdownService = Object.freeze({
    configureMarked,
    renderMarkdown,
  });
})();
