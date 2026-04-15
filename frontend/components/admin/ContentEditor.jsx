import React, { useEffect, useMemo, useState } from 'react'

function flattenContent(contentBundle) {
  return Object.entries(contentBundle ?? {}).flatMap(([section, items]) =>
    (items ?? []).map((item) => ({
      section,
      slug: item.slug,
      filePath: item.filePath,
      data: item.data,
    }))
  )
}

export default function ContentEditor({ contentBundle, onSaveFile, busy }) {
  const entries = useMemo(() => flattenContent(contentBundle), [contentBundle])
  const [selectedPath, setSelectedPath] = useState(entries[0]?.filePath ?? '')
  const [editorValue, setEditorValue] = useState('')

  useEffect(() => {
    if (!entries.find((entry) => entry.filePath === selectedPath)) {
      setSelectedPath(entries[0]?.filePath ?? '')
    }
  }, [entries, selectedPath])

  useEffect(() => {
    const entry = entries.find(
      (candidate) => candidate.filePath === selectedPath
    )
    setEditorValue(entry ? JSON.stringify(entry.data, null, 2) : '')
  }, [entries, selectedPath])

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <span className="eyebrow">Content Editor</span>
          <h2>Raw JSON workspace editing</h2>
        </div>
      </div>
      <label className="field">
        <span>Content file</span>
        <select
          value={selectedPath}
          onChange={(event) => setSelectedPath(event.target.value)}
        >
          {entries.map((entry) => (
            <option key={entry.filePath} value={entry.filePath}>
              {entry.section} / {entry.slug}
            </option>
          ))}
        </select>
      </label>
      <textarea
        className="code-editor code-editor--large"
        spellCheck="false"
        value={editorValue}
        onChange={(event) => setEditorValue(event.target.value)}
      />
      <div className="admin-actions">
        <button
          className="button button--primary"
          type="button"
          disabled={busy || !selectedPath}
          onClick={() => onSaveFile(selectedPath, editorValue)}
        >
          {busy ? 'Saving...' : 'Save file'}
        </button>
      </div>
    </section>
  )
}
