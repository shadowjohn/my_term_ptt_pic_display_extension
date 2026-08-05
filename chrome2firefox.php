<?php
$srcDir = __DIR__ . '/my_term_ptt_pic_display_extension';
$destDir = __DIR__ . '/firefox_extension/my_term_ptt_pic_display_extension';

function deleteRecursive($path) {
    if (!file_exists($path)) return;
    if (!is_dir($path)) {
        unlink($path);
        return;
    }
    foreach (scandir($path) as $item) {
        if ($item === '.' || $item === '..') continue;
        deleteRecursive("$path/$item");
    }
    rmdir($path);
}

function copyRecursive($src, $dst) {
    if (is_dir($src)) {
        if (!file_exists($dst)) mkdir($dst, 0777, true);
        foreach (scandir($src) as $item) {
            if ($item === '.' || $item === '..') continue;
            copyRecursive("$src/$item", "$dst/$item");
        }
        return;
    }
    copy($src, $dst);
}

$requiredFiles = [
    'manifest.json',
    'content.js',
    'previewRace.js',
    'vendor/jquery-4.0.0.min.js'
];
foreach ($requiredFiles as $file) {
    if (!file_exists("$srcDir/$file")) exit("❌ 找不到 $file\n");
}

$manifest = json_decode(file_get_contents("$srcDir/manifest.json"), true);
if (!is_array($manifest)) exit("❌ manifest.json 格式錯誤\n");

$hostPermissions = $manifest['host_permissions'] ?? [];
$manifest['manifest_version'] = 2;
$manifest['permissions'] = array_values(array_unique(array_merge(
    array_filter($manifest['permissions'] ?? [], function($permission) {
        return $permission !== 'scripting';
    }),
    $hostPermissions
)));
$manifest['content_scripts'] = [[
    'matches' => $hostPermissions,
    'js' => ['vendor/jquery-4.0.0.min.js', 'content.js'],
    'run_at' => 'document_idle'
]];
$manifest['web_accessible_resources'] = ['assets/*'];
$manifest['content_security_policy'] = "script-src 'self'; object-src 'self'";
unset($manifest['action'], $manifest['background'], $manifest['host_permissions']);

// Firefox 目錄是產物，每次清空可避免舊檔混入套件。
deleteRecursive($destDir);
mkdir($destDir, 0777, true);
foreach (scandir($srcDir) as $file) {
    if (in_array($file, ['.', '..', 'manifest.json', 'background.js'], true)) continue;
    copyRecursive("$srcDir/$file", "$destDir/$file");
}
file_put_contents(
    "$destDir/manifest.json",
    json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n"
);

echo "✅ Firefox 相容版已輸出到：$destDir\n";
