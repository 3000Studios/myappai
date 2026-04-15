import React from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import CommandConsole from '../../components/admin/CommandConsole.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'

export default function AdminConsolePage() {
  const {
    consoleMode,
    setConsoleMode,
    commandText,
    setCommandText,
    naturalLanguagePrompt,
    setNaturalLanguagePrompt,
    handleRunCommand,
    commandBusy,
    lastResult,
  } = useAdminDashboard()

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">AI console</span>
        <PrismHeadline text="Command router" />
        <p className="section-intro">
          Run natural-language or JSON actions against the live platform for
          content changes, deploys, and automation.
        </p>
      </div>
      <CommandConsole
        consoleMode={consoleMode}
        onConsoleModeChange={setConsoleMode}
        commandText={commandText}
        onCommandTextChange={setCommandText}
        naturalLanguagePrompt={naturalLanguagePrompt}
        onNaturalLanguagePromptChange={setNaturalLanguagePrompt}
        onRunCommand={handleRunCommand}
        busy={commandBusy}
        lastResult={lastResult}
      />
    </div>
  )
}
