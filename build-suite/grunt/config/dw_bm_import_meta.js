module.exports = function () {
    return {
        options: {
            server: 'https://<%= environment.server %>',
            /* we want to delete any system or custom objects not held in this file. */
            clearAttributeDefinitions: true
        },
        systemMetaImport: {
            options: {
                archiveName: 'system-objecttype-extensions.xml'
            }
        },
        customMetaImport: {
            options: {
                archiveName: 'custom-objecttype-definitions.xml'
            }
        }
    };
};
