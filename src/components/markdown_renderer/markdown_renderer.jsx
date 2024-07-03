import { useState } from 'react';
// import { Input } from '@/components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';

const MarkdownRenderer = () => {
  const [markdown, setMarkdown] = useState('# Hello\n\nThis is some **bold** and *italic* text.');
  const [css, setCss] = useState('body { font-family: Arial, sans-serif; }\nh1 { color: navy; }\nstrong { color: red; }\nem { color: green; }');
  const [renderedHtml, setRenderedHtml] = useState('');

  const renderMarkdown = () => {

    let html = markdown
      .replace(/# (.*$)/gim, '<h1>$1</h1>')
      .replace(/## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');

    setRenderedHtml(html);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Markdown Renderer with Custom CSS</h1>
      <div className="mb-4">
        <label className="block mb-2">Markdown Input:</label>
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-40"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Custom CSS:</label>
        <Textarea
          value={css}
          onChange={(e) => setCss(e.target.value)}
          className="w-full h-20"
        />
      </div>
      <Button onClick={renderMarkdown} className="mb-4">Render Markdown</Button>
      <Card className="p-4">
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </Card>
    </div>
  );
};

export default MarkdownRenderer;