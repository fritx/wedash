<template>
  <div class="container">
    <input v-show="mode === 'replace'"
      ref="input" class="input"
      @compositionstart="compositionStart"
      @compositionend="compositionEnd"
      @input="handleInput"
      v-model="input"
      autofocus
    >
    <div ref="editor" class="editor">
      <span v-for="(c, i) in chars" :key="`${i}-${c}`"
        :ref="`char-${i}`"
        :data-index="i"
        @click="charClick(i)"
      >{{c}}</span>
    </div>
  </div>
</template>

<script>
import text from '~/assets/text'

export default {
  data () {
    return {
      replacedIndex: null,
      isComposing: false,
      input: '',
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
    compositionEnd () {
      this.isComposing = false
      this.handleInput()
    },
    compositionStart () {
      this.isComposing = true
    },
    handleInput () {
      if (this.isComposing) return
      let v = this.input[0] || '' // 只取第1个字符
      if (!v) return
      let i = this.replacedIndex
      this.text = this.text.slice(0, i) + v + this.text.slice(i + 1)
      this.replacedIndex = null
      this.input = ''
      this.$refs.editor.focus()
      this.mode = 'normal'
    },
    insert (text, prepend = false) {
      let selection = window.getSelection()
      if (!selection.rangeCount) return
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
      if (!selection.rangeCount) return
      let range = selection.getRangeAt(0)
      let text = range.toString()
      this.clipboard.unshift(text)
    },
    keyDown (e) {
      let c = e.keyCode
      if (this.mode === 'replace') {
        return
      }
      if (this.mode === 'insert') {
        return
      }
      e.preventDefault()
      if (this.mode === 'normal') {
        if (c === 'Y'.charCodeAt(0)) {
          return this.copy()
        }
        if (c === 'P'.charCodeAt(0)) {
          let prepend = e.shiftKey
          return this.paste(prepend)
        }
        if (c === 'R'.charCodeAt(0)) {
          let input = this.$refs.input
          if (!input) return
          let selection = window.getSelection()
          if (!selection.rangeCount) return
          let range = selection.getRangeAt(0)
          this.storedRange = range
          let i = range.startOffset
          this.replacedIndex = i
          let span = this.$refs[`char-${i}`][0]
          input.style.left = span.offsetLeft + 'px'
          input.style.top = span.offsetTop + 'px'
          this.mode = 'replace'
          this.$nextTick(() => {
            input.focus()
          })
          return
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
.container {
  font-family: monospace;
  margin: 60px;
  font-size: 20px;
  position: relative;
}
.editor {
  border: solid 1px silver;
  min-height: 400px;
  max-height: 500px;
  background-color: rgba(0, 0, 0, .8);
  color: white;
  white-space: pre-wrap;
}
.input {
  position: absolute;
  font: inherit;
  padding: 0;
  border: none;
  opacity: 0;
}
</style>

<style>
::selection {
  color: white;
  background-color: rgba(255, 255, 255, .3);
}
</style>
