<template>
  <v-card class="rounded-xl W-50">
    <v-toolbar color="blue" elevation="0" class="text-h6 text-whit px-10">
      {{ dialogueStore.mode === 'create' ? 'Create a New Blog Post' : 'Edit Blog Post' }}
    </v-toolbar>

    <v-form ref="postForm" v-model="dialogueStore.formIsValid" @submit.prevent="handleSubmit">
      <v-card-text class="pb-0">
        <v-text-field
          v-model="dialogueStore.blogTitle"
          label="Blog Title"
          variant="outlined"
          class="mt-5"
          :rules="[(v) => !!v || 'Title is required']"
          required
        />

        <v-textarea
          v-model="dialogueStore.blogDescription"
          label="Blog Description"
          variant="outlined"
          counter="1000"
          maxlength="1000"
          class="mt-3"
          :rules="[(v) => !!v || 'Description is required']"
          required
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="dialogueStore.resetForm">Close</v-btn>
        <v-btn color="blue" type="submit" variant="elevated" :disabled="!dialogueStore.formIsValid">
          {{ dialogueStore.mode === 'create' ? 'Post' : 'Update' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { createPostAPI, updatePostAPI } from '@/API/ApiServices'
import { useToast } from '@/composables/useToasts'
import { usePostDialgueBox } from '@/stores/usePostDialogue'

const { success } = useToast()
const dialogueStore = usePostDialgueBox()
const postForm = ref()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

async function handleSubmit() {
  const isValid = await postForm.value?.validate()
  if (!isValid.valid) return

  const postData = {
    title: dialogueStore.blogTitle,
    description: dialogueStore.blogDescription,
  }

  try {
    if (dialogueStore.editingPostId != null) {
      const res = await updatePostAPI(dialogueStore.editingPostId, postData)

      if (res.data.success) {
        success(res.data.message)
      }
    } else {
      const res = await createPostAPI(postData)

      if (res.data.success) {
        success(res.data.message)
      }
    }

    dialogueStore.resetForm()
    emit('refresh')
  } catch (err) {
    console.log('geting error in create new post')
  }
}
</script>
