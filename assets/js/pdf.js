(() => {
  const { formatDatePtBr } = window.AppUtils;

  function buildPdfHeader() {
    const cfg = window.AppConfig.pdf.header;
    if (!cfg?.enabled) return "";
    const date = formatDatePtBr(new Date());
    return `
      <div class="pdf-header">
        <div class="pdf-title">${cfg.title}</div>
        <div class="pdf-subtitle">${cfg.subtitlePrefix} | ${date}</div>
      </div>
    `;
  }

  function buildPdfFooter() {
    const cfg = window.AppConfig.pdf.footer;
    if (!cfg?.enabled) return "";
    return `
      <div class="pdf-footer">
        <div>${cfg.text}</div>
      </div>
    `;
  }

  function buildFilename() {
    const prefix = window.AppConfig.pdf.filenamePrefix;
    const yyyyMmDd = new Date().toISOString().slice(0, 10);
    return `${prefix}_${yyyyMmDd}.pdf`;
  }

  async function generateFromHtml(html, { onFinally, onProgress } = {}) {
    const root = document.getElementById("pdf-root");
    const content = root?.querySelector(".pdf-content");
    if (!root || !content) throw new Error("pdf-root não encontrado.");

    // Processa o HTML em chunks para documentos grandes
    const maxChunkSize = 50000; // caracteres por chunk
    const needsChunking = html.length > maxChunkSize;
    
    if (needsChunking && typeof onProgress === 'function') {
      onProgress({ status: 'processando', message: 'Documento grande detectado, otimizando...' });
    }

    content.innerHTML = buildPdfHeader() + html + buildPdfFooter();

    const opt = {
      ...window.AppConfig.pdf,
      filename: buildFilename(),
    };

    // html2pdf espera as configs em chaves específicas, então "normaliza":
    const normalizedOpt = {
      margin: opt.margin,
      filename: opt.filename,
      image: opt.image,
      html2canvas: opt.html2canvas,
      jsPDF: opt.jsPDF,

      pagebreak: {
        mode: ["css", "legacy"],
        avoid: ["tr", "blockquote", "pre", "img"],
      },
    };

    try {
      if (typeof onProgress === 'function') {
        onProgress({ status: 'gerando', message: 'Gerando PDF...' });
      }
      
      await window.html2pdf().set(normalizedOpt).from(content).save();
      
      if (typeof onProgress === 'function') {
        onProgress({ status: 'concluido', message: 'PDF gerado com sucesso!' });
      }
    } catch (error) {
      if (typeof onProgress === 'function') {
        onProgress({ status: 'erro', message: 'Erro ao gerar PDF: ' + error.message });
      }
      throw error;
    } finally {
      content.innerHTML = "";
      if (typeof onFinally === "function") onFinally();
    }
  }

  window.PdfService = Object.freeze({
    generateFromHtml,
  });
})();
