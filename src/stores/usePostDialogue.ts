import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePostDialgueBox = defineStore(
  'usePostDialgueBox',
  () => {
    const formIsValid = ref(false)
    const blogTitle = ref('')
    const blogDescription = ref('')
    const mode = ref<'create' | 'edit'>('create')
    const editingPostId = ref<string | null>(null)
    const showCreatePostPopUp = ref(false)

    function resetForm() {
      blogTitle.value = ''
      blogDescription.value = ''
      formIsValid.value = false
      editingPostId.value = null
      mode.value = 'create'
      showCreatePostPopUp.value = false
    }

    function setBlogTitle(payload: string) {
      blogTitle.value = payload
    }

    function setBlogDescription(payload: string) {
      blogDescription.value = payload
    }

    function setEditingPostId(payload: string) {
      editingPostId.value = payload
    }

    function setMode() {
      mode.value = 'edit'
    }

    return {
      formIsValid,
      blogTitle,
      blogDescription,
      mode,
      editingPostId,
      showCreatePostPopUp,
      resetForm,
      setBlogTitle,
      setBlogDescription,
      setEditingPostId,
      setMode,
    }
  },
  {
    persist: true,
  },
)
