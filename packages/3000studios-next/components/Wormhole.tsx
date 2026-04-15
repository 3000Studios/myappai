// Placeholder for a wormhole animation effect
import { motion, AnimatePresence } from 'framer-motion';

export default function Wormhole({ show, onEnd }: { show: boolean; onEnd?: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-purple-900 via-blue-700 to-black opacity-80 animate-spin-slow"
            style={{ filter: 'blur(24px)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, rotate: 360 }}
            exit={{ scale: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            onAnimationComplete={onEnd}
          />
          <motion.div
            className="w-96 h-96 rounded-full border-8 border-blue-400/60 shadow-2xl animate-spin-slow"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

