const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(express.json())

const authRoutes = require('./routes/auth')
const transaksiRoutes = require('./routes/transaksi')
const authGuard = require('./middleware/authGuard')

app.use('/api/auth', authRoutes)
app.use('/api/transaksi', authGuard, transaksiRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})
