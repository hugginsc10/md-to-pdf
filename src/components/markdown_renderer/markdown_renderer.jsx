import { useState, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import DOMPurify from 'dompurify';

const defaultCss = `
h1, h2, h3, h4, h5, h6 {
  text-align: center;
  color: midnightblue;
}
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
p {
  text-align: left;
  margin-bottom: 1em;
}
strong {
  color: #d32f2f;
}
em {
  color: #388e3c;
}
`
const MarkdownRenderer = () => {
  const [markdown, setMarkdown] = useState('# Hello\n\nThis is some **bold** and *italic* text.');
  const [cssCode, setCssCode] = useState(defaultCss);
  const [renderedHtml, setRenderedHtml] = useState("");

  useEffect(() => {
    marked.setOptions({
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-'
    });


    const rawHtml = marked(markdown);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    setRenderedHtml(sanitizedHtml);
  }, [markdown]);


  const handleCssKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const lines = css.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const indent = currentLine.match(/^\s*/)[0];
      const newValue = css.substring(0, start) + '\n' + indent + css.substring(end);
      setCssCode(newValue);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + indent.length + 1;
      }, 0);
    }
  }, [css]);
  const generatePDF = async () => {
    const element = document.createElement('div');
    element.innerHTML = renderedHtml;
    element.style.cssText = css;
    document.body.appendChild(element);

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('markdown.pdf');
    document.body.removeChild(element);
  }




  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Markdown to PDF Converter</h1>
      <div className="mb-4">
        <label className="block mb-2 text-left">Markdown Input</label>
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-40 bg-"
        />

      </div>
      <div className="mb-4 text-left">
        <label className="block mb-2 text-left">CSS</label>

        <CodeMirror
          value={cssCode}
          height="200px"
          extensions={[css()]}
          onChange={(value) => setCssCode(value)}
          onKeyDown={handleCssKeyDown}
          theme="dark"
        />
      </div>
      <Button onClick={generatePDF} className="mb-4">Download PDF</Button>
      <Card className="p-4">
        <style>{css}</style>
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </Card>
    </div>
  );
};

export default MarkdownRenderer;