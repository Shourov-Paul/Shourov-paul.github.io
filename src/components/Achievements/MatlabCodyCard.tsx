'use client'

import React from 'react'
import Image from 'next/image'
import { HeroImage } from '@/utils/images'

interface MatlabCodyCardProps {
    name?: string
    rank?: string | number
    badges?: string | number
    score?: string | number
    profileUrl?: string
}

export default function MatlabCodyCard({
    name = 'Shourov',
    rank = '1262',
    badges = '15',
    score = '2022',
    profileUrl = 'https://www.mathworks.com/matlabcentral/profile/authors/41736197?s_tid=cody_local_to_profile'
}: MatlabCodyCardProps) {
    return (
        <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-neutral-950 p-5 md:p-7 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
        >
            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Background MATLAB Watermark Logo */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden select-none">
                <img
                    src="/images/matlab-logo.svg"
                    alt="MATLAB Logo Background"
                    className="w-full max-w-[650px] object-contain scale-110 filter brightness-125 contrast-125"
                />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Left Side: Avatar + Name + View Profile Link + MATLAB Badge */}
                <div className="flex items-center gap-4 text-left w-full lg:w-auto">
                    {/* User Avatar with MATLAB Badge Overlay */}
                    <div className="relative shrink-0">
                        <div className="relative h-16 w-16 md:h-18 md:w-18 overflow-hidden rounded-full border-2 border-amber-500/50 shadow-md group-hover:border-amber-400 transition-colors">
                            <Image
                                src={HeroImage}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* MATLAB Logo Badge */}
                        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 border border-amber-500/60 p-1 shadow-md" title="MathWorks MATLAB Cody">
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-amber-500">
                                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="#E65100" />
                                <path d="M7 14C9 10 11 15 13 9C15 14 17 12 17 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Name & Community Link */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                                {name}
                            </h3>
                            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/20">
                                MATLAB Cody
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-sm font-semibold text-sky-400 group-hover:text-sky-300 group-hover:underline transition-colors flex items-center gap-1">
                                View Community Profile
                                <svg className="w-4 h-4 text-sky-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 2 0 00-2 2v10a2 2 2 0 002 2h10a2 2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Clean Horizontal Stats Pillars (Rank, Badges, Score) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full lg:w-auto">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-950/80 border border-neutral-800/90 px-5 py-3 text-center min-w-[95px] md:min-w-[110px] transition-all group-hover:border-amber-500/40 group-hover:bg-neutral-950">
                        <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                            {rank}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">
                            Rank
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-950/80 border border-neutral-800/90 px-5 py-3 text-center min-w-[95px] md:min-w-[110px] transition-all group-hover:border-amber-500/40 group-hover:bg-neutral-950">
                        <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                            {badges}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">
                            Badges
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-950/80 border border-neutral-800/90 px-5 py-3 text-center min-w-[95px] md:min-w-[110px] transition-all group-hover:border-amber-500/40 group-hover:bg-neutral-950">
                        <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                            {score}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">
                            Score
                        </span>
                    </div>
                </div>
            </div>
        </a>
    )
}
