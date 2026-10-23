<?php
/**
 * create.php — Halaman Create (tambah data mahasiswa) dengan validasi dan upload foto.
 * Menggunakan prepared statement dan htmlspecialchars untuk keamanan.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$errors = [];
$old = [
    'nim'     => '',
    'nama'    => '',
    'jurusan' => '',
    'email'   => '',
    'telepon' => '',
    'alamat'  => '',
];
$fotoError = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil dan sanitasi input (mentah untuk validasi, output di-escape nanti)
    $nim     = trim($_POST['nim'] ?? '');
    $nama    = trim($_POST['nama'] ?? '');
    $jurusan = trim($_POST['jurusan'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $telepon = trim($_POST['telepon'] ?? '');
    $alamat  = trim($_POST['alamat'] ?? '');

    $old = compact('nim', 'nama', 'jurusan', 'email', 'telepon', 'alamat');

    // ==================== VALIDASI INPUT ====================
    if ($nim === '') {
        $errors['nim'] = 'NIM wajib diisi.';
    } elseif (!preg_match('/^[A-Za-z0-9]+$/', $nim)) {
        $errors['nim'] = 'NIM hanya boleh huruf dan angka.';
    } elseif (strlen($nim) > 20) {
        $errors['nim'] = 'NIM maksimal 20 karakter.';
    } else {
        // Cek duplikasi NIM (prepared statement)
        $existing = fetchOne('SELECT id FROM mahasiswa WHERE nim = ?', [$nim], 's');
        if ($existing) {
            $errors['nim'] = 'NIM sudah terdaftar.';
        }
    }

    if ($nama === '') {
        $errors['nama'] = 'Nama wajib diisi.';
    } elseif (strlen($nama) > 100) {
        $errors['nama'] = 'Nama maksimal 100 karakter.';
    }

    if ($jurusan === '') {
        $errors['jurusan'] = 'Jurusan wajib diisi.';
    } elseif (strlen($jurusan) > 50) {
        $errors['jurusan'] = 'Jurusan maksimal 50 karakter.';
    }

    if ($email === '') {
        $errors['email'] = 'Email wajib diisi.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Format email tidak valid.';
    } elseif (strlen($email) > 100) {
        $errors['email'] = 'Email maksimal 100 karakter.';
    }

    if ($telepon === '') {
        $errors['telepon'] = 'Telepon wajib diisi.';
    } elseif (!preg_match('/^[\d\s\+-]+$/', $telepon)) {
        $errors['telepon'] = 'Format telepon tidak valid.';
    } elseif (strlen($telepon) > 20) {
        $errors['telepon'] = 'Telepon maksimal 20 karakter.';
    }

    if ($alamat === '') {
        $errors['alamat'] = 'Alamat wajib diisi.';
    }

    // ==================== UPLOAD FOTO (bonus) ====================
    $fotoFileName = null;
    $uploadDir = __DIR__ . '/uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES['foto']['tmp_name'];
        $fileName = $_FILES['foto']['name'];
        $fileSize = $_FILES['foto']['size'];
        $fileType = mime_content_type($fileTmp);

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 2 * 1024 * 1024; // 2 MB

        if (!in_array($fileType, $allowedTypes, true)) {
            $fotoError = 'Tipe file tidak diizinkan (JPG, PNG, GIF, WEBP).';
        } elseif ($fileSize > $maxSize) {
            $fotoError = 'Ukuran file maksimal 2 MB.';
        } else {
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $fotoFileName = uniqid('mhs_', true) . '.' . $ext;
            $dest = $uploadDir . $fotoFileName;

            if (!move_uploaded_file($fileTmp, $dest)) {
                $fotoError = 'Gagal mengunggah foto.';
                $fotoFileName = null;
            }
        }
    } elseif (isset($_FILES['foto']) && $_FILES['foto']['error'] !== UPLOAD_ERR_NO_FILE) {
        $fotoError = 'Terjadi kesalahan saat mengunggah foto.';
    }

    // ==================== SIMPAN KE DATABASE ====================
    if (empty($errors) && $fotoError === '') {
        try {
            $sql = "INSERT INTO mahasiswa (nim, nama, jurusan, email, telepon, alamat, foto)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $types = 'sssssss';
            $params = [$nim, $nama, $jurusan, $email, $telepon, $alamat, $fotoFileName];

            execute($sql, $params, $types);

            header('Location: index.php?msg=created');
            exit;
        } catch (Exception $e) {
            $errors['__global'] = 'Gagal menyimpan data: ' . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tambah Mahasiswa</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header class="page-head">
      <h1>Tambah Mahasiswa</h1>
      <p>Isi formulir berikut untuk menambahkan data mahasiswa baru.</p>
    </header>

    <div class="card confirm">
      <div class="card-body">
        <?php if (!empty($errors['__global'])): ?>
          <div class="flash flash--error"><?php echo e($errors['__global']); ?></div>
        <?php endif; ?>

        <form action="create.php" method="POST" enctype="multipart/form-data" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="nim">NIM <span class="invalid" style="color:#dc2626;">*</span></label>
              <input
                type="text"
                id="nim"
                name="nim"
                class="form-control<?php echo isset($errors['nim']) ? ' is-invalid' : ''; ?>"
                value="<?php echo e($old['nim']); ?>"
                placeholder="Contoh: 2023001">
              <?php if (isset($errors['nim'])): ?>
                <p class="invalid"><?php echo e($errors['nim']); ?></p>
              <?php endif; ?>
            </div>

            <div class="form-group">
              <label for="nama">Nama Lengkap <span class="invalid" style="color:#dc2626;">*</span></label>
              <input
                type="text"
                id="nama"
                name="nama"
                class="form-control<?php echo isset($errors['nama']) ? ' is-invalid' : ''; ?>"
                value="<?php echo e($old['nama']); ?>"
                placeholder="Contoh: Andi Saputra">
              <?php if (isset($errors['nama'])): ?>
                <p class="invalid"><?php echo e($errors['nama']); ?></p>
              <?php endif; ?>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="jurusan">Jurusan <span class="invalid" style="color:#dc2626;">*</span></label>
              <input
                type="text"
                id="jurusan"
                name="jurusan"
                class="form-control<?php echo isset($errors['jurusan']) ? ' is-invalid' : ''; ?>"
                value="<?php echo e($old['jurusan']); ?>"
                placeholder="Contoh: Teknik Informatika">
              <?php if (isset($errors['jurusan'])): ?>
                <p class="invalid"><?php echo e($errors['jurusan']); ?></p>
              <?php endif; ?>
            </div>

            <div class="form-group">
              <label for="email">Email <span class="invalid" style="color:#dc2626;">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control<?php echo isset($errors['email']) ? ' is-invalid' : ''; ?>"
                value="<?php echo e($old['email']); ?>"
                placeholder="contoh@email.com">
              <?php if (isset($errors['email'])): ?>
                <p class="invalid"><?php echo e($errors['email']); ?></p>
              <?php endif; ?>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="telepon">Telepon <span class="invalid" style="color:#dc2626;">*</span></label>
              <input
                type="tel"
                id="telepon"
                name="telepon"
                class="form-control<?php echo isset($errors['telepon']) ? ' is-invalid' : ''; ?>"
                value="<?php echo e($old['telepon']); ?>"
                placeholder="Contoh: 08123456789">
              <?php if (isset($errors['telepon'])): ?>
                <p class="invalid"><?php echo e($errors['telepon']); ?></p>
              <?php endif; ?>
            </div>

            <div class="form-group">
              <label for="foto">Foto Profil (bonus)</label>
              <input type="file" id="foto" name="foto" class="form-control">
              <?php if ($fotoError !== ''): ?>
                <p class="invalid"><?php echo e($fotoError); ?></p>
              <?php else: ?>
                <p class="field-hint">Format: JPG, PNG, GIF, WEBP. Maksimal 2 MB.</p>
              <?php endif; ?>
            </div>
          </div>

          <div class="form-group">
            <label for="alamat">Alamat <span class="invalid" style="color:#dc2626;">*</span></label>
            <textarea
              id="alamat"
              name="alamat"
              class="form-control<?php echo isset($errors['alamat']) ? ' is-invalid' : ''; ?>"
              rows="4"
              placeholder="Contoh: Jl. Merdeka No. 1, Jakarta"><?php echo e($old['alamat']); ?></textarea>
            <?php if (isset($errors['alamat'])): ?>
              <p class="invalid"><?php echo e($errors['alamat']); ?></p>
            <?php endif; ?>
          </div>

          <div class="actions">
            <button type="submit" class="btn btn-primary">Simpan Data</button>
            <a href="index.php" class="btn btn-outline">Batal</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
