<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="入库记录" name="1">
        <el-table :data="list" style="width:100%">

          <el-table-column prop="image" label="入库商品" width="80">
            <img slot-scope="scope" :src="scope.row.image" style="width:50px">
          </el-table-column>

          <el-table-column prop="name" label="" width="200"></el-table-column>

          <el-table-column prop="price" label="入库价格" align="right">
            <div slot-scope="scope">¥ {{scope.row.price}}</div>
          </el-table-column>

          <!-- <el-table-column prop="source" label="来源"></el-table-column> -->
          <el-table-column prop="proDataTime" label="生产日期" align="right"></el-table-column>

          <el-table-column prop="proDataStr" label="欧版日期" align="right"></el-table-column>

          <!-- <el-table-column prop="remarks" label="备注"></el-table-column> -->
          
           <el-table-column prop="addTime" label="入库时间" width="200" align="right"></el-table-column>
           
          <el-table-column prop="number" label="入库数量" align="right">
            <div slot-scope="scope" style=""><b>{{scope.row.number}}</b></div>
          </el-table-column>

          <el-table-column prop="outNumber" align="right" label="已出库数量">
            <div slot-scope="scope" style=""><b>{{scope.row.outNumber}}</b></div>
          </el-table-column>

         
          <el-table-column label="操作" width="80" align="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="reduceStockClick(scope.row)" v-if="scope.row.number - scope.row.outNumber > 0">商品出库</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="出库记录" name="2">
        <el-table :data="list2" style="width:100%">
          <el-table-column prop="image" label="入库商品" width="80">
            <img slot-scope="scope" :src="scope.row.image" style="width:50px">
          </el-table-column>

          <el-table-column prop="name" label="" width="200"></el-table-column>

          <el-table-column prop="price" label="出库价格">
            <div slot-scope="scope">¥ {{scope.row.price}}</div>
          </el-table-column>

          <el-table-column prop="source" label="出库渠道"></el-table-column>

          <el-table-column prop="remarks" label="备注"></el-table-column>

          <el-table-column prop="outTime" label="出库时间"></el-table-column>

          <el-table-column prop="number" label="出库数量">
            <div slot-scope="scope" style=""><b>{{scope.row.number}}</b></div>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>


    <el-dialog title="商品出库" :visible.sync="reduceStock" width="600px" :modal-append-to-body="false">
			<el-form label-width="80px" size="small" v-if="selfItem">

        <el-form-item label="商品名称">{{selfItem.name}}</el-form-item>

        <el-row>
          <el-col :span="6"><el-form-item label="品牌">{{$store.state.brand.mapList[selfItem.brandId].name}}</el-form-item></el-col>
          <el-col :span="6"><el-form-item label="分类">{{$store.state.goodType.mapList[selfItem.goodsTypeId].name}}</el-form-item></el-col>
          <el-col :span="6"><el-form-item label="可出库存">{{selfItem.number - selfItem.outNumber}}</el-form-item></el-col>
        </el-row>

				<el-form-item label="出库数量">
					<el-input-number v-model="reduceStockForm.number" :min="1" :max="selfItem.number - selfItem.outNumber"></el-input-number>
				</el-form-item>

				<el-form-item label="到哪儿去">
					<el-input v-model="reduceStockForm.source" placeholder="去哪儿"></el-input>
				</el-form-item>

				<el-form-item label="出库价格">
					<el-input v-model="reduceStockForm.price" placeholder="出库价格"></el-input>
				</el-form-item>

				<el-form-item label="备注">
					<el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 4}"
						placeholder="请输入内容"
						v-model="reduceStockForm.remarks">
					</el-input>
				</el-form-item>
				
				<el-form-item>
					<el-button type="primary" @click="reduceStockSub()" :loading="loading">立即出库</el-button>
					<el-button @click="reduceStock = false">取消</el-button>
				</el-form-item>

			</el-form>
		</el-dialog>

  </div>
</template>

<script>

import Titles from '@/components/title.vue'
import io from '@/js/io.js'

export default {
	components: { Titles },
	data () {
		return {
      list: [],
      list2: [],

      activeName: "1",
      
      selfItem: null,

      loading: false,

      reduceStock: false,
      reduceStockForm: {
        goodsId: '',
        addStockId: '',
        number: 1,
        source: '',
        remarks: '',
        price: ''
      }
		}
	},

	created () {
	
	},

	mounted () {

	},

	methods: {
		


	}
}
</script>