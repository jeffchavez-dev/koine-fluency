import { useState, useMemo } from 'react'

export default function SearchBar({ sheets, onSearch, onSelectResult }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    const q = query.toLowerCase()
    const results = []

    sheets.forEach(sheet => {
      if (sheet.sections) {
        sheet.sections.forEach(section => {
          section.terms?.forEach(term => {
            if (term.greek.toLowerCase().includes(q) || term.english.toLowerCase().includes(q)) {
              results.push({
                sheetId: sheet.id,
                sheetTitle: sheet.english_title,
                greek: term.greek,
                english: term.english,
                examples: term.examples || []
              })
            }
          })
        })
      } else if (sheet.terms) {
        sheet.terms.forEach(term => {
          if (term.greek.toLowerCase().includes(q) || term.english.toLowerCase().includes(q)) {
            results.push({
              sheetId: sheet.id,
              sheetTitle: sheet.english_title,
              greek: term.greek,
              english: term.english,
              examples: term.examples || []
            })
          }
        })
      }
    })

    return results.slice(0, 15) // Limit to 15 results
  }, [query, sheets])

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
        <span className="text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search Greek or English..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-slate-400 hover:text-slate-300"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
          {searchResults.map((result, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectResult?.(result)
                setQuery('')
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-700 transition border-b border-slate-700 last:border-b-0"
            >
              <div className="greek-text text-sm text-yellow-400 font-semibold">{result.greek}</div>
              <div className="text-xs text-slate-400">{result.english}</div>
              <div className="text-xs text-slate-500">{result.sheetTitle}</div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-center text-sm text-slate-400 z-50">
          No results found
        </div>
      )}
    </div>
  )
}
