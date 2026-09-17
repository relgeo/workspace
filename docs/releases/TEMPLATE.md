# Release record — RelGeo <version>

**Status:** candidate / completed / partial / cancelled  
**Recorded at:** YYYY-MM-DD  
**Compatibility line:** `<line>`  
**Owner:** `<role or public handle>`  
**Publication mode:** manual / automated  
**Machine-readable snapshot:** `<version>.json`

## 1. Decision

- Contract change: none / patch-compatible / breaking.
- Rationale and compatibility impact: `<short explanation>`.
- Approval status: approved / rejected / deferred.
- Spec revision: `<commit>`.
- Reason and compatibility impact: `<short explanation>`.
- Release order: follow `docs/compatibility-matrix.json`.
- If partial: record `lastPublishedPackage`, `firstFailedPackage`, `forwardFixVersion`, `partialReleasePolicy`, and `noRepublishSameVersion: true` in the machine-readable record.

## 2. Package and consumer state

| Path | Name | Version | Status | Evidence |
| --- | --- | --- | --- | --- |
| `geometry` | `@relgeo/geometry` | `<version>` | pending/published | `<link or command>` |

Tambahkan seluruh package publik dan consumer yang terdampak. Status `pending` tidak boleh dianggap selesai.

## 3. Required evidence

- [ ] `pnpm run compatibility:check`
- [ ] `pnpm run integration:gate -- --local`
- [ ] `pnpm run release:audit`
- [ ] `npm pack --dry-run` boundary ditinjau
- [ ] publish result setiap package dicatat
- [ ] `pnpm run release:verify-published`
- [ ] `pnpm run integration:public`
- [ ] smoke website/Playground jika terdampak
- [ ] docs, baseline, tag, dan changelog diperbarui

## 4. Recovery decision

Jika ada partial release, jangan menghapus package atau memaksa overwrite versi npm. Hentikan urutan, simpan status aktual, perbaiki package, naikkan patch version, lalu ulangi verifier dan public integration.

Contoh recovery machine-readable:

~~~json
{
  "recovery": {
    "lastPublishedPackage": { "path": "core", "name": "@relgeo/core", "version": "0.5.1", "status": "published" },
    "firstFailedPackage": { "path": "language-service", "name": "@relgeo/language-service", "version": "0.5.1", "status": "failed" },
    "forwardFixVersion": "0.5.2",
    "partialReleasePolicy": "stop-and-record-then-forward-fix-next-patch",
    "noRepublishSameVersion": true
  }
}
~~~

## 5. Sign-off

- Decision: `<approved / rejected / deferred>`
- Evidence reviewed: `<summary>`
- Follow-up: `<none or link>`
