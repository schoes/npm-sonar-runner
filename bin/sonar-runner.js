#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var pjson = require('./../../package.json');

var sonarProps = pjson.sonar;

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
    var cmdProps = [];

    for (var param in sonarProps) {

        if (sonarProps.hasOwnProperty(param) && acceptedParams[param]) {
            cmdProps.push('-Dsonar.' + param + '=' + sonarProps[param]);
        }
    }

    console.log('sonar-scanner ' + cmdProps.concat(' '))

//-Dsonar.projectKey=myproject -Dsonar.sources=src1
}