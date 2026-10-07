package com.hijabku.app.data.repository

import com.hijabku.app.data.model.*
import com.hijabku.app.data.remote.SupabaseApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class NetworkResult<out T> {
    data class Success<out T>(val data: T) : NetworkResult<T>()
    data class Error(val message: String) : NetworkResult<Nothing>()
    object Loading : NetworkResult<Nothing>()
}

class ProductRepository(private val api: SupabaseApiService) {
    suspend fun getCategories(): NetworkResult<List<Category>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getCategories()
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat kategori: ${response.message()}")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun getProducts(): NetworkResult<List<Product>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getProducts()
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat produk: ${response.message()}")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun searchProducts(query: String): NetworkResult<List<Product>> = withContext(Dispatchers.IO) {
        try {
            // PostgREST ilike pattern
            val response = api.searchProducts("ilike.*$query*")
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal mencari produk: ${response.message()}")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun getProductsByCategory(categoryId: String): NetworkResult<List<Product>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getProductsByCategory("eq.$categoryId")
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat produk kategori: ${response.message()}")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun getProductDetail(productId: String): NetworkResult<Product> = withContext(Dispatchers.IO) {
        try {
            val response = api.getProductDetail("eq.$productId")
            val list = response.body()
            if (response.isSuccessful && !list.isNullOrEmpty()) {
                NetworkResult.Success(list.first())
            } else {
                NetworkResult.Error("Produk tidak ditemukan")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun getProductVariants(productId: String): NetworkResult<List<ProductVariant>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getProductVariants("eq.$productId")
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat varian produk")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }
}

class CartRepository(private val api: SupabaseApiService) {
    // READ Cart
    suspend fun getCart(userId: String): NetworkResult<List<CartItem>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getCartItems("eq.$userId")
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat keranjang")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    // CREATE Cart Item
    suspend fun addToCart(userId: String, productId: String, variantId: String?, quantity: Int): NetworkResult<CartItem> = withContext(Dispatchers.IO) {
        try {
            val request = CartRequest(userId, productId, variantId, quantity)
            val response = api.addToCart(request)
            val body = response.body()
            if (response.isSuccessful && !body.isNullOrEmpty()) {
                NetworkResult.Success(body.first())
            } else {
                NetworkResult.Error("Gagal menambahkan ke keranjang")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    // UPDATE Cart Quantity
    suspend fun updateQuantity(cartId: String, newQuantity: Int): NetworkResult<CartItem> = withContext(Dispatchers.IO) {
        try {
            val request = CartUpdateQuantityRequest(newQuantity)
            val response = api.updateCartQuantity("eq.$cartId", request)
            val body = response.body()
            if (response.isSuccessful && !body.isNullOrEmpty()) {
                NetworkResult.Success(body.first())
            } else {
                NetworkResult.Error("Gagal memperbarui jumlah produk")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    // DELETE Cart Item
    suspend fun deleteCartItem(cartId: String): NetworkResult<Boolean> = withContext(Dispatchers.IO) {
        try {
            val response = api.deleteCartItem("eq.$cartId")
            if (response.isSuccessful) {
                NetworkResult.Success(true)
            } else {
                NetworkResult.Error("Gagal menghapus item dari keranjang")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }
}

class OrderRepository(private val api: SupabaseApiService) {
    suspend fun createOrder(order: Order, items: List<OrderItem>): NetworkResult<Order> = withContext(Dispatchers.IO) {
        try {
            val orderResponse = api.createOrder(order)
            val createdOrders = orderResponse.body()
            if (orderResponse.isSuccessful && !createdOrders.isNullOrEmpty()) {
                val createdOrder = createdOrders.first()
                // Masukkan items dengan order_id yang valid
                val itemsWithOrderId = items.map { it.copy(orderId = createdOrder.id) }
                api.createOrderItems(itemsWithOrderId)
                NetworkResult.Success(createdOrder)
            } else {
                NetworkResult.Error("Gagal membuat pesanan")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun getUserOrders(userId: String): NetworkResult<List<Order>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getUserOrders("eq.$userId")
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat pesanan")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun getOrderDetail(orderId: String): NetworkResult<Order> = withContext(Dispatchers.IO) {
        try {
            val response = api.getOrderDetail("eq.$orderId")
            val list = response.body()
            if (response.isSuccessful && !list.isNullOrEmpty()) {
                NetworkResult.Success(list.first())
            } else {
                NetworkResult.Error("Pesanan tidak ditemukan")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }
}

class PaymentRepository(private val api: SupabaseApiService) {
    suspend fun createPayment(payment: Payment): NetworkResult<Payment> = withContext(Dispatchers.IO) {
        try {
            val response = api.createPayment(payment)
            val body = response.body()
            if (response.isSuccessful && !body.isNullOrEmpty()) {
                NetworkResult.Success(body.first())
            } else {
                NetworkResult.Error("Gagal memproses pembayaran sandbox")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun simulatePaymentSuccess(orderId: String): NetworkResult<Boolean> = withContext(Dispatchers.IO) {
        try {
            // Update status pembayaran menjadi PAID
            api.updatePaymentStatus("eq.$orderId", mapOf("payment_status" to "PAID"))
            // Update status pesanan menjadi PROCESSING
            api.updateOrderStatus("eq.$orderId", mapOf("order_status" to "PROCESSING", "payment_status" to "PAID"))
            NetworkResult.Success(true)
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }
}

class ReviewRepository(private val api: SupabaseApiService) {
    suspend fun getProductReviews(productId: String): NetworkResult<List<Review>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getProductReviews("eq.$productId")
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat ulasan")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }

    suspend fun createReview(review: Review): NetworkResult<Review> = withContext(Dispatchers.IO) {
        try {
            val response = api.createReview(review)
            val body = response.body()
            if (response.isSuccessful && !body.isNullOrEmpty()) {
                NetworkResult.Success(body.first())
            } else {
                NetworkResult.Error("Gagal mengirim ulasan")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }
}
