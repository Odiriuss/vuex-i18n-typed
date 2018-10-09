require('log-timestamp');
const configHelper = require('./config-helper');

require('yargs')
  .usage('Usage: $0 <command> <source> <destination> [options]')
  .command('emit <source> <destination>', 'Emit .ts files from the files in the source folder.', (yarg) => {
    yarg
      .positional('source', {
        describe: 'Source folder where the .json files are stored.'
      })
      .positional('destination', {
        describe: 'Destination folder where the .ts files will be emitted.'
      });
  }, (argv) => {
    configHelper.startEmit(argv);
  })
  .command('watch <source> <destination>', 'Emit .ts file from the files in the source folder whenever a file in the source folder changes.', (yarg) => {
    yarg
      .positional('source', {
        describe: 'Source folder where the .json files are stored.',
        type: "string"
      })
      .positional('destination', {
        describe: 'Destination folder where the .ts files will be emitted.',
        type: "string"
      });
  }, (argv) => {
    configHelper.startWatching(argv);
  })
  .option('lang', {
    alias: 'l',
    default: 'en',
    describe: 'Sets the language which will trigger the emit of the files defined in classes option.'
  })
  .option('templates', {
    alias: 't',
    describe: 'Templates folder where the source files are located.',
    type: "string"
  })
  .option('transforms', {
    alias: 'tf',
    describe: 'Transforms folder where files to be used for transforming source files are located. All files in the folder have to export a map object so that we can import them correctly.',
    type: "string"
  })
  .option('cleaner', {
    alias: 'c',
    describe: 'Path to clean module which will clean up the source code. Must export cleanSource function which accepts content as a string and returns a JSON object.',
    type: "string"
  })
  .option('extension-destinations', {
    alias: 'ed',
    describe: 'Sets the destination for each extension.',
    type: "array"
  })
  .demandOption('templates')
  .demandCommand(1)
  .help()
  .showHelpOnFail(false, 'Whoops, something went wrong! run with --help')
  .argv;