module.exports = (grunt) =>
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-browserify2'
  grunt.loadNpmTasks 'grunt-exec'
  grunt.loadNpmTasks 'grunt-parallel'

  grunt.initConfig

    less:
      development:
        options: compress: true, optimization: 2, yuicompress: true
        files:
          "./www/css/index.css": "./www/less/index.less"

    coffee:
      development:
        options: bare: true
        files: [
          expand: true
          cwd: 'www/src/',
          src: [ "**/*.coffee" ]
          dest: "www/lib/"
          ext: '.js'
        ]

    browserify2:
      compile:
        entry: './www/lib/app.js'
        compile: './www/js/app.js'

    exec:
      templates:
        command: 'coffee www/script/compileTemplates.coffee'

    watch:

      less:
        files: [ './www/less/*/**.less', './www/less/*.less' ]
        tasks: 'less'
        options: interrupt: true

      coffee:
        files: './www/src/**/*.coffee'
        tasks: 'coffee'
        options: interrupt: true

      bundle:
        files: [ './www/src/**/*.coffee' ]
        tasks: [ 'coffee', 'browserify2' ]
        options: interrupt: true

      templates:
        files: [ './www/templates/**/*.html' ]
        tasks: [ 'exec:templates' ]
        options: interrupt: true

    parallel:
      watch:
        tasks: [
          {
            grunt: true,
            args: [ 'watch:less' ]
          }
          {
            grunt: true,
            args: [ 'watch:coffee' ]
          }
          {
            grunt: true,
            args: [ 'watch:bundle' ]
          }
          {
            grunt: true,
            args: [ 'watch:templates' ]
          }
        ]

  grunt.registerTask 'default', 'parallel:watch'
  grunt.registerTask 'build', [ 'less', 'coffee', 'browserify2', 'templates' ]
