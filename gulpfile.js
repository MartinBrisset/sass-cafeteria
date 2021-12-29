const {src, dest, watch, series} = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const sourcemaps = require('gulp-sourcemaps');

function css( done ) {
    //compilar sass
    // paso 1 - identificar archivo
    // paso 2 - compilar
    // paso 3 - guardar en un archivo css

    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'));

    done();

}

function imagenes(done) {
    src('src/img/**/*')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(dest('build/img'));
    done();
}

const opt = {
    quality: 50
}

function versionWebp(done) {
    src('src/img/**/*.{jpg,png}')
        .pipe(webp(opt))
        .pipe(dest('build/img'));
    done();
}

function versionAvif(done) {
    src('src/img/**/*.{jpg,png}')
        .pipe(avif(opt))
        .pipe(dest('build/img'));
    done();
}

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

