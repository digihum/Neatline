
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Grunt file.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  // Load custom tasks.
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');

  // Load configuration.
  var config = grunt.file.readJSON('./config.json');

  grunt.initConfig({

    shell: {

      // NPM
      npm_jasmine: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },

      // BOWER
      bower_cache_clean: {
        command: 'bower cache-clean',
        stdout: true,
        execOptions: {
          cwd: config.bower.app
        }
      },
      bower_app: {
        command: 'bower install',
        stdout: true,
        execOptions: {
          cwd: config.bower.app
        }
      },
      bower_tests: {
        command: 'bower install',
        stdout: true,
        execOptions: {
          cwd: config.bower.tests
        }
      },

      // LIB
      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        stdout: true,
        execOptions: {
          cwd: config.build.openlayers
        }
      },
      build_bootstrap: {
        command: 'make bootstrap',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },
      move_bootstrap_images: {
        command: 'cp -r img ../../../css/img',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },

      // TEST
      phpunit: {
        command: 'phpunit --color',
        stdout: true,
        execOptions: {
          cwd: './tests'
        }
      },
      jasmine_public: {
        command: 'grunt --config gruntPublic.js jasmine',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },
      jasmine_public_server: {
        command: 'grunt --config gruntPublic.js jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },
      jasmine_editor: {
        command: 'grunt --config gruntEditor.js jasmine',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },
      jasmine_editor_server: {
        command: 'grunt --config gruntEditor.js jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      }

    },

    clean: {
      npm: [
        config.jasmine+'/node_modules',
      ],
      bower: [
        config.bower.app+'/components',
        config.bower.tests+'/components'
      ],
      payload: [
        config.payloads.app.css,
        config.payloads.test.css,
        config.payloads.app.js,
        config.payloads.test.js
      ]
    },

    concat: {
      neatline: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.bootstrap,
          config.vendor.js.d3,

          // Neatline:
          config.app+'/app.js',
          config.app+'/record/record.model.js',
          config.app+'/record/record.collection.js',
          config.app+'/map/**/*.js',
          config.app+'/bubble/**/*.js'

        ],
        dest: config.payloads.app.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.underscore_s,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.bootstrap,
          config.vendor.js.noty,
          config.vendor.js.noty_layout_base,
          config.vendor.js.noty_layout,
          config.vendor.js.noty_theme,
          config.vendor.js.d3,

          // Editor:
          config.app+'/app.js',
          config.app+'/record/record.model.js',
          config.app+'/record/record.collection.js',
          config.app+'/map/**/*.js',
          config.app+'/bubble/**/*.js',
          config.app+'/editor/**/*.js'

        ],
        dest: config.payloads.app.js+'/editor.js',
        separator: ';'
      },
      neatline_css: {
        src: [
          config.payloads.app.css+'/public/*.css',
          config.vendor.css.openlayers,
          config.vendor.css.bootstrap
        ],
        dest: config.payloads.app.css+'/neatline.css',
      },
      editor_css: {
        src: [
          '<config:concat.neatline_css.src>',
          config.payloads.app.css+'/editor/*.css'
        ],
        dest: config.payloads.app.css+'/editor.css',
      }
    },

    min: {
      neatline: {
        src: '<config:concat.neatline.src>',
        dest: config.payloads.app.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: '<config:concat.editor.src>',
        dest: config.payloads.app.js+'/editor.js',
        separator: ';'
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [config.stylus]
        },
        files: {
          './views/shared/css/payloads/*.css': [
            config.stylus+'/public/*.styl',
            config.stylus+'/editor/*.styl'
          ]
        }
      }
    },

    copy: {
      jasmine: {
        // options: {
        //   cwd: './views/shared/'
        // },
        files: {
          './views/shared/javascripts/tests/payloads/js/':
          './views/shared/javascripts/payloads/*.js',
          './views/shared/javascripts/tests/payloads/css/':
          './views/shared/css/payloads/*.css'
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.stylus+'/**/*.styl'
        ],
        tasks: [
          'compile_concat'
        ]
      }
    }

  });


  // Task aliases.
  // -------------

  // Default task.
  grunt.registerTask('default', 'test');

  // Assemble static assets.
  grunt.registerTask('compile_concat', [
    'clean:payload',
    'concat:neatline',
    'concat:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile_min', [
    'clean:payload',
    'min:neatline',
    'min:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css'
  ]);

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:npm_jasmine',
    'shell:bower_cache_clean',
    'shell:bower_app',
    'shell:bower_tests',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'shell:move_bootstrap_images',
    'compile_min'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'shell:phpunit',
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);

  // Run PHPUnit / Jasmine.
  grunt.registerTask('phpunit', 'shell:phpunit');
  grunt.registerTask('jasmine', [
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);

  // Run Jasmine servers.
  grunt.registerTask('public_server', 'shell:jasmine_public_server');
  grunt.registerTask('editor_server', 'shell:jasmine_editor_server');


};
