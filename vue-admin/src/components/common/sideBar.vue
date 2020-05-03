<template>
  <div>
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-aside :width="isCollapse ? '64px' : '200px'" style="background-color: rgb(238, 241, 246)">
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="'/'+subitem.path + ''"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  data() {
    return {
      menulist: [],
      isCollapse: false,
      activePath:'',
      indexPath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = this.$route.path
    // console.log(this.activePath);
    
    // :default-active="this.$route.path"
  },
  watch:{
    // activePath(){
    //   this.indexPath = this.$router.history.current.path
    // }
  $route(to){
    // console.log(to.path);
    this.activePath = to.path
  }
  },
  methods: {
    //获取菜单栏
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      this.menulist = res.data;
      // console.log(res);
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style scoped>
/* .el-aside {
  color: #333;
} */
.toggle-button {
  background-color: #eee;
  text-align: center;
  line-height: 40px;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>