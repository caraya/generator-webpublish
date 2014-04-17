#!/bin/sh

# Don't want to create an npm account as I want to keep this private

# Uninstall the existing version of the package
npm uninstall -g generator-starter
# Change the command below to install from a development branch
npm install -g https://github.com/caraya/generator-starter/tarball/master
