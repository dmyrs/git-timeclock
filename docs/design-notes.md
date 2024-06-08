# Design Notes

## 6/7/2024 - starting re-write after some time away

Idea/Goal:

- `.timeclock/` directory 
    - `CONFIG` file - set name, rate, company, project, etc
    - `punches/` directory to store the start of a "punch"
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
    COMPANY NAME
    INVOICE DATE
    INVOICE NUMBER

    BILL TO:
    CUSTOMER NAME

    LINEITEMS:
    
    TOTAL:
    ```

- `INVOICEFILE`

    An index of all unpaid invoices. This file will exist once the first invoice is created.

    ```list
    PROJECT_GUID|INVOICE_GUID
    ```

Directory Sturcture Design:
```
.timeclock
|_ INVOICEFILE
|_ PUNCHFILE
|_ PROJECTFILE
|_ projects/<project-guid>
   |_ shifts
      |_ <shift-guid>
   |_ invoices
      |_ <invoice-guid>
```

Supported CLI API

```
$ timeclock punch -p <project name>

$ timeclock punch cancel

$ timeclock invoice create -p <project name>

$ timeclock invoice cancel -p <project name> -n <invoice number>

$ timeclock invoice paid -p <project name> -n <invoice number>

$ timeclock invoice status

$ timeclock invoice status -p <project name>

$ timeclock invoice status -p <project name> -n <invoice number>

$ timeclock income

$ timeclock income -p <project name>

$ timeclock reset
```
