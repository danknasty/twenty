# 14 — Security Audit Checklist

## Purpose

Verification checklist derived from `06-security-privacy-threat-model.md`. Each abuse-case mitigation must be confirmed before production go-live.

## Asset Protection Verification

| Asset | Control | Verified |
|---|---|---|
| Candidate-confidential candidacy data | Field-level permissions, RLS, consent gates | [ ] |
| Client-confidential assignment data | Tenant + client-scoped RLS, client collaboration boundary | [ ] |
| Off-limits and conflict data | Guard enforcement, audit, permission-safe explanations | [ ] |
| Restricted references and diligence | Restricted permissions, consent/legal-basis tracking | [ ] |
| Compensation data | Field-level read permissions, non-selection | [ ] |
| Voluntary demographics/medical/accommodations | Absolute isolation from evaluators, compliance-only access | [ ] |
| Commercial/subscription data | ORM field-permission exclusion, automated leakage tests | [ ] |
| Authentication secrets | Never replicated; absolute no-sync | [ ] |
| Internal AI evidence and prompts | Redaction, context allowlists, guardrails, human review | [ ] |
| Research provenance and market maps | Assignment-confidential, client-scoped | [ ] |

## Abuse Case Mitigation Verification

| # | Threat | Mitigation | Test Method | Verified |
|---|---|---|---|---|
| 1 | Cross-workspace data leakage | Tenant isolation suite; workspace-scoped queries | Integration test: attempt cross-workspace query | [ ] |
| 2 | Cross-client data leakage | Client-scoped RLS; client isolation suite | Integration test: client A sees client B records | [ ] |
| 3 | Client enumerating unshared candidates | Client cannot search executive database | Manual: client portal login + attempt search | [ ] |
| 4 | Directus webhook forgery | HMAC signature verification; nonce; replay dedup | Unit test: invalid signature rejected | [ ] |
| 5 | Replay attacks | Idempotency keys, event dedup, bounded replay window | Integration test: duplicate event idempotent | [ ] |
| 6 | Secret leakage in logs | Redaction manifest; secrets never logged | Code audit: grep for secret patterns in log calls | [ ] |
| 7 | IDOR through external IDs | externalEntityLink workspace-scoped | Integration test: foreign workspace external ID | [ ] |
| 8 | File URL leakage | Secure file references; no raw storage paths | Code audit: file URL generation | [ ] |
| 9 | Stored XSS in bios/resumes/reports | Output encoding; input sanitization | Manual: inject XSS payload in rich text fields | [ ] |
| 10 | SSRF through external research URLs | URL allowlisting; outbound network policy | Code audit: URL fetch call sites | [ ] |
| 11 | CSV formula injection | Formula-safe CSV generation | Unit test: CSV output has formula prefix escaping | [ ] |
| 12 | Prompt injection through resumes/bios/notes | Input isolation; AI guardrails; human review | Manual: inject prompt in candidate bio, check AI output | [ ] |
| 13 | AI tool permission bypass | Role-scoped tools; capability flags; kill switches | Integration test: restricted role attempts AI tool | [ ] |
| 14 | Off-limits guard bypass | Guard mandatory; override requires elevated permission + audit | Integration test: attempt outreach on off-limits candidate | [ ] |
| 15 | Field-permission bypass | ORM-enforced field-read; SELECT * blocked with restrictions | Unit test: restricted field not in query result | [ ] |
| 16 | Candidate identity disclosure leak | Disclosure consent gate; masked presentations | Manual: verify masked presentation before consent | [ ] |
| 17 | Commercial/protected field leakage | Automated firewall tests; context allowlists; search-index exclusion | Integration test: search index excludes firewall fields | [ ] |
| 18 | Log/cache key leakage | Structured logging with correlation; cache keys workspace-scoped | Code audit: cache key construction | [ ] |

## Permission Set Verification

| Persona | Scope | Data Restrictions | Verified |
|---|---|---|---|
| Managing partner | Firm-wide | No medical/demographic without separate grant | [ ] |
| Search partner | Assignment-scoped | Cannot override firm off-limits without waiver | [ ] |
| Researcher/sourcer | Research fields only | No compensation, confidential references, commercial terms | [ ] |
| Client committee member | Assignment-specific, shared only | No database browse | [ ] |
| Executive candidate | Portal only (Directus) | Not a Twenty workspace member | [ ] |
| External affiliate | Time-bound, assigned projects | No broad export | [ ] |

## AI Security Verification

From `08-ai-governance.md`:

| Check | Verified |
|---|---|
| AI model registry canonical — no conflicting versions | [ ] |
| Prompt templates versioned and audited | [ ] |
| AI outputs require human approval before client-facing | [ ] |
| Candidate consent verified before AI evaluation | [ ] |
| AI tools role-scoped with capability flags | [ ] |
| Kill switches active and tested | [ ] |
| Prompt injection guardrails active | [ ] |
| AI evidence and prompts redacted in logs | [ ] |

## Privacy Controls Verification

| Control | Verified |
|---|---|
| Candidate consent states tracked per candidacy and per presentation | [ ] |
| Do-not-contact flags enforced | [ ] |
| Retention/legal-hold propagation across Directus and Twenty | [ ] |
| Privacy deletion reconciles across both systems | [ ] |
| Medical/accommodation data isolated from evaluators | [ ] |
| Voluntary demographics never enter individual search, AI, or client contexts | [ ] |

## Automated Verification Script

```bash
# Run the security audit test suite (Planned — not yet implemented)
# npx nx test:security-audit twenty-server

# Check for secret patterns in logs
grep -r "secret\|password\|token\|key" packages/twenty-server/src --include="*.ts" \
  | grep -v "test\|spec\|mock\|fixture" \
  | grep "console.log\|logger.log\|logger.info"

# Verify feature flags all default-off (Planned — not yet implemented)
# npx nx test:feature-flags twenty-server
```
