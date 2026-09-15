# Ἡ Φωνή — Koine Fluency

An interactive web app for practicing active fluency in Koine Greek, based on *The Greek Voice* (Ἡ Ἑλληνικὴ Φωνή) — 20 wall sheets for building living fluency.

**Live**: https://koine-fluency.vercel.app (coming soon)

## Features

### 📖 Sheet Browser
Browse all 16 available practice sheets (interrogatives, communication, and grammar) with:
- Greek terminology with English translations
- Examples from the Gospel of Mark
- Mark Studied button to track progress
- Beautiful dark theme with proper polytonic diacritics

### 🗂️ Flashcard Drill
Interactive flashcard practice with:
- 51 vocabulary flashcards auto-generated from sheets
- Filter by category (All, Interrogatives, Communication, Grammar)
- Click-to-flip card interaction
- Real-time scoring (correct/total)
- Progress tracking across sessions

### ⚡ Drilling Techniques
Learn and explore the five time-tested fluency-building methods:
1. **Circling a Fact** — Surround one true statement with questions
2. **Substitution** — Keep the frame, change one slot to feel endings
3. **Commands with the Body** — Silent comprehension through obedience
4. **Retelling a Scene** — Read, close the book, answer three questions
5. **Parsing Aloud** — Recite the grammatical formula for each term

Each technique includes descriptions, examples, and a practice tip.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS (CDN)
- **Data**: Static JSON (16 sheets, 51 terms)
- **Storage**: localStorage for progress tracking
- **Typography**: Noto Serif for Greek, system sans-serif for English

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx           # Navigation and sheet list
│   ├── SheetBrowser.jsx      # Display sheet content
│   ├── FlashcardDrill.jsx    # Flashcard practice mode
│   └── ExerciseMode.jsx      # Drilling techniques
├── data/
│   └── sheets.json           # All 16 sheets with terms and examples
├── App.jsx                   # Main app component
├── index.css                 # Base styles
└── main.jsx                  # React entry point
```

## Getting Started

### Development

```bash
npm install
npm run dev
```

App runs on http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## Roadmap

- [ ] Add sheets 7-10 (Food/Dining, Sleeping)
- [ ] User authentication (optional)
- [ ] Spaced repetition algorithm for flashcards
- [ ] Print/export sheets as PDFs
- [ ] Add audio pronunciation for Greek terms
- [ ] Mobile app (React Native)
- [ ] Community deck sharing

## Data Structure

Sheet data is stored in `src/data/sheets.json` with this structure:

```json
{
  "sheets": [
    {
      "id": 2,
      "number": "02",
      "greek_title": "Τὰ Ἐρωτηματικά Α΄",
      "english_title": "Question Words I",
      "category": "interrogatives",
      "terms": [
        {
          "greek": "τίς; τί;",
          "english": "Who? Which one?",
          "examples": [
            {
              "greek": "τίς ἄρα οὗτός ἐστιν;",
              "english": "Who then is this?",
              "reference": "Μᾶρκ. 4:41"
            }
          ]
        }
      ]
    }
  ]
}
```

## Attribution

Built with [Claude Code](https://claude.com/claude-code)

Based on *Ἡ Ἑλληνικὴ Φωνή* (The Greek Voice) — a resource by [name/publisher] for building active fluency in Koine Greek.
