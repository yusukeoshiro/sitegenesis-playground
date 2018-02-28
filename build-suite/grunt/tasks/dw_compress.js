/**
 * Compress content in output folder
 */
module.exports = function (grunt) {
    grunt.registerMultiTask('dw_compress', 'Compress Code into Zip files.', function () {
        var settings = grunt.config('settings');

        if (!settings.upload.per_cartridge || settings.upload.per_cartridge.toString() !== 'true') {
            grunt.log.writeln(' * Calling generic compress task.');
            grunt.task.run('compress:code');
        } else {
            grunt.log.writeln(' * Upload per cartridge enabled. ' +
            'Generating Cartridge-based compress tasks.');
            var dwProperties = grunt.config('dw_properties');

            var directories = grunt.file.expand(dwProperties.folders.code + '*');

            if (directories.length === 0) {
                grunt.fail.warn('Could not find any cartridges in source folder: ' + dwProperties.folders.code);
            }

            grunt.log.writeln('   - Cartridges:');

            // Compress all (cartridge-) directories.
            directories.forEach(function (dir) {
                if (!grunt.file.isDir(dir)) {
                // Only compress folders
                    return;
                }

                // Cartridge name = folder name
                var cartridgeName = dir.split('/').reverse()[0];
                grunt.log.writeln('     - ' + cartridgeName);

                // Prepare compress task
                var cartridgeOptions = {
                    options: {
                        archive: dwProperties.folders.code + dwProperties.version.name + '_' + cartridgeName + '.zip'
                    },
                    src: ['**/*', '!**/*.zip'],
                    cwd: dwProperties.folders.code + cartridgeName,
                    dest: dwProperties.version.name + '/' + cartridgeName,
                    expand: true,
                    dot: true
                };

                // Add config+task to queue
                grunt.config('compress.' + cartridgeName, cartridgeOptions);
                grunt.task.run('compress:' + cartridgeName);
            });
        }
    });
};
