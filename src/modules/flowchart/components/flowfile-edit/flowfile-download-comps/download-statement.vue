<template>
  <div id="download-statement">
    <b-layout mode="horizontal" placement="left" space="40px" :border="false">
      <div slot="first" class="txt">声明：</div>
      <div slot="last" class="txt">
        <div>（1）下载新的流程图需消耗1次额度，若该流程图版本重新编辑变更，将视作新流程图，下载将重新计费；</div>
        <div>（2）同一版本的流程图，多次下载不重复计费；</div>
        <div>（3）流程图版本变化判定：流程图图形元素发生增、删变动时，则为新版本。</div>
      </div>
    </b-layout>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'
export default {
  components: {
    BLayout
  }
}
</script>

<style lang="scss" scoped>
#download-statement{
  .txt{
    font-size: 13px;
    color: #999;
  }
}
</style>
