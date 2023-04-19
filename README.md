# repldb-cli
> Interact with ReplDB via the command line

Install:
```sh
$ npm install -g repldb-cli
```

Note: You must have a `REPLIT_DB_URL` environmental variable for it to work. If you're using Replit, the variable already exists.

## Usage
```sh
$ repldb [options] [command]
```

```sh
$ repldb get <key>                       # Get a value in the database
$ repldb set -k <key> -v <value>         # Set a value in the database
$ repldb delete <key>                    # Delete a value from the database
$ repldb list [prefix]                   # List keys from the database
$ repldb nuke [options]                  # Nuke the database. This is irreversible!
```