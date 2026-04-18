'use client'

import { useState, useRef } from 'react'

export default function TTSConfigurator() {
  const [mode, setMode] = useState<'single' | 'multi'>('single')
  const [apiKey, setApiKey] = useState('')
  const [text, setText] = useState('Say dynamically: "Hello! [short pause] [whisper] I have a secret... I\'m a machine."')

  // Single Config
  const [singleVoice, setSingleVoice] = useState('Puck')

  // Multi Config
  const [spk1Name, setSpk1Name] = useState('Joe')
  const [spk1Voice, setSpk1Voice] = useState('Puck')
  const [spk2Name, setSpk2Name] = useState('Jane')
  const [spk2Voice, setSpk2Voice] = useState('Kore')

  const [status, setStatus] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleEnded = () => setIsPlaying(false)

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = Number(e.target.value)
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const voices = [
    { name: 'Puck', desc: 'Upbeat' },
    { name: 'Kore', desc: 'Firm' },
    { name: 'Zephyr', desc: 'Bright' },
    { name: 'Charon', desc: 'Informative' },
    { name: 'Enceladus', desc: 'Breathy' },
    { name: 'Fenrir', desc: 'Excitable' },
    { name: 'Leda', desc: 'Youthful' },
    { name: 'Aoede', desc: 'Breezy' }
  ]

  const handleModeChange = (newMode: 'single' | 'multi') => {
    setMode(newMode)
    if (newMode === 'single') {
      setText('Say dynamically: "Hello! [short pause] [whisper] I have a secret... I\'m a machine."')
    } else {
      setText('TTS the following conversation between Joe and Jane:\n\nJoe: How\'s it going today Jane?\nJane: [yawn] Not too bad, how about you?')
    }
  }

  const createWavBlobFromPcmBase64 = (base64Data: string, sampleRate: number, numChannels: number, bitsPerSample: number) => {
    const binaryString = atob(base64Data)
    const dataSize = binaryString.length
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
    const blockAlign = (numChannels * bitsPerSample) / 8
    const buffer = new ArrayBuffer(44 + dataSize)
    const view = new DataView(buffer)

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + dataSize, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitsPerSample, true)
    writeString(36, 'data')
    view.setUint32(40, dataSize, true)

    const pcmData = new Uint8Array(buffer, 44)
    for (let i = 0; i < dataSize; i++) pcmData[i] = binaryString.charCodeAt(i)

    return new Blob([buffer], { type: 'audio/wav' })
  }

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setStatus('Please provide a valid API key.')
      return
    }

    setIsGenerating(true)
    setStatus('Generating audio...')
    setAudioUrl('')

    let speechConfig: any = {}
    if (mode === 'single') {
      speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: singleVoice }
        }
      }
    } else {
      speechConfig = {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: spk1Name.trim(),
              voiceConfig: { prebuiltVoiceConfig: { voiceName: spk1Voice } }
            },
            {
              speaker: spk2Name.trim(),
              voiceConfig: { prebuiltVoiceConfig: { voiceName: spk2Voice } }
            }
          ]
        }
      }
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text.trim() }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: speechConfig
          }
        })
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`API Error ${response.status}: ${err}`)
      }

      const data = await response.json()
      const base64PcmData = data.candidates[0].content.parts[0].inlineData.data
      const wavBlob = createWavBlobFromPcmBase64(base64PcmData, 24000, 1, 16)
      const objectUrl = URL.createObjectURL(wavBlob)

      setAudioUrl(objectUrl)
      setStatus('Success!')
    } catch (error: any) {
      console.error(error)
      setStatus(`Failed: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-secondary border-border my-8 rounded-2xl border p-6 shadow-lg sm:p-8 animate-fade-in">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-secondary-content text-2xl font-semibold">Gemini 3.1 Flash TTS Configurator</h3>
          <details className="text-sm group relative">
            <summary className="cursor-pointer text-accent font-medium list-none flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span>How to get an API Key?</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="mt-3 p-4 bg-primary border-border border rounded-xl text-neutral animate-fade-in w-full sm:absolute sm:w-[320px] sm:z-10 shadow-2xl">
              <p className="mb-2 text-primary-content">1. Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">Google AI Studio</a>.</p>
              <p className="mb-2">2. Sign in with your Google account.</p>
              <p>3. Click <strong className="text-primary-content">Get API key</strong> in the menu to create your key.</p>
            </div>
          </details>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-neutral mb-2 block font-medium text-sm">Gemini API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter your API Key here..."
          className="bg-primary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-neutral mb-2 block font-medium text-sm">TTS Mode</label>
          <select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value as 'single' | 'multi')}
            className="bg-primary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors"
          >
            <option value="single">Single Speaker</option>
            <option value="multi">Multi-Speaker (Conversation)</option>
          </select>
        </div>

        {mode === 'single' ? (
          <div>
            <label className="text-neutral mb-2 block font-medium text-sm">Voice</label>
            <select
              value={singleVoice}
              onChange={e => setSingleVoice(e.target.value)}
              className="bg-primary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors"
            >
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.desc})</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-primary border-border border">
              <label className="text-neutral mb-2 block font-medium text-sm">Speaker 1 Name</label>
              <input
                type="text"
                value={spk1Name}
                onChange={e => setSpk1Name(e.target.value)}
                className="bg-secondary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors mb-4"
              />
              <label className="text-neutral mb-2 block font-medium text-sm">Speaker 1 Voice</label>
              <select
                value={spk1Voice}
                onChange={e => setSpk1Voice(e.target.value)}
                className="bg-secondary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors"
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name}>{v.name} ({v.desc})</option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-primary border-border border">
              <label className="text-neutral mb-2 block font-medium text-sm">Speaker 2 Name</label>
              <input
                type="text"
                value={spk2Name}
                onChange={e => setSpk2Name(e.target.value)}
                className="bg-secondary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors mb-4"
              />
              <label className="text-neutral mb-2 block font-medium text-sm">Speaker 2 Voice</label>
              <select
                value={spk2Voice}
                onChange={e => setSpk2Voice(e.target.value)}
                className="bg-secondary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors"
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name}>{v.name} ({v.desc})</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="text-neutral mb-2 block font-medium text-sm">Script / Prompt</label>
        <div className="bg-primary/50 text-neutral mb-4 rounded-md p-3 text-sm border-l-2 border-accent">
          {mode === 'single' ? (
            <p><strong>Tip:</strong> Try using directorial tags like <code>[whisper]</code>, <code>[short pause]</code>, or <code>Say cheerfully: </code>.</p>
          ) : (
            <p><strong>Tip:</strong> Format your text as a script using the <strong>Exact Speaker Names</strong> defined above.</p>
          )}
        </div>
        <textarea
          rows={7}
          value={text}
          onChange={e => setText(e.target.value)}
          className="bg-primary border-border focus:border-accent text-primary-content w-full rounded-lg border p-3 outline-none transition-colors resize-y leading-relaxed"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-primary hover:bg-[#FFFFFF1A] border-accent/50 hover:border-accent text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto border"
        >
          {isGenerating ? 'Generating...' : 'Generate Audio 🚀'}
        </button>

        {status && (
          <span className={`text-sm ${status === 'Success!' ? 'text-accent' : 'text-neutral'}`}>
            {status}
          </span>
        )}
      </div>

      {audioUrl && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-primary border-border border animate-fade-in w-full">
          <audio
            ref={audioRef}
            src={audioUrl}
            className="hidden"
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />

          <div className="flex-1 flex w-full items-center gap-4 bg-secondary px-5 py-3 rounded-full border border-border">
            <button onClick={togglePlay} className="text-secondary-content hover:text-accent outline-none">
              {isPlaying ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              )}
            </button>
            <span className="text-sm text-neutral font-medium w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <span className="text-sm text-neutral font-medium w-10">{formatTime(duration)}</span>
          </div>

          <a
            href={audioUrl}
            download="gemini_speech.wav"
            className="flex flex-shrink-0 items-center justify-center gap-2 bg-primary hover:bg-[#FFFFFF1A] border-accent/50 hover:border-accent text-white px-5 py-3 rounded-full font-medium transition-colors w-full sm:w-auto border text-center text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download WAV
          </a>
        </div>
      )}
    </div>
  )
}
