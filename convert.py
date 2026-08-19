import re

with open('apps/web/public/mapping.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css_content = css_match.group(1).strip()

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
js_content = js_match.group(1).strip()
js_content = js_content.replace("window.addEventListener('DOMContentLoaded',()=>{\n  loadLocateGrave();\n  setTimeout(initPreviews,120);\n  if(LOCATE_GRAVE){\n    setTimeout(()=>{ openView('public'); },400);\n  }\n});", "window.initMapping = () => {\n  loadLocateGrave();\n  setTimeout(initPreviews,120);\n  if(LOCATE_GRAVE){\n    setTimeout(()=>{ openView('public'); },400);\n  }\n};")
js_content += '\n// Make global functions explicit\n'
for fn in ['openView', 'closeView', 'setCamera', 'toggleLayer', 'flyToTarget', 'showGravePopup', 'closeGravePopup']:
    js_content += f'\nwindow.{fn} = {fn};'

# Extract Body
body_match = re.search(r'<body>(.*?)<script', content, re.DOTALL)
body_html = body_match.group(1).strip()

# Clean up HTML for React dangerouslySetInnerHTML
page_tsx = f"""'use client';

import {{ useEffect, useRef }} from 'react';
import Script from 'next/script';
import './mapping.css';

export default function MappingPage() {{
  const initialized = useRef(false);

  useEffect(() => {{
    const timer = setInterval(() => {{
      if (typeof window !== 'undefined' && (window as any).initMapping && !initialized.current) {{
        (window as any).initMapping();
        initialized.current = true;
        clearInterval(timer);
      }}
    }}, 100);
    return () => clearInterval(timer);
  }}, []);

  return (
    <div style={{{{ width: '100%', height: 'calc(100vh - 60px)', position: 'relative' }}}}>
      <div dangerouslySetInnerHTML={{{{ __html: `{body_html.replace('`', '\\\\`')}` }}}} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      <Script src="/mapping-script.js" strategy="afterInteractive" />
    </div>
  );
}}
"""

with open('apps/web/app/(user)/mapping/mapping.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

with open('apps/web/public/mapping-script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

with open('apps/web/app/(user)/mapping/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_tsx)

print('Success')
