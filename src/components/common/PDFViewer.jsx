import React, { useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const PDFJS_IMPORT_RELOAD_KEY = 'bcatpc:pdfjs-import-reload';

export default function PDFViewer({ url, documentLabel = 'PDF document', onStatusChange }) {
  const pagesRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    onStatusChange?.(status, errorMessage);
  }, [status, errorMessage, onStatusChange]);

  useEffect(() => {
    let disposed = false;
    let documentTask;
    let pdfDocument;
    let renderTask;
    let renderVersion = 0;
    let resizeObserver;
    let resizeFrame;
    let renderedWidth = 0;

    setStatus('loading');
    setErrorMessage('');

    const renderPages = async () => {
      if (!pdfDocument || !pagesRef.current || disposed) return;

      const container = pagesRef.current;
      const width = container.clientWidth;
      if (!width) return;
      renderedWidth = width;

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
          canvas.setAttribute('aria-label', `${documentLabel} page ${pageNumber} of ${pdfDocument.numPages}`);
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
          console.error(`Failed to render ${documentLabel}:`, error);
          container.replaceChildren();
          setErrorMessage(error.message);
          setStatus('error');
        }
      }
    };

    const handleResize = () => {
      const width = pagesRef.current?.clientWidth || 0;
      if (!width || Math.abs(width - renderedWidth) < 1) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        renderPages();
      });
    };

    const loadPdf = async () => {
      try {
        let pdfjs;
        try {
          pdfjs = await import('pdfjs-dist');
          sessionStorage.removeItem(PDFJS_IMPORT_RELOAD_KEY);
        } catch (error) {
          if (!sessionStorage.getItem(PDFJS_IMPORT_RELOAD_KEY)) {
            sessionStorage.setItem(PDFJS_IMPORT_RELOAD_KEY, '1');
            window.location.reload();
            return;
          }
          throw error;
        }

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
          console.error(`Failed to load ${documentLabel}:`, error);
          setErrorMessage(error.message);
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
  }, [url, documentLabel]);

  return (
    <div className="w-full">
      {status === 'error' && (
        <div
          className="my-3 rounded-2xl border border-amber-200 bg-[var(--college-logo-red)]/5 p-6 text-center text-amber-900"
          role="alert"
        >
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--college-logo-red)]/10 text-amber-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-amber-950">
            {errorMessage?.includes('404')
              ? 'PDF Document Currently Unavailable (404)'
              : `Unable to display ${documentLabel}`}
          </h4>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-amber-800">
            {errorMessage?.includes('404')
              ? 'The digital examination PDF file for this question paper could not be found on the server. The college administration has been notified to re-upload the official question paper copy.'
              : errorMessage || 'An error occurred while loading the PDF document.'}
          </p>
        </div>
      )}
      {status === 'loading' && (
        <p className="py-6 text-center text-xs font-medium text-slate-500" role="status">
          Loading {documentLabel}…
        </p>
      )}
      <div
        ref={pagesRef}
        className="mx-auto flex w-full max-w-5xl flex-col gap-2 overflow-hidden"
      />
    </div>
  );
}
