module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      clean: {
        options: { force: true },
        public: ["../public"]
    },
    copy: {
        dev: {
            files: [{
                expand: true,
                cwd: "../",
                src: [
                    "index.html",
                    "styles/*",
                    "app/login/**/*",
                    "app/navigation/**/*",
                    "app/userHome/**/*",
                    "app/app.config.js",
                    "app/app.js",
                    "images/*.jpg",
                    "images/*.jpeg",
                    "lib/node_modules/angular/angular.min.js",
                    "lib/node_modules/angular/angular.min.js.map",
                    "lib/node_modules/firebase/firebase.js",
                    "lib/node_modules/firebase/firebase.js.map",
                    "lib/node_modules/angular-route/angular-route.min.js",
                    "lib/node_modules/angular-route/angular-route.min.js.map",
                    "lib/node_modules/ng-file-upload/dist/ng-file-upload.min.js"

                ],
                dest: "../public/"
            }]
        }
    }
    });
  
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

  
    // Default task(s).
    grunt.registerTask("deploy", ["copy"]);
    grunt.registerTask("cleanit", ["clean"]);

    
  };