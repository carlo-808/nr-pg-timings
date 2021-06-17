# Instrumented pg query timings repro

It appears that postgres query timings are extremely short. This is an attempt to verify and reproduce the bug.
Follow instructions below to set up environment. View data on NROne to see postgres timings on the Summary page or database page.

## Setup & Reproduction
* run `npm install`

* Add a `.env` file to the root of the project populating the following environment variables:
  * NEW_RELIC_LICENSE_KEY
  * NEW_RELIC_HOST (only needed for staging)
  * PG_DATABASE
  * PG_HOST
  * PG_USER
  * PG_PASSWORD
  * PG_PORT

## Data Setup

You just need a postgres server along with credentials

## Running the reproduction

Run `npm run start` to start the server at `http://localhost:1999`

### This is the main route for reproducing the error
Send traffic to the route `http://localhost:1999/sync` for synchronous call

### This is for testing out instrumenting at a deeper location unrelated to bug
Send traffic to the base route `http://localhost:1999/async` for asynchronous call

I recommend using a module like `autocannon` to send a burst of traffic to get good averages.
