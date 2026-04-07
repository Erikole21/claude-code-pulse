## ADDED Requirements

### Requirement: ETag-based conditional fetching
The fetcher SHALL store ETags in `.pulse-meta.json` and send `If-None-Match` headers on subsequent requests. When the server responds with HTTP 304, the fetcher SHALL return `{ changed: false, content: '' }` without re-downloading.

#### Scenario: First fetch stores ETag
- **WHEN** a URL is fetched for the first time and the response includes an ETag header
- **THEN** the ETag is stored in meta.etags[url] and `changed` is `true`

#### Scenario: Unchanged content returns 304
- **WHEN** a URL is fetched with a stored ETag and the server responds 304
- **THEN** `changed` is `false` and `content` is empty string

#### Scenario: Changed content updates ETag
- **WHEN** a URL is fetched with a stored ETag and the server responds 200 with a new ETag
- **THEN** `changed` is `true`, `content` contains the new document, and the ETag is updated

### Requirement: Retry with exponential backoff
The fetcher SHALL retry failed requests up to 2 times with exponential backoff. Each request SHALL have a 10-second timeout.

#### Scenario: Transient failure recovered
- **WHEN** the first request fails with a network error and the second succeeds
- **THEN** the fetcher returns the successful result without error

#### Scenario: All retries exhausted
- **WHEN** all 3 attempts (1 initial + 2 retries) fail
- **THEN** the fetcher throws an error with the last failure reason

### Requirement: Concurrency limiting
The fetcher SHALL process at most 4 simultaneous HTTP requests when fetching multiple URLs.

#### Scenario: Batch fetch respects limit
- **WHEN** 10 URLs are fetched simultaneously
- **THEN** at most 4 HTTP connections are open at any time

### Requirement: FetchResult interface
Each fetch SHALL return a `FetchResult` with fields: `url` (string), `content` (string), `changed` (boolean), `etag` (string | undefined), `fetchedAt` (ISO string).

#### Scenario: Complete result structure
- **WHEN** a URL is successfully fetched
- **THEN** all FetchResult fields are populated with `fetchedAt` as a valid ISO 8601 timestamp
