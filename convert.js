const fs = require('fs');

const content = fs.readFileSync('apps/web/public/mapping.html', 'utf8');

// Extract CSS
const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
const cssContent = cssMatch ? cssMatch[1].trim() : '';

// Extract JS
const jsMatch = content.match(/<script>([\s\S]*?)<\/script>/);
let jsContent = jsMatch ? jsMatch[1].trim() : '';
jsContent = jsContent.replace(
  "window.addEventListener('DOMContentLoaded',()=>{\n  loadLocateGrave();\n  setTimeout(initPreviews,120);\n  if(LOCATE_GRAVE){\n    setTimeout(()=>{ openView('public'); },400);\n  }\n});",
  "window.initMapping = () => {\n  loadLocateGrave();\n  setTimeout(initPreviews,120);\n  if(LOCATE_GRAVE){\n    setTimeout(()=>{ openView('public'); },400);\n  }\n};"
);
jsContent += '\n// Make global functions explicit\n';
['openView', 'closeView', 'setCamera', 'toggleLayer', 'flyToTarget', 'showGravePopup', 'closeGravePopup'].forEach(fn => {
  jsContent += `\nwindow.${fn} = ${fn};`;
});

// Extract Body
const bodyMatch = content.match(/<body>([\s\S]*?)<script/);
const bodyHtml = bodyMatch ? bodyMatch[1].trim() : '';

// Clean up HTML for React dangerouslySetInnerHTML
const pageTsx = `'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import './mapping.css';

export default function MappingPage() {
  const initialized = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).initMapping && !initialized.current) {
        (window as any).initMapping();
        initialized.current = true;
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)', position: 'relative' }}>
      <div dangerouslySetInnerHTML={{ __html: \`${bodyHtml.replace(/`/g, '\\`')}\` }} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      <Script src="/mapping-script.js" strategy="afterInteractive" />
    </div>
  );
}
`;

fs.writeFileSync('apps/web/app/(user)/mapping/mapping.css', cssContent, 'utf8');
fs.writeFileSync('apps/web/public/mapping-script.js', jsContent, 'utf8');
fs.writeFileSync('apps/web/app/(user)/mapping/page.tsx', pageTsx, 'utf8');

console.log('Success');
