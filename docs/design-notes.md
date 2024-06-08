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

File Designs:

- PUNCHFILE
- INVOICES
- PROJECTS

Directory Sturcture Design:
```
.timeclock
|_ INVOICES
|_ PUNCHFILE
|_ PROJECTS
|_ projects/<project-guid>
   |_ punches
   |_ shifts
   |_ invoices
```
