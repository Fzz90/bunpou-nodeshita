# Bunpou Jawir: ～のでした

Presentasi interaktif 7 slide bertema **manga & anime (tanpa karakter)** untuk **Faiz Syihab · NIM 125241046 · Kelas A**, membahas pola tata bahasa Jepang **～のでした**, perbandingan dengan bunpou yang mirip, dan cara membedakannya (tanpa slide latihan soal).

## Cara Membuka

Buka `index.html` langsung di Chrome, Edge, atau Firefox, atau jalankan server lokal dari folder ini:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Lalu buka `http://127.0.0.1:4173`.

## Struktur 7 Slide

1. **Pembuka:** Judul pola `～のでした`, visual panel manga *koma* pemandangan *fumikiri* tanpa karakter, stempel `文`, dan identitas presenter.
2. **Makna:** Dua fungsi utama (`気づき・納得` dan `背景説明・結び`) dengan balon dialog *fukidashi* dan penanda penggunaan.
3. **Rumus (`かたち`):** Aturan pembentukan kata kerja, kata sifat `い`, kata sifat `な`, dan kata benda dengan pengalih kala (`Kini / Fakta` ↔ `Lampau`).
4. **Contoh:** Enam contoh kalimat kontekstual lengkap dengan furigana (dapat diaktifkan/nonaktifkan) dan terjemahan bahasa Indonesia.
5. **Bunpou Mirip:** Perbandingan 4 panel gaya *yonkoma* antara `～のでした`, `～のです / ～んです`, `～からだった`, dan `～わけだった`.
6. **Cara Membedakan:** Panduan 3 pertanyaan penentu dan *Storyboard Cut Simulator* interaktif untuk melihat perubahan nuansa tiap pola secara langsung.
7. **Penutup:** Kartu akhir episode bertanda stempel **`完`** dan tombol kembali ke awal.

## Kontrol

- `←` / `→`, `PageUp` / `PageDown`, `Space` / `Shift+Space`: berpindah slide.
- `Home` / `End`: langsung ke slide pertama atau terakhir.
- `F`: masuk atau keluar mode layar penuh.
- Tombol `ふりがな` di header: menyembunyikan atau menampilkan furigana pada kalimat contoh dan simulator.
- Ponsel: tombol pilih slide, tombol panah, atau geser horizontal.

## GitHub Pages

Repository: [Fzz90/bunpou-nodeshita](https://github.com/Fzz90/bunpou-nodeshita)

Situs: [fzz90.github.io/bunpou-nodeshita](https://fzz90.github.io/bunpou-nodeshita/)

Situs berupa HTML/CSS/JavaScript statis dari root branch `main` melalui `.github/workflows/pages.yml`.

## Ekspor PDF

CSS cetak disiapkan untuk 7 halaman 16:9 (`320 × 180 mm`). Gunakan Print browser → Save as PDF dengan *Background graphics* aktif dan tanpa header/footer browser.
