(() => {
  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
  };

  const debounce = (fn, wait = 150) => {
    let t = null;
    return (...args) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => fn(...args), wait);
    };
  };

  const formatDatePtBr = (date = new Date()) =>
    date.toLocaleDateString("pt-BR");

  window.AppUtils = Object.freeze({
    escapeHtml,
    debounce,
    formatDatePtBr,
  });
})();
