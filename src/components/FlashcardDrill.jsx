import { useState, useMemo } from 'react'

export default function FlashcardDrill({ sheets, onMarkStudied }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
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
    if (selectedCategory === 'all') return flashcards
    return flashcards.filter(c => c.category === selectedCategory)
  }, [flashcards, selectedCategory])

  const currentCard = filtered[currentIndex]
  const categories = ['all', ...new Set(flashcards.map(c => c.category))]

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
    <div className="flex-1 flex flex-col bg-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Flashcard Drill</h2>
          <div className="text-sm text-slate-400">
            {stats.total > 0 && (
              <span>
                Score: {stats.correct}/{stats.total} ({Math.round(stats.correct / stats.total * 100)}%)
              </span>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentIndex(0)
                setIsFlipped(false)
                setStats({ correct: 0, total: 0 })
              }}
              className={`px-4 py-2 rounded text-sm transition ${
                selectedCategory === cat
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-2xl cursor-pointer"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-12 shadow-2xl border border-slate-600 h-96 flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-yellow-500/20"
            style={{
              perspective: '1000px',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s'
            }}
          >
            <div className="text-center">
              {!isFlipped ? (
                <div>
                  <p className="text-slate-400 text-sm mb-4">Greek</p>
                  <p className="greek-text text-5xl text-yellow-400 font-bold">
                    {currentCard?.greek}
                  </p>
                  <p className="text-slate-500 text-sm mt-8">Click to reveal</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-400 text-sm mb-4">English</p>
                  <p className="text-2xl text-slate-100 font-semibold">
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
