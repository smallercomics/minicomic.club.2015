import gulp from 'gulp'
import fs from 'fs'
import rimraf from 'rimraf'

import htmlmin from 'gulp-htmlmin'

import connect from 'gulp-connect'
import rename from 'gulp-rename'
import rev from 'gulp-rev'
import sass from 'gulp-sass'
import handlebars from 'handlebars'
import gulpHandlebars from 'gulp-handlebars-html'

const template = gulpHandlebars(handlebars)

const distPath = './dist'

gulp.task('clean', (cb)=> {
  rimraf(distPath, () => cb() );
})

gulp.task('tidy', () => {
  fs.unlink(`${distPath}/images.json`, ()=>{})
  fs.unlink(`${distPath}/styles.json`, ()=>{})
  fs.unlink(`${distPath}/scripts.json`, ()=>{})
})
gulp.task('assets', ['styles','images', 'scripts'], (next) => {
  next()
})

gulp.task('styles', () => {
  return gulp.src('./src/style/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rev())
    .pipe(gulp.dest(distPath))
    .pipe(rev.manifest({ path: 'styles.json' }))
    .pipe(gulp.dest(distPath))
})

gulp.task('scripts', () => {
  return gulp.src('./src/scripts/common.js')
    .pipe(rev())
    .pipe(gulp.dest(distPath))
    .pipe(rev.manifest({ path: 'scripts.json' }))
    .pipe(gulp.dest(distPath))
})

gulp.task('images', () => {
  return gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest(`./${distPath}/img`))
    .pipe(rev.manifest({ path: 'images.json' }))
    .pipe(gulp.dest(distPath))
})

gulp.task('dotfiles', () => {
  return gulp.src('./src/.*')
    .pipe(gulp.dest(distPath))
})

gulp.task('index', ['assets', 'dotfiles'], function () {
    const templateData = {
      assets: Object.assign(
        {},
        JSON.parse(fs.readFileSync(`${distPath}/styles.json`)),
        JSON.parse(fs.readFileSync(`${distPath}/images.json`)),
        JSON.parse(fs.readFileSync(`${distPath}/scripts.json`)),
      ),
      artists: JSON.parse(fs.readFileSync('./src/artists.json')),
      previously: JSON.parse(fs.readFileSync('./src/previously.json')),
    }
    const options = {
        partialsDirectory : ['./src/templates/partials']
    }
    handlebars.registerHelper('asset', key => templateData.assets[key])

    return gulp.src('src/templates/*.handlebars')
        .pipe(template(templateData, options))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename((path) => path.extname='.html'))
        .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
  gulp.watch('./src/**', ['index'])
})

gulp.task('webserver', ()=> {
  connect.server({
    root: distPath,
    livereload: true
  })
})

gulp.task('dev', ['index', 'watch', 'webserver']);
gulp.task('default', ['index'])