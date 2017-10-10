<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:;" @click="sortItems" class="price">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short">
              </use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" :class="{'cur':priceSelected=='all'}">
                  All
                </a>
              </dd>
              <dd v-for="(price, index) in priceFilter" :key="index">
                <a href="javascript:void(0)" :class="{'cur':priceSelected==index}" @click="setPriceFilter(index)">
                  ${{ price.startPrice}} - ${{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">

            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in itemsList" :key="item._id">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImg" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">${{item.productPrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">Add to Cart</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
              Loading...
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>


<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/login.css'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import axios from 'axios'

export default {
  data() {
    return {
      itemsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,


      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '200.00'
        },
        {
          startPrice: '200.00',
          endPrice: '400.00'
        },
        {
          startPrice: '400.00',
          endPrice: '1000.00'
        }
      ],
      priceSelected: 'all',
      filterBy: false,
      overLayFlag: false,
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted() {
    this.getItemsList();
  },
  methods: {
    sortItems() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getItemsList()
    },
    getItemsList(flag) {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
      }
      axios.get("/items", {
        params: params
      }).then((response) => {
        let res = response.data;
        if (res.status == "0"){
          if (flag){
            if (res.result.count === 0){
              this.busy = true;
            } else {
              this.busy = false;
            }
            this.itemsList =  this.itemsList.concat(res.result.list);
          } else {
            this.itemsList =  res.result.list;
            this.busy = false;
          }
        } else {
          this.itemsList = [];
        }
      });
    },

    loadMore(){
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getItemsList(true);
      }, 500);
    },


    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    setPriceFilter(index) {
      this.priceSelected = index;
      this.closePop();
    }
  }
}
</script>
