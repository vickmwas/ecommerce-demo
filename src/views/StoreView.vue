<template>
  <el-container class="layout-container-demo" style="border: 1px solid #eee">
    <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>Search Filters
            </template>
            <el-menu-item-group>
              <template #title>Enter Search Term</template>
              <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="Please input the search term"
                @select="handleSelect"
              /> </el-menu-item-group
            ><br />
            <el-menu-item-group title="Select Categories">
              <el-menu-item
                index="1-3"
                v-for="(category, index) in categories.data"
                :key="index"
              > 
                <el-checkbox
                  v-model="categoriesModels.data[index]"
                  :label="category"
                  v-on:update:modelValue="onCategoryFilterUpdate"
                  size="large"
                /><br />
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="content-container">
      <el-main>
        <!-- {{ categories }}
        {{ categoriesModels }} -->
        <!-- {{ filteredProducts }} -->
        <el-scrollbar>
          <el-row>
            <el-col
              v-for="(product, index) in filteredProducts.data"
              :key="index"
              :span="5"
            >
              <el-card :body-style="{ padding: '0px' }">
                <img
                  :src="
                    product.image
                      ? product.image
                      : 'http://placehold.jp/3d4070/ffffff/150x150.png'
                  "
                  class="image"
                />
                <div style="padding: 14px">
                  <span class="product-title">{{ product.product_name }}</span>
                  <div class="bottom">
                    <span class="product-price">KSH {{ product.price }}</span>
                    <el-button type="text" class="button"
                      >{{ product.quantity }} in stock</el-button
                    >
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { Message, Menu as IconMenu, Setting } from "@element-plus/icons-vue";
import StoreDataService from "../services/StoreDataService";
const state = ref("");

// interface LinkItem {
//   value: string;
//   link: string;
// }

// Upon loading the admin page, load the products from the API
let products = reactive({ data: [] });
let filteredProducts = reactive({ data: [] });
let categories = reactive({ data: [] });
let categoriesModels = reactive({ data: [] });

onMounted(() => {
  fetchMyProducts();
});

const fetchMyProducts = () => {
  StoreDataService.getProducts()
    .then((response: any) => {
      products.data = response.data;
      filteredProducts.data = response.data;
      products.data.forEach((product) => {
        product.categories.forEach((category) => {
          if (categories.data.indexOf(category) === -1) {
            categories.data.push(category);
            categoriesModels.data.push(false);
          }
        });
      });
    })
    .catch((e: any) => {
      console.log(e);
    });
};

const onCategoryFilterUpdate = () => {
  setTimeout(()=> {
    let filteredCategories = categoriesModels.data
      .map((category, index) => {
        return category == true ? categories.data[index] : null;
      })
      .filter((category) => category != null);

    if (filteredCategories.length > 0) {
      filteredProducts.data = filteredProducts.data.filter((product) => {
        return anyMatchInArray(filteredCategories, product.categories);
      });
      console.log(filteredProducts);
    } else {
      filteredProducts.data = products.data;
    }
  }, 1000);
  
};

const anyMatchInArray = function (
  targetArray: string | any[],
  checkerArray: string | any[]
) {
  var found = false;
  for (var i = 0, j = checkerArray.length; !found && i < j; i++) {
          if (targetArray.indexOf(checkerArray[i]) > -1) {
              found = true;
          }
      }
      return found;
  };

const links = ref([]);

const loadAll = () => {
  return filteredProducts.data.map(product => {
    return { value: product.product_name, link: product.image };
  });
  return [
    { value: "vue", link: "https://github.com/vuejs/vue" },
    { value: "element", link: "https://github.com/ElemeFE/element" },
    { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
    { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "vuex", link: "https://github.com/vuejs/vuex" },
    { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
    { value: "babel", link: "https://github.com/babel/babel" },
  ];
};

let timeout: NodeJS.Timeout;
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 500 * Math.random());
};
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSelect = (item: any) => {
  console.log(item);
};

onMounted(() => {
  links.value = loadAll();
  console.log(JSON.stringify(links.value));
});

const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
};
</script>

<style scoped>
.el-card {
  margin: 10px;
}
.layout-container-demo .el-header {
  position: relative;
  padding: 10px;
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  width: 300px;
  height: fit-content;
  color: var(--el-text-color-primary);
  background: #fff !important;
  border-right: solid 1px #e6e6e6;
  box-sizing: border-box;
  padding: 10px;
  margin: 33px;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.content-container {
  margin: 33px;
}
</style>
