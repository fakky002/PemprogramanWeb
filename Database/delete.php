<?php
/**
 * delete.php — Halaman Delete (hapus data mahasiswa) dengan konfirmasi.
 * Menggunakan prepared statement dan htmlspecialchars untuk keamanan.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    header('Location: index.php?msg=error');
    exit;
}

// Ambil data yang akan dihapus (prepared statement)
$mhs = fetchOne('SELECT * FROM mahasiswa WHERE id = ?', [$id], 'i');
if (!$mhs) {
    header('Location: index.php?msg=error');
    exit;
}

// Proses hapus jika tombol konfirmasi ditekan
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm'])) {
    try {
        // Hapus foto fisik jika ada
        if (!empty($mhs['foto'])) {
            $fotoPath = __DIR__ . '/uploads/' . $mhs['foto'];
            if (file_exists($fotoPath)) {
                @unlink($fotoPath);
            }
        }

        $sql = 'DELETE FROM mahasiswa WHERE id = ?';
        execute($sql, [$id], 'i');

        header('Location: index.php?msg=deleted');
        exit;
    } catch (Exception $e) {
        header('Location: index.php?msg=error');
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hapus Mahasiswa</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header class="page-head">
      <h1>Hapus Data Mahasiswa</h1>
      <p>Konfirmasi penghapusan data berikut.</p>
    </header>

    <div class="card confirm">
      <div class="card-body">
        <div class="flash flash--error">
          Perhatian: Tindakan ini tidak dapat dibatalkan.
        </div>

        <div style="text-align: center; margin: 1.5rem 0;">
          <?php
          $foto = !empty($mhs['foto']) && file_exists(__DIR__ . '/uploads/' . $mhs['foto'])
            ? 'uploads/' . $mhs['foto']
            : null;
          ?>
          <?php if ($foto): ?>
            <img src="<?php echo e($foto); ?>" alt="Foto <?php echo e($mhs['nama']); ?>" style="width: 6rem; height: 6rem; object-fit: cover; border-radius: 0.5rem; border: 0.0625rem solid #d1d5db; margin-bottom: 0.75rem;">
          <?php else: ?>
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 6rem; height: 6rem; border-radius: 0.5rem; background: #e5e7eb; color: #9ca3af; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.75rem;">-</span>
          <?php endif; ?>
          <p style="font-size: 1.15rem; font-weight: 600;"><?php echo e($mhs['nama']); ?></p>
          <p style="color: #6b7280;">NIM: <?php echo e($mhs['nim']); ?> &bull; Jurusan: <?php echo e($mhs['jurusan']); ?></p>
        </div>

        <form action="delete.php?id=<?php echo $id; ?>" method="POST" onsubmit="return confirm('Yakin ingin menghapus data <?php echo e($mhs['nama']); ?>?')">
          <div class="confirm-actions">
            <button type="submit" name="confirm" value="1" class="btn btn-danger">Ya, Hapus Data</button>
            <a href="index.php" class="btn btn-outline">Batal</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
