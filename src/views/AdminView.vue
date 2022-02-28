<template>
  <el-container>
    <h1>Welcome To The Wingi eCommerce Admin Platform</h1>
    <br />
    <el-tabs type="border-card">
      <el-tab-pane label="View My Products">
        <div style="text-align: center" v-if="myProducts.products.length == 0">
          <span> You have no products on your store.</span><br/>
          <el-button type="primary" :icon="Search" style="margin: 30px;"
            @click="navigateToAddProduct"
            >Add New Product</el-button
          >
        </div>
        <el-row v-else>
          <el-col
            v-for="(product, index) in myProducts.products"
            :key="index"
            :span="4"
          >
            <!-- <el-col v-for="(o, index) in 8" :key="o" :span="4"> -->
            <el-card :body-style="{ padding: '0px' }">
              <img :src="product.image" class="image" style="height: 188px;" />
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
      </el-tab-pane>

      <el-tab-pane label="Add My Products">
        <el-form
          ref="formRef"
          :model="newProduct"
          label-width="160px"
          class="add-product-form"
        >
          <el-form-item label="Product Name">
            <el-input v-model="newProduct.product_name"></el-input>
          </el-form-item>
          <el-form-item label="Add Product Categories">
            <el-tag
              v-for="tag in newProduct.categories"
              :key="tag"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="InputRef"
              v-model="inputValue"
              class="ml-1 w-20"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag ml-1"
              size="small"
              @click="showInput"
            >
              + New Category
            </el-button>
          </el-form-item>
          <el-form-item label="Quantity In Stock">
            <el-input v-model="newProduct.quantity"></el-input>
          </el-form-item>
          <el-form-item label="Price (Ksh.)">
            <el-input v-model="newProduct.price"></el-input>
          </el-form-item>
          <el-form-item label="Upload Image">
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="uploadImageHTTP"
            >
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>
              <el-button v-if="false" class="ml-3" type="success" @click="submitUpload"
                >upload to server</el-button
              >
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb recommended.
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitNewProduct">Create</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { Message, Menu as IconMenu, Setting } from "@element-plus/icons-vue";
const state = ref("");
import { reactive } from "vue";

import type { ElInput } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadFile } from "element-plus/es/components/upload/src/upload.type";
import StoreDataService from "../services/StoreDataService";
import type { ElUpload } from "element-plus";
import apiClient from "@/http-common";

const uploadRef = ref<InstanceType<typeof ElUpload>>();

const uploadImageHTTP = (file, fileList) => {  
  var reader = new FileReader();
  reader.onloadend = function() {
    StoreDataService.uploadImage({image: reader.result})
      .then((response: any) => {
        newProduct.image = response.data.image_url
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
  reader.readAsDataURL(file.raw);
 
}

const navigateToAddProduct = (event: Event) => {
  document.querySelector("#tab-1").click();
}



const submitNewProduct = (event: Event) => {
  event.preventDefault();
  if (newProduct.product_name == "") {
    console.log("Invalid product name");
  } else if (newProduct.categories.length === 0) {
    console.log("Please add more than one category");
  } else if (newProduct.quantity == 0) {
    console.log("Please enter quantity in stock");
  } else if (newProduct.price == 0) {
    console.log("Please enter product price");
  } else if (newProduct.image == "") {
    console.log("Please upload an image");
  } else {
    StoreDataService.addProduct(newProduct)
      .then((response: any) => {
        document.querySelector("#tab-0").click();
        fetchMyProducts();
        console.log(response.data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
};

interface RawFile {
  name: string;
  url: string;
}

let myProducts = reactive({ products: [] });

const fetchMyProducts = () => {
  StoreDataService.getMyProducts()
    .then((response: any) => {
      myProducts.products = response.data;
      console.log(myProducts);
    })
    .catch((e: any) => {
      console.log(e);
    });
};

// Upon loading the admin page, load the products from the API
onMounted(() => {
  fetchMyProducts();
});

let newProduct = reactive({
  product_name: "",
  categories: [],
  quantity: 0,
  price: 0,
  image: "",
});

const inputValue = ref("");
const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

// =============== IMAGE UPLOAD ========================================
const fileList = ref<RawFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "food2.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList);
};
const handlePreview = (file: UploadFile) => {
  console.log(file);
};
const handleExceed = (files: FileList, fileList: UploadFile[]) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + fileList.length
    } totally`
  );
};
const beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${file.name} ?`);
};
// =======================================================
const handleClose = (tag: string) => {
  newProduct.categories.splice(newProduct.categories.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    newProduct.categories.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};



interface LinkItem {
  value: string;
  link: string;
}

const links = ref<LinkItem[]>([]);

const loadAll = () => {
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
  }, 3000 * Math.random());
};
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSelect = (item: LinkItem) => {
  console.log(item);
};

onMounted(() => {
  links.value = loadAll();
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

.add-product-form {
  width: 50%;
}

.el-container {
  flex-direction: column;
  padding: 50px;
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
