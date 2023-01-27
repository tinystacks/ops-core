const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');



const lintRc = readFileSync(resolve(__dirname, '../.eslintrc')).toString();
const testLintRc = JSON.parse(lintRc);
testLintRc.parserOptions.project = ['tsconfig.test.json'];
writeFileSync(resolve(__dirname, '../.eslintrc.test.json'), JSON.stringify(testLintRc, null, 2));

const tsConfig = readFileSync(resolve(__dirname, '../tsconfig.json')).toString();
const testTsConfig = JSON.parse(tsConfig);
testTsConfig.compilerOptions.outDir = './test-dist';
testTsConfig.include = ['test'];
writeFileSync(resolve(__dirname, '../tsconfig.test.json'), JSON.stringify(testTsConfig, null, 2));