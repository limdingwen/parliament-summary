# Democracy@Work SG

A simple and modern public oversight website for the Singapore's democracy. 

![](img/screenshot-1.png)

## Features

- A **simple and modern** UI for the public to view and understand the most recent bills and debates in the Singapore Parliament.
- **AI or volunteer-based summaries** of the bills and debates for easier understanding, alongside original sources for accuracy and verification.
- **Search** for recent bills and debates by keywords.

## Usage

You can find the website at https://democracyat.work/.

## API

You can get the data directly via SQL from the Supabase API! All rows are read-only to anonymous users. Use the following credentials:

```
NEXT_PUBLIC_SUPABASE_URL="https://dcumfcshvsrrtkujjmvp.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdW1mY3NodnNycnRrdWpqbXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzMjU4NzIsImV4cCI6MjAzNDkwMTg3Mn0.GDBuYM5uBepzfod0LlG6ZDlV5DWt88Z83Xc8GeJ-E3o"
```

The schema can be found in `supabase/schema.sql`.

Yes, you can indeed run only the front-end while using the existing back-end, but it's not recommended since the back-end is the most important part of the project, and it'll help to have additional instances.

## Installation

You can run the website entirely independently by following the instructions below. We use Supabase for the backend, and NextJS on CloudFlare for the frontend.

**Please note that these instructions have not been fully tested! Check it before using, and feel free to open an issue if you encounter any problems.**

First, clone the repository:
```sh
git clone https://github.com/limdingwen/parliament-summary
cd parliament-summary
```

### Backend

Create a Supabase account and create a new project. You'll also need to install the Supabase CLI tools.

#### Database

Set up the schema in your new Supabase project. Go to the `SQL Editor`, copy and paste the contents of `supabase/schema.sql` into the editor, and run the query.

#### OpenAI

We use OpenAI's API to generate summaries. You'll need to create an account and get an API key at https://platform.openai.com/api-keys. At the time of writing (2 Aug 2024), give it full permissions since it's the only one that works reliably.

Go back to Supabase, and go to `Edge Functions -> Manage secrets -> Add new secret`. Set the name as `OPENAI_API_KEY` and the value as your OpenAI API key.

#### Edge Functions

Edge functions can be deployed using scripts in the `scripts` folder. First, fill in the .env file:
    
```sh
cp scripts/.env.example scripts/.env
```

For reference:

```
SUPABASE_PROJECT_ID="TODO"
SUPABASE_SERVICE_ROLE_KEY="TODO"
SUPABASE_ANON_KEY="TODO"
```

`SUPABASE_PROJECT_ID` is just the random string of characters that Supabase assigned for you, like here: `https://supabase.com/dashboard/project/[ID_HERE]/`.

`SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ANON_KEY` can be found in `Project Settings -> Configuration -> API -> Project API keys`.

Then, run the following scripts:

```sh
cd scripts
./per-10-min.sh
./per-1-hour.sh
./search.sh
cd ..
```

These 3 endpoints are the most important ones. The other ones are optional, mostly used if you want to invoke them individually.

You shouldn't be seeing an `Internal Server Error`. If there is, something has gone wrong, and you should open an issue to check. We might have missed something.

#### Scheduling edge functions

`per-10-min` and `per-1-hour` need to run at scheduled intervals.

We need to enable a database extension to do this. Go to `Database -> Database Management -> Extensions` and turn on `pg_cron` (the default settings are fine).

Then, go to the `SQL Editor` again. Run the following queries, replacing `[SERVICE_ROLE_KEY]` with your Supabase service role API key and `[PROJECT_ID]` with your Supabase project ID:

```sql
select
  cron.schedule(
    'invoke-per-1-hour',
    '0 * * * *', -- every hour at minute 0
    $$
    select
      net.http_post(
          url:='https://[PROJECT_ID].supabase.co/functions/v1/per-1-hour',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer [SERVICE_ROLE_KEY]"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );
```

```sql
select
  cron.schedule(
    'invoke-per-10-min',
    '*/10 * * * *', -- every 10 mins
    $$
    select
      net.http_post(
          url:='https://[PROJECT_ID].supabase.co/functions/v1/per-10-min',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer [SERVICE_ROLE_KEY]"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );
```

You can use `select cron.unschedule('invoke-per-1-hour');` or `select cron.unschedule('invoke-per-10-min');` to stop the scheduled tasks, and you can use `SELECT * FROM cron.job;` to see what jobs have been scheduled.

### Frontend

You'll need to set up a Cloudflare account and install the Wrangler CLI.

#### Environment variables

Create a `.env` file in the `site` directory of the project. You can copy the example file:

```sh
cp site/.env.example site/.env
```

For reference:

```
NEXT_PUBLIC_SUPABASE_URL="TODO"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TODO"
NEXT_PUBLIC_SITE_NAME="Parliament Summary"
NEXT_PUBLIC_ITEMS_PER_PAGE="20"
NEXT_PUBLIC_REPOSITORY_URL="https://github.com/limdingwen/parliament-summary"
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in `Project Settings -> Configuration -> API -> Project API keys` back in Supabase.

`NEXT_PUBLIC_SITE_NAME` is the name of your site (the official one is called `Democracy@Work SG`, and `NEXT_PUBLIC_ITEMS_PER_PAGE` is the number of items to show per page.

`NEXT_PUBLIC_REPOSITORY_URL` is the URL of the GitHub repository you want the site to link to.

## To-dos

Please see the [issues](https://github.com/limdingwen/parliament-summary/issues) page to see what currently requires help.

In general, we hope to turn this website into something like https://www.theyworkforyou.com/ but in Singapore's context, with better annotations for debates and bills, alerts, and more, but this is a volunteer project. Any help is appreciated! ❤️

## Contributing

All contributions welcome! Want something? Make something!

Pretty standard GitHub open source contributing stuff. Fork the project, develop off the `develop` branch (or a feature branch off `develop`), and open a pull request back to the `develop` branch.

If you contribute code to this repository, you are releasing your contribution into the public domain and the CC-0 license.

## Sending Bug Reports

Please see the [issues](https://github.com/limdingwen/parliament-summary/issues) page to see if your bug has already been reported. If not, please open a new issue.

Please make it as clear as possible what the bug is, and how it can be repeatedly encountered.

## Requesting Features

Please see the [issues](https://github.com/limdingwen/parliament-summary/issues) page to see if your feature has already been requested. If not, please open a new issue.

Do note that we are all volunteers here, and we may not have the time to implement every feature request. If you like, you may want to commission us or another developer to implement the feature for you.

## License

This project is licensed under the CC-0 license, and is also released into the public domain.

## Credits

- Lim Ding Wen: Creator

## Acknowledgements

- They Work For You and [Telescope SG](https://telescope-sg.vercel.app/) for the inspiration.
- OpenAI, Supabase, CloudFlare, NextJS, Deno, and all of our dependencies for making this possible.
- The Parliament of Singapore for providing the data.