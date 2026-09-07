# API specification

JSON requests and responses under /api. Session cookie required except health, login, public schemes/partners. Validation failures return 400; unauthenticated 401; unauthorized 403; missing 404; conflict 409.

POST /auth/login; POST /auth/logout; GET /auth/me
GET/PUT /profile; POST /matches; GET /schemes; GET /schemes/:id
PUT /saved/:id; PUT /documents; POST /uploads
GET /partners; POST /emi
GET/POST /applications; GET /applications/:id; PATCH /applications/:id/status
GET /admin/overview; POST/PATCH /admin/schemes[/:id]
POST /admin/schemes/:id/versions; POST /admin/versions/:id/approve
GET /admin/audit; GET /admin/users; GET /admin/partners

Citizens can access only their records. Partners access assigned applications and may move created→under review→documents required/approved/rejected, with documents-required→under-review resumption. Admins manage schemes and rule approval. Client-supplied loan estimates and eligibility are never authoritative.
