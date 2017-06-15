#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var appRoot = process.cwd();
var isWin = /^win/.test(process.platform);

var prosFile = path.resolve(appRoot, 'sonar-project.properties');
var pjson = require(path.resolve(appRoot, 'package.json'));

var sonarProps = pjson.sonar;

var execSonarScanner = function (command) {

    var sonarScannerFile = isWin? 'sonar-scanner.bat' : 'sonar-scanner';
    var sonarCommand = path.resolve(__dirname, './../lib/sonar-scanner/bin/' + sonarScannerFile);
    var projectBaseDir = '-Dsonar.projectBaseDir=' + appRoot;
    console.log(sonarCommand)
    command.unshift(projectBaseDir);
    command.unshift(sonarCommand);

    // console.log(command.join(' '));

    var sys = require('sys')
    var exec = require('child_process').exec;

    exec(command.join(' '), function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}


if (fs.existsSync(prosFile)) {
    // Do something
    execSonarScanner(['-Dproject.settings=' + path.resolve(appRoot, 'sonar-project.properties')])

} else {

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

        var paramIsValid = function (param) {
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

        execSonarScanner(cmdProps)
        // console.log('sonar-scanner ' + cmdProps.join(' '))

        // node_modules/sonar-runner/lib/sonar-scanner-3.0.3.778/bin/sonar-scanner -Dsonar.host.url=https:localhost:9001 -Dsonar.projectKey=TSM-CHR -Dsonar.projectName=TSM-Carhire-Results -Dsonar.projectVersion=0.0.1 -Dsonar.login=admin -Dsonar.password=admin -Dsonar.links.scm=git@github.com:jasonconway-williams/npm-sonar-runner.git -Dsonar.language=js -Dsonar.sources=index.js
    }
}