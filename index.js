import express from 'express'

import path from 'path'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'))
})

app.listen(port, () => console.log(`Dev server started on port ${port}`))
