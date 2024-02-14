<template>
  <div class="catalog-view">
    <el-table
      :data="tableDataComputed"
      size="mini"
      width="100%"
      border
      :cell-class-name="handleGetCellClassName"
      header-cell-class-name="catalog-table-header-cell--normal"
      height="500"
    >
      <el-table-column :label="folderName">
        <el-table-column prop="catalog_number" label="编号"></el-table-column>
        <el-table-column
          v-for="(item, index) in colList.level"
          :key="item.label"
          :label="item.label"
        >
          <template slot-scope="{ row }">
            <span>
              <span
                v-if="index + 1 === row.level"
                :class="{
                  'catalog-table-content-item__hyperlink': row.flow_id
                }"
                @click="handleCatalogClick(row)"
              >{{ row[item.prop] }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="责任部门"></el-table-column>
      </el-table-column>
      <el-table-column :label="''">
        <el-table-column prop="complete_percent" label="完成度">
          <template slot-scope="{ row }">
            <span v-if="row.complete_percent === '0' || row.complete_percent === 0 || !row.complete_percent">
            </span>
            <span v-else>
              {{ row.complete_percent }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'catalog-view',
  props: {
    folderId: {
      type: [Number, String]
    },
    catalogListData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableData: [],
      height: '',
      colList: {
        level: [
          { prop: 'catalog_name', label: '一级' },
          { prop: 'catalog_name', label: '二级' },
          { prop: 'catalog_name', label: '三级' },
          { prop: 'catalog_name', label: '四级' }
        ]
      }
    }
  },
  computed: {
    tableDataComputed () {
      return this.tableData.slice(1) || []
    },
    folderName () {
      return this.tableData[0] ? this.tableData[0].catalog_name + '流程目录' : '项目名字'
    }
  },
  methods: {
    /**
     * 点击目录
     * @param row 行数据
     */
    handleCatalogClick (row) {
      if (!row.flow_id) {
        return
      }
      const _location = {
        name: 'fc-flowfile-edit',
        params: {
          flowfileId: row.flow_id
        }
      }
      if (row.page_name) {
        _location.query = {
          pageName: row.page_name
        }
      }
      this.$router.push(_location)
    },
    /**
     * 计算样式
     */
    handleGetCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.level === 1) {
        return 'catalog-table-cell--level-1'
      }
      return 'catalog-table-cell--normal'
    },
    /**
     * set 设置 tableData
     * @param list
     */
    setTableData (list) {
      this.tableData = list
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.catalog-view {
  .catalog-table-content-item__hyperlink {
    text-decoration: underline;
    color: $primary-color;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
@import "@/styles/index.scss";
.catalog-view {
  .catalog-table-cell--level-1 {
    background-color: $--background-color-base;
    font-weight: bold;
  }
  .catalog-table-header-cell--normal {
    background-color: $--color-white !important;
  }
}
</style>
