# Workspace Scripts

Folder ini akan berisi script portable untuk bootstrap dan verification lintas-repo.

Script root harus:

1. menggunakan Git dan command repository umum;
2. tidak bergantung pada aplikasi operator tertentu;
3. aman dijalankan dari fresh clone;
4. menjelaskan dependency dan failure dengan jelas;
5. tidak membaca atau mempublikasikan isi `.local/` dan `private/`.

Script deployment detail menjadi ownership repository tujuan masing-masing.

## Verifikasi baseline dan integration gate

Baseline submodule dan metadata package dapat diverifikasi dari root workspace dengan:

~~~text
node scripts/verify-baseline.mjs
node scripts/verify-baseline.mjs --strict
node scripts/verify-baseline.mjs --write --strict
node scripts/verify-baseline.mjs --strict --require-main
node scripts/test-baseline-failure.mjs
pnpm run integration:gate -- --local --report=.local/integration-local.json
pnpm run integration:public -- --report=.local/integration-public.json
~~~

Manifest snapshot publik berada di `docs/integration-baseline.json`. Verifier tidak membutuhkan GitHub API; ia membandingkan manifest dengan gitlink workspace, checkout submodule, working tree, dan `package.json` lokal. Opsi `--write` memperbarui snapshot dari checkout saat ini dan hanya boleh dipakai secara sengaja. Opsi `--manifest=PATH` dipakai oleh failure-injection untuk menguji snapshot sementara tanpa mengubah file publik. Opsi `--require-main` hanya untuk validasi lokal; CI submodule checkout biasanya detached.

Mode `--local` menggunakan root pnpm workspace dan workspace links. Mode `--public` menyalin setiap consumer ke direktori temporary tanpa sibling submodule, lalu meng-install dependency dari npm registry dan menjalankan package/consumer checks di sana. Mode public juga menjalankan `npm pack --dry-run` untuk package library.
