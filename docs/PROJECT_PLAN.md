# YojanaSetu AI — project plan

Team QBit · SIH26092 · Smart India Hackathon 2026

## Specification extraction

All six pages of the supplied presentation were read and rendered. It proposes a free beneficiary-facing platform for marginalized entrepreneurs seeking concessional credit. Users: citizens, banks/SCAs/NBFCs/CSCs, and scheme administrators. Flow: profile → deterministic qualification → financing/affordability ranking → EMI/readiness → nearest eligible channel partner → application handoff and status tracking. The architecture separates portal, authenticated validation gateway, intelligence services and scheme/user/application/partner databases. Visual stack references include Next.js, React, Tailwind, Node and MongoDB; the detailed user brief adds Express, TypeScript and Zod.

Feasibility: a curated set of 3–5 schemes, deterministic engines, multilingual explanations, maps and administrative tools. Challenges: changing rules, misleading recommendations, stale partners, form abandonment and sensitive information. Mitigations: immutable approved versions, explicit explanations, freshness flags, simple mode, consent, minimal collection and protected sessions. Impact statements are conceptual: awareness, inclusion, self-employment, reduced middlemen and application preparation time. No invented impact statistics.

The presentation describes OCR, partner operations and analytics as future plans; the user explicitly requests partner/admin operations now. User instructions take priority. No official rates or complete rule datasets are supplied: seed data must be labelled Demo Dataset, never verified government terms.

## Delivery order

1. Design system, monorepo and landing.
2. MongoDB persistence, secure sessions and demo accounts.
3. Profile wizard, versioned eligibility, ranking and explanation.
4. Calculator, comparison, checklist and map.
5. Application creation, shared tracking and partner operations.
6. Admin catalogue, rule review and audit analytics.
7. English/Hindi, simple mode and progressive voice/upload support.
8. Domain and integration tests, lint, typecheck, build and desktop/mobile QA.

## Acceptance

Golden persona Ananya (Delhi, SC, annual family income 300000, project 500000, requested credit 450000) must get eligible alternatives and a meaningful rejection. Citizen creates one database application; assigned partner updates it; citizen and admin see that same event. All significant controls perform real actions. Public submission is a local demonstration handoff, not a government submission.
