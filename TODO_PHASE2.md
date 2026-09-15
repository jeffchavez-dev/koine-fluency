# Phase 2: Enhance Grammar Sheets with First-Person Narratives

## Overview
The current app has comprehensive vocabulary structure but is missing the **pedagogical richness** of the original PDF: "Ἡ Ἑλληνικὴ Φωνή" (The Greek Voice).

## Key Gap: First-Person Narratives
Each grammar concept in the PDF speaks in first person, introducing itself to the learner.

**Example from PDF:**
```
ἡ περίοδος: "Ἐγώ εἰμι ἡ περίοδος. συνάγω πάντα εἰς λόγον τέλειον: ἀρχὴν ἔχω καὶ τέλος."
(The sentence: "I am the sentence. I gather everything into one complete utterance: I have a beginning and an end.")

τὸ ῥῆμα: "Ἐγώ εἰμι τὸ ῥῆμα. λέγω τί ποιεῖ τις ἢ τί πάσχει ἢ τί ἐστιν..."
(The verb: "I am the verb. I tell what someone does, or undergoes, or is...")
```

## Sheets Requiring Enhancement

### High Priority (Grammar Foundations)
- **Sheet 11**: Parts of Speech I (sentence, noun, verb, adjective)
  - Add first-person narratives for each
  - Add 2-3 examples per part of speech
  - Add introductory pedagogical instruction

- **Sheet 12**: Parts of Speech II (pronoun, preposition, article, adverb)
  - Same enhancements as Sheet 11

- **Sheet 13**: Parts of Speech III (conjunction, participle, infinitive, interjection)
  - Same enhancements as Sheet 11

### Medium Priority (Grammar Concepts)
- **Sheet 14**: The Cases (nominative → vocative)
  - Add narrative explaining each case's function
  - Expand examples (currently 1 per case, need 2-3)
  - Add pedagogical introduction

- **Sheet 15**: Gender & Number
  - Add narrative for each gender
  - Explain why gender matters in Greek
  - More agreement examples

- **Sheet 16**: The Tenses
  - Add narrative for each tense
  - Explain aspect vs. time distinction
  - More verb form examples

- **Sheet 17**: The Voices
  - Add narrative for each voice
  - Explain middle voice subtleties
  - More usage examples

- **Sheet 18**: The Moods
  - Add narrative for each mood
  - Explain when to use each
  - More contextual examples

- **Sheet 19**: Person
  - Add narrative about person in Greek verbs
  - Show person/number agreement patterns
  - More examples with different verbs

### Lower Priority
- **Sheet 2-3**: Question Words (already have examples, but could add narratives)
- **Sheets 4-10**: Communication & Daily Life (mostly complete, minor enhancements only)

## Implementation Approach

### For Each Sheet:
1. **Add Sheet Introduction**
   - Pedagogical guidance on how to learn the concept
   - Example from Mark showing the concept in action

2. **Add First-Person Narratives**
   - Each term speaks as itself in Greek and English
   - Explains its function and importance
   - ~2-3 sentences per narrative

3. **Expand Examples**
   - Minimum 2-3 Mark Gospel examples per term (currently 1)
   - Vary example context to show different usages
   - Include reference formatting

4. **Add Introductory Instructions**
   - How to practice the sheet
   - Drill methodology specific to that grammar concept
   - Connection to drilling techniques (Sheet 20)

## Data Structure Addition
```json
{
  "sheet": "11",
  "introduction": "Grammar is easier to remember when it speaks...",
  "instruction": "Let each part of speech introduce itself in first person...",
  "sections": [
    {
      "title": "Core Parts of Speech",
      "terms": [
        {
          "greek": "ἡ περίοδος",
          "english": "The sentence",
          "narrative": "Ἐγώ εἰμι ἡ περίοδος. συνάγω πάντα εἰς λόγον τέλειον...",
          "narrative_english": "I am the sentence. I gather everything into one complete utterance...",
          "examples": [/* 2-3 examples */]
        }
      ]
    }
  ]
}
```

## Estimated Scope
- **11 sheets to enhance** (11-19, plus 2-3)
- **~40-50 first-person narratives** to write/extract from PDF
- **~100+ new examples** to add from Mark
- **~20 introductory instructions** to write
- **Total new content**: ~500-800 lines of JSON

## Success Criteria
- [ ] All grammar sheets (11-19) have first-person narratives
- [ ] Each term has 2-3 Mark Gospel examples minimum
- [ ] Each sheet has introductory pedagogical guidance
- [ ] App displays narratives alongside definitions
- [ ] Visual consistency with original PDF maintained

## Critical UI/UX Gap: ExerciseMode Not Functional

### Issue
The "Drills" tab (ExerciseMode component) currently shows nothing because:
- Component expects Sheet 20 to have a `drills` array (old data format)
- We rebuilt Sheet 20 with `sections` structure (new format)
- No data matches the component's expectations

### Solution Options
1. **Refactor ExerciseMode** to render from `sections` structure
   - Map 5 drilling techniques to interactive drill interface
   - Allow students to select drill type and practice sheet
   - Show examples and let students practice substitutions/circling/etc.

2. **Create Interactive Drill Mode**
   - Circling: Present Mark passages, ask W-questions repeatedly
   - Substitution: Show sentence structure, let student swap words
   - Commands: Present commands, have student indicate understanding
   - Retelling: Show passage, student retells from memory
   - Parsing: Show verb/noun, student identifies components

3. **Minimum Viable Fix** (Phase 2a)
   - Display drilling techniques from Sheet 20 sections
   - Show examples and instructions
   - Link to flashcard/sheet browser for practice

### Estimated Effort
- **UI Refactor**: 2-4 hours
- **Interactive Implementation**: 8-12 hours (requires UI for each technique)
- **Minimum Fix**: 1-2 hours

---

## Notes
- Original PDF is the authoritative source for narratives and examples
- Prioritize Mark's Gospel for all biblical examples
- Maintain the "voice" of the original resource
- Consider adding a "narrative mode" UI toggle in the app to show/hide first-person narratives

---

**Started**: After Phase 1 completion (2024)
**Priority**: High - This is what makes the resource unique and pedagogically effective
**Owner**: Next phase development

## Phase 2 Implementation Checklist
- [ ] Extract first-person narratives from original PDF (Sheets 11-19)
- [ ] Add 2-3 examples per grammar term (Sheets 11-19)
- [ ] Add pedagogical introductions for each sheet
- [ ] Refactor ExerciseMode component for new data structure
- [ ] Consider interactive drill modes (circling, substitution, commands, retelling, parsing)
- [ ] Test all sheets in app after changes
- [ ] Commit and push to GitHub
