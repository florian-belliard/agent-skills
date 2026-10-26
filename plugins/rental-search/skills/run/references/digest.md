# The digest email

A short notice, always the same template: how many new listings, a few fixed info lines, one button to "To decide". The user decides in Notion, not in their inbox. Validated in testing.

**You only fill the slots below. Never add, reword, reorder or restyle anything**: no listing details, no score, no date, no chip, no footer note, no free text. Use the texts in the user's language: English below, French in the validated table at the end, any other language from Settings › Digest › `Texts` (translated once at setup).

## When and to whom

- Send only if the run wrote **at least one new row** or has **at least one info line** (the 💻 line does not count). Otherwise send nothing.
- To: Settings › Digest › `Sent to`. Gmail `send_message`: `htmlBody` = the HTML below, `body` = the plain text below, filled with the same values.
- **One per run, never two.** If a send returns an error, check Sent before resending. A correction mail only when the user asks for one; it keeps the subject plus "(correction)".
- **Put the HTML directly in the tool argument.** Arguments are never shell-expanded: no `$(…)`, no backticks, no file path. The CAPITALISED words below are slots you fill yourself: never send one as is.
- Test mode (Settings › Digest › `Test mode` = yes): the subject starts with "[test]".

## Slots

- `N` = new rows written this run.
- `HEADLINE` / `SUBLINE`:
  - N = 1 → "1 new listing" / "is waiting for you in Notion."
  - N ≥ 2 → "N new listings" / "are waiting for you in Notion."
  - N = 0 → "No new listings" / "but one update for you." ("but some updates for you." with two or more)
- `INFO` lines — closed list, in this order, exact wording, one line each:
  1. "📩 <Agency> replied about the <type> <street or quartier>. Your reply is ready as a draft in Gmail." — one per human email (the draft is created by step 7 of `run`). Not in test mode: no draft was made.
  2. "📅 Visit confirmed for the <type> <street or quartier>, <day> at <time>."
  3. "↘️ The <type> <street or quartier> in your selection drops to <rent> € incl. charges (−<difference> €)."
  4. "💡 New rule learned: <rule>. You can remove it in My criteria."
  5. "⚠️ No alert received for 24 h: check your alert forwarding (and your spam folder)." — at most once a day (`sources.md` › 2).
  6. "⚠️ <Site> showed an anti-robot check: it was not read this pass." — at most once a day per site: skip it if a Run log row of today already notes `blocked: <site>`.
  7. "💻 Your computer was off: this pass only read your emails (fewer listings, less detail). Leave it on with Claude open at run times." — only in a `fallback` run that sends a digest anyway (it never triggers one on its own); at most once a day: skip it if a Run log row of today already notes `warned: computer off`.
- `BUTTON` / `BUTTON_URL`: "See the listings →" to Settings › Views › `To decide link`. Only when N = 0 and the first info line is 📩: "Open Gmail →" to `https://mail.google.com/mail/u/0/#drafts`.
- `NEXT_RUN`: the next scheduled run in the user's time zone (Settings › Runs › `Times`): "at 12:00", or "tomorrow at 9:00" after the last run of the day.
- Subject:
  - N ≥ 1 → "🏠 1 new listing to decide on" / "🏠 N new listings to decide on", plus " · 📩 R agency replies" ("1 agency reply") when R ≥ 1.
  - N = 0 → the first info's label: "📩 R agency replies" ("1 agency reply") · "📅 Visit confirmed" · "↘️ Price drop in your selection" · "💡 New rule learned" · "⚠️ Alerts silent for 24 h" · "⚠️ <Site> blocked".

Whatever else the run has to say (listings dropped, sources, a question for the user) goes in the Run log and in your final answer, never in the mail.

## HTML — exactly this

Repeat the `INFO` row once per info line; with none, leave it out.

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:24px 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<tr><td style="font-size:26px;font-weight:700;line-height:1.2;color:#1f1d1a;">HEADLINE</td></tr>
<tr><td style="font-size:15px;line-height:1.5;color:#6f6a63;padding:4px 0 16px;">SUBLINE</td></tr>
<tr><td style="font-size:14px;line-height:1.5;color:#1f1d1a;padding:10px 0;border-top:1px solid #e6e2dc;">INFO</td></tr>
<tr><td style="padding:18px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#8a5a3b" style="background-color:#8a5a3b;border-radius:8px;"><a href="BUTTON_URL" style="display:inline-block;padding:13px 22px;border:1px solid #8a5a3b;border-radius:8px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">BUTTON</a></td></tr></table></td></tr>
<tr><td style="font-size:12px;line-height:1.5;color:#6f6a63;padding:20px 0 0;">Next run NEXT_RUN</td></tr>
</table></td></tr></table>
```

Only the button has a fill, on its own cell, with both the `bgcolor` attribute and `background-color` (checked in Gmail dark mode). White bold text on the link. Never put the fill on the `<a>`: inline elements lose their background in several clients and the button turns invisible.

**Known and accepted: Google's redirect page.** The Gmail connector rewrites every link at send time into `google.com/url?q=…` without Google's signature, so a click first shows Google's redirect warning. It also strips `background-image` and `role`. Nothing in the template can prevent it; do not try workarounds such as custom link schemes.

## Plain text — exactly this

One line per info line, then an empty line:

```
HEADLINE SUBLINE

INFO

BUTTON (without the arrow): BUTTON_URL

Next run NEXT_RUN
```

## Example

Subject "🏠 2 new listings to decide on · 📩 1 agency reply". Body: "2 new listings" / "are waiting for you in Notion.", then "📩 Oralia replied about the 2-room on rue Daguerre. Your reply is ready as a draft in Gmail." and "💡 New rule learned: no raised ground floor. You can remove it in My criteria.", the button "See the listings →", and "Next run tomorrow at 9:00".

## Validated French version

| Text | French |
|---|---|
| HEADLINE / SUBLINE, N = 1 | « 1 nouvelle annonce » / « t'attend dans Notion. » |
| HEADLINE / SUBLINE, N ≥ 2 | « N nouvelles annonces » / « t'attendent dans Notion. » |
| HEADLINE / SUBLINE, N = 0 | « Pas de nouvelle annonce » / « mais une info pour toi. » (« mais des infos pour toi. » with two or more) |
| INFO 1 | « 📩 <Agence> a répondu pour le <type> <rue ou quartier>. Ta réponse est prête en brouillon dans Gmail. » |
| INFO 2 | « 📅 Visite confirmée pour le <type> <rue ou quartier>, <jour> à <heure>. » |
| INFO 3 | « ↘️ Le <type> <rue ou quartier> de ta sélection passe à <loyer> € CC (−<écart> €). » |
| INFO 4 | « 💡 Nouvelle règle apprise : <règle>. Tu peux la retirer dans Mes critères. » |
| INFO 5 | « ⚠️ Aucune alerte reçue depuis 24 h : vérifie le transfert de tes alertes (et tes spams). » |
| INFO 6 | « ⚠️ <Site> a affiché un contrôle anti-robot : il n'a pas été lu à ce passage. » |
| INFO 7 | « 💻 Ton ordinateur était éteint : ce passage n'a lu que tes mails (moins d'annonces, moins de détails). Laisse-le allumé avec Claude ouvert aux heures de passage. » |
| BUTTON | « Voir les annonces → » · « Voir Gmail → » |
| NEXT_RUN | « à 12h » · « demain à 9h » |
| Footer | « Prochain passage NEXT_RUN » |
| Subject, N ≥ 1 | « 🏠 1 nouvelle annonce à décider » / « 🏠 N nouvelles annonces à décider », plus « · 📩 R réponse(s) d'agence » |
| Subject, N = 0 | « 📩 R réponse(s) d'agence » · « 📅 Visite confirmée » · « ↘️ Baisse de prix dans ta sélection » · « 💡 Nouvelle règle apprise » · « ⚠️ Alertes muettes depuis 24 h » · « ⚠️ <Site> bloqué » |
| Plain-text button line | `BUTTON : BUTTON_URL` |
