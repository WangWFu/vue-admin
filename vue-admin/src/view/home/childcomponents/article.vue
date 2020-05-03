<template>
    <el-container>
   <el-header style="text-align: right; font-size: 12px">
        <el-dropdown @command="loginout">
          <!-- <i class="el-icon-setting" style="margin-right: 15px"></i> -->
          <span class="el-dropdown-link">admin</span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item> -->
            <el-dropdown-item command="out">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
         <!-- <el-dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        
      </el-header>
      <el-main>
       <router-view></router-view>
      </el-main>
    </el-container>

</template>
<script>

export default {
  name: "articles",
  data() {
    return {
     adminName:''
    }
  },
  components: {
   
  },
  methods:{
  loginout(){
     //退出登录
     window.sessionStorage.clear();
     this.$router.push('/login')
  }
  }
}
</script>
<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-dropdown-link {
    cursor: pointer;
  }
</style>