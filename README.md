# git-timeclock
A timeclock solution for freelance developers to track billable hours.

## Getting Started

[Install deno!](https://deno.land/manual/getting_started/installation#installation)


_**Note:** Add `--allow-run --allow-read --allow-write` to commands skip security prompts._

### Create your first punch

```
deno run https://deno.land/x/git_timeclock@v0.1.0-alpha/src/app/timeclock.ts <username>
```

### End a shift

```
deno run https://deno.land/x/git_timeclock@v0.1.0-alpha/src/app/timeclock.ts <username> --end