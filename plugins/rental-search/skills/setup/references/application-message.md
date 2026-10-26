# Step 3 — Application file and default message

Goal: when a listing appears, the person can apply in one sentence. That needs two things ready now: the facts of their file, and a message they have approved.

**Language.** Ask the questions in the user's language. Write the message in the language of the listings they will answer: French for a search in France, whatever the user's language. If they do not read French, show them a translation next to it, and store both.

## Questions, one at a time

1. "Are you looking alone, as a couple, or for a flatshare?"
2. "What's your work situation (and the other person's, if there is one)? Permanent contract, civil servant, self-employed, student… Still in a probation period?"
3. "Is the household's net income at least 3 times the rent you're aiming for?" Accept yes / no / roughly. **Do not ask for the amount.** If they volunteer it, ask whether they want it written in their applications before storing it.
4. "Do you have one or more guarantors? In France? Have you thought of Visale (free) or a paid guarantee like GarantMe?"
5. "Do you have a DossierFacile?" If not, recommend it in two lines:
   > "It's the State's free rental file: your supporting documents, verified, in a single link. Landlords answer complete files first, and one listing in two is already gone when you open it. You can make it here: https://www.dossierfacile.logement.gouv.fr"
   They can continue without it; add the link to the message later.
6. "When are you free for visits?" (e.g. "evenings and weekends", "at very short notice")
7. **Contact details for applications:**
   "To fill in forms for you, I need: first name, last name, the email where you want to receive replies, and your phone if you want it to appear. I only use them in applications you approve."
   - Suggest their main email for applications, not the alerts alias created at step 5: replies from agencies must not drown in alerts.
   - Phone is optional. Ask explicitly: "Shall I put your number in the forms that ask for it?"

## Write the message

In the listings' language (French in France, formal « vous »), 4 to 6 lines, no bragging, no invented fact. Structure:

1. **First line: left as a placeholder**, adapted for each listing by `rental-search:apply` (street or area, one concrete thing they like).
2. The file in one sentence (who, situations).
3. The guarantee in one sentence (guarantors, Visale/GarantMe, 3× rent if true).
4. Availability for a visit.
5. DossierFacile link if any.
6. Signature: first name and last name.

Skeleton, given in English: write it in the listings' language (French in France, formal « vous »), and fill it with their answers only; never add a fact they did not give:

> Hello,
>
> [First line adapted to the listing]
>
> [Who is applying, in one sentence: "I am…" / "We are…", with the work situations.]
> [The guarantee, in one sentence: guarantors, Visale or paid guarantee, income ≥ 3× the rent if true.]
>
> Available for a visit [their availability]. [My / Our] full file: [DossierFacile link]
>
> Kind regards,
> [First name Last name]

Show it (with its translation if needed), ask "Shall I change anything?", iterate until they say ok.

## Store it

Until step 4, keep the approved message and fields in Settings › Message draft. Also write the application email in Settings › Search › `Application email`, and the query `run` uses to find agencies' replies in `Human mail query`: the template from `settings-page.md` › Search with that email filled in (the sites' domains are filled in at step 5.1). Test mode: copy both from the existing search if it has a Settings page.

At step 4, create the page "My application" under the home page: icon `icons/send_brown`, no cover, title in the user's language. Section titles in the user's language: `apply` finds the sections by position and meaning, in whatever language they are. Exactly this content, in Notion-flavoured Markdown, texts in the user's language; the headings are H2:

~~~
<callout icon="/icons/drafts_brown.svg" color="gray_bg">
What the agent puts in the forms when you apply. Edit freely: it rereads this page for every application, and nothing goes out without your ok.
</callout>

## My contact details

| Field | What I put |
| --- | --- |
| First name | … |
| Last name | … |
| Email | … |
| Phone | … (or "leave empty if you don't want to give it") |

## My file
- Who: … (alone, as a couple, work situations)
- Guarantees: … (guarantors, Visale, paid guarantee, 3× the rent if true)
- DossierFacile: link, or "to add"
- Visits: … (availability)

## My message
<the approved message, in the listings' language, first line to adapt>

## Translation (for you)
<only if the user does not read the message's language>

## Rules
- The first line is adapted to each listing, and the message goes out in the listing's language.
- A field a site asks for that is not here (income, date of birth…): the agent asks you first.
- Nothing is sent without your ok, listing by listing.
~~~

Tell them they can edit this page whenever they want: `apply` reads it fresh every time.
