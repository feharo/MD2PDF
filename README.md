# MD2PDF

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
</p>

<p align="center">
  <strong>Conversor de Markdown para PDF com Preview em Tempo Real</strong>
</p>

<p align="center">
  <a href="#-demonstração">Demonstração</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-como-usar">Como Usar</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-tecnologias">Tecnologias</a>
</p>

---

## 🚀 Demonstração

Acesse a versão online: [https://feharo.github.io/MD2PDF](https://feharo.github.io/MD2PDF)

![MD2PDF Screenshot](./assets/screenshot.png)

---

## ✨ Funcionalidades

- ✅ **Preview em tempo real** - Veja suas alterações instantaneamente
- ✅ **Upload de arquivos** - Arraste ou selecione arquivos .md, .markdown ou .txt
- ✅ **Exportação para PDF** - Gere PDFs de alta qualidade com um clique
- ✅ **Sintaxe completa** - Suporte a tabelas, código, listas, citações e mais
- ✅ **Checkboxes** - Renderização visual de tarefas `(x)` e `( )`
- ✅ **100% Front-end** - Não envia dados para servidor
- ✅ **Design responsivo** - Funciona em desktop e mobile
- ✅ **Animações elegantes** - Interface moderna e sofisticada
- ✅ **Atalhos de teclado** - `Ctrl/Cmd + P` para gerar PDF

---

## 📖 Como Usar

### Online
1. Acesse [https://feharo.github.io/MD2PDF](https://feharo.github.io/MD2PDF)
2. Cole seu Markdown no editor ou carregue um arquivo
3. Clique em **"Gerar PDF"** ou pressione `Ctrl/Cmd + P`

### Localmente
```bash
# Clone o repositório
git clone https://github.com/feharo/MD2PDF.git

# Entre na pasta
cd MD2PDF

# Abra o arquivo index.html no navegador
# No macOS:
open index.html

# No Linux:
xdg-open index.html

# No Windows:
start index.html
```

---

## 🛠️ Instalação

Não é necessário instalação! O MD2PDF é uma aplicação web pura que roda diretamente no navegador.

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para carregar bibliotecas CDN)

---

## 💻 Tecnologias

- **[Marked.js](https://marked.js.org/)** - Parser Markdown
- **[html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)** - Geração de PDF
- **[Bootstrap 5](https://getbootstrap.com/)** - Framework CSS
- **JavaScript Vanilla** - Lógica da aplicação
- **CSS3** - Estilização e animações

---

## 📁 Estrutura do Projeto

```
MD2PDF/
├── index.html              # Página principal
├── LICENSE                 # Licença MIT
├── README.md              # Este arquivo
└── assets/
    ├── css/
    │   ├── base.css          # Variáveis e reset
    │   ├── layout.css        # Layout da aplicação
    │   ├── markdown-preview.css  # Estilos do preview
    │   ├── pdf.css           # Estilos do PDF
    │   └── animations.css    # Animações e UI
    └── js/
        ├── app.js            # Lógica principal
        ├── config.js         # Configurações
        ├── markdown.js       # Processamento Markdown
        ├── pdf.js            # Geração de PDF
        └── utils.js          # Utilitários
```

---

## 🎨 Personalização

### Alterar cores
Edite `assets/css/base.css`:
```css
:root {
  --primary: #sua-cor;      /* Cor principal */
  --primary-dark: #sua-cor; /* Cor escura */
}
```

### Configurar PDF
Edite `assets/js/config.js`:
```javascript
pdf: {
  filenamePrefix: "MeuDocumento",
  image: { quality: 0.95 },  // Qualidade (0-1)
  // ... outras opções
}
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Faça um **Fork** do projeto
2. Crie uma **branch** (`git checkout -b feature/nova-funcionalidade`)
3. Faça **commit** das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Felipe Aquino**
- 💼 Fundador da [Feharo Tech](https://feharo.tech)
- 🐙 GitHub: [@feharo](https://github.com/feharo)
- 💼 LinkedIn: [Felipe Aquino](https://linkedin.com/in/feharo)

---

## 🙏 Agradecimentos

- [Marked.js](https://marked.js.org/) pela excelente biblioteca de parsing
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) pela geração de PDF
- [Bootstrap](https://getbootstrap.com/) pelo framework CSS

---

<p align="center">
  ⭐ <strong>Se este projeto te ajudou, deixe uma estrela!</strong> ⭐
</p>
