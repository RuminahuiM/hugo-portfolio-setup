async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.JSZip;
}

async function downloadProjectZip(container) {
  const manifestURL = container.dataset.projectManifest;
  const markdownURL = container.dataset.projectMarkdown;

  const [manifestRes, markdownRes] = await Promise.all([fetch(manifestURL), fetch(markdownURL)]);

  if (!manifestRes.ok || !markdownRes.ok) {
    throw new Error('Unable to fetch project bundle files.');
  }

  const manifest = await manifestRes.json();
  const markdown = await markdownRes.text();

  const JSZip = await ensureJSZip();
  const zip = new JSZip();

  zip.file('project.md', markdown);

  const assetsFolder = zip.folder('assets');

  await Promise.all(
    (manifest.assets || []).map(async (asset) => {
      const response = await fetch(asset.path);
      if (!response.ok) return;
      const blob = await response.blob();
      assetsFolder.file(asset.name, blob);
    })
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadLink = document.createElement('a');
  const safeName = (manifest.project || 'project').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${safeName || 'project'}-documentation.zip`;
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
}

function wireProjectDownloads() {
  const blocks = document.querySelectorAll('.project-downloads');

  blocks.forEach((block) => {
    const zipBtn = block.querySelector('[data-project-zip-btn]');
    if (!zipBtn || zipBtn.dataset.wired) return;

    zipBtn.dataset.wired = 'true';
    zipBtn.addEventListener('click', async () => {
      const defaultLabel = zipBtn.textContent;
      zipBtn.disabled = true;
      zipBtn.textContent = 'Preparing ZIP…';

      try {
        await downloadProjectZip(block);
        zipBtn.textContent = 'ZIP downloaded';
      } catch (err) {
        console.error(err);
        zipBtn.textContent = 'Download failed. Retry';
      } finally {
        setTimeout(() => {
          zipBtn.disabled = false;
          zipBtn.textContent = defaultLabel;
        }, 1600);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireProjectDownloads);
} else {
  wireProjectDownloads();
}
