<?php get_header(); ?>
<div data-page="seite" class="is-active">
  <section class="page-hero page-hero--plain"><div class="wrap"><div class="page-hero-copy">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Start</a><span>/</span><span><?php echo esc_html(wp_get_document_title()); ?></span></div>
    <h1><?php echo is_singular() ? esc_html(get_the_title()) : esc_html(get_the_archive_title() ?: 'Beiträge'); ?></h1>
  </div></div></section>
  <section class="section"><div class="wrap wp-prose">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <?php if (is_singular()) : the_content(); else : ?>
        <article><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>
      <?php endif; ?>
    <?php endwhile; else : ?>
      <p>Hier ist noch nichts zu sehen.</p>
    <?php endif; ?>
  </div></section>
</div>
<?php get_footer();
