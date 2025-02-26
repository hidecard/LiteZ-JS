#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

// Load LiteZ from litez.js (assumes it's in the same directory as the CLI)
const LiteZ = require('./litez'); // Adjust path if litez.js is elsewhere

program.version('1.0.0').description('LiteZ CLI for project setup and builds');

// Command: Initialize a new project
program
  .command('init <name>')
  .description('Initialize a new LiteZ project')
  .action((name) => {
    const projectDir = path.join(process.cwd(), name);
    const srcDir = path.join(projectDir, 'src');

    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(srcDir, { recursive: true });

    fs.writeFileSync(path.join(projectDir, 'index.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
</head>
<body>
  <div id="app"></div>
  <script src="dist/litez.js"></script>
  <script src="dist/app.js"></script>
</body>
</html>
    `);

    fs.writeFileSync(path.join(srcDir, 'app.zjs'), `
<template>
  <h1>Hello, ${name}!</h1>
  <button data-on="click:increment">Count: {{ count }}</button>
</template>
<script>
() => ({
  data: () => ({ count: 0 }),
  methods: {
    increment() { this.state.set({ count: this.state.get('count') + 1 }); }
  }
})
</script>
<style>
h1 { color: #333; }
button { padding: 5px 10px; }
</style>
    `);

    fs.copyFileSync(path.join(__dirname, 'litez.js'), path.join(srcDir, 'litez.js'));

    console.log(`Project "${name}" initialized! Run "cd ${name} && node ../litez-cli.js build" to build it.`);
  });

// Command: Build the project
program
  .command('build')
  .description('Build the LiteZ project')
  .action(async () => {
    const srcDir = path.join(process.cwd(), 'src');
    const distDir = path.join(process.cwd(), 'dist');

    if (!fs.existsSync(srcDir)) {
      console.error('Error: "src" directory not found. Are you in a LiteZ project directory?');
      process.exit(1);
    }

    fs.mkdirSync(distDir, { recursive: true });

    // Build litez.js
    await esbuild.build({
      entryPoints: [path.join(srcDir, 'litez.js')],
      outfile: path.join(distDir, 'litez.js'),
      bundle: true,
      minify: true,
      format: 'iife',
    });

    // Build app.zjs (convert to JS and bundle)
    const zjsContent = fs.readFileSync(path.join(srcDir, 'app.zjs'), 'utf8');
    const { script } = LiteZ._parseZJS(zjsContent);
    fs.writeFileSync(path.join(srcDir, 'app.js'), `
      LiteZ.createComponentFromFile('src/app.zjs', 'App').then(() => {
        LiteZ.router({ '/': { component: 'App' } });
      });
    `);

    await esbuild.build({
      entryPoints: [path.join(srcDir, 'app.js')],
      outfile: path.join(distDir, 'app.js'),
      bundle: true,
      minify: true,
      format: 'iife',
      external: ['litez.js'],
    });

    fs.copyFileSync(path.join(srcDir, 'app.zjs'), path.join(distDir, 'app.zjs'));

    console.log('Build complete! Serve the "dist" folder (e.g., npx serve dist).');
  });

program.parse(process.argv);