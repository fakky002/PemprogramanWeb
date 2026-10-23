<?php
/**
 * config.php — Koneksi database MySQLi
 * Digunakan oleh semua halaman CRUD mahasiswa.
 */

declare(strict_types=1);

// Konfigurasi database — sesuaikan dengan environment Anda
define('DB_HOST', 'localhost');
define('DB_USER', 'mahasiswa_app');
define('DB_PASS', 'password123');
define('DB_NAME', 'db_mahasiswa');
define('DB_CHARSET', 'utf8mb4');

/**
 * Buat dan kembalikan koneksi MySQLi.
 *
 * @return mysqli
 * @throws Exception jika koneksi gagal
 */
function getDb(): mysqli
{
    static $db = null;

    if ($db === null) {
        $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($db->connect_error) {
            throw new Exception('Koneksi database gagal: ' . $db->connect_error);
        }
        $db->set_charset(DB_CHARSET);
    }

    return $db;
}

/**
 * Jalankan query dengan prepared statement.
 *
 * @param string $sql    Query SQL dengan tanda tanya (?) sebagai placeholder
 * @param array  $params Nilai parameter yang di-bind
 * @param string $types  Tipe parameter (misal "ssi", "s", dsb.)
 * @return mysqli_result|bool
 * @throws Exception jika query gagal
 */
function query(string $sql, array $params = [], string $types = '')
{
    $db = getDb();
    $stmt = $db->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Prepare gagal: ' . $db->error);
    }

    if ($params !== []) {
        if ($types === '') {
            $types = str_repeat('s', count($params));
        }
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    return $result;
}

/**
 * Ambil satu baris hasil query (array asosiatif).
 */
function fetchOne(string $sql, array $params = [], string $types = ''): ?array
{
    $result = query($sql, $params, $types);
    return $result ? $result->fetch_assoc() : null;
}

/**
 * Ambil semua baris hasil query.
 */
function fetchAll(string $sql, array $params = [], string $types = ''): array
{
    $result = query($sql, $params, $types);
    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    return $rows;
}

/**
 * Jalankan query INSERT / UPDATE / DELETE dan kembalikan jumlah baris terpengaruh.
 */
function execute(string $sql, array $params = [], string $types = ''): int
{
    $db = getDb();
    $stmt = $db->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Prepare gagal: ' . $db->error);
    }

    if ($params !== []) {
        if ($types === '') {
            $types = str_repeat('s', count($params));
        }
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();

    return $affected;
}

/**
 * Sanitasi output untuk mencegah XSS.
 */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}
