"use strict"

const newrelic = require("newrelic")
const { Client } = require("pg")
const Koa = require('koa')
const Router = require('koa-router')
const dbconfig = require('./dbconfig')

const app = new Koa()
const router = new Router()

const PORT = 1999

const asyncData = async () => {
  const client = new Client(dbconfig)
  try {
    await client.connect()
  } catch (err) {
    console.error("Unable to connect to the database:", err)
  }
  const results = await client.query(`SELECT pg_sleep(1), now() as sleep`)
  let result = ''
  if (results.rows.length > 0) {
    result = results.rows[0].sleep
  }

  await client.end()

  return result
}

const syncData = () => {
  const client = new Client(dbconfig)

  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        client.end()
        reject(err)
      }

      client.query(`SELECT pg_sleep(1), now() as sleep`,
        (err, result) => {
          if (err) {
            client.end()
            reject(err)
          }

          client.end()
          resolve(result)
        })
    })
  })
}

router.get('/', async (ctx, next) => {
  ctx.body = 'big data'
})
.get('/async', async (ctx, next) => {
  const moarData = await asyncData()

  ctx.body = moarData
})
.get('/sync', async (ctx) => {
  const result = await syncData()
  ctx.body = result
})
.get('/kill', async (ctx) => {
  ctx.body = 'goodbye'
  process.exit(0)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`app listening at port: localhost:${PORT}`)
})
