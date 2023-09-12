# git-timeclock
A timeclock solution for freelance developers to track billable hours.

## Getting Started

[Install deno!](https://deno.land/manual/getting_started/installation#installation)


_**Note:** Add `--allow-run --allow-read --allow-write` to skip security prompts._

### Create your first punch

```
deno run https://deno.land/x/git_timeclock@v0.2.1-alpha/mod.ts <username:string>
```

### End a shift

```
deno run https://deno.land/x/git_timeclock@v0.2.1-alpha/mod.ts <username:string> <rate:decimal> --end
```

### Create an Invoice

```
deno run https://deno.land/x/git_timeclock@v0.2.1-alpha/mod.ts <username> --invoice <invoicee:string> <company:string> <rate:decimal>
```
