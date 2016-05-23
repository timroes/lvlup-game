import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import streamqueue from 'streamqueue';

const _ = gulpLoadPlugins();

const modules = ['admin', 'client', 'screen', 'shared'];

const dirs = {
	src: 'src',
	build: 'build',
	fontello: 'assets/fontello'
};

const src = {
	assets: ['assets/**', 'assets/fontello'],
	fontello: 'fontello.json',
	html: '*.html',
	scripts: 'scripts/**/*.js',
	styles: 'styles/**/*.scss',
	server: 'src/server/**',
	templates: 'views/**/*.html'
};

const out = {
	modules: `${dirs.build}/modules/`
};

var server = _.liveServer([`${dirs.build}/index.js`], null, false);

modules.forEach((module) => {

	let moddir = `src/modules/${module}/`;

	gulp.task(`${module}:fontello`, () => {
		return gulp.src(moddir + src.fontello, { base: moddir })
			.pipe(_.fontello())
			.pipe(gulp.dest(moddir + dirs.fontello));
	});

	gulp.task(`${module}:assets`, [`${module}:fontello`], () => {
		return gulp.src(src.assets.map(src => `${moddir}${src}`), { base: moddir })
			.pipe(gulp.dest(`${out.modules}/${module}`))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:scripts`, () => {
		return gulp.src(moddir + src.scripts)
			.pipe(_.concat(`${module}.min.js`))
			.pipe(_.babel())
			.pipe(_.ngAnnotate())
			.pipe(_.uglify())
			.pipe(gulp.dest(`${out.modules}/${module}`))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:styles`, ()  => {
		return gulp.src(moddir + src.styles)
			.pipe(_.sass())
			.pipe(_.concat(`${module}.min.css`))
			.pipe(_.autoprefixer())
			// .pipe(_.combineMediaQueries())
			.pipe(_.minifyCss())
			.pipe(gulp.dest(`${out.modules}/${module}`))
			.pipe(_.livereload());
	});

	gulp.task(`${module}:html`, () => {
		return gulp.src(moddir + src.html)
			.pipe(_.minifyHtml())
			.pipe(gulp.dest(`${out.modules}/${module}`))
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
			.pipe(gulp.dest(`${out.modules}/${module}`))
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
			.pipe(gulp.dest(`${out.modules}/${module}`));
	});

	gulp.task(`${module}:libs:styles`, () => {
		let libStyles = libraries.filter(lib => lib.styles).map(lib => {
			return gulp.src(lib.styles.map(file => `node_modules/${lib.id}/${file}`));
		});

		return streamqueue({ objectMode: true }, ...libStyles)
			.pipe(_.concat('libs.min.css'))
			.pipe(gulp.dest(`${out.modules}/${module}`));
	});

	gulp.task(`${module}:watch`, () => {
		_.livereload.listen();
		gulp.watch(moddir + src.html, [`${module}:html`]);
		gulp.watch(moddir + src.scripts, [`${module}:scripts`]);
		gulp.watch(moddir + src.styles, [`${module}:styles`]);
		gulp.watch(moddir + src.templates, [`${module}:templates`]);
		// TODO: Assets is now an array, this line needs to be fixed
		gulp.watch(moddir + src.assets, [`${module}:assets`]);
		gulp.watch(moddir + src.fontello, [`${module}:fontello`]);
	});

	gulp.task(`${module}:build`, ['assets', 'fontello', 'scripts', 'styles', 'html', 'libs', 'libs:styles', 'templates']
		.map(job => `${module}:${job}`));

});

gulp.task('server:watch', () => {
	gulp.watch(src.server, ['serve']);
});

gulp.task('server:build', () => {
	const filter = _.filter(['**/*.js'], { restore: true });
	return gulp.src(src.server)
		.pipe(filter)
		.pipe(_.babel())
		.pipe(filter.restore)
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
