#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const { name, version } = require("../package.json");
const getOutputName = require("./utils/getOutputName");
const processFile = require("./utils/processFile");
const processFolder = require("./utils/processFolder");

const argv = yargs
  .scriptName("mh-ssg")
  .usage("Usage: $0 -i <filename> -o <outputpath> -s <stylesheet>")
  .option("input", {
    alias: "i",
    describe: "Specify input file or input folder (required)",
    type: "array",
  })
  .option("output", {
    alias: "o",
    describe: "Specify output path",
    type: "array",
  })
  .option("stylesheet", {
    alias: "s",
    describe: "Specify stylesheet for html file",
    type: "string",
    default: "",
  })
  .alias("help", "h")
  .version(`You're running ${name} version ${version}`)
  .alias("version", "v").argv;

// main program
console.log("-----------------------------------------------------------");
console.log("|                     Welcome to MH-SSG                   |");
console.log("-----------------------------------------------------------\n");
yargs.showHelp();
console.log("");

if (!argv.input) {
  if (argv.output) {
    return console.log(
      "Input file cannot be blank. Please specify an input file or folder."
    );
  }
  return;
}

const input = argv.input.join(" ");
const stylesheet = argv.stylesheet;

if (input === "") {
  return console.error(
    "Input file cannot be blank. Please specify an input file or folder."
  );
}

fs.lstat(input, (err, stats) => {
  if (err)
    return console.log(
      "Input file does not exist. Please use a different file."
    );

  const output = getOutputName(argv.output);

  //handle text file input
  if (stats.isFile()) {
    if (path.extname(input) !== ".txt") {
      return console.error(
        "File type not supported. Please use a text file (.txt) only."
      );
    }
    processFile(input, output, stylesheet);
    console.log(`File saved to folder ${output} successfully!`);
  }

  //handle folder input
  if (stats.isDirectory()) {
    processFolder(input, output, stylesheet);
  }
});
