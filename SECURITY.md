# Security

The plugins in this repository act with the installing user's own tools: their mailbox, their Notion workspace, their browser. A flaw can expose that user's data or make the agent act on their behalf.

## Supported versions

Only the latest `main` is supported. Plugins carry no version number: every installation updates from `main`, so a fix reaches everyone at their next update.

## Reporting a vulnerability

Please do not open a public issue. Report it privately through GitHub: **Security › Report a vulnerability** on this repository. Without a GitHub account, write to security@florianbelliard.com.

Describe the plugin and skill, what an attacker controls (a mail, a web page, a listing, a file in a pull request…), and what the agent ends up doing.

Reports are read and answered on a best-effort basis: this is a personal project, with no bounty.

## In scope

- A skill that lets content from a mail, a web page or a document make the agent send, write or reveal something the user did not ask for.
- Personal data leaving the user's own accounts beyond what a skill states it shares, including what a skill sends to a third-party service (a geocoder, a search engine, a website).
- Anything in the repository's scripts and checks that could run untrusted code.

Out of scope: weaknesses of the Claude apps, the connectors or the websites the agent visits. Report those to their owners.
