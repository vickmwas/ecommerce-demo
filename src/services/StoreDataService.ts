import http from "@/http-common";
class StoreDataService {
  login(auth: any): Promise<any> {
    return http.post("/login", auth);
  }
  register(registration_details: any): Promise<any> {
    return http.post("/register", registration_details);
  }
  getProducts(): Promise<any> {
    return http.get("/products");
  }
  getMyProducts(): Promise<any> {
    return http.get("/products/my");
  }
  uploadImage(image: any): Promise<any> {
    return http.post("/products/image/upload", image );
  }
  addProduct(newProduct: any): Promise<any> {
    return http.post("/products/add", newProduct);
  }
}
export default new StoreDataService();