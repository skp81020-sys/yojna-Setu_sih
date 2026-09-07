# Database schema

- users: unique email, passwordHash, name, role, optional partnerId.
- sessions: unique tokenHash, userId, expiresAt (TTL).
- profiles: unique userId, consent, personal/need/finance/business/location fields, checklist and saved scheme IDs.
- schemes: stable slug, bilingual title, provider, enabled, activeVersion.
- schemeversions: schemeId+version unique, DRAFT/ACTIVE/ARCHIVED, rules, financial terms, required documents, source, dataset label, reviewedAt.
- evaluations: userId, profile snapshot, results, version references, createdAt.
- partners: name/type/address/coordinates, supported schemes/states, lastVerified and demo label.
- applications: unique reference, citizenId, partnerId, schemeId, version, profile snapshot, status, document requests and embedded append-only history.
- uploadeddocuments: owner, random storage name, original name, MIME, size, confirmed fields; files outside public web root.
- auditlogs: actor, action, entity, timestamp, bounded change details.

Rules, checklist and status history are embedded where owned, avoiding redundant collections. MongoDB indexes enforce identity and version uniqueness. All application reads apply role and ownership filters.
