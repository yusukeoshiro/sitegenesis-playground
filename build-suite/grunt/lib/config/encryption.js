'use strict';

module.exports = function Encryption(grunt) {
    var ENCRYPTION_MARKER = 't8kdrXdL61E_';
    var ENCRYPTION_PASSPHRASE = 'gBqZACrbEMdiICjSerRWzFeK';

    var crypto = require('crypto');

    /**
     * Runs encryption: Either encrypts the password and writes it back to config file, or decrypts it.
     * In either case the decrypted password will be in the config after calling this.
     */
    this.run = function (dependencyFilename) {
        var enabled = grunt.config('settings').general ? grunt.config('settings').general.password_encryption : true;
        enabled = String(enabled);

        if (enabled == 'false') {
            grunt.log.write('   * ');
            grunt.log.warn('Password encryption is disabled.');
            return;
        }

        grunt.log.write('   * Password encryption enabled... ');

        var password;

        if (grunt.config('environment') && grunt.config('environment').password) {
            password = grunt.config('environment').password;
        }

        if (!password) {
            grunt.log.writeln('No password found. Nothing to encrypt/decrypt. ');
            return;
        }

        if (password.indexOf(ENCRYPTION_MARKER) === 0) {
            password = this.decrypt(password);

            grunt.config('environment.password', password);

            grunt.log.write('decryption ');
            grunt.log.ok();
        } else {
            var encryptedPassword = this.encrypt(password);

            var fileContent = grunt.file.read(dependencyFilename);
            grunt.file.write(dependencyFilename, fileContent.replace(password, ENCRYPTION_MARKER + encryptedPassword));

            grunt.log.write('encryption ');
            grunt.log.ok();
        }
    };

    this.decrypt = function (password) {
        password = password.substring(ENCRYPTION_MARKER.length);

        var decipher = crypto.createDecipheriv('des-ede3', ENCRYPTION_PASSPHRASE, '');
        var plainPwd = decipher.update(password, 'base64', 'utf8');
        plainPwd += decipher.final('utf8');

        return plainPwd;
    };

    this.encrypt = function (password) {
        var cipher = crypto.createCipheriv('des-ede3', ENCRYPTION_PASSPHRASE, '');

        var encryptedPwd = cipher.update(password, 'utf8', 'base64');
        encryptedPwd += cipher.final('base64');

        if (encryptedPwd === null) {
            grunt.fail.warn('Password encryption failed!');
        }

        return encryptedPwd;
    };
};

