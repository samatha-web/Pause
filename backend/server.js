require('dotenv').config()

const Fastify = require('fastify')

const app = Fastify({
  logger: true   // req/err logs in terminal
})

app.register(require('@fastify/cors'), {
  origin: true
})

app.register(require('./authRoutes'))

app.get('/', async () => {
  return { status: 'API running' } //temp
})

// const connectDB = require('./db')
// app.get('/db-test', async () => {
//   const db = await connectDB()
//   return { status: 'DB connected' }
// })

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
