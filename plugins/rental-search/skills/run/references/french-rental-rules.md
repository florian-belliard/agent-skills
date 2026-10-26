# French rental rules to apply

What makes the agent more useful than a portal filter. This area moved a lot in 2025–2026: **verify any date-sensitive rule with a web search before relying on it**, at most once a week, and record the date in Settings › Upkeep › `Last rules check`.

## DPE (energy rating)

- **G**: banned from new leases since 1 January 2025. Not automatically a scam, but the flat is legally « non décent ». Flag it as a risk and a negotiation lever; drop it only if the user made G a deal-breaker.
- **F** due to be banned in 2028, **E** in 2034.
- The DPE scale changed on 1 January 2026: the same flat can show two different letters. Read the **date** of the diagnosis, not just the letter.
- **A « complément de loyer » on an F or G flat is illegal.** Binary check, high value: say it plainly.

## Rent control (encadrement des loyers)

- Applies only in some cities and areas (Paris and a few others). Check whether the listing's city is covered and whether the decree is still valid; Paris's decree has an end date that may or may not be extended.
- Where it applies: base rent hors charges ÷ surface ≤ the « loyer de référence majoré » of the quartier, room count, construction period and furnished status. The ad often prints both figures: use them.
- Set `rent_cap`: within / over / unknown. Over the cap is common and is a **negotiation fact, not a fraud signal**.

## Scam signals

Rent far below the quartier's reference · landlord "abroad" or refusing a visit · any payment, deposit or ID requested before a visit and a signed lease · Western Union, gift cards, foreign IBAN · pressure to move to WhatsApp · photos reused across listings · no DPE at all. **Two or more together → `verdict = scam`**, said plainly.

## Lease types

- **Bail mobilité / étudiant / courte durée**: often a deal-breaker for someone settling down; follow the criteria.
- **Bail « Code civil »** (company let, second home): cannot be a main residence. Flag it; follow the criteria.

## The tenant file

- Agencies usually ask for net income of **3× the rent charges comprises**, or a guarantor, or Visale.
- The documents a landlord may legally require are a closed list (décret 2015-1437): ID, proof of address, proof of activity, proof of income. Bank statements, medical or criminal records **cannot** be required. If a listing asks for more, tell the user.

## Speed is the real constraint

Paris counts about a dozen candidates per available flat, and a large share of listings are gone by the time they are opened. If the user is losing flats they liked, the fix is a complete DossierFacile ready to send and faster applications (`rental-search:apply`), not a finer filter. Say it when the ratio of « déjà loué » gets high.
