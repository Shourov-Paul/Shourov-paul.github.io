'use client'

import React, { useState, useEffect, useRef } from 'react'

const E24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1]

function parseResistor(valStr: string): number {
    if (!valStr) return NaN
    let str = valStr.trim().toLowerCase()
    let multiplier = 1
    if (str.endsWith('k')) {
        multiplier = 1000
        str = str.slice(0, -1)
    } else if (str.endsWith('m')) {
        multiplier = 1000000
        str = str.slice(0, -1)
    }
    const num = parseFloat(str)
    return isNaN(num) ? NaN : num * multiplier
}

function formatResistorInput(ohms: number): string {
    if (!isFinite(ohms) || isNaN(ohms) || ohms <= 0) return ''
    if (ohms >= 1000000) return (ohms / 1000000).toFixed(3).replace(/\.?0+$/, '') + 'M'
    if (ohms >= 1000) return (ohms / 1000).toFixed(3).replace(/\.?0+$/, '') + 'k'
    return ohms.toFixed(2).replace(/\.?0+$/, '')
}

function formatResistorLabel(ohms: number | null): string {
    if (ohms === null || !isFinite(ohms) || isNaN(ohms) || ohms <= 0) return '-'
    if (ohms >= 1000000) return (ohms / 1000000).toFixed(3).replace(/\.?0+$/, '') + ' MΩ'
    if (ohms >= 1000) return (ohms / 1000).toFixed(3).replace(/\.?0+$/, '') + ' kΩ'
    return ohms.toFixed(2).replace(/\.?0+$/, '') + ' Ω'
}

function getNearestE24(val: number): number | null {
    if (!val || val <= 0 || !isFinite(val)) return null
    const exponent = Math.floor(Math.log10(val))
    const multiplier = Math.pow(10, exponent)
    const normalized = val / multiplier
    let closest = E24[0]
    let minDiff = Math.abs(normalized - closest)
    for (let i = 1; i < E24.length; i++) {
        const diff = Math.abs(normalized - E24[i])
        if (diff < minDiff) {
            minDiff = diff
            closest = E24[i]
        }
    }
    return closest * multiplier
}

export default function TL431Calculator() {
    const [vref, setVref] = useState<string>('2.5')
    const [useR3, setUseR3] = useState<boolean>(false)
    const [vout, setVout] = useState<string>('')
    const [r1, setR1] = useState<string>('20k')
    const [r2, setR2] = useState<string>('5.1k')
    const [r3, setR3] = useState<string>('22k')

    const [suggR1, setSuggR1] = useState<string>('')
    const [suggR2, setSuggR2] = useState<string>('')
    const [suggR3, setSuggR3] = useState<string>('')

    const [calculatedTarget, setCalculatedTarget] = useState<string | null>('vout')
    const [inputHistory, setInputHistory] = useState<string[]>(['r1', 'r2'])
    const [errorMsg, setErrorMsg] = useState<string>('')

    // Auto calculation trigger
    const recalculate = () => {
        const vrefNum = parseFloat(vref) || 2.5
        const allVars = useR3 ? ['vout', 'r1', 'r2', 'r3'] : ['vout', 'r1', 'r2']
        const validHistory = inputHistory.filter((v) => allVars.includes(v))

        let target: string | null = null
        const requiredCount = useR3 ? 3 : 2

        if (validHistory.length >= requiredCount) {
            const recentInputs = validHistory.slice(-requiredCount)
            target = allVars.find((v) => !recentInputs.includes(v)) || null
        } else if (validHistory.length === requiredCount - 1) {
            const fields = { vout, r1, r2, r3 }
            target = allVars.find((v) => !validHistory.includes(v) && !(fields as any)[v]?.trim()) || null
            if (!target) {
                target = allVars.find((v) => !validHistory.includes(v)) || null
            }
        }

        setCalculatedTarget(target)
        setErrorMsg('')
        setSuggR1('')
        setSuggR2('')
        setSuggR3('')

        if (!target) return

        let parsedVout = parseResistor(vout)
        let parsedR1 = parseResistor(r1)
        let parsedR2 = parseResistor(r2)
        let parsedR3 = parseResistor(r3)

        if (target !== 'vout') parsedVout = parseFloat(vout)

        try {
            if (target === 'vout') {
                if (isNaN(parsedR1) || isNaN(parsedR2)) return
                let Reff = parsedR2
                if (useR3 && !isNaN(parsedR3)) Reff = (parsedR2 * parsedR3) / (parsedR2 + parsedR3)
                const calculatedVout = vrefNum * (1 + parsedR1 / Reff)
                setVout(calculatedVout.toFixed(3))
            } else if (target === 'r1') {
                if (isNaN(parsedVout) || isNaN(parsedR2)) return
                let Reff = parsedR2
                if (useR3 && !isNaN(parsedR3)) Reff = (parsedR2 * parsedR3) / (parsedR2 + parsedR3)
                const calcR1 = Reff * (parsedVout / vrefNum - 1)
                if (calcR1 > 0) {
                    setR1(formatResistorInput(calcR1))
                    const nearest = getNearestE24(calcR1)
                    setSuggR1(`Nearest E24 standard: ${formatResistorLabel(nearest)}`)
                } else {
                    setR1('Invalid')
                    setErrorMsg('Vout must be greater than Vref!')
                }
            } else if (target === 'r2') {
                if (isNaN(parsedVout) || isNaN(parsedR1)) return
                if (parsedVout <= vrefNum) {
                    setErrorMsg('Vout must be greater than Vref!')
                    setR2('Invalid')
                    return
                }
                const ReffTarget = parsedR1 / (parsedVout / vrefNum - 1)
                if (!useR3) {
                    if (ReffTarget > 0) {
                        setR2(formatResistorInput(ReffTarget))
                        const nearest = getNearestE24(ReffTarget)
                        setSuggR2(`Nearest E24 standard: ${formatResistorLabel(nearest)}`)
                    } else setR2('Invalid')
                } else {
                    if (isNaN(parsedR3)) return
                    if (parsedR3 <= ReffTarget) {
                        setR2('R3 too small!')
                        setErrorMsg('R3 is too small to achieve requested target voltage.')
                        return
                    }
                    const calcR2 = (ReffTarget * parsedR3) / (parsedR3 - ReffTarget)
                    if (calcR2 > 0) {
                        setR2(formatResistorInput(calcR2))
                        const nearest = getNearestE24(calcR2)
                        setSuggR2(`Nearest E24 standard: ${formatResistorLabel(nearest)}`)
                    } else setR2('Invalid')
                }
            } else if (target === 'r3' && useR3) {
                if (isNaN(parsedVout) || isNaN(parsedR1) || isNaN(parsedR2)) return
                if (parsedVout <= vrefNum) {
                    setErrorMsg('Vout must be greater than Vref!')
                    setR3('Invalid')
                    return
                }
                const ReffTarget = parsedR1 / (parsedVout / vrefNum - 1)
                if (parsedR2 <= ReffTarget) {
                    setR3('R2 too small!')
                    setErrorMsg('R2 alone is already smaller than or equal to target effective resistance!')
                    return
                }
                const calcR3 = (ReffTarget * parsedR2) / (parsedR2 - ReffTarget)
                if (calcR3 > 0) {
                    setR3(formatResistorInput(calcR3))
                    const nearest = getNearestE24(calcR3)
                    setSuggR3(`Nearest E24 standard: ${formatResistorLabel(nearest)}`)
                } else setR3('Invalid')
            }
        } catch (e) {
            console.error('Calculation error:', e)
        }
    }

    useEffect(() => {
        recalculate()
    }, [vref, useR3, inputHistory])

    const handleInputChange = (field: string, value: string) => {
        if (field === 'vout') setVout(value)
        if (field === 'r1') setR1(value)
        if (field === 'r2') setR2(value)
        if (field === 'r3') setR3(value)

        setInputHistory((prev) => {
            const filtered = prev.filter((item) => item !== field)
            if (value.trim() !== '') {
                return [...filtered, field]
            }
            return filtered
        })
    }

    const handleR3Toggle = (checked: boolean) => {
        setUseR3(checked)
        if (!checked) {
            setR3('')
            setInputHistory((prev) => prev.filter((item) => item !== 'r3'))
        }
    }

    return (
        <div className="w-full my-8 bg-neutral-900/90 border border-emerald-500/30 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md text-white">
            <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    TL431 Voltage Calculator
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Circuit Diagram SVG */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center bg-neutral-950/80 border border-neutral-800 rounded-xl p-5 shadow-inner">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Circuit Schematic</span>
                    <svg viewBox="0 0 320 260" className="w-full max-w-[340px] h-auto select-none">
                        {/* Vout Top Wire */}
                        <line
                            x1="40"
                            y1="30"
                            x2="260"
                            y2="30"
                            className={`transition-all duration-300 ${calculatedTarget === 'vout' ? 'stroke-amber-400 stroke-[4px]' : 'stroke-neutral-300 stroke-[2.5px]'}`}
                        />
                        <text
                            x="40"
                            y="20"
                            className={`font-mono font-bold text-xs transition-colors duration-300 ${calculatedTarget === 'vout' ? 'fill-amber-400 font-extrabold' : 'fill-emerald-400'}`}
                        >
                            Vout ({vout ? `${vout}V` : 'Vout'})
                        </text>
                        <circle cx="40" cy="30" r="4" fill="#10b981" />

                        {/* GND Bottom Line */}
                        <line x1="40" y1="220" x2="260" y2="220" stroke="#a3a3a3" strokeWidth="2.5" />
                        <line x1="150" y1="220" x2="150" y2="235" stroke="#a3a3a3" strokeWidth="2.5" />
                        <line x1="140" y1="235" x2="160" y2="235" stroke="#a3a3a3" strokeWidth="2.5" />
                        <line x1="145" y1="242" x2="155" y2="242" stroke="#a3a3a3" strokeWidth="2.5" />

                        {/* TL431 Branch (Right) */}
                        <line x1="230" y1="30" x2="230" y2="100" stroke="#a3a3a3" strokeWidth="2.5" />
                        <line x1="230" y1="140" x2="230" y2="220" stroke="#a3a3a3" strokeWidth="2.5" />
                        
                        {/* Schematic Symbol Zener Shunt */}
                        <polygon points="230,100 215,140 245,140" fill="none" stroke="#10b981" strokeWidth="2.5" />
                        <path d="M 215 100 L 245 100 M 215 100 L 215 110 M 245 100 L 245 90" stroke="#10b981" strokeWidth="2.5" fill="none" />
                        <text x="248" y="125" className="fill-emerald-400 font-bold text-[12px] font-mono">TL431</text>

                        {/* Physical TO-92 Graphic */}
                        <g transform="translate(265, 175)">
                            <path d="M -15 -10 A 15 15 0 0 1 15 -10 L 15 5 L -15 5 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                            <line x1="-8" y1="5" x2="-8" y2="25" stroke="#9ca3af" strokeWidth="2" />
                            <line x1="0" y1="5" x2="0" y2="25" stroke="#9ca3af" strokeWidth="2" />
                            <line x1="8" y1="5" x2="8" y2="25" stroke="#9ca3af" strokeWidth="2" />
                            <text x="0" y="-12" fill="#9ca3af" fontSize="9" fontWeight="bold" textAnchor="middle">TO-92</text>
                        </g>

                        {/* Voltage Divider (Left) */}
                        <line x1="90" y1="30" x2="90" y2="60" stroke="#a3a3a3" strokeWidth="2.5" />
                        <circle cx="90" cy="30" r="3" fill="#a3a3a3" />

                        {/* R1 Component */}
                        <g className="cursor-pointer">
                            <rect
                                x="75"
                                y="60"
                                width="30"
                                height="45"
                                rx="4"
                                className={`transition-all duration-300 ${
                                    calculatedTarget === 'r1'
                                        ? 'fill-amber-500/40 stroke-amber-400 stroke-[3px]'
                                        : 'fill-amber-900/30 stroke-amber-600 stroke-[2px]'
                                }`}
                            />
                            <line x1="75" y1="70" x2="105" y2="70" className={calculatedTarget === 'r1' ? 'stroke-amber-300 stroke-[3px]' : 'stroke-amber-600 stroke-[2px]'} />
                            <line x1="75" y1="82" x2="105" y2="82" className={calculatedTarget === 'r1' ? 'stroke-amber-300 stroke-[3px]' : 'stroke-amber-600 stroke-[2px]'} />
                            <line x1="75" y1="94" x2="105" y2="94" className={calculatedTarget === 'r1' ? 'stroke-amber-300 stroke-[3px]' : 'stroke-amber-600 stroke-[2px]'} />
                            <text x="48" y="88" className={`font-mono font-bold text-xs ${calculatedTarget === 'r1' ? 'fill-amber-400 font-extrabold' : 'fill-gray-300'}`}>R1</text>
                        </g>

                        {/* REF Junction */}
                        <line x1="90" y1="105" x2="90" y2="140" stroke="#a3a3a3" strokeWidth="2.5" />
                        <circle cx="90" cy="120" r="4" fill="#10b981" />
                        <line x1="90" y1="120" x2="222" y2="120" stroke="#10b981" strokeWidth="2.5" />

                        {/* R2 Component */}
                        <g className="cursor-pointer">
                            <rect
                                x="75"
                                y="140"
                                width="30"
                                height="45"
                                rx="4"
                                className={`transition-all duration-300 ${
                                    calculatedTarget === 'r2'
                                        ? 'fill-amber-500/40 stroke-amber-400 stroke-[3px]'
                                        : 'fill-amber-900/30 stroke-amber-600 stroke-[2px]'
                                }`}
                            />
                            <line x1="75" y1="150" x2="105" y2="150" className={calculatedTarget === 'r2' ? 'stroke-amber-300 stroke-[3px]' : 'stroke-amber-600 stroke-[2px]'} />
                            <line x1="75" y1="162" x2="105" y2="162" className={calculatedTarget === 'r2' ? 'stroke-amber-300 stroke-[3px]' : 'stroke-amber-600 stroke-[2px]'} />
                            <line x1="75" y1="174" x2="105" y2="174" className={calculatedTarget === 'r2' ? 'stroke-amber-300 stroke-[3px]' : 'stroke-amber-600 stroke-[2px]'} />
                            <text x="48" y="168" className={`font-mono font-bold text-xs ${calculatedTarget === 'r2' ? 'fill-amber-400 font-extrabold' : 'fill-gray-300'}`}>R2</text>
                        </g>

                        <line x1="90" y1="185" x2="90" y2="220" stroke="#a3a3a3" strokeWidth="2.5" />
                        <circle cx="90" cy="220" r="3" fill="#a3a3a3" />

                        {/* R3 Parallel Component (Conditional) */}
                        {useR3 && (
                            <g className="transition-opacity duration-300">
                                <line x1="90" y1="130" x2="150" y2="130" stroke="#6b7280" strokeWidth="2" />
                                <line x1="150" y1="130" x2="150" y2="140" stroke="#6b7280" strokeWidth="2" />
                                <rect
                                    x="135"
                                    y="140"
                                    width="30"
                                    height="45"
                                    rx="4"
                                    strokeDasharray="4"
                                    className={`transition-all duration-300 ${
                                        calculatedTarget === 'r3'
                                            ? 'fill-cyan-500/40 stroke-cyan-400 stroke-[3px]'
                                            : 'fill-cyan-900/30 stroke-cyan-500 stroke-[2px]'
                                    }`}
                                />
                                <line x1="135" y1="150" x2="165" y2="150" className={calculatedTarget === 'r3' ? 'stroke-cyan-300 stroke-[3px]' : 'stroke-cyan-600 stroke-[2px]'} />
                                <line x1="135" y1="162" x2="165" y2="162" className={calculatedTarget === 'r3' ? 'stroke-cyan-300 stroke-[3px]' : 'stroke-cyan-600 stroke-[2px]'} />
                                <line x1="135" y1="174" x2="165" y2="174" className={calculatedTarget === 'r3' ? 'stroke-cyan-300 stroke-[3px]' : 'stroke-cyan-600 stroke-[2px]'} />
                                <text x="172" y="168" className={`font-mono font-bold text-xs ${calculatedTarget === 'r3' ? 'fill-cyan-400 font-extrabold' : 'fill-gray-300'}`}>R3</text>
                                <line x1="150" y1="185" x2="150" y2="200" stroke="#6b7280" strokeWidth="2" />
                                <line x1="150" y1="200" x2="90" y2="200" stroke="#6b7280" strokeWidth="2" />
                                <circle cx="90" cy="130" r="3" fill="#6b7280" />
                                <circle cx="90" cy="200" r="3" fill="#6b7280" />
                            </g>
                        )}
                    </svg>
                </div>

                {/* Form & Controls Panel */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Header Settings: Vref & R3 toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1">
                                Reference Voltage (Vref):
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.001"
                                    value={vref}
                                    onChange={(e) => setVref(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                                />
                                <span className="absolute right-3 top-1.5 text-xs text-gray-400 font-mono">V</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 sm:mt-5">
                            <input
                                type="checkbox"
                                id="useR3-checkbox"
                                checked={useR3}
                                onChange={(e) => handleR3Toggle(e.target.checked)}
                                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                            />
                            <label htmlFor="useR3-checkbox" className="text-xs font-semibold text-gray-200 cursor-pointer select-none">
                                Parallel Resistor (R3 across R2)
                            </label>
                        </div>
                    </div>

                    {/* Error Banner if any */}
                    {errorMsg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {/* Vout Input */}
                    <div
                        className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            calculatedTarget === 'vout'
                                ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                : 'bg-neutral-950/40 border-neutral-800'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-gray-200">
                                Output Voltage (Vout):
                            </label>
                            {calculatedTarget === 'vout' && (
                                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                    Calculated
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={vout}
                                placeholder="e.g. 14.6"
                                onChange={(e) => handleInputChange('vout', e.target.value)}
                                className={`w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm font-mono transition-colors focus:outline-none ${
                                    calculatedTarget === 'vout'
                                        ? 'border-amber-500/80 text-amber-300 font-bold bg-amber-950/20'
                                        : 'border-neutral-700 text-white focus:border-emerald-500'
                                }`}
                            />
                            <span className="absolute right-3 top-2 text-xs text-gray-400 font-mono">V</span>
                        </div>
                    </div>

                    {/* R1 Input */}
                    <div
                        className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            calculatedTarget === 'r1'
                                ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                : 'bg-neutral-950/40 border-neutral-800'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-gray-200">
                                R1 (Top Resistor):
                            </label>
                            {calculatedTarget === 'r1' && (
                                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                    Calculated
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={r1}
                            placeholder="e.g. 20k"
                            onChange={(e) => handleInputChange('r1', e.target.value)}
                            className={`w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm font-mono transition-colors focus:outline-none ${
                                calculatedTarget === 'r1'
                                    ? 'border-amber-500/80 text-amber-300 font-bold bg-amber-950/20'
                                    : 'border-neutral-700 text-white focus:border-emerald-500'
                            }`}
                        />
                        {suggR1 && (
                            <p className="mt-1 text-xs font-semibold text-amber-400">
                                💡 {suggR1}
                            </p>
                        )}
                    </div>

                    {/* R2 Input */}
                    <div
                        className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            calculatedTarget === 'r2'
                                ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                : 'bg-neutral-950/40 border-neutral-800'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-gray-200">
                                R2 (Bottom Resistor):
                            </label>
                            {calculatedTarget === 'r2' && (
                                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                    Calculated
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={r2}
                            placeholder="e.g. 5.1k"
                            onChange={(e) => handleInputChange('r2', e.target.value)}
                            className={`w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm font-mono transition-colors focus:outline-none ${
                                calculatedTarget === 'r2'
                                    ? 'border-amber-500/80 text-amber-300 font-bold bg-amber-950/20'
                                    : 'border-neutral-700 text-white focus:border-emerald-500'
                            }`}
                        />
                        {suggR2 && (
                            <p className="mt-1 text-xs font-semibold text-amber-400">
                                💡 {suggR2}
                            </p>
                        )}
                    </div>

                    {/* R3 Input (Conditional) */}
                    {useR3 && (
                        <div
                            className={`p-3.5 rounded-xl border transition-all duration-300 ${
                                calculatedTarget === 'r3'
                                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                    : 'bg-neutral-950/40 border-neutral-800'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-cyan-300">
                                    R3 (Parallel Resistor across R2):
                                </label>
                                {calculatedTarget === 'r3' && (
                                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                                        Calculated
                                    </span>
                                )}
                            </div>
                            <input
                                type="text"
                                value={r3}
                                placeholder="e.g. 22k"
                                onChange={(e) => handleInputChange('r3', e.target.value)}
                                className={`w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm font-mono transition-colors focus:outline-none ${
                                    calculatedTarget === 'r3'
                                        ? 'border-cyan-500/80 text-cyan-300 font-bold bg-cyan-950/20'
                                        : 'border-neutral-700 text-white focus:border-cyan-500'
                                }`}
                            />
                            {suggR3 && (
                                <p className="mt-1 text-xs font-semibold text-cyan-400">
                                    💡 {suggR3}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
