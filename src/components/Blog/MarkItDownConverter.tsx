'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { marked } from 'marked'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Configure marked for GFM tables & breaks (matching reference project)
marked.setOptions({
  gfm: true,
  breaks: true,
})

export default function MarkItDownConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedMarkdown, setConvertedMarkdown] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted')
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [progressPercent, setProgressPercent] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading file contents')
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [])

  // Start simulated progress
  const startProgress = (fileName: string) => {
    setProgressPercent(0)
    setProgressLabel(`Processing: ${fileName}`)

    const stages = [
      { at: 15, label: 'Reading file contents...' },
      { at: 30, label: 'Uploading to server...' },
      { at: 50, label: 'Running structure extraction...' },
      { at: 70, label: 'Parsing document layout...' },
      { at: 85, label: 'Generating markdown output...' },
      { at: 92, label: 'Finalizing conversion...' },
    ]

    let current = 0
    progressInterval.current = setInterval(() => {
      current += Math.random() * 3 + 0.5
      if (current > 92) current = 92 // Cap at 92% until real completion
      setProgressPercent(Math.min(Math.round(current), 92))

      const stage = [...stages].reverse().find(s => current >= s.at)
      if (stage) setProgressLabel(stage.label)
    }, 200)
  }

  const stopProgress = (success: boolean) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    if (success) {
      setProgressPercent(100)
      setProgressLabel('Conversion complete!')
    }
  }

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // File Select handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  // Upload & Conversion execution
  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile)
    setIsConverting(true)
    setErrorMessage('')
    setConvertedMarkdown('')
    startProgress(selectedFile.name)

    const formData = new FormData()
    formData.append('file', selectedFile)

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const endpoint = isLocal
      ? 'http://127.0.0.1:5000/convert'
      : (process.env.NEXT_PUBLIC_MARKITDOWN_API_URL || 'https://shourov-paul-markitdown.onrender.com/convert')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        stopProgress(true)
        // Small delay to show 100% before transitioning
        await new Promise(resolve => setTimeout(resolve, 400))
        setConvertedMarkdown(data.markdown)
      } else {
        throw new Error(data.error || 'Conversion failed.')
      }
    } catch (err: any) {
      console.error('Error during conversion:', err)
      stopProgress(false)
      setErrorMessage(err.message || 'An error occurred during file conversion.')
      setFile(null)
    } finally {
      setIsConverting(false)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!convertedMarkdown) return
    try {
      await navigator.clipboard.writeText(convertedMarkdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  }

  // Download Markdown file
  const handleDownload = () => {
    if (!convertedMarkdown || !file) return

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    const outFileName = `${baseName}.md`

    const blob = new Blob([convertedMarkdown], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = outFileName
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Reset
  const handleReset = () => {
    setFile(null)
    setConvertedMarkdown('')
    setErrorMessage('')
    setActiveTab('formatted')
    setProgressPercent(0)
  }

  // Helper formatting size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const getFriendlyFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    const types: Record<string, string> = {
      'pdf': 'PDF Document',
      'docx': 'Word Document',
      'doc': 'Word Document',
      'xlsx': 'Excel Spreadsheet',
      'xls': 'Excel Spreadsheet',
      'pptx': 'PowerPoint Presentation',
      'ppt': 'PowerPoint Presentation',
      'png': 'PNG Image',
      'jpg': 'JPEG Image',
      'jpeg': 'JPEG Image',
      'gif': 'GIF Image',
      'mp3': 'MP3 Audio',
      'wav': 'WAV Audio',
      'zip': 'ZIP Archive',
      'epub': 'EPub Book',
      'csv': 'CSV File',
      'json': 'JSON Data',
      'xml': 'XML Document',
      'html': 'HTML Document',
      'txt': 'Text Document',
      'md': 'Markdown File'
    }
    return types[ext] || `${ext.toUpperCase()} File`
  }

  // Render markdown safely
  const getHtmlContent = () => {
    try {
      const parsed = marked.parse(convertedMarkdown)
      return typeof parsed === 'string' ? parsed : ''
    } catch {
      return '*Error parsing Markdown.*'
    }
  }

  // ─── LOADING STATE: Spinner ring + % progress ───
  if (isConverting && file) {
    return (
      <div className="w-full max-w-[760px] mx-auto animate-fade-in text-neutral select-none">
        {/* Loader Card — exact replica of reference */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center backdrop-blur-xl border"
          style={{
            background: 'var(--bg-secondary, rgba(17, 24, 39, 0.7))',
            borderColor: 'var(--border, rgba(255,255,255,0.08))',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Spinner Ring (4-ring CSS animation) */}
          <div className="relative inline-block" style={{ width: 80, height: 80 }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  boxSizing: 'border-box',
                  display: 'block',
                  position: 'absolute',
                  width: 64,
                  height: 64,
                  margin: 8,
                  border: '6px solid var(--accent, #6366f1)',
                  borderRadius: '50%',
                  animation: 'spinnerRing 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                  borderColor: 'var(--accent, #6366f1) transparent transparent transparent',
                  animationDelay: `${-0.45 + i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Title */}
          <h4 className="text-xl font-bold text-neutral mt-6 mb-2">Converting Document...</h4>

          {/* File name label */}
          <p className="text-sm text-tertiary-content/70 mb-1.5 truncate max-w-[300px]">
            {progressLabel}
          </p>

          {/* Percentage */}
          <p className="text-2xl font-extrabold mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {progressPercent}%
          </p>

          {/* Progress bar */}
          <div
            className="w-full max-w-xs rounded-full overflow-hidden"
            style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, var(--gradient-start, #6366f1), var(--gradient-end, #06b6d4))',
              }}
            />
          </div>
        </div>

        {/* Keyframes injected inline */}
        <style jsx>{`
          @keyframes spinnerRing {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // ─── LANDING STATE: Upload dropzone ───
  if (!file && !convertedMarkdown) {
    return (
      <div className="w-full max-w-[760px] mx-auto animate-fade-in text-neutral select-none">
        {/* ERROR TOAST */}
        {errorMessage && (
          <div
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-xl px-6 py-4 text-white shadow-2xl animate-slide-in"
            style={{
              background: 'rgba(239, 68, 68, 0.95)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.25)',
            }}
          >
            <i className="fa-solid fa-triangle-exclamation text-lg" />
            <span className="text-sm font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              className="text-white font-bold text-xl ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-[4.5rem] px-8 transition-all duration-300 text-center cursor-pointer backdrop-blur-xl relative ${
            dragOver
              ? 'scale-[1.02]'
              : 'hover:-translate-y-0.5'
          }`}
          style={{
            background: dragOver ? 'var(--bg-card-hover, rgba(26, 36, 57, 0.95))' : 'var(--bg-secondary, rgba(17, 24, 39, 0.7))',
            borderColor: dragOver ? 'var(--accent, #06b6d4)' : 'var(--border, rgba(255,255,255,0.08))',
            boxShadow: dragOver
              ? '0 8px 40px 0 rgba(var(--a, 99, 102, 241), 0.25)'
              : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
          onClick={() => document.getElementById('markitdownFileInput')?.click()}
        >
          <input
            type="file"
            id="markitdownFileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-6 py-6">
            {/* Center Cloud Icon with soft glow and theme gradient */}
            <div className="relative group/cloud flex items-center justify-center mb-2">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-125 opacity-70 group-hover/cloud:scale-150 transition-transform duration-500"></div>
              <i
                className="fa-solid fa-cloud-arrow-up text-[4.5rem] bg-clip-text text-transparent relative animate-[pulse_3.5s_infinite_ease-in-out]"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))'
                }}
              />
            </div>

            {/* Badges row of file formats using FontAwesome */}
            <div className="flex items-center gap-3.5 text-tertiary-content/60 hover:text-tertiary-content transition-colors duration-300 text-xl">
              <i className="fa-solid fa-file-pdf" title="PDF Document" />
              <i className="fa-solid fa-file-word" title="Word Document" />
              <i className="fa-solid fa-file-excel" title="Excel Spreadsheet" />
              <i className="fa-solid fa-file-powerpoint" title="PowerPoint Presentation" />
              <i className="fa-solid fa-file-image" title="Images" />
              <i className="fa-solid fa-file-audio" title="Audio File" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-neutral tracking-tight">Drag & Drop your file here</h3>
              <p className="text-xs text-tertiary-content/70 max-w-md mx-auto leading-relaxed">
                Supports PDF, DOCX, XLSX, PPTX, PNG, JPG, MP3, WAV, EPub, ZIP & more
              </p>
            </div>

            <button
              className="px-7 py-3.5 rounded-xl text-[0.95rem] font-semibold transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-2 mt-2"
              style={{
                background: 'linear-gradient(135deg, var(--gradient-start, #6366f1), var(--gradient-end, #4f46e5))',
                color: '#ffffff',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
              }}
            >
              <i className="fa-regular fa-folder-open" /> Browse Files
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── RESULT WORKSPACE: Sidebar + Main Preview (exact reference layout) ───
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in text-neutral select-none">
      {/* Error Toast */}
      {errorMessage && (
        <div
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-xl px-6 py-4 text-white shadow-2xl"
          style={{
            background: 'rgba(239, 68, 68, 0.95)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.25)',
          }}
        >
          <i className="fa-solid fa-triangle-exclamation text-lg" />
          <span className="text-sm font-medium">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="text-white font-bold text-xl ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            &times;
          </button>
        </div>
      )}

      {/* Workspace Grid: Sidebar + Main */}
      <div className="grid gap-6 items-start" style={{ gridTemplateColumns: '280px 1fr' }}>
        {/* ── SIDEBAR: File Stats & Info ── */}
        <div
          className="rounded-2xl p-6 backdrop-blur-xl border flex flex-col gap-5"
          style={{
            background: 'var(--bg-secondary, rgba(17, 24, 39, 0.7))',
            borderColor: 'var(--border, rgba(255,255,255,0.08))',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          }}
        >
          <h4 className="text-base font-bold text-neutral flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-accent" />
            File Information
          </h4>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-tertiary-content/60 uppercase tracking-wider">Name</span>
              <span className="text-sm font-medium text-neutral truncate" title={file?.name}>
                {file?.name || 'document.pdf'}
              </span>
            </div>
            {/* Size */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-tertiary-content/60 uppercase tracking-wider">Size</span>
              <span className="text-sm font-medium text-neutral">
                {file ? formatBytes(file.size) : '0 KB'}
              </span>
            </div>
            {/* Type */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-tertiary-content/60 uppercase tracking-wider">Type</span>
              <span className="text-sm font-medium text-neutral">
                {file ? getFriendlyFileType(file.name) : 'Unknown'}
              </span>
            </div>
          </div>

          {/* Convert Another button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)]"
            style={{
              background: 'transparent',
              borderColor: 'var(--border, rgba(255,255,255,0.08))',
              color: 'var(--text-neutral, #f3f4f6)',
            }}
          >
            <i className="fa-solid fa-arrow-left text-xs" /> Convert Another
          </button>
        </div>

        {/* ── MAIN CONTENT: Previewer Card ── */}
        <div
          className="rounded-2xl backdrop-blur-xl border flex flex-col overflow-hidden"
          style={{
            background: 'var(--bg-secondary, rgba(17, 24, 39, 0.7))',
            borderColor: 'var(--border, rgba(255,255,255,0.08))',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
            minHeight: 500,
            maxHeight: '70vh',
          }}
        >
          {/* Previewer Header: Tabs + Actions */}
          <div
            className="flex justify-between items-center px-5 py-3 border-b flex-wrap gap-2"
            style={{
              borderColor: 'var(--border, rgba(255,255,255,0.08))',
              background: 'rgba(11, 15, 25, 0.3)',
            }}
          >
            {/* Tab Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('formatted')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                  activeTab === 'formatted'
                    ? ''
                    : 'border-transparent hover:bg-[rgba(255,255,255,0.05)]'
                }`}
                style={
                  activeTab === 'formatted'
                    ? {
                        color: 'var(--text-neutral, #f3f4f6)',
                        background: 'rgba(var(--a, 99, 102, 241), 0.15)',
                        borderColor: 'rgba(var(--a, 99, 102, 241), 0.25)',
                      }
                    : {
                        color: 'var(--text-tertiary-content, #9ca3af)',
                        background: 'transparent',
                      }
                }
              >
                <i className="fa-solid fa-eye text-xs" /> Formatted Preview
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                  activeTab === 'raw'
                    ? ''
                    : 'border-transparent hover:bg-[rgba(255,255,255,0.05)]'
                }`}
                style={
                  activeTab === 'raw'
                    ? {
                        color: 'var(--text-neutral, #f3f4f6)',
                        background: 'rgba(var(--a, 99, 102, 241), 0.15)',
                        borderColor: 'rgba(var(--a, 99, 102, 241), 0.25)',
                      }
                    : {
                        color: 'var(--text-tertiary-content, #9ca3af)',
                        background: 'transparent',
                      }
                }
              >
                <i className="fa-solid fa-code text-xs" /> Raw Markdown
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-300"
                style={
                  copied
                    ? {
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderColor: 'rgba(16, 185, 129, 0.4)',
                        color: '#10b981',
                      }
                    : {
                        background: 'rgba(255,255,255,0.06)',
                        borderColor: 'var(--border, rgba(255,255,255,0.08))',
                        color: 'var(--text-neutral, #f3f4f6)',
                      }
                }
              >
                <i className={`fa-${copied ? 'solid fa-check' : 'regular fa-copy'} text-xs`} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.15))',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                }}
              >
                <i className="fa-solid fa-download text-xs" /> Download
              </button>
            </div>
          </div>

          {/* Previewer Body */}
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin' }}>
            {activeTab === 'formatted' ? (
              <div
                className="markdown-body max-w-none"
                dangerouslySetInnerHTML={{ __html: getHtmlContent() }}
              />
            ) : (
              <div className="font-mono text-sm overflow-x-auto rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border, rgba(255,255,255,0.08))' }}>
                <SyntaxHighlighter
                  language="markdown"
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '1.25rem',
                    backgroundColor: '#0f141c',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: '2.2em',
                    paddingRight: '1em',
                    color: '#4b5563',
                    textAlign: 'right'
                  }}
                  wrapLines={true}
                >
                  {convertedMarkdown}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive + Markdown Body Styles (matching reference project) */}
      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 280px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <style jsx global>{`
        .markdown-body {
          color: #e5e7eb;
          font-size: 0.95rem;
          line-height: 1.6;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .markdown-body h1 {
          font-size: 1.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 0.3em;
        }
        .markdown-body h2 {
          font-size: 1.4rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 0.3em;
        }
        .markdown-body h3 { font-size: 1.15rem; }
        .markdown-body p,
        .markdown-body ul,
        .markdown-body ol,
        .markdown-body blockquote,
        .markdown-body table {
          margin-bottom: 1rem;
        }
        .markdown-body ul, .markdown-body ol {
          padding-left: 2rem;
        }
        .markdown-body li {
          margin-bottom: 0.25rem;
        }
        .markdown-body blockquote {
          border-left: 4px solid var(--accent, #6366f1);
          background: rgba(99, 102, 241, 0.05);
          padding: 0.5rem 1rem;
          color: #9ca3af;
          border-radius: 0 12px 12px 0;
        }
        .markdown-body code {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(255, 255, 255, 0.08);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85rem;
        }
        .markdown-body pre {
          background: #0f141c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        .markdown-body pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
          font-size: 0.85rem;
        }
        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          display: table;
        }
        .markdown-body thead {
          display: table-header-group;
        }
        .markdown-body tbody {
          display: table-row-group;
        }
        .markdown-body tr {
          display: table-row;
        }
        .markdown-body th, .markdown-body td {
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.5rem 0.75rem;
          text-align: left;
          display: table-cell;
        }
        .markdown-body th {
          background: rgba(255, 255, 255, 0.04);
          font-weight: 600;
          color: #ffffff;
        }
        .markdown-body tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.01);
        }
        .markdown-body img {
          max-width: 100%;
          border-radius: 12px;
          margin: 1rem 0;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .markdown-body a {
          color: var(--accent, #6366f1);
          text-decoration: none;
        }
        .markdown-body a:hover {
          text-decoration: underline;
        }
        .markdown-body hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  )
}
