"use strict";
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
          options: {
            // this allows grunt to delete files outside the Gruntfile directory.
            // required to clean the ../public directory.
            force: true
          },
          dist: {
            src: ['dist/**/*', '!dist/.gitignore']
          }
        },

        copy: {
          distHtml: {
            files: [
              {expand: true, cwd: 'src/', src: ['**/*.html'], dest: 'dist/'}
            ]
          }
        },

        sass: {
          dist: {
            files: [
              {'dist/css/styles.css': 'src/scss/styles.scss'},
              {
                expand: true,
                cwd: 'src/components',
                src: ['**/*.scss'],
                dest: 'dist/components',
                ext: '.css'
              }
            ],
            options: {
              sourcemap: 'none',
              style: 'expanded',
              require: 'susy'
            }
          }
        },

        shell: {
          tsCompile: {
            command: 'tsc'
          },
          affirmation: {
            command: 'say -v Whisper "Nice work, developer.  Would you care for a massage?"'
          }
        },

        // use this to compile typescript - it uses the version of typescript compiler defined within this project, rather than any global typescript compiler
        ts: {
          default: {
            tsconfig: './tsconfig.json',
            src: ["src/**/*.ts", "!node_modules/**", "!typings/main/**", "!typings/main.d.ts"],
            dest: ['dist']
          }
        },

        watch: {
          options: {
            // spawn must be false for bsReload tasks to work correctly
            spawn: false
          },
          css: {
            files: ['src/scss/**/*.scss'],
            tasks: ['sass:dist', 'postcss:dist', 'bsReload:css']
          },
          typescript: {
            files: ['src/**/*.ts'],
            tasks: ['ts', 'bsReload:all']
          },
          html: {
            files: ['src/**/*.html'],
            tasks: ['copy:html', 'bsReload:all']
          },
          jade: {
            files: ['src/**/*.jade'],
            tasks: ['jade:compile', 'bsReload:all']
          }
        },

        // make sure to call the 'browserSync:xxxx' task rather than just 'browserSync' so it doesn't try to serve multiple things
        browserSync: {
          dist: {
            options: {
              server: './',
              // background must be true in order for grunt watch task to run
              background: true,
              browser: 'google chrome'
            }
          }
        },

        bsReload: {
          css: {
            reload: "dist/css/styles.css"
          },
          all: {
            reload: true
          }
        },

        postcss: {
          options: {
            // no sourcemaps
            map: false,
            processors: [
              // add vendor prefixes
              require('autoprefixer')({browsers: 'last 2 versions'})
            ]
          },
          dist: {
            src: 'dist/**/*.css'
          }
        },

        jade: {
          compile: {
              options: {
                pretty: true
              },
              files: [{
                cwd: "src",
                src: ["**/*.jade", "!index.jade"],
                dest: "dist",
                expand: true,
                ext: ".html"
              },{
                cwd: "src",
                src: "index.jade",
                dest: "./",
                expand: true,
                ext: ".html"
              }]
          }
        }
    });

    // Load the plugin that provides the "clean" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "watch" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Load the plugin that provides the "copy" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Load the plugin that provides the "sass" task.
    grunt.loadNpmTasks('grunt-contrib-sass');
    // Load the plugin that provides the "browserSync" task.
    grunt.loadNpmTasks('grunt-browser-sync');
    // Load the plugin that provides the "postcss" task.
    grunt.loadNpmTasks('grunt-postcss')
    // Load the plugin that provides the "shell" task
    grunt.loadNpmTasks('grunt-shell');
    // Load the plugin that provides the "jade" task - used to compile jade template to html
    grunt.loadNpmTasks('grunt-contrib-jade');
    // Load the plugin that provides typescript compilation
    grunt.loadNpmTasks('grunt-ts');

    // Default task(s).
    grunt.registerTask('default', ['build', 'bs-dist']);
    grunt.registerTask('build', ['clean:dist','jade:compile', 'ts', 'sass:dist', 'postcss:dist']);
    grunt.registerTask('bs-dist', ['browserSync:dist', 'watch']);
//    grunt.registerTask('deploy', ['clean:deploy', 'build', 'copy:deploy']);
//    grunt.registerTask('bs-deploy', ['browserSync:deploy']);
};
