var gulp = require('gulp'),
	includer = require('gulp-htmlincluder'),
	sourcemap = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
//    connectPHP = require('gulp-connect-php'),
    reload = browserSync.reload;
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
	.pipe(sourcemap.write())
	.pipe(gulp.dest('build/css/'))
    .pipe(reload({stream:true}));
    console.log('Css changed');      
});

gulp.task('move', function(){
	gulp.src('dev/fonts/**/*.*').pipe(gulp.dest('build/fonts/')).pipe(reload({stream:true}));
	gulp.src('dev/js/*.js').pipe(gulp.dest('build/js/')).pipe(reload({stream:true}));
	gulp.src('dev/img/icons/*.*').pipe(gulp.dest('build/img/icons/')).pipe(reload({stream:true}));
    gulp.src('dev/img/img/*.*').pipe(gulp.dest('build/img/img/')).pipe(reload({stream:true}));
    gulp.src('dev/img/spriteIcons/*.*').pipe(gulp.dest('build/img/spriteIcons/'))
    .pipe(reload({stream:true}));
	console.log('Moved'); 
});



var paths = {
  move:['dev/fonts/**/*.*', 'dev/js/*.js', 'dev/img/**/*.*'],
};

gulp.task('watcher', function(){  
    gulp.watch( paths.move, ['move']);    
    gulp.watch('dev/sass/**/*.scss', ['sass']);
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
    
    gulp.task('default', ['watcher', 'browserSync', 'scriptsConcat', 'html', 'sass', 'move', ]);  
    
} else if (using == 'php'){
    
  gulp.task('browserSync', function() {
  browserSync({
    proxy:'http://forstart/build/', 
    notify: false,  
  });
});

//gulp.task('php', function(){
//  connectPHP.server({ 
//      base: './build', 
//      keepalive: true, 
//      hostname: 'localhost', 
//      port: 8080, 
//      open: false});
//});  
    
    gulp.task('default', ['watcher', 'browserSync', 'scriptsConcat', 'phpinc', 'sass', 'move', ]);  
    
};


