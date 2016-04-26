var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync')


gulp.task('nodemon', function(){
    nodemon({
        ext: 'js html css',
        env: {'NODE_ENV': 'development'}
    })
})
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        files: ["public-dev/**/*.*"],
        browser: "google chrome",
        port: 7000,
  });
});
gulp.task('default', ['browser-sync'])
