<template>
  <v-card class="rounded-xl pa-0 mx-auto" max-width="900" elevation="8">
    <!-- Header -->
    <v-toolbar color="blue" elevation="0" class="text-h6 text-white font-weight-bold px-6 py-3">
      {{ dialogueStore.mode === 'create' ? 'Create a New Blog Post' : 'Edit Blog Post' }}
    </v-toolbar>

    <!-- Form -->
    <v-form ref="postForm" v-model="dialogueStore.formIsValid" @submit.prevent="handleSubmit">
      <v-card-text class="pb-0">
        <!-- Title Input -->
        <v-text-field
          v-model="dialogueStore.blogTitle"
          label="Blog Title"
          variant="outlined"
          rounded="lg"
          density="comfortable"
          class="mt-5"
          prepend-inner-icon="mdi-format-title"
          :rules="[(v) => !!v || 'Title is required']"
          required
        />

        <!-- Description Input -->
        <v-textarea
          v-model="dialogueStore.blogDescription"
          label="Blog Description"
          variant="outlined"
          rounded="lg"
          counter="1000"
          maxlength="1000"
          rows="5"
          auto-grow
          density="comfortable"
          prepend-inner-icon="mdi-text"
          class="mt-3"
          :rules="[(v) => !!v || 'Description is required']"
          required
        />
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="justify-end px-6 pb-4">
        <v-btn
          variant="text"
          color="grey-darken-1"
          class="text-none font-weight-medium"
          @click="dialogueStore.resetForm"
        >
          Close
        </v-btn>
        <v-btn
          color="blue"
          type="submit"
          variant="elevated"
          class="text-none font-weight-medium"
          rounded="lg"
          :disabled="!dialogueStore.formIsValid"
        >
          {{ dialogueStore.mode === 'create' ? 'Post' : 'Update' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease;
}
.v-card:hover {
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.08);
}
</style>

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
    console.log(err)
  }
}
</script>
