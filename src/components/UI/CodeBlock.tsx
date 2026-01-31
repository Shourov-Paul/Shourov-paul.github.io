'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyIcon } from '@/utils/icons'

interface CodeBlockProps {
    code: string
    language?: string
    filename?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript', filename }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy!', err)
        }
    }

    return (
        <div className="group my-6 overflow-hidden rounded-lg bg-[#0d1520] font-mono text-sm shadow-xl border border-[#FFFFFF1A]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#FFFFFF1A] bg-[#1e293b50] px-4 py-3">
                {filename ? (
                    <span className="text-sm text-gray-400 font-medium">{filename}</span>
                ) : (
                    // Placeholder if no filename is provided, or just empty
                    <div />
                )}

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded bg-[#FFFFFF1A] px-3 py-1.5 text-xs text-gray-300 hover:bg-[#FFFFFF33] transition-colors"
                >
                    {copied ? (
                        <>
                            <span className="text-accent">Copied!</span>
                        </>
                    ) : (
                        <>
                            <span className="sr-only">Copy</span>
                            <span className="text-xs">Copy</span>
                        </>
                    )}
                </button>
            </div>

            <div className="relative">
                <SyntaxHighlighter
                    language={language}
                    style={atomDark}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        backgroundColor: 'transparent',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        color: '#4b5563',
                        textAlign: 'right'
                    }}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

export default CodeBlock
