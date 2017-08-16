<template>
  <div class="editor" @mouseup="editorMouseUp">
    <span v-for="(c, i) in chars" :key="`${i}-${c}`"
      :data-index="i"
      :class="{ selected: inRange(i) }"
      @mousedown="mouseDown(i)"
      @mouseenter="mouseEnter(i)"
      @click="charClick(i)"
    >{{c}}</span>
  </div>  
</template>

<script>
export default {
  data () {
    return {
      code: 'hello world',
      range: { start: 0, end: 0 }
    }
  },
  computed: {
    chars () {
      return this.code.split('')
    }
  },
  methods: {
    inRange (i) {
      return i >= this.range.start && i <= this.range.end
    },
    editorMouseUp (e) {
      let i = +e.target.dataset.index || Infinity
      this.mouseEnter(i)
      this.isMouseDown = false
    },
    mouseEnter (i) {
      if (!this.isMouseDown) return
      if (i >= this.range.start) {
        this.range.end = i
      } else {
        this.range.start = i
      }
    },
    mouseDown (i) {
      this.isMouseDown = true
      this.range.start = i
      this.range.end = i
    },
    charClick (i) {
      // this.range = [i, i]
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
  font-size: 20px;
  background-color: rgba(0, 0, 0, .8);
  color: white;
}
.selected {
  background-color: rgba(255, 255, 255, .3);
}
</style>

<style>
::selection {
  color: inherit;
  background-color: inherit;
}
</style>
