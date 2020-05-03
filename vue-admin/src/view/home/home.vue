<template>
  <div class="contain">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <sidebar></sidebar>
      <articles></articles>
    </el-container>
  </div>
</template>
<script>


import sidebar from '@/components/common/sideBar';
import articles from './childcomponents/article';




export default {
  name: "home",
  data() {
      return {  
       
      }
    },
  components: {
    sidebar,
    articles
  },
};
</script>
<style scoped>
/* html,body{
    padding: 0;
    margin: 0;
} */
.contain{
  background-color: #fff;
}

</style>