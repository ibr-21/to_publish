import { create } from "zustand";
import axios from "axios";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    // Basic validation
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }

  
    try {
      //  /products is a proxy with value in vite.config
      const res = await axios.post("/products", newProduct);
      console.log("Success:", res.data);
      // Optionally update store
      set((state) => ({ products: [...state.products, res.data.data] }));

      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.error(
        "Axios Error:",
        error.response?.data?.message || error.message
      );
      return { success: false, message: "Failed to create product." };
    }
  },
  fetchProducts: async () => {
    try {
      const res = await axios.get("/products");
      set({ products: res.data });
    } catch (err) {
      console.log("Fail to fetch data: " + err);
    }
  },
  deleteProduct: async (pid) => {
    const res = await axios.delete(`/products/${pid}`);
    
    // alert("state: "+res.data.success)
    if (res.data.success) {
      // update the ui immediately, without needing a refresh
      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return { success: true, message: res.data.message };
    } else {
      return { success: false, message: res.data.message };
    }
  },
  updateProduct: async (pid, updatedProduct) => {
  
    try {
      const res = await axios.patch(`/products/${pid}`, updatedProduct);
    
      if (res.data.success) {
        // update the ui immediately, without needing a refresh
        set((state) => ({
          products: state.products.map((product) =>
            product._id === pid ? res.data.product : product
          )
        }));
        return {
          success: res.data.success,
          message: res.data.message
        };
      } else {
        return { success: false, message: res.data.message };
      }     
    } catch (err) {
      console.log("Fail to update data: " + err);
    }
  },
}));
