<script setup lang="ts">
import { footerData } from '~/content/footer';


const toast = useToast();
</script>

<template>
  <USeparator icon="i-lucide-code" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="footerData().columns">
          <template #left>
            <div>
              <AppLogo :size="5" />
              <p class="font-normal text-muted text-md mt-5">
                {{ footerData().msg }}
              </p>
              <div class="flex gap-2 mt-5">
                <UButton
                  v-for="(social, index) in useAppConfig().site.socialLinks"
                  :key="index"
                  :icon="social.icon"
                  :to="social.link"
                  variant="soft"
                  color="neutral"
                />
              </div>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <div>
      <p class="text-sm text-muted text-center">
        {{ footerData().copyright }}
        <br />
        <UButton v-bind="footerData().engineeredBy"  variant="link"/>
      </p>
    </div>
  </UFooter>
</template>
