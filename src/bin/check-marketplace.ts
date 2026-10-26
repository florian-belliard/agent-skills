// Checks the marketplace repo it runs in: `task marketplace` (part of `task check`) calls it
// from the repo root. Exit code 1 when any error is found; warnings print and pass.
import { checkMarketplace } from '../check-marketplace'

const findings = checkMarketplace(process.cwd())
findings.forEach((f) => console.error(`${f.level}  ${f.file}: ${f.message}`))

const errors = findings.filter((f) => f.level === 'error').length
const warnings = findings.length - errors
console.log(
  errors === 0
    ? `check-marketplace: ok${warnings > 0 ? ` (${warnings} warnings)` : ''}`
    : `check-marketplace: ${errors} errors`,
)
process.exit(errors === 0 ? 0 : 1)
