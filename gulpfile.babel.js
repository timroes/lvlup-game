import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import streamqueue from 'streamqueue';

const _ = gulpLoadPlugins();

const modules = ['admin', 'client', 'screen', 'shared'];

const dirs = {
	src: 'src',
	build: 'build'
};

const src = {
	html: '*.html',
	scripts: 'scripts/**/*.js',
	styles: 'styles/**/*.scss',
	server: 'src/server/**',
	templates: 'views/**/*.html'
};

var server = _.liveServer([`${dirs.build}/index.js`], null, false);

modules.forEach((module) => {

	let moddir = `src/modules/${module}/`;

	gulp.task(`${module}:scripts`, () => {
		return gulp.src(moddir + src.scripts)
			.pipe(_.concat(`${module}.min.js`))
			.pipe(_.ngAnnotate())
			.pipe(_.uglify())
			.pipe(gulp.dest(`${dirs.build}/${module}`))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:styles`, ()  => {
		return gulp.src(moddir + src.styles)
			.pipe(_.sass())
			.pipe(_.concat(`${module}.min.css`))
			// .pipe(_.combineMediaQueries())
			.pipe(_.minifyCss())
			.pipe(gulp.dest(`${dirs.build}/${module}`))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:html`, () => {
		return gulp.src(moddir + src.html)
			.pipe(_.minifyHtml())
			.pipe(gulp.dest(`${dirs.build}/${module}`))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:templates`, () => {
		return gulp.src(moddir + src.templates)
			.pipe(_.minifyHtml())
			.pipe(_.angularTemplatecache('templates.min.js', {
				module: `lvlup.${module}.templates`,
				standalone: true,
				root: 'views/'
			}))
			.pipe(_.uglify())
			.pipe(gulp.dest(`${dirs.build}/${module}`))
			.pipe(_.livereload());
	});

	var libraries = [];

	try {
		libraries = require(`./${moddir}/libraries.json`);
	} catch(e) {
		// Modules don't need to have libraries.
	}

	gulp.task(`${module}:libs`, () => {
		let libScripts = libraries.map(lib => {
			return gulp.src(lib.scripts.map(file => `node_modules/${lib.id}/${file}`));
		});

		return streamqueue({ objectMode: true }, ...libScripts)
			.pipe(_.concat('libs.min.js'))
			.pipe(gulp.dest(`${dirs.build}/${module}`));
	});

	gulp.task(`${module}:libs:styles`, () => {
		let libStyles = libraries.filter(lib => lib.styles).map(lib => {
			return gulp.src(lib.styles.map(file => `node_modules/${lib.id}/${file}`));
		});

		return streamqueue({ objectMode: true }, ...libStyles)
			.pipe(_.concat('libs.min.css'))
			.pipe(gulp.dest(`${dirs.build}/${module}`));
	});

	gulp.task(`${module}:watch`, () => {
		_.livereload.listen();
		gulp.watch(moddir + src.html, [`${module}:html`]);
		gulp.watch(moddir + src.scripts, [`${module}:scripts`]);
		gulp.watch(moddir + src.styles, [`${module}:styles`]);
		gulp.watch(moddir + src.templates, [`${module}:templates`]);
	});

	gulp.task(`${module}:build`, ['scripts', 'styles', 'html', 'libs', 'libs:styles', 'templates']
		.map(job => `${module}:${job}`));

});

gulp.task('server:watch', () => {
	gulp.watch(src.server, ['serve']);
});

gulp.task('server:build', () => {
	return gulp.src(src.server)
		.pipe(gulp.dest(dirs.build));
});

gulp.task('build', [...modules, 'server'].map(mod => `${mod}:build`));

gulp.task('watch', [...modules, 'server'].map(mod => `${mod}:watch`));

gulp.task('serve', ['server:build'], () => {
	server.start.bind(server)();
});

gulp.task('clean', () => {
	return del(dirs.build);
});

gulp.task('dev', ['build', 'watch', 'serve']);
