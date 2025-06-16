<!-- src/components/ToastEditor.vue -->
<template>
  <div ref="editorRoot" />
</template>

<script setup>
import '@toast-ui/editor/dist/toastui-editor.css'
import { onMounted, ref } from 'vue'
import Editor from '@toast-ui/editor'

const editorRoot = ref(null)
let editorInstance = null

onMounted(() => {
  editorInstance = new Editor({
    el: editorRoot.value,
    height: '500px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    initialValue: 'Hello, Toast UI!'
  })
})
</script>
