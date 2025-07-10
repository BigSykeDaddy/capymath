// src/components/CapybaraAnimation.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface CapybaraAnimationProps {
  /** 0 → left end, 1 → right end */
  progress: number
  /** once true, we show the “full” tub + bubble an orange */
  finished: boolean
}

export default function CapybaraAnimation({
  progress,
  finished,
}: CapybaraAnimationProps) {
  // ─── track math ───────────────────────
  const trackWidth = 600         // must match the container below
  const capySize   = 48          // px
  const startX     = 0
  const endX       = trackWidth - capySize
  const xPos       = startX + (endX - startX) * progress

  // ─── two‐frame walk cycle ────────────
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    let iv: NodeJS.Timeout
    if (!finished) {
      setFrame(0)
      iv = setInterval(() => setFrame(f => (f + 1) % 2), 300)
    }
    return () => clearInterval(iv)
  }, [finished])

  const walkSrc = frame === 0 ? '/images/capy1.png' : '/images/capy2.png'

  return (
    <div className="relative w-[600px] h-24 overflow-visible mt-44 mx-auto">
      {/* grey track, vertically centered */}
      <div
        className="absolute left-0 w-full h-3 bg-gray-300 rounded-full"
        style={{ top: 'calc(50% - 1.5px)' }}
      />

      {/* tub (empty vs complete), bottom‐on‐track */}
      <div
        className="absolute w-12 h-16 z-10"
        style={{ 
            top: 'calc(50% - 49.5px)',
            right: 0,
            transform: finished ? 'translateY(-5px)' : undefined 
                 }}
      >
        <Image
          src={
            finished
              ? '/images/sauna-complete.png'
              : '/images/sauna-empty.png'
          }
          alt={finished ? 'Capy in tub' : 'Empty sauna bucket'}
          width={48}
          height={48}
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* walking capy (bottom‐on‐rail), only until finish */}
      {!finished && (
        <motion.div
          className="absolute w-12 h-12 z-20"
          // ← nudged 2px down compared to the tub above:
          style={{ top: 'calc(50% - 47.5px)' }}
          animate={{ x: xPos }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Image
            src={walkSrc}
            alt="Capybara walking"
            fill
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
      )}

      {/* bubble an orange out of the tub on finish */}
      <AnimatePresence>
        {finished && (
          <motion.div
            key="orange"
            className="absolute w-6 h-6 z-20"
            style={{ top: 'calc(50% - 49.5px)', right: '1.5rem' }}
            initial={{ y: 24, opacity: 1 }}
            animate={{ y: -32, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <Image
              src="/images/orange.png"
              alt="Floating orange"
              fill
              style={{ objectFit: 'contain' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
