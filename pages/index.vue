<template>
  <div class="editor">
    <span v-for="(c, i) in chars" :key="`${i}-${c}`"
      :ref="`char-${i}`"
      :data-index="i"
      @click="charClick(i)"
    >{{c}}</span>
  </div>  
</template>

<script>
import text from '~/assets/text'

export default {
  data () {
    return {
      clipboard: [],
      mode: 'normal',
      text: text.trim(),
      range: { start: 0, end: 0 }
    }
  },
  computed: {
    chars () {
      return this.text.split('')
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },
  beforeDestory () {
    window.removeEventListener('keydown', this.keyDown)
  },
  methods: {
    insert (text, prepend = false) {
      let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      let i = +range.endContainer.parentNode.dataset.index + 1
      if (prepend) i -= 1 
      this.text = this.text.slice(0, i) + text + this.text.slice(i)
    },
    paste (prepend = false) {
      let text = this.clipboard[0] || ''
      this.insert(text, prepend)
    },
    copy () {
      document.execCommand('copy')
      let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      let text = range.toString()
      this.clipboard.unshift(text)
    },
    keyDown (e) {
      let c = e.keyCode
      if (this.mode === 'insert') {
        return
      }
      // e.preventDefault()
      if (this.mode === 'normal') {
        if (c === 'Y'.charCodeAt(0)) {
          return this.copy()
        }
        if (c === 'P'.charCodeAt(0)) {
          let prepend = e.shiftKey
          return this.paste(prepend)
        }
      }
    },
    charClick (i) {
      let range = document.createRange()
      let span = this.$refs[`char-${i}`][0]
      range.selectNode(span)
      let selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}
</script>

<style scoped>
.editor {
  font-family: monospace;
  border: solid 1px silver;
  margin: 60px;
  min-height: 400px;
  max-height: 500px;
  font-size: 20px;
  background-color: rgba(0, 0, 0, .8);
  color: white;
  white-space: pre-wrap;
}
</style>

<style>
::selection {
  color: white;
  background-color: rgba(255, 255, 255, .3);
}
</style>
