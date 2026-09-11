# Workspace Scripts

Folder ini akan berisi script portable untuk bootstrap dan verification lintas-repo.

Script root harus:

1. menggunakan Git dan command repository umum;
2. tidak bergantung pada aplikasi operator tertentu;
3. aman dijalankan dari fresh clone;
4. menjelaskan dependency dan failure dengan jelas;
5. tidak membaca atau mempublikasikan isi `.local/` dan `private/`.

Script deployment detail menjadi ownership repository tujuan masing-masing.
