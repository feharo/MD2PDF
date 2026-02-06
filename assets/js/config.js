(() => {
  window.AppConfig = Object.freeze({
    marked: {
      breaks: true,
      gfm: true,
      pedantic: false,
      smartLists: true,
      smartypants: true,
      headerIds: true,
      mangle: false,
    },
    pdf: {
      margin: [5, 7, 7, 7],
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: {
        scale: 1,
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
        precision: 16,
      },
      filenamePrefix: "Documento",
      header: { enabled: false, title: "", subtitlePrefix: "" },
      footer: { enabled: false, text: "" },
    },
    ui: {
      renderDebounceMs: 120,
    },
  });
})();
