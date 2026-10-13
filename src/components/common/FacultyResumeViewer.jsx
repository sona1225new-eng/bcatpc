import React, { useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export default function FacultyResumeViewer({ url }) {
  const pagesRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let disposed = false;
    let documentTask;
    let pdfDocument;
    let renderTask;
    let renderVersion = 0;
    let resizeObserver;
    let resizeFrame;

    const renderPages = async () => {
      if (!pdfDocument || !pagesRef.current || disposed) return;

      const container = pagesRef.current;
      const width = container.clientWidth;
      if (!width) return;

      const version = ++renderVersion;
      renderTask?.cancel();
      container.replaceChildren();
      setStatus('rendering');

      try {
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
          const page = await pdfDocument.getPage(pageNumber);
          if (disposed || version !== renderVersion) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const scale = width / baseViewport.width;
          const viewport = page.getViewport({ scale });
          const outputScale = Math.min(window.devicePixelRatio || 1, 2);
          const canvas = document.createElement('canvas');
          canvas.className = 'block h-auto w-full bg-white';
          canvas.setAttribute('role', 'img');
          canvas.setAttribute('aria-label', `Resume page ${pageNumber} of ${pdfDocument.numPages}`);
          canvas.width = Math.ceil(viewport.width * outputScale);
          canvas.height = Math.ceil(viewport.height * outputScale);
          container.appendChild(canvas);

          renderTask = page.render({
            canvas,
            viewport,
            transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
          });
          await renderTask.promise;
          if (disposed || version !== renderVersion) return;
        }

        setStatus('ready');
      } catch (error) {
        if (error.name !== 'RenderingCancelledException' && !disposed && version === renderVersion) {
          console.error('Failed to render faculty resume PDF:', error);
          container.replaceChildren();
          setStatus('error');
        }
      }
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        renderPages();
      });
    };

    const loadPdf = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        if (disposed) return;
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        documentTask = pdfjs.getDocument({ url });
        pdfDocument = await documentTask.promise;
        if (disposed) {
          await pdfDocument.destroy();
          return;
        }

        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(pagesRef.current);
        await renderPages();
      } catch (error) {
        if (!disposed) {
          console.error('Failed to load faculty resume PDF:', error);
          setStatus('error');
        }
      }
    };

    loadPdf();

    return () => {
      disposed = true;
      renderVersion += 1;
      cancelAnimationFrame(resizeFrame);
      resizeObserver?.disconnect();
      renderTask?.cancel();
      documentTask?.destroy();
    };
  }, [url]);

  return (
    <div className="w-full">
      {status !== 'ready' && (
        <p
          className="py-6 text-center text-sm text-slate-600"
          role={status === 'error' ? 'alert' : 'status'}
        >
          {status === 'error'
            ? 'Unable to display this PDF.'
            : 'Loading resume…'}
        </p>
      )}
      <div
        ref={pagesRef}
        className="mx-auto flex w-full max-w-5xl flex-col gap-2 overflow-hidden"
      />
    </div>
  );
}
