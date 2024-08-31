<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-modal-provider>
            <FeedbackApi />
            <slot />
          </n-modal-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>
