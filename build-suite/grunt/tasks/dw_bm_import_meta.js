'use strict';

/**
 * Imports meta content via the Site Development -> Import & Export section of demandware.
 * Validation of the imported meta files must already been executed before hand.
 **/
module.exports = function (grunt) {
    grunt.registerMultiTask('dw_bm_import_meta', 'Import Meta data', function () {
        var options = this.options(),
            done = this.async(),
            request = require('../lib/util/bm_request'),
            cheerio = require('cheerio'),
            bmUtils = require('../lib/util/dw_bm_utils');

        /**
         * Selects the first completed validation for import
         */
        function selectValidationJob(body) {
            var $ = cheerio.load(body);

            if (!bmUtils.isLoggedIn(body)) {
                throw 'Not able to login into business manager';
            }

            if (!options.archiveName) {
                throw 'No archive name provided for this process';
            }

            // Check if validation has been done on this file: Prepare label text
            var archiveLabel = 'Meta Data Validation <{0}>'.replace('{0}', options.archiveName),
                $td = $('form[name="ImpexForm"] > table:nth-child(6) > tr >td:nth-child(2)'),
                importLink;

            // Compare target label text with actual result, strip whitespace (to ignore line breaks etc.)
            var record = $td.filter(function () {
                var normalizedTargetLabel = bmUtils.removeAllWhiteSpaces(archiveLabel);
                var normalizedActualLabel = bmUtils.removeAllWhiteSpaces($(this).text());

                return normalizedActualLabel === normalizedTargetLabel;
            });

            if (!record || record.length === 0) {
                throw 'No validation task found for ' + options.archiveName;
            }

            importLink = $(record).find('.selection_link').first().attr('href');

            grunt.log.verbose.writeln('Found validation task at ' + importLink);

            // Go to validation form page in order to execute import process
            request.post({
                url: importLink,
                jar: true
            }, function (error, resp, body) {
                importMeta(body);
            });
        }
        /**
         * Execute meta data import for the validation file
         */
        function importMeta(body) {
            var $ = cheerio.load(body);

            // if confirm import is disabled this validation import is invalid
            if ($('button[name="confirmImport"]').attr('disabled')) {
                throw 'Validation errors have been found, unable to import';
            }

            var formAction = $('form[name="ValidateFileForm"]').attr('action'),
                form = {
                    SelectedFile: $('input[name="SelectedFile"]').attr('value'),
                    JobConfigurationUUID: $('input[name="JobConfigurationUUID"]').attr('value'),
                    ProcessPipelineName: $('input[name="ProcessPipelineName"]').attr('value'),
                    ProcessPipelineStartNode: $('input[name="ProcessPipelineStartNode"]').attr('value'),
                    JobName: $('input[name="JobName"]').attr('value'),
                    startImport: '',
                    ClearAttributeDefinitions: options.clearAttributeDefinitions
                };

            grunt.log.verbose.writeln('Importing meta data file ' + form.SelectedFile);

            // start import process
            request.post({
                url: formAction,
                jar: true,
                form: form
            }, function () {
                done();
            });
        }

        // request import & export page
        request.post({
            url: options.server +
              '/on/demandware.store/Sites-Site/default/ViewCustomizationImpex-Start',
            jar: true
        }, function (error, resp, body) {
            selectValidationJob(body);
        });
    });
};
