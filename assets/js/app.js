(() => {
  const { debounce } = window.AppUtils;

  const state = {
    elements: /** @type {null | {
      textarea: HTMLTextAreaElement,
      preview: HTMLElement,
      btnGenerate: HTMLButtonElement,
      btnUpload: HTMLButtonElement,
      fileInput: HTMLInputElement,
      status: HTMLElement,
      loadingOverlay: HTMLElement,
      loadingMessage: HTMLElement,
      loadingSubmessage: HTMLElement,
      progressBar: HTMLElement,
      toastContainer: HTMLElement
    }} */ (null),
  };

  // ============================================
  // NOTIFICAÇÕES TOAST
  // ============================================
  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;
    
    state.elements.toastContainer.appendChild(toast);
    
    // Fechar ao clicar no X
    toast.querySelector('.toast-close').addEventListener('click', () => {
      hideToast(toast);
    });
    
    // Auto-fechar
    if (duration > 0) {
      setTimeout(() => hideToast(toast), duration);
    }
  }

  function hideToast(toast) {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }

  // ============================================
  // LOADING OVERLAY
  // ============================================
  function showLoading(message = 'Processando...', submessage = '') {
    const { loadingOverlay, loadingMessage, loadingSubmessage, progressBar } = state.elements;
    loadingMessage.textContent = message;
    loadingSubmessage.textContent = submessage;
    progressBar.style.width = '0%';
    loadingOverlay.classList.add('active');
  }

  function hideLoading() {
    state.elements.loadingOverlay.classList.remove('active');
    state.elements.progressBar.style.width = '0%';
  }

  function updateProgress(percent) {
    state.elements.progressBar.style.width = `${percent}%`;
  }

  function setLoadingMessage(message, submessage = '') {
    state.elements.loadingMessage.textContent = message;
    if (submessage) {
      state.elements.loadingSubmessage.textContent = submessage;
    }
  }

  // ============================================
  // STATUS
  // ============================================
  function setStatus(text, type = '') {
    if (!state.elements?.status) return;
    state.elements.status.textContent = text || '';
    state.elements.status.className = type ? type : '';
  }

  function setBusy(isBusy) {
    const btn = state.elements?.btnGenerate;
    if (!btn) return;

    btn.disabled = isBusy;
    btn.dataset.originalText ??= btn.textContent;

    if (isBusy) {
      btn.textContent = '⏳ Gerando...';
      setStatus('Exportando...', 'loading');
    } else {
      btn.textContent = btn.dataset.originalText;
      setStatus('PDF gerado com sucesso!', 'success');
      setTimeout(() => setStatus('Pronto'), 2000);
    }
  }

  // ============================================
  // PREVIEW
  // ============================================
  function updatePreview() {
    const { textarea, preview } = state.elements;
    const markdown = textarea.value;
    const result = window.MarkdownService.renderMarkdown(markdown);
    preview.innerHTML = result.html;
  }

  const updatePreviewDebounced = debounce(
    updatePreview,
    window.AppConfig.ui.renderDebounceMs
  );

  // ============================================
  // GERAR PDF
  // ============================================
  async function onGeneratePdf() {
    const { textarea } = state.elements;
    
    showLoading('Gerando PDF...', 'Processando seu documento');
    updateProgress(10);
    
    try {
      updateProgress(30);
      const { html } = window.MarkdownService.renderMarkdown(textarea.value);
      
      updateProgress(50);
      await window.PdfService.generateFromHtml(html, {
        onProgress: (info) => {
          setLoadingMessage(info.message);
          if (info.status === 'gerando') {
            updateProgress(75);
          } else if (info.status === 'concluido') {
            updateProgress(100);
          }
        },
        onFinally: () => {
          setTimeout(() => {
            hideLoading();
            showToast('PDF gerado com sucesso!', 'success');
          }, 500);
        },
      });
    } catch (err) {
      console.error(err);
      hideLoading();
      showToast('Erro ao gerar PDF: ' + (err?.message ?? err), 'error', 5000);
      setStatus('Erro ao gerar PDF', 'error');
    }
  }

  // ============================================
  // UPLOAD DE ARQUIVO
  // ============================================
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Verifica extensão
    const validExtensions = ['.md', '.markdown', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      showToast('Por favor, selecione um arquivo .md, .markdown ou .txt', 'error');
      event.target.value = ''; // Limpa o input
      return;
    }

    showLoading('Carregando arquivo...', file.name);
    updateProgress(20);
    setStatus('Carregando arquivo...', 'loading');

    const reader = new FileReader();
    
    reader.onload = (e) => {
      updateProgress(60);
      const content = e.target.result;
      
      // Pequeno delay para mostrar a animação
      setTimeout(() => {
        state.elements.textarea.value = content;
        updatePreview();
        updateProgress(100);
        
        setTimeout(() => {
          hideLoading();
          showToast(`Arquivo "${file.name}" carregado!`, 'success');
          setStatus('Arquivo carregado', 'success');
          setTimeout(() => setStatus('Pronto'), 2000);
        }, 300);
      }, 300);
    };
    
    reader.onerror = () => {
      hideLoading();
      showToast('Erro ao ler o arquivo', 'error');
      setStatus('Erro ao carregar arquivo', 'error');
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Limpa o input para permitir reupload
  }

  // ============================================
  // EVENTOS
  // ============================================
  function bindEvents() {
    const { textarea, btnGenerate, btnUpload, fileInput } = state.elements;

    textarea.addEventListener("input", updatePreviewDebounced);
    btnGenerate.addEventListener("click", onGeneratePdf);
    
    // Upload de arquivo
    btnUpload.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handleFileUpload);

    // Atalho: Ctrl/Cmd + P gera PDF
    window.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "p") {
        e.preventDefault();
        onGeneratePdf();
      }
    });

    // Drag and drop
    const editorPane = textarea.closest('.app-pane');
    
    editorPane.addEventListener('dragover', (e) => {
      e.preventDefault();
      editorPane.style.borderColor = 'var(--primary)';
      editorPane.style.backgroundColor = 'rgba(47, 128, 237, 0.05)';
    });
    
    editorPane.addEventListener('dragleave', (e) => {
      e.preventDefault();
      editorPane.style.borderColor = '';
      editorPane.style.backgroundColor = '';
    });
    
    editorPane.addEventListener('drop', (e) => {
      e.preventDefault();
      editorPane.style.borderColor = '';
      editorPane.style.backgroundColor = '';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const event = { target: { files: files } };
        handleFileUpload(event);
      }
    });
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================
  function init() {
    state.elements = {
      textarea: document.getElementById("markdown"),
      preview: document.getElementById("preview"),
      btnGenerate: document.getElementById("btn-generate"),
      btnUpload: document.getElementById("btn-upload"),
      fileInput: document.getElementById("file-input"),
      status: document.getElementById("status"),
      loadingOverlay: document.getElementById("loading-overlay"),
      loadingMessage: document.getElementById("loading-message"),
      loadingSubmessage: document.getElementById("loading-submessage"),
      progressBar: document.getElementById("progress-bar"),
      toastContainer: document.getElementById("toast-container"),
    };

    window.MarkdownService.configureMarked();
    bindEvents();
    updatePreview();
    setStatus("Pronto");
    
    // Toast de boas-vindas
    setTimeout(() => {
      showToast('Bem-vindo ao MD2PDF! Arraste um arquivo ou clique em "Carregar MD"', 'info', 5000);
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
