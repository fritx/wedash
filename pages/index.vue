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
      text: text.trim(),
      range: { start: 0, end: 0 }
    }
  },
  computed: {
    chars () {
      return this.text.split('')
    }
  },
  methods: {
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
