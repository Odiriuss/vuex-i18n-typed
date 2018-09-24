require('log-timestamp');
const configHelper = require('./config-helper');

require('yargs') // eslint-disable-line
  .usage('Usage: $0 <command> <source> <destination> [options]')
  .command('emit <source> <destination>', 'Emit .ts files from the files in the source folder.', (yarg) => {
    yarg
      .positional('source', {
        describe: 'Source folder where the .json files are stored.'
      })
      .positional('destination', {
        describe: 'Destination folder where the .ts files will be emitted.'
      })
  }, (argv) => {
    configHelper.createEmit(argv);
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
      })
  }, (argv) => {
    configHelper.startWatching(argv);
  })
  .option('lang', {
    alias: 'l',
    default: 'en',
    describe: 'Sets the language which will trigger the emit of the .ts file.'
  })
  .demandCommand(1)
  .help()
  .showHelpOnFail(false, 'Whoops, something went wrong! run with --help')
  .argv;