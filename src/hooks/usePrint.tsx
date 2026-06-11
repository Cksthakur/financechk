import { useCallback } from "react"

type PrintOptions =
  | {
      title?: string
      content: string
      isHtml?: false
    }
  | {
      title?: string
      content: string
      isHtml: true
    }

export const usePrint = () => {
  const print = useCallback((options: PrintOptions) => {
    const { title = "", content, isHtml = false } = options

    const iframe = document.createElement("iframe")

    Object.assign(iframe.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "0",
    })

    document.body.appendChild(iframe)

    const win = iframe.contentWindow
    if (!win) {
      document.body.removeChild(iframe)
      return
    }

    const doc = win.document

    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4;
              margin: 0;
            }

            body {
              margin: 0;
              background: #fff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #111;
            }

            .page {
              max-width: 720px;
              margin: 0 auto;
              padding: 24mm 20mm;
              font-size: 14px;
              line-height: 1.6;
            }

            .header {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 12px;
            }

            .title {
              text-align: center;
              font-weight: 600;
              margin-bottom: 20px;
            }

            .content {
              white-space: pre-wrap;
            }

            .content p {
              margin: 0 0 12px 0;
            }

            .signature {
              margin-top: 24px;
            }

            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">${new Date().toLocaleString()}</div>
            <div class="title">${title}</div>
            <div class="content" id="content"></div>
          </div>
        </body>
      </html>
    `)
    doc.close()

    const contentEl = doc.getElementById("content")
    if (!contentEl) return

    // Inject content
    if (isHtml) {
      contentEl.innerHTML = content
    } else {
      // Convert text → paragraphs for better formatting
      const paragraphs = content
        .split(/\n{2,}/)
        .map((p) => `<p>${escapeHtml(p)}</p>`)
      contentEl.innerHTML = paragraphs.join("")
    }

    const triggerPrint = () => {
      win.focus()
      win.print()

      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 500)
    }

    if (doc.readyState === "complete") {
      setTimeout(triggerPrint, 120)
    } else {
      win.onload = () => triggerPrint()
    }
  }, [])

  return print
}

// Minimal safe escape (only used for text mode)
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
