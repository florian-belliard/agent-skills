# Step 2 — Criteria interview

Goal: a criteria profile sharp enough that the agent can say no on its own, and honest enough that it never says no on a guess.

Ask the questions below in the user's language. Write the criteria (Criterion, Detail) in the user's language too.

## How to ask

- **One question at a time.** Wait for the answer, write it down, ask the next.
- **Ask the version that decides**, not the generic one. "What's your budget?" is weak. "What rent, charges included, makes you say no without thinking, and what rent makes you say yes without thinking?" is useful.
- **Give two or three examples** in each question so they can answer in one word.
- **Accept "I don't know"**: it becomes a nice-to-have, never a deal-breaker.
- Keep a running summary in your head; do not read it back after every answer.

## The questions, in this order

1. **City and areas.** "Which city? And which neighbourhoods (or arrondissements)? Any specific spots you rule out, even inside an area you accept?" Write the city in Settings › Search › `City`.
   - Paris: ask arrondissements, then exclusions inside them (e.g. "not beyond such-and-such street", "not near the ring road"). Then their order of preference: first choice, acceptable, "only if great".
2. **Budget.** "Rent with charges included: your ideal, and the ceiling you never go above?"
   - If they mention a higher figure for a flat they would love, store it in the criterion's Detail as their negotiating margin. **The filter is the hard ceiling, never the dream-flat figure.**
3. **Size.** "Minimum surface? And from what surface would you be really happy? Minimum number of rooms, and of bedrooms?"
4. **Furnished or unfurnished.** "Furnished, unfurnished, or either?"
5. **Date.** "By when? A hard deadline, or can you wait? Would a short lease (student, mobility, a few months) work for you?"
6. **Building.** "Ground floor possible? From which floor does a lift become a must? A preference for high floors or the top floor?"
7. **Comfort.** "What matters most to you: light, quiet, outdoor space (balcony, terrace), separate kitchen, parking, something else?"
8. **Deal-breakers.** "What makes you turn down a listing without even visiting it?"

The application file (income, guarantors) is step 3. Do not ask it here.

## Turn answers into criteria

Each answer becomes one or more rows in the Criteria database. Until the database exists (step 4), keep the draft in Settings › Criteria draft.

Field names and option labels come from the Schema (canonical keys below; display names in the user's language):

| Key | Rule |
|---|---|
| title | Short title in the user's language: "Ceiling: €1,950 charges included", "No ground floor" |
| type | `dealbreaker` · `must` · `nice` · `bonus` (English labels: Deal-breaker · Top priority · Nice-to-have · Bonus) |
| weight | 0 to 10. Deal-breakers: 10 (not scored, kept for ordering). |
| category | One of the Category options (display names in the user's language, see `notion-workspace.md` › Criteria): Budget · Location · Size & layout · Building · Comfort · Practical · Application file |
| detail | In the user's language, 1 to 4 sentences: how to judge it from an ad, and what to do when the ad says nothing |
| origin | `declared` |
| active | checked |

**Which type** — explain the difference to the user the first time, in their language, in these words:

> "**Deal-breaker**: the listing is set aside straight away, I don't show it to you. **Top priority**: it weighs a lot in the score, but I can almost never check it on a listing, so I don't set it aside for that. **Nice-to-have**: a plus that raises the score."

- `dealbreaker` only for facts an ad actually states: zone, ceiling rent, minimum surface, rooms, ground floor, high floor without lift, lease type. **A deal-breaker fires on what the ad says, never on what it does not say.** Write that sentence in the detail of every deal-breaker.
- `must` for what matters most but an ad rarely proves: light, quiet bedrooms. Unknown = half the points, never a rejection; clearly not met = minus its weight.
- `nice` for preferences: under the ideal rent, above the comfortable surface, top floor, unfurnished, outdoor space.
- `bonus` for small extras.

**Always add these two, without asking:**
- "Usable photos" — `nice`, weight 3: met when the listing has real photos of the flat.
- "Never reject on a doubt" — `nice`, weight 0. Detail: "When a listing does not give the floor, the area or the DPE, keep it, count the scored criteria that depend on it at half, and name the missing fact in the summary."

## Read the profile back

One message, with these parts in this order:

1. **The profile**, in five lines maximum. Example:

   > **Paris 14th and 15th first, then 13th and 12th (not beyond the ring road).**
   > **Rent: ideal €1,700, never above €1,950 charges included.**
   > **2 rooms (T2) minimum, 40 m² minimum, ideally over 50 m², furnished or not.**
   > **No ground floor, lift required from the 4th floor.**
   > **What matters most: light and a quiet bedroom.**

2. **What you added yourself**, one line each: the criteria added without asking. Leave this part out when you added nothing.
3. **The feedback loop**, in one line: "These criteria aren't set in stone: when you turn down a listing with a word of explanation, I use it. Two rejections for the same reason become a new criterion, which you'll see and can delete."
4. **The question, last.** One question closes the message: "What's wrong in there?", asked as a question. When you need a decision from them (a rule an older profile had, two criteria that contradict each other), say why in the sentence before, then put the decision and its options into that same question: "Shall I put DPE G back as a deal-breaker or leave it out, and what else is wrong in there?"

Fix what they correct, then move to step 3.
