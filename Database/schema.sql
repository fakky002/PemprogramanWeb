-- ============================================================================
-- Skema Database untuk Manajemen Data Mahasiswa
-- Teknologi: PHP Native + MySQL (MySQLi Prepared Statements)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS db_mahasiswa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_mahasiswa;

-- Tabel mahasiswa minimal 6 kolom + Primary Key
CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- PK
    nim VARCHAR(20) NOT NULL UNIQUE,                      -- Nomor Induk Mahasiswa
    nama VARCHAR(100) NOT NULL,                           -- Nama lengkap
    jurusan VARCHAR(50) NOT NULL,                         -- Jurusan / Prodi
    email VARCHAR(100) NOT NULL,                          -- Email
    telepon VARCHAR(20) NOT NULL,                         -- Nomor telepon
    alamat TEXT NOT NULL,                                 -- Alamat lengkap
    foto VARCHAR(255) DEFAULT NULL,                       -- Nama file foto (bonus)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Waktu pendaftaran
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data contoh untuk pengujian
INSERT INTO mahasiswa (nim, nama, jurusan, email, telepon, alamat) VALUES
('2023001', 'Andi Saputra', 'Teknik Informatika', 'andi@example.com', '08123456789', 'Jl. Merdeka No. 1, Jakarta'),
('2023002', 'Budi Wijaya', 'Sistem Informasi', 'budi@example.com', '08123456780', 'Jl. Sudirman No. 2, Bandung'),
('2023003', 'Citra Lestari', 'Teknik Informatika', 'citra@example.com', '08123456781', 'Jl. Thamrin No. 3, Surabaya'),
('2023004', 'Dedi Setiawan', 'Sistem Informasi', 'dedi@example.com', '08123456782', 'Jl. Gatot Subroto No. 4, Yogyakarta'),
('2023005', 'Eka Putri', 'Teknik Industri', 'eka@example.com', '08123456783', 'Jl. Diponegoro No. 5, Semarang'),
('2023006', 'Farhan Akbar', 'Teknik Informatika', 'farhan@example.com', '08123456784', 'Jl. Ahmad Yani No. 6, Medan'),
('2023007', 'Gina Melati', 'Sistem Informasi', 'gina@example.com', '08123456785', 'Jl. Hayam Wuruk No. 7, Denpasar'),
('2023008', 'Hendi Pratama', 'Teknik Industri', 'hendi@example.com', '08123456786', 'Jl. Letda Said No. 8, Makassar'),
('2023009', 'Indah Permata', 'Teknik Informatika', 'indah@example.com', '08123456787', 'Jl. Kartini No. 9, Palembang'),
('2023010', 'Joko Susilo', 'Sistem Informasi', 'joko@example.com', '08123456788', 'Jl. Ahmad Dahlan No. 10, Batam');

-- ============================================================================
-- Keterangan kolom:
-- 1. id            : Primary Key (Auto Increment)
-- 2. nim           : Nomor Induk Mahasiswa (unik)
-- 3. nama          : Nama lengkap mahasiswa
-- 4. jurusan       : Jurusan / Program Studi
-- 5. email         : Alamat email
-- 6. telepon       : Nomor telepon / HP
-- 7. alamat        : Alamat domisili
-- 8. foto          : Nama file foto yang diunggah (bonus fitur upload)
-- 9. created_at    : Waktu data ditambahkan
-- Total: 9 kolom (melebihi minimal 6 kolom + PK)
-- ============================================================================
