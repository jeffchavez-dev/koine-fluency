import { useState, useEffect } from 'react'
import SheetBrowser from './components/SheetBrowser'
import FlashcardDrill from './components/FlashcardDrill'
import ExerciseMode from './components/ExerciseMode'
import Sidebar from './components/Sidebar'
import sheetsData from './data/sheets.json'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('browser')
  const [selectedSheetId, setSelectedSheetId] = useState(2)
  const [progress, setProgress] = useState({})

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('koine-progress')
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('koine-progress', JSON.stringify(progress))
  }, [progress])

  const markSheetStudied = (sheetId) => {
    setProgress(p => ({
      ...p,
      [sheetId]: { ...p[sheetId], studied: true, lastStudied: new Date().toISOString() }
    }))
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        sheets={sheetsData.sheets}
        onSelectSheet={setSelectedSheetId}
        onChangeView={setCurrentView}
        currentView={currentView}
        progress={progress}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'browser' && (
          <SheetBrowser
            sheets={sheetsData.sheets}
            selectedSheetId={selectedSheetId}
            onMarkStudied={markSheetStudied}
          />
        )}
        {currentView === 'flashcards' && (
          <FlashcardDrill
            sheets={sheetsData.sheets}
            onMarkStudied={markSheetStudied}
          />
        )}
        {currentView === 'exercises' && (
          <ExerciseMode sheets={sheetsData.sheets} />
        )}
      </main>
    </div>
  )
}
