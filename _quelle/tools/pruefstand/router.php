<?php
/* Prüfstand: liefert das Theme mit nachgebildeten WordPress-Funktionen aus (nur zum Testen, kein WordPress). */
$THEME = getenv('BSV_THEME');
$PAGES = json_decode(file_get_contents(getenv('BSV_PAGES')), true);
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (strpos($uri, '/wp-content/themes/bsv-niewerth/') === 0) {
	$f = $THEME . substr($uri, strlen('/wp-content/themes/bsv-niewerth'));
	if (is_file($f)) {
		$types = ['css' => 'text/css', 'js' => 'text/javascript', 'webp' => 'image/webp', 'woff2' => 'font/woff2', 'png' => 'image/png', 'jpg' => 'image/jpeg'];
		header('Content-Type: ' . ($types[pathinfo($f, PATHINFO_EXTENSION)] ?? 'application/octet-stream'));
		readfile($f); return true;
	}
	http_response_code(404); return true;
}
if ($uri === '/wp-json/bsv/v1/anfrage') {
	header('Content-Type: application/json');
	file_put_contents(sys_get_temp_dir() . '/bsv-anfrage.json', json_encode(['post' => $_POST, 'files' => array_map(function ($f) { return $f['name']; }, $_FILES)]));
	echo '{"ok":true}'; return true;
}
$KEY = null; foreach ($PAGES as $k => $p) if ($p['url'] === $uri) $KEY = $k;

/* --- nachgebildete WordPress-Funktionen --- */
define('ABSPATH', '/'); define('MB_IN_BYTES', 1048576); define('HOUR_IN_SECONDS', 3600);
$H = [];
function add_action($h, $f, $p = 10) { global $H; $H[$h][$p][] = $f; }
function add_filter($h, $f, $p = 10) { add_action($h, $f, $p); }
function remove_action() {} function remove_filter() {}
function do_action($h) { global $H; if (empty($H[$h])) return; ksort($H[$h]); foreach ($H[$h] as $fs) foreach ($fs as $f) $f(); }
function apply_filters($h, $v) { global $H; if (empty($H[$h])) return $v; ksort($H[$h]); foreach ($H[$h] as $fs) foreach ($fs as $f) $v = $f($v); return $v; }
function add_theme_support() {} function register_rest_route() {}
function is_front_page() { global $KEY; return $KEY === 'start'; }
function is_page() { global $KEY; return $KEY !== null; }
function is_singular() { return is_page(); }
function get_queried_object() { global $KEY, $PAGES; $u = trim($PAGES[$KEY]['url'], '/'); $parts = explode('/', $u); return (object) ['post_name' => end($parts), 'post_parent' => count($parts) > 1 ? $parts[0] : 0]; }
function get_post_field($f, $id) { return $id; }
function get_post() { global $KEY, $PAGES; return (object) ['post_content' => $PAGES[$KEY]['content']]; }
function have_posts() { static $n = 0; return $n++ === 0; } function the_post() {}
function the_title() { echo 'Titel'; } function the_content() { echo ''; }
function language_attributes() { echo 'lang="de-DE"'; } function bloginfo($k) { echo 'UTF-8'; }
function get_bloginfo() { return 'Bau-Sachverständigenbüro'; }
function get_template_directory_uri() { return 'http://' . $_SERVER['HTTP_HOST'] . '/wp-content/themes/bsv-niewerth'; }
function home_url($p = '/') { return 'http://' . $_SERVER['HTTP_HOST'] . $p; }
function rest_url($p) { return home_url('/wp-json/' . $p); }
function get_permalink() { global $KEY, $PAGES; return home_url($PAGES[$KEY]['url']); }
function esc_attr($s) { return htmlspecialchars($s, ENT_QUOTES); } function esc_html($s) { return htmlspecialchars($s, ENT_QUOTES); } function esc_url($s) { return $s; }
function wp_strip_all_tags($s) { return strip_tags($s); } function get_the_excerpt() { return ''; }
function wp_json_encode($v) { return json_encode($v, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); }
function wp_get_document_title() { return apply_filters('pre_get_document_title', 'BSV Niewerth'); }
$ST = []; $SC = []; $INL = [];
function wp_enqueue_style($h, $u, $d = [], $v = '') { global $ST; $ST[$h] = $u . '?ver=' . $v; }
function wp_enqueue_script($h, $u, $d = [], $v = '', $f = false) { global $SC; $SC[$h] = $u . '?ver=' . $v; }
function wp_add_inline_script($h, $c) { global $INL; $INL[$h] = $c; } function wp_dequeue_style() {}
function wp_head() { global $ST; do_action('wp_enqueue_scripts'); echo '<title>' . esc_html(wp_get_document_title()) . "</title>\n"; do_action('wp_head'); foreach ($ST as $u) echo "<link rel='stylesheet' href='$u'>\n"; }
function wp_footer() { global $SC, $INL; foreach ($SC as $h => $u) { if (isset($INL[$h])) echo "<script>{$INL[$h]}</script>\n"; echo "<script src='$u'></script>\n"; } }
function body_class() { echo 'class="page"'; } function wp_body_open() {}
function get_header() { global $THEME; include $THEME . '/header.php'; }
function get_footer() { global $THEME; include $THEME . '/footer.php'; }
function get_option($k, $d = false) { return $d; } function update_option() {} function flush_rewrite_rules() {}

require $THEME . '/functions.php';
if ($KEY === null) { http_response_code(404); include $THEME . '/404.php'; return true; }
include $THEME . ($KEY === 'start' ? '/front-page.php' : '/page.php');
return true;
