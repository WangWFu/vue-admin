<template>
    <div>
         <el-table :data="articleList">
          <el-table-column prop="title" label="标题" ></el-table-column>
          <el-table-column prop="content" label="内容" ></el-table-column>
          <el-table-column prop="date" label="日期" ></el-table-column>
        </el-table>
    </div>
</template>
<script>
// import{Table,TableColumn,} from 'element-ui'

// import {getarticle} from '../../network/getarticle'
export default {
    name:'articlelist',
    data() {
    return {
      articleList: []
    };
  },
 
    components: {
    // [Table.name]: Table,
    // [TableColumn.name]: TableColumn,
  },
 created(){
    // this.getarticle();
   
  },
    methods:{
    // getarticle(){
    //   getarticle().then(res=>{
    //     console.log(res.data);
    //     console.log(res.data.data[0].date.split('T')[0]);
    //     let date = res.data.data.map(item=>{
    //       return item.date.split('T')[0]
    //     })
    //     console.log(date);
        
    //     this.articleList = res.data.data
    //   })
    // }
  }

}
</script>
<style scoped>
.el-table{
  width: 100%;
}
.el-table-column{
  width: 420px;
}
</style>