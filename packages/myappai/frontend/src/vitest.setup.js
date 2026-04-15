import React from 'react'
import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

globalThis.React = React

HTMLCanvasElement.prototype.getContext = vi.fn(() => null)
