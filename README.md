# Bunpou Jawir: ～のでした

Presentasi interaktif 5 slide bertema **manga & anime (tanpa karakter)** untuk **Faiz Syihab · NIM 125241046 · Kelas A**, membahas pola tata bahasa Jepang **～のでした** secara fokus dan ringkas.

## Cara Membuka

Buka `index.html` langsung di Chrome, Edge, atau Firefox, atau jalankan server lokal dari folder ini:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Lalu buka `http://127.0.0.1:4173`.

## Struktur 5 Slide

1. **Pembuka:** Judul pola `～のでした`, visual panel manga *koma* pemandangan *fumikiri* tanpa karakter, stempel `文`, dan identitas presenter.
2. **Makna:** Dua fungsi utama (`気づき・納得` dan `背景説明・結び`) dengan balon dialog *fukidashi* dan penanda penggunaan.
3. **Rumus (`かたち`):** Aturan pembentukan kalimat **Positif** lebih dulu pada tiap panel (`V & Adj-い` dan `N & Adj-な`) beserta tombol balik **Negatif** beranimasi *flip* 3D untuk membandingkan bentuk negatifnya, lengkap dengan pengalih kala (`Kini / Fakta` ↔ `Lampau`).
4. **Contoh:** Enam contoh kalimat kontekstual berukuran besar lengkap dengan furigana (dapat diaktifkan/nonaktifkan) dan terjemahan bahasa Indonesia.
5. **Penutup:** Kartu akhir episode bertanda stempel **`完`** dan tombol kembali ke awal.

## Kontrol

- Saat dibuka di browser desktop, dek langsung mengisi area jendela browser dan otomatis masuk mode layar penuh (*fullscreen*) pada klik atau tombol ketuk pertama.
- `←` / `→`, `PageUp` / `PageDown`, `Space` / `Shift+Space`: berpindah slide.
- `Home` / `End`: langsung ke slide pertama atau terakhir.
- `F`: masuk atau keluar mode layar penuh kapan saja.
- Tombol `ふりがな` di header: menyembunyikan atau menampilkan furigana pada kalimat contoh.
- Ponsel: tombol pilih slide, tombol panah, atau geser horizontal.

## GitHub Pages

Repository: [Fzz90/bunpou-nodeshita](https://github.com/Fzz90/bunpou-nodeshita)

Situs: [fzz90.github.io/bunpou-nodeshita](https://fzz90.github.io/bunpou-nodeshita/)

Situs berupa HTML/CSS/JavaScript statis dari root branch `main` melalui `.github/workflows/pages.yml`.

## Ekspor PDF

CSS cetak disiapkan untuk 5 halaman 16:9 (`320 × 180 mm`). Gunakan Print browser → Save as PDF dengan *Background graphics* aktif dan tanpa header/footer browser.
