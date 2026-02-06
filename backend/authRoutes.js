const { OAuth2Client } = require('google-auth-library')  // To verify ID Tokens
const jwt = require('jsonwebtoken')
const connectDB = require('./db')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

async function routes(fastify, options) {

  // end point for Google Sign-In
  fastify.post('/auth/google', async (request, reply) => {
    try {
      const { idToken } = request.body

      if (!idToken) {
        return reply.code(400).send({ error: 'No token provided' })
      }

      const ticket = await client.verifyIdToken({  // Verify token with Google
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      const payload = ticket.getPayload()  // Extracting user info from token

      const googleId = payload.sub
      const email = payload.email
      const name = payload.name
      const picture = payload.picture

      const db = await connectDB()
      const users = db.collection('users')

      let user = await users.findOne({ googleId })

      if (!user) {
        const result = await users.insertOne({
          googleId,
          email,
          name,
          picture,
          createdAt: new Date()
        })

        user = {
          _id: result.insertedId,
          googleId,
          email,
          name,
          picture
        }
      }

      // Generating JWT for frontend
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      //Final response in frontend
      return {
        token,
        user
      }

    } catch (err) {
      fastify.log.error(err)
      return reply.code(401).send({ error: 'Authentication failed' })
    }
  })
}

module.exports = routes
