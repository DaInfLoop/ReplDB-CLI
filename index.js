#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const { version } = require('./package.json')
const Database = require('@replit/database');
const db = new Database;

program
  .showSuggestionAfterError(true)
  .name('repldb')
  .version(`repldb-cli v${version}`)
  .description('Interact with ReplDB via the command line')

program.command('get')
  .description('Get a value in the database')
  .argument('<key...>', 'Key to get')
  .action(async key => {
    if (!process.env.REPLIT_DB_URL) {
      console.error("repldb: get: cannot find REPLIT_DB_URL environmental variable")
      process.exitCode = 3
    }
    try {
      const v = await db.get(key.join(' '))
      if (v) console.log(v)
      else {
        console.error("repldb: get: non-existant key")
        process.exitCode = 2
      }
    } catch (e) {
      console.error(`repldb: get: ${e.message}`)
      process.exitCode = 1
    }
  });

program.command('set')
  .description('Set a value in the database')
  .requiredOption('-k, --key <key...>', "Key to set")
  .requiredOption('-v, --value <value...>', "Value to set")
  .action(async options => {
    if (!process.env.REPLIT_DB_URL) {
      console.error("repldb: set: cannot find REPLIT_DB_URL environmental variable")
      process.exitCode = 3
    }
    try {
      const v = await db.set(options.key.join(' '), options.value.join(' '))
    } catch (e) {
      console.error(`repldb: set: ${e.message}`)
      process.exitCode = 1
    }
  });

program.command('delete')
  .description('Delete a value from the database')
  .argument('<key...>', 'Key to delete')
  .action(async key => {
    if (!process.env.REPLIT_DB_URL) {
      console.error("repldb: delete: cannot find REPLIT_DB_URL environmental variable")
      process.exitCode = 3
    }
    try {
      await db.delete(key)
    } catch (e) {
      console.error(`repldb: delete: ${e.message}`)
      process.exitCode = 1
    }
  });

program.command('list')
  .description('List keys from the database')
  .argument('[prefix]', 'Prefix to search for')
  .action(async prefix => {
    if (!process.env.REPLIT_DB_URL) {
      console.error("repldb: delete: cannot find REPLIT_DB_URL environmental variable")
      process.exitCode = 3
    }
    try {
      let keys = await db.list(prefix)
      process.stdout.write(keys.join('\n'))
      keys.length ? console.log() : null
    } catch (err) {
      console.error(`repldb: list: ${e.message}`)
      process.exitCode = 1      
    }
  });

program.command('nuke')
  .description("Nuke the database. This is irreversible!")
  .option("-c, --confirm", "Confirm you want to nuke the database")
  .action(async options => {
    if (!process.env.REPLIT_DB_URL) {
      console.error("repldb: nuke: cannot find REPLIT_DB_URL environmental variable")
      process.exitCode = 3
    }
    if (!options.confirm) return console.log("repldb: nuke: You must confirm the nuke with the --confirm option.")
    try {
      await db.empty()
    } catch (err) {
      console.error(`repldb: nuke: ${e.message}`)
      process.exitCode = 1      
    }
  })

if (require.main == module) {
  program.parse();
} else {
  throw new Error("There is no programmatic API for repldb-cli.")
}