var gulp = require('gulp'),
	includer = require('gulp-htmlincluder'),
	sourcemap = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    //scss css
	sass = require('gulp-sass'),
    cssNano = require('gulp-cssnano'),
    //scss css
    //svg
    svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');
    //svg

 var using = 'html';

gulp.task('scriptsConcat', function() {
  return gulp.src('dev/js/includes/*.js')
    .pipe(concat('functions.js'))
    .pipe(gulp.dest('build/js/'));
    console.log('Script changed');
    
});

gulp.task('html', function(){
	gulp.src('dev/html/**/*.html')
		.pipe(includer())
		.pipe(gulp.dest('build/'))
        .pipe(reload({stream:true}));
    console.log('Html changed');
});

gulp.task('phpinc', function(){
	gulp.src('dev/php/**/*.php')
		.pipe(includer())
		.pipe(gulp.dest('build/'))
        .pipe(reload({stream:true}));
    console.log('PHP changed');
});

gulp.task('sass', function(){
	gulp.src('dev/sass/**/*.scss')
	.pipe(sourcemap.init())
	.pipe(sass())
    .pipe(cssNano())
	.pipe(sourcemap.write())
	.pipe(gulp.dest('build/css/'))
    .pipe(reload({stream:true}));
    console.log('Css changed');      
});

gulp.task('move', function(){
	gulp.src('dev/fonts/**/*.*').pipe(gulp.dest('build/fonts/')).pipe(reload({stream:true}));
	gulp.src('dev/js/*.js').pipe(gulp.dest('build/js/')).pipe(reload({stream:true}));
    gulp.src('dev/img/images/*.*').pipe(gulp.dest('build/img/images/')).pipe(reload({stream:true}));
	console.log('Moved'); 
});

gulp.task('svgSpriteBuild', function () {
	return gulp.src('dev/img/icons/svg/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest:'../../../../../dev/sass/my_style_components/_sprite.scss',
							template: "./dev/sass/my_style_components/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('build/img/icons/svg/'))
    .pipe(reload({stream:true}));
});


var paths = {
  move:['dev/fonts/**/*.*', 'dev/js/*.js', 'dev/img/images/*.*'],
};

gulp.task('watcher', function(){  
    gulp.watch( paths.move, ['move']);    
    gulp.watch('dev/sass/**/*.scss', ['sass']);
    gulp.watch('dev/img/icons/svg/*.svg', ['svgSpriteBuild']);
    gulp.watch('dev/html/**/*.html', ['html']);
    gulp.watch('dev/php/**/*.php', ['phpinc']);
    gulp.watch('dev/js/includes/*.js', ['scriptsConcat']); 
});
    


if (using == 'html'){
    gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./build/"
    },
    port: 8080, 
    open: true,
    notify: false
  });
});
    
    gulp.task('default', ['watcher', 'browserSync', 'scriptsConcat', 'html', 'sass', 'move', 'svgSpriteBuild' ]);  
    
} else if (using == 'php'){
    
  gulp.task('browserSync', function() {
  browserSync({
    proxy:'http://forstart/build/', 
    notify: false,  
  });
});

    gulp.task('default', ['watcher', 'browserSync', 'scriptsConcat', 'phpinc', 'sass', 'move', 'svgSpriteBuild' ]);  
    
};


