# Design Notes

## 6/7/2024 - 6/8/2024 - starting re-write after some time away

## Brainstorming:

- `.timeclock/` directory 
    - `CONFIG` file - set name, rate, company, project, etc
    - the same command will add an end punch (something like `timeclock punch`) and create a "shift"
    - `shifts/` directory to store un-invoiced shifts
        - "un-invoiced shift" = a shift that hasn't been chared the the customer
    - `invoices/` directory to aggregate shifts onto an invoice for the client
        - this is where some decisions come into play:
            - do I want this to be something they stand up per repo, and provide a service to push the data to? That would require paid infrasturcture and authentication - NO
            - all local would be ideal
                - setup the path to the `.timeclock` directory in an environment variable, so it can be placed centrally on the dev's machine and shared across repos. 
    - allow the concept of "projcets" -> customer
        - one project at a time? - YES
            - an "in repo" option that took commit notes would be cool?

File Designs:

- `PROJECTFILE`

    An index of all projects the user has interacted with. Each project is assigned a PROJECT_GUID.

    ```list
    PROJECT_NAME|PROJECT_GUID
    ```

- `PUNCHFILE`

    If this file exists, the user has "punched in" on a project.

    ```singleRow
    PROJECT_GUID|PUNCH_GUID|PUNCH_START_UTC|SHIFT_RATE
    ```

- `shifts/` files

    filename: SHIFT_GUID
    ```
    SHIFT_START_UTC|SHIFT_END_UTC|SHIFT_RATE|SHIFT_TOTAL|PAID
    ```

- `invoices/` files

    filename: INVOICE_GUID
    ```
    DMYRS Software
    invoicing@dmyrs.com
    INVOICE DATE
    INVOICE NUMBER

    BILL TO:
    CUSTOMER NAME
    CUSTOMER EMAIL

    LINEITEMS:
    
    TOTAL:
    ```

- `INVOICEFILE`

    An index of all unpaid invoices. This file will exist once the first invoice is created.

    ```list
    PROJECT_GUID|INVOICE_GUID
    ```

- `INCOMEFILE`

    A total of the income from paid invoices. Used so it doesn't need to be calculated each time.

    ```
    INCOME_$_AMMOUNT
    ```

Directory Sturcture Design:
```
.timeclock
|_ INVOICEFILE
|_ INCOMEFILE
|_ PUNCHFILE
|_ PROJECTFILE
|_ projects/<project-guid>
   |_ INCOMEFILE
   |_ shifts
      |_ <shift-guid>
   |_ invoices
      |_ INVOICEFILE
      |_ <invoice-guid>
```

Supported CLI API

[Official documentation](./api-docs.md)

```
$ timeclock shift punch -p <project name>

$ timeclock shift cancel

$ timeclock invoice create -p <project name>

$ timeclock invoice cancel -p <project name> -n <invoice number>

$ timeclock invoice paid -p <project name> -n <invoice number>

$ timeclock invoice status

$ timeclock invoice status -p <project name>

$ timeclock invoice status -p <project name> -n <invoice number>

$ timeclock income

$ timeclock income -p <project name>
```
