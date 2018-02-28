/**
 * Scan ISML templates in order to find Markup for merging CSS and JS files.
 */
module.exports = function (grunt) {
    grunt.registerMultiTask('dw_merge', 'Execute merge task for one repository.', function () {
        var options = this.data.options;
        var filesFound = 0;

        if (!options.merge_enabled || options.merge_enabled !== 'true') {
            grunt.log.warn('Static files concatenation is disabled. Skipping task.');
            return;
        }

        if (options.optimize_css !== 'true' && options.optimize_js !== 'true') {
            grunt.log.warn('Both CSS and JS optimization are disabled. Skipping task.');
            return;
        }

        // Iterate over files
        this.files.forEach(function (filesEntry) {
            filesEntry.src.forEach(function (filePath) {
                var content = grunt.file.read(filePath);
                var foundOne = false;

                if (options.optimize_js && content.indexOf('<!--- BEGIN JS files to merge') !== -1) {
                    content = mergeJavascript(content, grunt, filePath);
                    foundOne = true;
                }

                if (options.optimize_css && content.indexOf('<!--- BEGIN CSS files to merge') !== -1) {
                    content = mergeStylesheets(content, grunt, filePath);
                    foundOne = true;
                }

                if (foundOne) {
                    filesFound++;
                    grunt.file.write(filePath, content);
                }
            });

            grunt.log.ok(filesFound + ' files found.');
        });
    });
};

/**
 * @param {string} content
 * @param grunt
 * @param sourcePath
 * @returns {string}
 */
function mergeJavascript(content, grunt, sourcePath) {
    var cartridgePath = sourcePath.replace(/\/cartridge\/.*/i, '');
    var cartridgeName = cartridgePath.split('/').pop();

    content = content.replace(/<!--- BEGIN JS files to merge(.*)--->([\s\S]*)\s*<!--- END JS files to merge(.*)--->/g,
        function (all, params, scripts) {
            var relpath = params.match(/source_path=([^;)]*)/)[1];
            var target = params.match(/targetfile=([^;)]*)/)[1];

            // Read source files from markup content
            var sourceFiles = scripts.replace(/.*\('/g, cartridgePath + '/' +
        relpath).replace(/'\).*/g, '').match(/[^\r\n]+/g).filter(function (e) {
                return e.length && e.indexOf('.js') > -1;
            });

            // Build full target file path + task name
            var targetFile = grunt.config('dw_properties').folders.code +
        cartridgeName + '/' + relpath + '/' + target;
            var targetTaskName = cartridgeName + '_' + target.split('.')[0].replace(/[\/\\]/g, '_');

            grunt.log.writeln("Generating task 'uglify." + (target.split('.')[0]) +
        "' to optimize " + JSON.stringify(sourceFiles, null, 1) + ' into ' + targetFile);

            // create uglify config
            grunt.config('uglify.' + targetTaskName, {
                src: sourceFiles,
                dest: targetFile
            });

            grunt.task.run('uglify:' + targetTaskName);

            return '<script type="text/javascript" src="${URLUtils.absStatic(\'' +
        target + '\')}"></script>';
        });

    return content;
}

/**
 * @param {string} content
 * @param grunt
 * @param sourcePath
 * @returns {string}
 */
function mergeStylesheets(content, grunt, sourcePath) {
    var cartridgePath = sourcePath.replace(/\/cartridge\/.*/i, '');
    var cartridgeName = cartridgePath.split('/').pop();

    content = content.replace(/<!--- BEGIN CSS files to merge(.*)--->([\s\S]*)\s*<!--- END CSS files to merge(.*)--->/g,
        function (all, params, scripts) {
            var relpath = params.match(/source_path=([^;)]*)/)[1];
            var target = params.match(/targetfile=([^;)]*)/)[1];

            // Read source files from markup content
            var sourceFiles = scripts.replace(/.*\('/g, cartridgePath + '/' + relpath)
                .replace(/'\).*/g, '').match(/[^\r\n]+/g).filter(function (e) {
                    return e.length && e.indexOf('.css') > -1;
                });

            // Build full target file path + task name
            var targetFile = grunt.config('dw_properties').folders.code +
        cartridgeName + '/' + relpath + '/' + target;
            var targetTaskName = cartridgeName + '_' + target.split('.')[0].replace(/[\/\\]/g, '_');

            grunt.log.writeln('Generating task "cssmin.' + (target.split('.')[0]) +
        '" to optimize ' + JSON.stringify(sourceFiles, null, 1) + ' into ' + targetFile);

            // create cssmin config
            grunt.config('cssmin.' + targetTaskName, {
                src: sourceFiles,
                dest: targetFile
            });

            grunt.task.run('cssmin:' + targetTaskName);

            return '<link href="${URLUtils.absStatic(\'' + target +
        '\')}" rel="stylesheet" type="text/css" />';
        });

    return content;
}
