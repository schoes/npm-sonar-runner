#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var appRoot = process.cwd();
var isWin = /^win/.test(process.platform);

var prosFile = path.resolve(appRoot, 'sonar-project.properties');
var pjson = require(path.resolve(appRoot, 'package.json'));

var sonarProps = pjson.sonar;

/**
 * Execute the sonar-scanner command.
 * @param command an Array containing the sonar-scanner command and props.
 */
function execSonarScanner(command) {

    var sonarScannerFile = isWin? 'sonar-scanner.bat' : 'sonar-scanner';
    var sonarCommand = path.resolve(__dirname, './../lib/sonar-scanner/bin/' + sonarScannerFile);
    var projectBaseDir = '-Dsonar.projectBaseDir=' + appRoot;

    command.unshift(projectBaseDir);
    command.unshift(sonarCommand);

    var sys = require('sys');
    var exec = require('child_process').exec;

    exec(command.join(' '), function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

//Execute the sonar-scanner command specifying the location of the props file.
if (fs.existsSync(prosFile)) {
    execSonarScanner(['-Dproject.settings=' + path.resolve(appRoot, 'sonar-project.properties')])

} else {

    //Execute the sonar-scanner command specifying the props as command line args.
    if (sonarProps !== null || sonarProps !== undefined) {

        var acceptedParams = [
            'host.url',
            'projectKey',
            'sources',
            'projectName',
            'projectVersion',
            'login',
            'password',
            'ws.timeout',
            'projectDescription',
            'links.homepage',
            'links.ci',
            'links.issue',
            'links.scm',
            'links.scm_dev',
            'tests',
            'language',
            'sourceEncoding',
            'projectDate',
            'branch',
            'profile',
            'projectBaseDir',
            'working.directory',
            'scm.provider',
            'scm.forceReloadAll',
            'inclusions',
            'exclusions',
            'coverage.exclusions',
            'test.exclusions',
            'test.inclusions',
            'issue.ignore.allfile',
            'import_unknown_files',
            'cpd.exclusions',
            'cpd.exclusions',
            'cpd.${language}.minimumtokens',
            'cpd.${language}.minimumLines',
            'log.level',
            'verbose',
            'showProfiling',
            'scanner.dumpToFile',
            'analysis.mode'
        ];

        /**
         * Check whether the acceptedParams array contains the provided param.
         * @param param
         * @returns {boolean}
         */
        function paramIsValid(param) {
            for (var i = 0; i < acceptedParams.length; i++) {
                if (acceptedParams[i] === param) {
                    return true;
                }
            }
            return false;
        }

        var cmdProps = [];

        for (var param in sonarProps) {
            if (sonarProps.hasOwnProperty(param) && paramIsValid(param)) {
                cmdProps.push('-Dsonar.' + param + '=' + sonarProps[param]);
            }
        }

        execSonarScanner(cmdProps);
    }
}