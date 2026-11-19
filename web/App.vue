<script setup lang="ts">
import { useElementPlusConfig } from './hooks'

const config = useElementPlusConfig()
</script>

<template>
  <el-config-provider v-bind="config">
    <el-watermark style="height: 100%;">
      <router-view />
    </el-watermark>
  </el-config-provider>
</template>
