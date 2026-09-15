import { useState, useMemo } from 'react'

export default function FlashcardDrill({ sheets, onMarkStudied }) {
  const [selectedSheetId, setSelectedSheetId] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, total: 0 })

  // Build flashcard deck from all terms
  const flashcards = useMemo(() => {
    const cards = []
    sheets.forEach(sheet => {
      if (sheet.terms) {
        sheet.terms.forEach(term => {
          cards.push({
            sheetId: sheet.id,
            sheetTitle: sheet.english_title,
            greek: term.greek,
            english: term.english,
            category: sheet.category
          })
        })
      }
    })
    return cards
  }, [sheets])

  const filtered = useMemo(() => {
    if (!selectedSheetId) return flashcards
    return flashcards.filter(c => c.sheetId === selectedSheetId)
  }, [flashcards, selectedSheetId])

  const currentCard = filtered[currentIndex]
  const practiceSheets = sheets.filter(s => s.terms && s.terms.length > 0)

  const handleCorrect = () => {
    setStats(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }))
    nextCard()
  }

  const handleIncorrect = () => {
    setStats(s => ({ ...s, total: s.total + 1 }))
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // Restart
      setCurrentIndex(0)
      setIsFlipped(false)
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 p-8">
        <div className="text-center">
          <p className="text-slate-400">No cards in this category</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 p-4 md:p-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Flashcard Drill</h2>
          <div className="text-sm text-slate-400">
            {stats.total > 0 && (
              <span>
                Score: {stats.correct}/{stats.total} ({Math.round(stats.correct / stats.total * 100)}%)
              </span>
            )}
          </div>
        </div>

        {/* Sheet Selection */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Choose a Lesson:</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedSheetId(null)
                setCurrentIndex(0)
                setIsFlipped(false)
                setStats({ correct: 0, total: 0 })
              }}
              className={`px-3 py-2 rounded text-sm transition ${
                selectedSheetId === null
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Lessons
            </button>
            {practiceSheets.map(sheet => (
              <button
                key={sheet.id}
                onClick={() => {
                  setSelectedSheetId(sheet.id)
                  setCurrentIndex(0)
                  setIsFlipped(false)
                  setStats({ correct: 0, total: 0 })
                }}
                className={`px-3 py-2 rounded text-sm transition ${
                  selectedSheetId === sheet.id
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sheet.number}: {sheet.english_title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-2xl cursor-pointer h-96"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 md:p-12 shadow-2xl border border-slate-600 h-full flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-yellow-500/20"
          >
            <div className="text-center">
              {!isFlipped ? (
                <div>
                  <p className="text-slate-400 text-sm mb-4">Greek</p>
                  <p className="greek-text text-3xl md:text-5xl text-yellow-400 font-bold break-words">
                    {currentCard?.greek}
                  </p>
                  <p className="text-slate-500 text-sm mt-8">Click to reveal</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-400 text-sm mb-4">English</p>
                  <p className="text-lg md:text-2xl text-slate-100 font-semibold break-words">
                    {currentCard?.english}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex gap-4 justify-center">
        {isFlipped && (
          <>
            <button
              onClick={handleIncorrect}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              ✗ Not sure
            </button>
            <button
              onClick={handleCorrect}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              ✓ Got it!
            </button>
          </>
        )}
      </div>

      {/* Progress */}
      <div className="mt-8 text-center text-slate-400 text-sm">
        Card {currentIndex + 1} of {filtered.length}
      </div>
    </div>
  )
}
