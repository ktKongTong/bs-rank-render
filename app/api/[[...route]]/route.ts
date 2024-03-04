import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge';

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

app.get('/api/player/:uid', async (c)=> {
  const {uid} = c.req.param()

  const items = [
    fetch(`https://scoresaber.com/api/player/${uid}/scores?page=1&sort=top`).then(res=>res.json()),
    fetch(`https://scoresaber.com/api/player/${uid}/scores?page=2&sort=top`).then(res=>res.json()),
    fetch(`https://scoresaber.com/api/player/${uid}/scores?page=3&sort=top`).then(res=>res.json()),
    fetch(`https://scoresaber.com/api/player/${uid}/scores?page=4&sort=top`).then(res=>res.json()),
  ]

  const res = (await Promise.all(items)).map(item=>item["playerScores"])
  return c.json(res)
})

app.get('/api/player/:uid/full', async (c)=> {
  const {uid} = c.req.param()
  const platform = c.req.query('platform')
  // let url = 

  const res = await fetch(`https://scoresaber.com/api/player/${uid}/full`)
  return res
})



app.get('/api/beatsaver/:id', async (c)=> {
  const {id} = c.req.param()
  const res = await fetch(`https://beatsaver.com/api/maps/id/${id}`)
  return res
})


app.get('/api/beatleader/:uid', async (c)=> {
  const {uid} = c.req.param()
  
  const res = await fetch(`https://api.beatleader.xyz/player/${uid}`)
  return res
})
app.get('/api/beatleader/:uid/scores', async (c)=> {
  const {uid} = c.req.param()
  const url = `https://api.beatleader.xyz/player/${uid}/scores?count=32&sortBy=pp&order=asc`
  console.log(url)
  const res = await fetch(url)
  return res
})

app.get('/api/beatleader/:uid/pinnedScores', async (c)=> {
  const {uid} = c.req.param()
  const res = await fetch(`https://api.beatleader.xyz/player/${uid}/pinnedScores`)
  return res
})
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)