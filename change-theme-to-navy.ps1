# Script untuk mengubah tema dari Emerald Green & Gold ke Navy Blue & Bronze
# Jalankan script ini di folder desain-pria

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mengubah Tema ke Navy Blue & Bronze  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$cssFile = "src/index.css"

# Cek apakah file ada
if (-not (Test-Path $cssFile)) {
    Write-Host "ERROR: File $cssFile tidak ditemukan!" -ForegroundColor Red
    Write-Host "Pastikan Anda menjalankan script ini di folder desain-pria" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "Membaca file $cssFile..." -ForegroundColor Yellow
$content = Get-Content $cssFile -Raw

Write-Host "Mengubah warna tema..." -ForegroundColor Yellow

# Ubah HSL colors di :root
$content = $content -replace '160 70% 25%', '215 45% 20%'
$content = $content -replace '160 60% 20%', '215 40% 18%'
$content = $content -replace '160 70% 15%', '215 45% 15%'
$content = $content -replace '170 60% 40%', '220 40% 30%'
$content = $content -replace '160 50% 30%', '215 35% 25%'
$content = $content -replace '160 65% 35%', '215 40% 30%'
$content = $content -replace '45 100% 55%', '30 60% 45%'
$content = $content -replace '45 90% 60%', '30 55% 50%'
$content = $content -replace '48 100% 65%', '35 65% 55%'
$content = $content -replace '42 95% 45%', '25 55% 35%'

# Ubah hex colors - Emerald to Navy
$content = $content -replace '#1a5f4f', '#1e3a5f'
$content = $content -replace '#164d3f', '#152a47'
$content = $content -replace '#1e6e5c', '#26456e'

# Ubah rgba colors - Emerald to Navy
$content = $content -replace 'rgba\(26, 95, 79', 'rgba(30, 58, 95'
$content = $content -replace 'rgba\(22, 77, 63', 'rgba(21, 42, 71'
$content = $content -replace 'rgba\(30, 110, 92', 'rgba(38, 69, 110'

# Ubah hex colors - Gold to Bronze
$content = $content -replace '#FFD700', '#CD7F32'
$content = $content -replace '#FFA500', '#B8733E'
$content = $content -replace '#FFED4E', '#D4A574'
$content = $content -replace 'rgb\(255, 215, 0\)', 'rgb(205, 127, 50)'

# Ubah rgba colors - Gold to Bronze
$content = $content -replace 'rgba\(255, 215, 0', 'rgba(205, 127, 50'
$content = $content -replace 'rgba\(212, 175, 55', 'rgba(205, 127, 50'

# Ubah nama variable CSS
$content = $content -replace '--minang-green:', '--navy-blue:'
$content = $content -replace '--minang-green-dark:', '--navy-blue-dark:'
$content = $content -replace '--minang-green-light:', '--navy-blue-light:'
$content = $content -replace '--minang-teal:', '--navy-teal:'
$content = $content -replace '--gold:', '--bronze:'
$content = $content -replace '--gold-light:', '--bronze-light:'
$content = $content -replace '--gold-dark:', '--bronze-dark:'

# Ubah komentar
$content = $content -replace 'Minangkabau Theme - Emerald Green & Gold', 'Minangkabau Theme - Navy Blue & Bronze (Masculine)'
$content = $content -replace 'Custom tokens - Minangkabau Emerald Green & Gold', 'Custom tokens - Navy Blue & Bronze'
$content = $content -replace 'Emerald Green & Gold', 'Navy Blue & Bronze'

Write-Host "Menyimpan perubahan..." -ForegroundColor Yellow
Set-Content $cssFile -Value $content -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ BERHASIL!                          " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tema telah diubah ke Navy Blue & Bronze" -ForegroundColor Green
Write-Host "File: $cssFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Jalankan: npm run dev" -ForegroundColor White
Write-Host "2. Buka browser untuk melihat perubahan" -ForegroundColor White
Write-Host ""

pause
