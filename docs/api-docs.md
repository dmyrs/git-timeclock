# timeclock API docs

# Command Grammer

A timeclock cli call will always include a `command`. It can also contain a `verb` associated with the command, and a collection of `options`.

```
$ timeclock <command> <verb> [-options]
```

# Commands

## `shift`

Used to start, stop, and cancel a shift. 

### Verbs

- `punch` - create a "punch" - will either start or stop a shift

    #### Options

    - `-p` - required - project name

    #### Example

    Start/end a punch for the "customer-api" project.
    ```
    $ timeclock shift punch -p customer-api
    ```
    
- `cancel` - end a shift without saving the details

    #### Options

    - N/A

    #### Example

    Cancel the current shift.
    ```
    $ timeclock shift cancel
    ```

## `invoice`

Used to create invoices. Can also cancel and mark as paid. 

Also provides functionality to see unpaid invoices.

### Verbs

- `create` - add all shifts for a project to an invoice for the customer and return the invoice number

    #### Options

    - `-p` - required - project name

    #### Example

    Create an invoice for the "customer-api" project.
    ```
    $ timeclock invoice create -p customer-api
    XXXXX
    ```

- `cancel` - cancel an existing invoice 

    #### Options

    - `-p` - required - project name

    #### Example

    Cancel invoice number XXXXX for project "customer-api".
    ```
    $ timeclock invoice cancel -p customer-api -n XXXXX
    ```

- `paid` - mark an invoice as paid by the customer

    #### Options

    - `-p` - required - project name

    #### Example

    Mark invoice XXXXX as paid for project "customer-api".
    ```
    $ timeclock invoice paid -p customer-api -n XXXXX
    ```

- `status` - show any unpaid invoices or check a specific invoice

    #### Options

    - `-p` - optional - project name

    #### Example

    Show all unpaid invoices for all projects.
    ```
    $ timeclock invoice status
    ```

    Show all unpaid invoices for the "customer-api" project.
    ```
    $ timeclock shift punch -p customer-api
    ```

    Show the status of invoice XXXXX in project "customer-api".
    ```
    $ timeclock shift punch -p customer-api -n XXXXX
    ```

## `income`

Used to see income generated from paid invoices.

### Verbs

- `punch` - create a "punch" - will either start or stop a shift

    #### Options

    - `-p` - optional - project name

    #### Example

    See income from all projects.
    ```
    $ timeclock income
    ```

    See income from the "customer-api" project.
    ```
    $ timeclock income -p customer-api
    ```