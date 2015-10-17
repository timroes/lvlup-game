import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const _ = gulpLoadPlugins();

const modules = ['admin', 'client', 'common', 'screen'];

const dirs = {
	src: 'src',
	build: 'build'
};

const src = {
	html: '*.html',
	scripts: 'scripts/**/*.js',
	styles: 'styles/**/*.scss',
	server: 'src/server/**'
};

var clientPublic = dirs.build + 'public/';

var server = _.liveServer([dirs.build + 'index.js'], null, false);

modules.forEach(function(module) {

	var moddir = 'src/' + module + '/';

	gulp.task(`${module}:scripts`, () => {
		return gulp.src(moddir + src.scripts)
			.pipe(_.concat('app.min.js'))
			.pipe(_.uglify())
			.pipe(gulp.dest(clientPublic))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:styles`, ()  => {
		return gulp.src(moddir + src.styles)
			.pipe(_.sass())
			.pipe(_.concat('app.min.css'))
			.pipe(_.combineMediaQueries())
			.pipe(_.minifyCss())
			.pipe(gulp.dest(clientPublic))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:html`, () => {
		return gulp.src(moddir + src.html)
			.pipe(_.minifyHtml())
			.pipe(gulp.dest(clientPublic))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:watch`, () => {
		_.livereload.listen();
		gulp.watch(moddir + src.html, [`${module}:html`]);
		gulp.watch(moddir + src.scripts, [`${module}:scripts`]);
		gulp.watch(moddir + src.styles, [`${module}:styles`]);
	});

	gulp.task(module + ':build')

});

// - BEGIN SERVER TASKS -

gulp.task('serve', ['server'], () => {
	server.start.bind(server)();
});

gulp.task('server', () => {
	return gulp.src(src.server)
		.pipe(gulp.dest(dirs.build));
});

// - END SERVER TASKS -

gulp.task('clean', () => {
	return del(dirs.build);
});


gulp.task('client', ['html', 'scripts', 'styles']);

gulp.task('build', ['server', 'client']);

gulp.task('dev', ['build', 'watch', 'serve']);