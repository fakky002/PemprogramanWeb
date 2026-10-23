<?php
/**
 * index.php — Halaman utama: Read (tampilkan data) + pencarian + pagination.
 * Semua output di-escape dengan htmlspecialchars melalui fungsi e() untuk mencegah XSS.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$flash = '';
$flashType = '';

// Tangkap notifikasi flash dari aksi create/edit/delete
if (isset($_GET['msg'])) {
    $msg = (string) $_GET['msg'];
    switch ($msg) {
        case 'created':
            $flash = 'Data mahasiswa berhasil ditambahkan.';
            $flashType = 'success';
            break;
        case 'updated':
            $flash = 'Data mahasiswa berhasil diperbarui.';
            $flashType = 'success';
            break;
        case 'deleted':
            $flash = 'Data mahasiswa berhasil dihapus.';
            $flashType = 'success';
            break;
        case 'error':
            $flash = 'Terjadi kesalahan. Silakan coba lagi.';
            $flashType = 'error';
            break;
    }
}

// --- Konfigurasi pagination ---
$limit = 5; // data per halaman
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int) $_GET['page'] : 1;
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $limit;

// --- Pencarian ---
$search = isset($_GET['search']) ? trim((string) $_GET['search']) : '';
$searchLike = '%' . $search . '%';

if ($search !== '') {
    $sql = "SELECT SQL_CALC_FOUND_ROWS * FROM mahasiswa
            WHERE nim LIKE ? OR nama LIKE ? OR jurusan LIKE ? OR email LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?";
    $stmt = getDb()->prepare($sql);
    $stmt->bind_param('sssiii', $searchLike, $searchLike, $searchLike, $searchLike, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    $mahasiswa = [];
    while ($row = $result->fetch_assoc()) {
        $mahasiswa[] = $row;
    }
    $stmt->close();

    $countStmt = getDb()->prepare("SELECT FOUND_ROWS() AS total");
    $countStmt->execute();
    $totalRow = $countStmt->get_result()->fetch_assoc();
    $total = (int) $totalRow['total'];
    $countStmt->close();
} else {
    $sql = "SELECT * FROM mahasiswa
            ORDER BY id DESC
            LIMIT ? OFFSET ?";
    $stmt = getDb()->prepare($sql);
    $stmt->bind_param('ii', $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    $mahasiswa = [];
    while ($row = $result->fetch_assoc()) {
        $mahasiswa[] = $row;
    }
    $stmt->close();

    $countStmt = getDb()->prepare("SELECT COUNT(*) AS total FROM mahasiswa");
    $countStmt->execute();
    $totalRow = $countStmt->get_result()->fetch_assoc();
    $total = (int) $totalRow['total'];
    $countStmt->close();
}

$totalPages = (int) ceil($total / $limit);
if ($totalPages < 1) {
    $totalPages = 1;
}
if ($page > $totalPages) {
    $page = $totalPages;
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manajemen Data Mahasiswa</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header class="page-head">
      <h1>Data Mahasiswa</h1>
      <p>Sistem informasi akademik &mdash; CRUD dengan prepared statement, pencarian, pagination, dan upload foto.</p>
    </header>

    <?php if ($flash !== ''): ?>
      <div class="flash flash--<?php echo e($flashType); ?>">
        <?php echo e($flash); ?>
        <a href="index.php" class="btn btn-outline btn-sm">Tutup</a>
      </div>
    <?php endif; ?>

    <div class="card">
      <div class="card-header">
        <h2>Daftar Mahasiswa</h2>
        <div class="actions">
          <a href="create.php" class="btn btn-primary">+ Tambah Mahasiswa</a>
        </div>
      </div>
      <div class="card-body">
        <!-- Pencarian -->
        <div class="toolbar">
          <div class="search-box">
            <label class="sr-only" for="search">Cari mahasiswa</label>
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Cari NIM, nama, jurusan, atau email..."
              value="<?php echo e($search); ?>">
          </div>
        </div>

        <!-- Tabel data -->
        <div class="table-wrap">
          <?php if (count($mahasiswa) > 0): ?>
            <table>
              <thead>
                <tr>
                  <th style="width: 4rem;">Foto</th>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Jurusan</th>
                  <th>Email</th>
                  <th>Telepon</th>
                  <th style="width: 14rem;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach ($mahasiswa as $mhs): ?>
                  <tr>
                    <td class="photo-cell">
                      <?php
                      $foto = !empty($mhs['foto']) && file_exists(__DIR__ . '/uploads/' . $mhs['foto'])
                        ? 'uploads/' . e($mhs['foto'])
                        : null;
                      ?>
                      <?php if ($foto): ?>
                        <img src="<?php echo e($foto); ?>" alt="Foto <?php echo e($mhs['nama']); ?>">
                      <?php else: ?>
                        <span class="no-photo">-</span>
                      <?php endif; ?>
                    </td>
                    <td><?php echo e($mhs['nim']); ?></td>
                    <td><?php echo e($mhs['nama']); ?></td>
                    <td><span class="badge badge--info"><?php echo e($mhs['jurusan']); ?></span></td>
                    <td><?php echo e($mhs['email']); ?></td>
                    <td><?php echo e($mhs['telepon']); ?></td>
                    <td>
                      <div class="actions" style="gap: 0.4rem;">
                        <a href="edit.php?id=<?php echo (int) $mhs['id']; ?>" class="btn btn-outline btn-sm">Ubah</a>
                        <a href="delete.php?id=<?php echo (int) $mhs['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin menghapus data <?php echo e($mhs['nama']); ?>?')">Hapus</a>
                      </div>
                    </td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          <?php else: ?>
            <div class="empty-state">
              <p>Tidak ada data mahasiswa<?php echo $search !== '' ? ' yang cocok dengan pencarian' : ''; ?>.</p>
              <?php if ($search !== ''): ?>
                <p><a href="index.php" class="btn btn-outline btn-sm">Reset pencarian</a></p>
              <?php else: ?>
                <p><a href="create.php" class="btn btn-primary btn-sm">Tambah data pertama</a></p>
              <?php endif; ?>
            </div>
          <?php endif; ?>
        </div>

        <!-- Pagination -->
        <?php if ($totalPages > 1): ?>
          <div class="toolbar">
            <div class="pagination">
              <?php
              // Link halaman sebelumnya
              if ($page > 1) {
                  $prev = $page - 1;
                  $query = http_build_query(array_merge($_GET, ['page' => $prev]));
                  echo '<a href="index.php?' . $query . '">&laquo; Sebelumnya</a>';
              } else {
                  echo '<span class="disabled">&laquo; Sebelumnya</span>';
              }

              // Halaman-halaman (tampilkan sekitar halaman aktif)
              $start = max(1, $page - 2);
              $end = min($totalPages, $page + 2);

              if ($start > 1) {
                  $query = http_build_query(array_merge($_GET, ['page' => 1]));
                  echo '<a href="index.php?' . $query . '">1</a>';
                  echo '<span class="disabled">...</span>';
              }

              for ($i = $start; $i <= $end; $i++) {
                  $query = http_build_query(array_merge($_GET, ['page' => $i]));
                  if ($i === $page) {
                      echo '<span class="active">' . $i . '</span>';
                  } else {
                      echo '<a href="index.php?' . $query . '">' . $i . '</a>';
                  }
              }

              if ($end < $totalPages) {
                  echo '<span class="disabled">...</span>';
                  $query = http_build_query(array_merge($_GET, ['page' => $totalPages]));
                  echo '<a href="index.php?' . $query . '">' . $totalPages . '</a>';
              }

              // Link halaman berikutnya
              if ($page < $totalPages) {
                  $next = $page + 1;
                  $query = http_build_query(array_merge($_GET, ['page' => $next]));
                  echo '<a href="index.php?' . $query . '">Selanjutnya &raquo;</a>';
              } else {
                  echo '<span class="disabled">Selanjutnya &raquo;</span>';
              }
              ?>
            </div>
            <div style="margin-left: auto; font-size: 0.875rem; color: #6b7280;">
              Halaman <strong><?php echo e($page); ?></strong> dari <strong><?php echo e($totalPages); ?></strong>
              (<?php echo e($total); ?> data)
            </div>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</body>
</html>
