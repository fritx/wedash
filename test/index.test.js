// https://github.com/nuxt/nuxt.js/blob/dev/examples/with-ava
// https://github.com/nuxt/nuxt.js/issues/1379#issuecomment-322389621
import test from 'ava'
import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

// We keep the nuxt and server instance
// So we can close them at the end of the test
const port = 4000
let nuxt = null
let server = null

// Init Nuxt.js and create a server listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const app = express()
  const rootDir = resolve(__dirname, '..')
  let config = {}

  try {
    config = require(resolve(rootDir, 'nuxt.config.js'))
  } catch (e) {
    console.log('Unable to locate nuxt config!')
  }

  config.rootDir = rootDir // project folder
  config.dev = false // production build

  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()

  app.use(nuxt.render)
  server = app.listen(port)
})

// Example of testing only generated html
test('Route / exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/', context)
  t.true(html.includes('<h1 class="red">Hello world!</h1>'))
})

// Example of testing via dom checking
test('Route / exits and render HTML with CSS applied', async t => {
  const window = await nuxt.renderAndGetWindow(`http://localhost:${port}/`)
  const element = window.document.querySelector('.red')
  t.not(element, null)
  t.is(element.textContent, 'Hello world!')
  t.is(element.className, 'red')
  t.is(window.getComputedStyle(element).color, 'red')
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', t => {
  server.close()
  nuxt.close()
})
