module.exports = {

    /* Put all cartridges in one single Zip file. Might get overwritten by dw_compress task. */
    code: {
        options: {
            archive: '<%= dw_properties.folders.code %><%= dw_properties.version.name %>.zip'
        },
        files: [{
            src: ['**/*', '!**/*.zip'],
            cwd: '<%= dw_properties.folders.code %>',
            dest: '<%= dw_properties.version.name %>',
            expand: true,
            dot: true
        }]
    },

    /* Package all contents, ignore any generated zip file contents*/
    siteImport: {
        options: {
            archive: '<%= dw_properties.folders.site %><%= settings.siteImport.filenames.init %>.zip'
        },
        files: [{
            src: ['**/<%= settings.siteImport.filenames.init %>/**/*', '!**/*.zip'],
            cwd: '<%= dw_properties.folders.site %>',
            expand: true,
            dot: true
        }]
    },

    /* Package only meta data*/
    siteMeta: {
        options: {
            archive: '<%= dw_properties.folders.site %><%= settings.siteImport.filenames.meta %>.zip'
        },
        files: [{
            src: ['site_init/meta/*', 'site_demo/meta/*'],
            cwd: '<%= dw_properties.folders.site %>',
            flatten: true,
            expand: true,
            dot: true
        }]
    }
};
