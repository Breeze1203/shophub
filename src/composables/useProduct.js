import { ref } from 'vue';
import {productApi} from "@/api/business/product.js";

export function useProduct() {
    const product = ref(null);
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchProducts = async (params) => {
        loading.value = true;
        error.value = null;
        try {
            products.value = await productApi.getProducts(params);
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const fetchProductDetail = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            product.value = await productApi.getProductDetail(id);
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    return {
        product,
        products,
        loading,
        error,
        fetchProducts,
        fetchProductDetail
    };
}