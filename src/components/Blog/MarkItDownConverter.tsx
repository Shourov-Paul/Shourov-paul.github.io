'use client'

import { useState, useCallback } from 'react'
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  Eye, 
  Code,
  ArrowLeft
} from 'lucide-react'
import { marked } from 'marked'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkItDownConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedMarkdown, setConvertedMarkdown] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted')
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)

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

    const formData = new FormData()
    formData.append('file', selectedFile)

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const endpoint = isLocal ? 'http://127.0.0.1:5000/convert' : 'https://markitdown-backend-f33z.onrender.com/convert'

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
        setConvertedMarkdown(data.markdown)
      } else {
        throw new Error(data.error || 'Conversion failed.')
      }
    } catch (err: any) {
      console.error('Error during conversion:', err)
      setErrorMessage(err.message || 'An error occurred during file conversion.')
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

  return (
    <div className="bg-secondary border border-border/80 my-8 rounded-2xl p-6 shadow-xl sm:p-8 animate-fade-in text-neutral">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-secondary-content text-2xl font-semibold">MarkItDown Web Converter</h3>
        <p className="text-sm text-neutral/70">
          Powered by your Flask + Python backend running Microsoft's MarkItDown conversion engine.
        </p>
      </div>

      {/* ERROR TOAST */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 animate-shake">
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Conversion Failed</h4>
            <p className="text-xs mt-1 text-red-300/90">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-300 text-sm font-bold ml-auto shrink-0 select-none">
            &times;
          </button>
        </div>
      )}

      {/* UPLOAD PANEL */}
      {!file && !isConverting && !convertedMarkdown && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-all duration-300 text-center cursor-pointer ${
            dragOver 
              ? 'border-accent bg-accent/5 scale-[0.99] shadow-lg shadow-accent/5' 
              : 'border-border hover:border-accent hover:bg-[#FFFFFF05]'
          }`}
          onClick={() => document.getElementById('markitdownFileInput')?.click()}
        >
          <input
            type="file"
            id="markitdownFileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center size-14 rounded-full bg-[#FFFFFF0A] border border-[#FFFFFF15] group-hover:scale-105 transition-transform">
              <Upload className="size-7 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-content">Drag & Drop your file here</h3>
              <p className="text-xs text-neutral/60 mt-1 max-w-sm mx-auto">
                Supports PDF, DOCX, XLSX, PPTX, PNG, JPG, MP3, WAV, EPub, ZIP, HTML, JSON, CSV & more (up to 32MB).
              </p>
            </div>
            <button className="bg-primary hover:bg-[#FFFFFF1A] border-accent/40 hover:border-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border flex items-center gap-2 mt-2">
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* LOADER COMPONENT */}
      {isConverting && (
        <div className="flex flex-col items-center justify-center border border-border bg-[#FFFFFF03] rounded-xl p-10 text-center animate-pulse">
          <RefreshCw className="size-10 text-accent animate-spin mb-4" />
          <h4 className="text-lg font-semibold text-secondary-content">Converting Document...</h4>
          <p className="text-xs text-neutral/60 mt-1">
            Running structure extraction algorithms for: <span className="text-neutral font-medium">{file?.name}</span>
          </p>
          <div className="w-full max-w-xs bg-primary h-1 rounded-full overflow-hidden mt-6 border border-[#FFFFFF0A]">
            <div className="h-full bg-accent w-2/3 animate-[loading_1.5s_infinite] rounded-full"></div>
          </div>
        </div>
      )}

      {/* RESULT WORKSPACE */}
      {convertedMarkdown && file && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* File Metadata Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#FFFFFF03] border border-border/60">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#FFFFFF05] border border-[#FFFFFF0D]">
                <FileText className="size-6 text-accent" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-secondary-content truncate max-w-xs md:max-w-md">{file.name}</h4>
                <p className="text-xs text-neutral/60 flex items-center gap-2 mt-1">
                  <span>{formatBytes(file.size)}</span>
                  <span className="size-1 rounded-full bg-neutral/40"></span>
                  <span>{getFriendlyFileType(file.name)}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="bg-primary hover:bg-[#FFFFFF1A] border-border hover:border-accent text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border flex items-center gap-2 shrink-0 self-end md:self-auto"
            >
              <ArrowLeft className="size-3.5" /> Convert Another
            </button>
          </div>

          {/* Workspace Body */}
          <div className="flex flex-col border border-border/80 rounded-xl overflow-hidden bg-primary/20">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border/80 bg-primary/50 px-4 py-2.5 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-[#FFFFFF05] p-1 rounded-lg border border-[#FFFFFF05]">
                <button
                  onClick={() => setActiveTab('formatted')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none ${
                    activeTab === 'formatted'
                      ? 'bg-secondary text-accent border border-border shadow-sm'
                      : 'text-neutral/70 hover:text-neutral'
                  }`}
                >
                  <Eye className="size-3.5" /> Formatted Preview
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none ${
                    activeTab === 'raw'
                      ? 'bg-secondary text-accent border border-border shadow-sm'
                      : 'text-neutral/70 hover:text-neutral'
                  }`}
                >
                  <Code className="size-3.5" /> Raw Markdown
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    copied
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-primary hover:bg-[#FFFFFF1A] border-border hover:border-accent text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-accent hover:bg-[#18f2e5]/90 text-[#00071E] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-accent/5 hover:scale-102"
                >
                  <Download className="size-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-5 max-h-[500px] overflow-y-auto leading-relaxed select-text">
              {activeTab === 'formatted' ? (
                <div 
                  className="prose prose-invert max-w-none text-primary-content text-sm md:text-base space-y-4 markdown-body"
                  dangerouslySetInnerHTML={{ __html: getHtmlContent() }}
                />
              ) : (
                <div className="font-mono text-sm overflow-x-auto rounded-lg overflow-hidden border border-[#FFFFFF0D]">
                  <SyntaxHighlighter
                    language="markdown"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '1.25rem',
                      backgroundColor: '#0a0f18',
                      fontSize: '0.85rem',
                      lineHeight: '1.6',
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
      )}
    </div>
  )
}
