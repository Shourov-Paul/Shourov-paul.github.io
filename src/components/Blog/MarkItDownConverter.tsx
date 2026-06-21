'use client'

import { useState, useCallback } from 'react'
import { 
  AlertTriangle, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  Eye, 
  Code,
  ArrowLeft,
  FileText
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

  // LANDING STATE: Renders ONLY the dashed upload dropzone card (No outer solid card)
  if (!file && !isConverting && !convertedMarkdown) {
    return (
      <div className="w-full max-w-[760px] mx-auto animate-fade-in text-neutral select-none">
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

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-[4.5rem] px-8 transition-all duration-300 text-center cursor-pointer bg-secondary/70 backdrop-blur-md relative shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${
            dragOver 
              ? 'border-accent bg-secondary/95 scale-[1.02] shadow-[0_8px_40px_0_rgba(var(--a),0.25)]' 
              : 'border-border/40 hover:border-accent/50 hover:bg-secondary/85 hover:shadow-accent/15 hover:-translate-y-0.5'
          }`}
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

            <button className="bg-accent text-[#00071E] px-[1.75rem] py-[0.85rem] rounded-xl text-[0.95rem] font-semibold transition-all duration-300 shadow-accent/20 shadow-lg hover:scale-105 flex items-center gap-2 mt-2">
              <i className="fa-regular fa-folder-open" /> Browse Files
            </button>
          </div>
        </div>
      </div>
    )
  }

  // LOADING AND RESULT WORKSPACE STATE: Renders in the premium solid glassmorphic card
  return (
    <div className="bg-secondary/70 border border-border/40 my-6 rounded-2xl p-6 shadow-xl sm:p-8 animate-fade-in text-neutral">
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

      {/* LOADER COMPONENT */}
      {isConverting && (
        <div className="flex flex-col items-center justify-center border border-border/40 bg-[#FFFFFF03] rounded-xl p-10 text-center animate-pulse">
          <RefreshCw className="size-10 text-accent animate-spin mb-4" />
          <h4 className="text-lg font-semibold text-neutral">Converting Document...</h4>
          <p className="text-xs text-tertiary-content/70 mt-1">
            Running structure extraction algorithms for: <span className="text-neutral font-medium">{file?.name}</span>
          </p>
          <div className="w-full max-w-xs bg-primary h-1 rounded-full overflow-hidden mt-6 border border-border/10">
            <div className="h-full bg-accent w-2/3 animate-[loading_1.5s_infinite] rounded-full"></div>
          </div>
        </div>
      )}

      {/* RESULT WORKSPACE */}
      {convertedMarkdown && file && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* File Metadata Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-primary/20 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/40 border border-border/10">
                <FileText className="size-6 text-accent" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-neutral truncate max-w-xs md:max-w-md">{file.name}</h4>
                <p className="text-xs text-tertiary-content/70 flex items-center gap-2 mt-1">
                  <span>{formatBytes(file.size)}</span>
                  <span className="size-1 rounded-full bg-neutral/40"></span>
                  <span>{getFriendlyFileType(file.name)}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="bg-primary hover:bg-[#FFFFFF1A] border-border/60 hover:border-accent text-neutral px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border flex items-center gap-2 shrink-0 self-end md:self-auto"
            >
              <ArrowLeft className="size-3.5" /> Convert Another
            </button>
          </div>

          {/* Workspace Body */}
          <div className="flex flex-col border border-border/60 rounded-xl overflow-hidden bg-primary/20">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-primary/50 px-4 py-2.5 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-[#FFFFFF05] p-1 rounded-lg border border-[#FFFFFF05]">
                <button
                  onClick={() => setActiveTab('formatted')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none ${
                    activeTab === 'formatted'
                      ? 'bg-primary text-accent border border-border/80 shadow-sm font-bold'
                      : 'text-tertiary-content hover:text-neutral'
                  }`}
                >
                  <Eye className="size-3.5" /> Formatted Preview
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none ${
                    activeTab === 'raw'
                      ? 'bg-primary text-accent border border-border/80 shadow-sm font-bold'
                      : 'text-tertiary-content hover:text-neutral'
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
                      : 'bg-primary hover:bg-[#FFFFFF1A] border-border/40 hover:border-accent text-neutral'
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
                  className="bg-accent hover:bg-accent/90 text-[#00071E] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-accent/10 hover:scale-102"
                >
                  <Download className="size-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-5 max-h-[500px] overflow-y-auto leading-relaxed select-text">
              {activeTab === 'formatted' ? (
                <div 
                  className="prose prose-invert max-w-none text-neutral text-sm md:text-base space-y-4 markdown-body"
                  dangerouslySetInnerHTML={{ __html: getHtmlContent() }}
                />
              ) : (
                <div className="font-mono text-sm overflow-x-auto rounded-lg overflow-hidden border border-border/20">
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
