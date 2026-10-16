# Portofolio — Terungku Fakky

Website portofolio pribadi, 6 halaman, **CSS murni tanpa framework**.

## Identitas

- **Nama:** Terungku Fakky
- **Domisili:** Banda Aceh, Aceh
- **Kampus:** Universitas Islam Negeri Ar-Raniry Banda Aceh
- **Jurusan:** S1 Teknologi Informasi · Semester 5
- **Sekolah asal:** SMK Dharma Bahari Surabaya · Teknik Komputer dan Jaringan (TKJ), 2021–2024
- **Sertifikasi:** Pelatihan Web Design dan Sertifikasi Junior Web Developer, 2025

## Struktur Folder

```
WebPhortofolio/
├── index.html          ← Beranda
├── tentang.html        ← Profil & perjalanan
├── keahlian.html       ← Keahlian & tools
├── proyek.html         ← Daftar proyek
├── pendidikan.html     ← Riwayat pendidikan
├── kontak.html         ← Kontak & form
├── css/                ← Satu CSS per halaman
│   ├── index.css
│   ├── tentang.css
│   ├── keahlian.css
│   ├── proyek.css
│   ├── pendidikan.css
│   └── kontak.css
├── img/                ← gambar SVG (avatar & thumbnail proyek)
│   ├── avatar.svg
│   ├── project-umkm.svg
│   ├── project-portofolio.svg
│   ├── project-landing.svg
│   ├── project-dashboard.svg
│   ├── project-katalog.svg
│   ├── project-sekolah.svg
│   └── project-todo.svg
└── screenshot/         ← bukti tampilan
```

Setiap halaman memakai satu file CSS sendiri di `css/` (termasuk Beranda),
tanpa `style.css` terpusat. Semua ukuran memakai unit relatif `rem`/`vw`/`vh`
(kecuali breakpoint media query dan trik pembaca layar yang memang ber-px).
Warna ditulis langsung tanpa variabel CSS. Semua ilustrasi (avatar & thumbnail
proyek) berupa file SVG lokal di `img/` dan dirujuk lewat tag `<img>`.

## Aturan yang Ditegakkan

| Aturan | Status |
|---|---|
| CSS eksternal, tanpa `style=""` / `<style>` | Sesuai |
| Tanpa framework (Bootstrap/Tailwind/dll) | Sesuai |
| Tanpa `@import`, tanpa JavaScript | Sesuai |
| Tanpa CDN / font eksternal | Sesuai |
| Gambar lokal di `img/` (tanpa aset eksternal) | Sesuai |
| Tag semantik (`header`/`nav`/`main`/`section`/`article`/`footer`) | Sesuai |
| Warna ditulis langsung (tanpa variabel CSS) | Sesuai |
| Breakpoint 3 ukuran | Sesuai |

## Fitur

- **Navigasi responsif.** Di HP & tablet (≤959px) menu jadi dropdown hamburger
  (checkbox + `<label>`, murni CSS tanpa JavaScript). Di desktop (≥960px) menu
  tampil inline. Header sticky di semua ukuran.
- **Tombol Menu** bisa dipakai keyboard (`Space` / `Enter`) dan punya
  focus outline 3px.
- **Layout Fleksibel.** Flexbox untuk header, tombol, footer, kartu, dan form;
  CSS Grid untuk timeline, hero, dan grid proyek `auto-fit` + `minmax()`.
- **Halaman.** Beranda, Tentang, Keahlian, Proyek, Pendidikan, Kontak — plus
  form kontak dan FAQ.
- **Aksesibilitas.** `prefers-reduced-motion` dihormati, ada menu cetak,
  `sr-only` untuk teks pembaca layar, fokus selalu terlihat.

## Breakpoint

| Kondisi | Lebar | Perilaku |
|---|---|---|
| HP | 320–639px | 1 kolom, menu dropdown, tombol memanjang |
| Tablet | 640–959px | 2 kolom, menu dropdown |
| Desktop | ≥960px | 3 kolom, menu inline, tombol Menu disembunyikan |
| Layar sangat kecil | ≤359px | Body & jarak dikecilkan agar tetap muat |

## Hasil Pengujian

Pengujian dijalankan otomatis dengan Chrome DevTools Protocol.

| Uji | Hasil |
|---|---|
| Responsif 6 halaman × 14 lebar (menu tutup & buka) | **84/84 lolos**, 0 gagal |
| Bandingkan computed style sebelum vs sesudah peringkasan | **8190 elemen, 0 berubah** |
| Urutan timeline kronologis (14 lebar × 2 halaman) | **28/28 lolos** |
| Tombol `Space` pada tombol Menu | Panel 0px → 350px, berhasil |
| Tombol `Enter` pada tombol Menu | Tidak berubah (wajar, toggle native = `Space`) |
| Horizontal scroll | Tidak ada di semua lebar |
| Kurung kurawal CSS seimbang | 6/6 file |

## Screenshot

| File | Ukuran |
|---|---|
| `screenshot/screenshot-mobile-375px.png` | Mobile |
| `screenshot/screenshot-desktop-1440px.png` | Desktop |
| `screenshot/screenshot-menu-mobile-375px.png` | Dropdown terbuka |
| `screenshot/page-pendidikan-mobile-375px.png` | Riwayat pendidikan |
| `screenshot/page-pendidikan-desktop-1440px.png` | Riwayat pendidikan |

## Data yang Masih Perlu Dilengkapi

- Email, LinkedIn, dan GitHub asli (`kontak.html`)
- Nama lembaga penyelenggara pelatihan/sertifikasi 2025 (`pendidikan.html`)
- Angka statistik di Beranda — masih "10+ Proyek Kuliah" dan "3 Proyek Mandiri" (`index.html`)
- Isi 6 kartu proyek (`proyek.html`)
- Status ketersediaan magang (`tentang.html`)