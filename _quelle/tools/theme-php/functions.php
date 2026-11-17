<?php
/**
 * BSV Niewerth – Theme-Funktionen
 * Seitentitel, Beschreibungen und strukturierte Daten kommen aus inc/routes.json.
 */
defined('ABSPATH') || exit;
define('BSV_VERSION', '{{VERSION}}');

function bsv_data() {
	static $d = null;
	if ($d === null) $d = json_decode(file_get_contents(__DIR__ . '/inc/routes.json'), true);
	return $d;
}
function bsv_route_key() {
	static $k = false;
	if ($k !== false) return $k;
	$k = null;
	if (is_front_page()) {
		$k = 'start';
	} elseif (is_page()) {
		$p = get_queried_object();
		$parent = $p->post_parent ? get_post_field('post_name', $p->post_parent) : '';
		$cand = $parent === 'ratgeber' ? 'ratgeber-' . $p->post_name : $p->post_name;
		if (isset(bsv_data()['routes'][$cand])) $k = $cand;
	}
	return $k;
}
function bsv_route() {
	$k = bsv_route_key();
	return $k ? bsv_data()['routes'][$k] : null;
}

add_action('after_setup_theme', function () {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('responsive-embeds');
	add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
});

/* Aufräumen im Kopfbereich */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'feed_links_extra', 3);
add_filter('comments_open', '__return_false');
add_filter('pings_open', '__return_false');

/* Seitentitel */
add_filter('pre_get_document_title', function ($t) {
	$r = bsv_route();
	return $r ? $r['title'] : $t;
});

/* Beschreibung, Social-Media-Vorschau, strukturierte Daten */
add_action('wp_head', function () {
	$r = bsv_route();
	$desc = $r ? $r['desc'] : (is_singular() ? wp_strip_all_tags(get_the_excerpt()) : get_bloginfo('description'));
	$title = $r ? $r['title'] : wp_get_document_title();
	$url = is_front_page() ? home_url('/') : (is_singular() ? get_permalink() : '');
	$img = get_template_directory_uri() . '/assets/og-image.jpg';
	if ($desc) echo '<meta name="description" content="' . esc_attr($desc) . "\">\n";
	echo '<meta property="og:type" content="website">' . "\n";
	echo '<meta property="og:locale" content="de_DE">' . "\n";
	echo '<meta property="og:site_name" content="BSV Niewerth">' . "\n";
	echo '<meta property="og:title" content="' . esc_attr($title) . "\">\n";
	if ($desc) echo '<meta property="og:description" content="' . esc_attr($desc) . "\">\n";
	if ($url) echo '<meta property="og:url" content="' . esc_url($url) . "\">\n";
	echo '<meta property="og:image" content="' . esc_url($img) . '"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">' . "\n";
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
	echo '<script type="application/ld+json">' . bsv_data()['ld'] . "</script>\n";
	if ($r && $r['ld'] && $r['ld'] !== '{}') echo '<script type="application/ld+json">' . $r['ld'] . "</script>\n";
	if (bsv_route_key() === 'start' && !empty(bsv_data()['hero'])) echo '<link rel="preload" as="image" href="' . esc_url(bsv_data()['hero']) . '" fetchpriority="high">' . "\n";
}, 1);

/* Gestaltung und Skript */
add_action('wp_enqueue_scripts', function () {
	$u = get_template_directory_uri() . '/assets/';
	wp_enqueue_style('bsv', $u . 'site.css', [], BSV_VERSION);
	wp_enqueue_script('bsv', $u . 'site.js', [], BSV_VERSION, true);
	$r = bsv_route();
	wp_add_inline_script('bsv', 'window.BSV=' . wp_json_encode([
		'route' => bsv_route_key() ?: 'seite',
		'nav' => $r ? $r['nav'] : '',
		'urls' => array_map('home_url', bsv_data()['urls']),
		'rest' => rest_url('bsv/v1/anfrage'),
	]) . ';', 'before');
	if ($r) {
		foreach (['wp-block-library', 'wp-block-library-theme', 'global-styles', 'classic-theme-styles'] as $h) wp_dequeue_style($h);
	}
}, 20);

/* Seiteninhalt ausgeben: eigene Seiten roh (HTML-Block), andere Seiten im normalen Layout */
function bsv_render_page() {
	$r = bsv_route();
	$post = get_post();
	if ($r && $post && strpos(ltrim($post->post_content), '<!-- wp:html -->') === 0) {
		$html = preg_replace(['/^\s*<!-- wp:html -->\s*/', '/\s*<!-- \/wp:html -->\s*$/'], '', $post->post_content);
		echo '<div data-page="' . esc_attr($r['page']) . '" class="is-active">' . $html . '</div>';
		return;
	}
	?>
	<div data-page="seite" class="is-active">
		<section class="page-hero page-hero--plain"><div class="wrap"><div class="page-hero-copy">
			<div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Start</a><span>/</span><span><?php the_title(); ?></span></div>
			<h1><?php the_title(); ?></h1>
		</div></div></section>
		<section class="section"><div class="wrap wp-prose"><?php the_content(); ?></div></section>
	</div>
	<?php
}

/* Kontaktband vor der Fußzeile (auf der Kontaktseite ausgeblendet) */
function bsv_kontaktband() {
	if (bsv_route_key() === 'kontakt') return null;
	$r = bsv_route();
	if ($r && !empty($r['kb'])) return $r['kb'];
	return ['h' => 'Klarheit beginnt mit einem Gespräch.', 'p' => 'Schildern Sie mir Ihr Anliegen. Ich freue mich auf Ihre Anfrage.', 'b' => 'Anfrage senden', 's' => 'info@bsv-niewerth.de', 'thema' => ''];
}

/* Kontaktformular: Anfrage per E-Mail an das Büro (mit Fotos als Anhang) */
add_action('rest_api_init', function () {
	register_rest_route('bsv/v1', '/anfrage', [
		'methods' => 'POST',
		'permission_callback' => '__return_true',
		'callback' => 'bsv_anfrage',
	]);
});
function bsv_anfrage(WP_REST_Request $req) {
	$p = $req->get_body_params();
	$ok = new WP_REST_Response(['ok' => true], 200);
	if (!empty($p['website'])) return $ok;                                   // Spam-Falle
	$ts = isset($p['ts']) ? (int) $p['ts'] : 0;
	if ($ts && time() - $ts < 3) return $ok;                                 // zu schnell ausgefüllt
	$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
	$key = 'bsv_rl_' . md5($ip);
	$n = (int) get_transient($key);
	if ($n >= 6) return new WP_Error('bsv_limit', 'Es wurden in kurzer Zeit zu viele Anfragen gesendet.', ['status' => 429]);

	$name = sanitize_text_field(isset($p['name']) ? $p['name'] : '');
	$email = sanitize_email(isset($p['email']) ? $p['email'] : '');
	$msg = sanitize_textarea_field(isset($p['nachricht']) ? $p['nachricht'] : '');
	$tel = sanitize_text_field(isset($p['telefon']) ? $p['telefon'] : '');
	$ort = sanitize_text_field(isset($p['ort']) ? $p['ort'] : '');
	$thema = sanitize_text_field(isset($p['thema']) ? $p['thema'] : 'Allgemein');
	if (!$name || !is_email($email) || !$msg) return new WP_Error('bsv_fields', 'Bitte füllen Sie Name, E-Mail und Nachricht aus.', ['status' => 400]);
	if (empty($p['einwilligung'])) return new WP_Error('bsv_consent', 'Bitte bestätigen Sie die Datenschutzerklärung.', ['status' => 400]);

	$att = [];
	$files = $req->get_file_params();
	if (!empty($files['fotos']['name']) && is_array($files['fotos']['name'])) {
		$total = 0;
		$tmpdir = trailingslashit(get_temp_dir());
		$types = ['jpg|jpeg|jpe' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp', 'heic' => 'image/heic', 'heif' => 'image/heif'];
		foreach ($files['fotos']['name'] as $i => $fn) {
			if ($files['fotos']['error'][$i] !== UPLOAD_ERR_OK || count($att) >= 10) continue;
			$size = (int) $files['fotos']['size'][$i];
			$total += $size;
			if ($size > 12 * MB_IN_BYTES || $total > 30 * MB_IN_BYTES) {
				foreach ($att as $f) @unlink($f);
				return new WP_Error('bsv_size', 'Die Fotos sind zusammen zu groß (höchstens 30 MB).', ['status' => 413]);
			}
			$chk = wp_check_filetype_and_ext($files['fotos']['tmp_name'][$i], $fn, $types);
			if (empty($chk['type'])) continue;
			$dest = $tmpdir . wp_unique_filename($tmpdir, sanitize_file_name($fn));
			if (move_uploaded_file($files['fotos']['tmp_name'][$i], $dest)) $att[] = $dest;
		}
	}

	$to = get_option('bsv_mail_to', 'info@bsv-niewerth.de');
	$subject = 'Website-Anfrage: ' . $thema . ' – ' . $name;
	$body = "Neue Anfrage über bsv-niewerth.de\n\n"
		. "Thema:    $thema\nName:     $name\nE-Mail:   $email\nTelefon:  " . ($tel ?: '–') . "\nObjekt:   " . ($ort ?: '–') . "\n"
		. 'Fotos:    ' . count($att) . "\n\nNachricht:\n$msg\n\n"
		. "Einwilligung Datenschutz: ja\nGesendet: " . wp_date('d.m.Y H:i') . " Uhr\n";
	$headers = ['Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . str_replace(['<', '>', '"', ',', "\n", "\r"], '', $name) . ' <' . $email . '>'];
	$sent = wp_mail($to, $subject, $body, $headers, $att);
	foreach ($att as $f) @unlink($f);
	set_transient($key, $n + 1, HOUR_IN_SECONDS);
	if (!$sent) return new WP_Error('bsv_mail', 'Die Anfrage konnte gerade nicht versendet werden.', ['status' => 500]);
	return $ok;
}
