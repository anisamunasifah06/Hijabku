package com.hijabku.app.data.remote

import com.hijabku.app.data.model.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface SupabaseApiService {

    // ==========================================
    // 1. CATEGORIES & PRODUCTS
    // ==========================================
    @GET("rest/v1/categories?select=*")
    suspend fun getCategories(): Response<List<Category>>

    @GET("rest/v1/products?select=*")
    suspend fun getProducts(
        @Query("order") order: String = "rating.desc"
    ): Response<List<Product>>

    @GET("rest/v1/products?select=*")
    suspend fun searchProducts(
        @Query("name") nameFilter: String
    ): Response<List<Product>>

    @GET("rest/v1/products?select=*")
    suspend fun getProductsByCategory(
        @Query("category_id") categoryFilter: String
    ): Response<List<Product>>

    @GET("rest/v1/products?select=*")
    suspend fun getProductDetail(
        @Query("id") idFilter: String
    ): Response<List<Product>>

    @GET("rest/v1/product_variants?select=*")
    suspend fun getProductVariants(
        @Query("product_id") productFilter: String
    ): Response<List<ProductVariant>>

    // ==========================================
    // 2. CART (FULL CRUD)
    // ==========================================
    @GET("rest/v1/cart?select=*,products(*),product_variants(*)")
    suspend fun getCartItems(
        @Query("user_id") userFilter: String
    ): Response<List<CartItem>>

    @Headers("Prefer: return=representation")
    @POST("rest/v1/cart")
    suspend fun addToCart(
        @Body request: CartRequest
    ): Response<List<CartItem>>

    @Headers("Prefer: return=representation")
    @PATCH("rest/v1/cart")
    suspend fun updateCartQuantity(
        @Query("id") idFilter: String,
        @Body request: CartUpdateQuantityRequest
    ): Response<List<CartItem>>

    @DELETE("rest/v1/cart")
    suspend fun deleteCartItem(
        @Query("id") idFilter: String
    ): Response<Unit>

    // ==========================================
    // 3. CHECKOUT & ORDERS
    // ==========================================
    @Headers("Prefer: return=representation")
    @POST("rest/v1/orders")
    suspend fun createOrder(
        @Body order: Order
    ): Response<List<Order>>

    @Headers("Prefer: return=representation")
    @POST("rest/v1/order_items")
    suspend fun createOrderItems(
        @Body items: List<OrderItem>
    ): Response<List<OrderItem>>

    @GET("rest/v1/orders?select=*")
    suspend fun getUserOrders(
        @Query("user_id") userFilter: String,
        @Query("order") sortOrder: String = "created_at.desc"
    ): Response<List<Order>>

    @GET("rest/v1/orders?select=*")
    suspend fun getOrderDetail(
        @Query("id") idFilter: String
    ): Response<List<Order>>

    @GET("rest/v1/order_items?select=*")
    suspend fun getOrderItems(
        @Query("order_id") orderFilter: String
    ): Response<List<OrderItem>>

    // ==========================================
    // 4. PAYMENTS (SANDBOX)
    // ==========================================
    @Headers("Prefer: return=representation")
    @POST("rest/v1/payments")
    suspend fun createPayment(
        @Body payment: Payment
    ): Response<List<Payment>>

    @Headers("Prefer: return=representation")
    @PATCH("rest/v1/payments")
    suspend fun updatePaymentStatus(
        @Query("order_id") orderFilter: String,
        @Body updateBody: Map<String, String>
    ): Response<List<Payment>>

    @Headers("Prefer: return=representation")
    @PATCH("rest/v1/orders")
    suspend fun updateOrderStatus(
        @Query("id") idFilter: String,
        @Body updateBody: Map<String, String>
    ): Response<List<Order>>

    // ==========================================
    // 5. PROFILES & REVIEWS
    // ==========================================
    @GET("rest/v1/profiles?select=*")
    suspend fun getUserProfile(
        @Query("id") idFilter: String
    ): Response<List<UserProfile>>

    @GET("rest/v1/reviews?select=*")
    suspend fun getProductReviews(
        @Query("product_id") productFilter: String,
        @Query("order") sort: String = "created_at.desc"
    ): Response<List<Review>>

    @Headers("Prefer: return=representation")
    @POST("rest/v1/reviews")
    suspend fun createReview(
        @Body review: Review
    ): Response<List<Review>>
}

object ApiClient {
    private var token: String? = null

    fun setAuthToken(newToken: String?) {
        token = newToken
    }

    fun getClient(supabaseUrl: String, supabaseAnonKey: String): SupabaseApiService {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val original = chain.request()
                val requestBuilder = original.newBuilder()
                    .header("apikey", supabaseAnonKey)
                    .header("Authorization", "Bearer ${token ?: supabaseAnonKey}")
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                chain.proceed(requestBuilder.build())
            }
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

        val baseUrl = if (supabaseUrl.endsWith("/")) supabaseUrl else "$supabaseUrl/"

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SupabaseApiService::class.java)
    }
}
