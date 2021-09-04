In-memory database similar to Redis.

How to use
----
```
node db.js
```

Commands are processed per line.

Example
----
```
node db.js
SET a 10
BEGIN
NUMEQUALTO 10
1
BEGIN
UNSET a
NUMEQUALTO 10
ROLLBACK
NUMEQUALTO 10
COMMIT
END
```

Supported commands (case-insensitive)
----
SET - `name` `value` - Sets the variable ​name​ to the value ​value​. Neither variable names nor values will contain spaces. Command will be ignored if arguments are empty.
GET - `name` - Prints out the value of the variable n​ ame,​ or NULL if that variable is not set. Command will be ignored if arguments are empty.
UNSET - `name` - Deletes the variable ​name​, making it just like that variable was never set. Command will be ignored if arguments are empty.
NUMEQUALTO - `value` - Prints out the number of variables that are currently set to value .​ If no variables equal that value, prints 0. Command will be ignored if arguments are empty.
END - Exit the program.
BEGIN - Open a new transaction block. Transaction blocks can be nested; a BEGIN can be issued inside of an existing block.
ROLLBACK - Undo all of the commands issued in the most recent transaction block, and close the block. Prints nothing if successful, or prints ​NO TRANSACTION​ if no transaction is in progress.
COMMIT​ – Closes all open transaction blocks, permanently applying the changes made in them. Prints nothing if successful, or prints ​NO TRANSACTION​ if no transaction is in progress.
