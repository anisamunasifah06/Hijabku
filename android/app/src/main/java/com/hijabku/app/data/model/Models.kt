package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class UserProfile(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("phone") val phone: String?,
    @SerializedName("email") val email: String,
    @SerializedName("address") val address: String?,
    @SerializedName("member_level") val memberLevel: String = "Silver Member HijabKu",
    @SerializedName("points") val points: Int = 450,
    @SerializedName("voucher_count") val voucherCount: Int = 4,
    @SerializedName("avatar_url") val avatarUrl: String? = null
) : Serializable

data class Category(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String?,
    @SerializedName("product_count") val productCount: Int = 0,
    @SerializedName("tagline") val tagline: String?,
    @SerializedName("image_url") val imageUrl: String?
) : Serializable

data class Product(
    @SerializedName("id") val id: String,
    @SerializedName("category_id") val categoryId: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String?,
    @SerializedName("price") val price: Double,
    @SerializedName("original_price") val originalPrice: Double?,
    @SerializedName("discount") val discount: Int = 0,
    @SerializedName("rating") val rating: Double = 5.0,
    @SerializedName("sold_count") val soldCount: Int = 0,
    @SerializedName("stock") val stock: Int = 100,
    @SerializedName("material") val material: String?,
    @SerializedName("image_url") val imageUrl: String
) : Serializable

data class ProductVariant(
    @SerializedName("id") val id: String,
    @SerializedName("product_id") val productId: String,
    @SerializedName("variant_name") val variantName: String,
    @SerializedName("variant_value") val variantValue: String,
    @SerializedName("color_hex") val colorHex: String?,
    @SerializedName("stock") val stock: Int = 50
) : Serializable

data class CartItem(
    @SerializedName("id") val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("product_id") val productId: String,
    @SerializedName("variant_id") val variantId: String?,
    @SerializedName("quantity") var quantity: Int,
    @SerializedName("products") val product: Product? = null,
    @SerializedName("product_variants") val variant: ProductVariant? = null
) : Serializable

data class CartRequest(
    @SerializedName("user_id") val userId: String,
    @SerializedName("product_id") val productId: String,
    @SerializedName("variant_id") val variantId: String?,
    @SerializedName("quantity") val quantity: Int
)

data class CartUpdateQuantityRequest(
    @SerializedName("quantity") val quantity: Int
)

data class Order(
    @SerializedName("id") val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("order_number") val orderNumber: String,
    @SerializedName("shipping_address") val shippingAddress: String,
    @SerializedName("shipping_method") val shippingMethod: String,
    @SerializedName("payment_method") val paymentMethod: String,
    @SerializedName("subtotal") val subtotal: Double,
    @SerializedName("shipping_cost") val shippingCost: Double,
    @SerializedName("service_fee") val serviceFee: Double,
    @SerializedName("total_amount") val totalAmount: Double,
    @SerializedName("payment_status") var paymentStatus: String,
    @SerializedName("order_status") var orderStatus: String,
    @SerializedName("courier") val courier: String? = "J&T Express",
    @SerializedName("tracking_number") val trackingNumber: String? = "JP9876543210",
    @SerializedName("estimated_arrival") val estimatedArrival: String? = "Besok, 19 Okt 2023",
    @SerializedName("created_at") val createdAt: String? = null
) : Serializable

data class OrderItem(
    @SerializedName("id") val id: String? = null,
    @SerializedName("order_id") val orderId: String,
    @SerializedName("product_id") val productId: String?,
    @SerializedName("product_name") val productName: String,
    @SerializedName("variant_name") val variantName: String?,
    @SerializedName("quantity") val quantity: Int,
    @SerializedName("price") val price: Double,
    @SerializedName("subtotal") val subtotal: Double,
    @SerializedName("image_url") val imageUrl: String?
) : Serializable

data class Payment(
    @SerializedName("id") val id: String? = null,
    @SerializedName("order_id") val orderId: String,
    @SerializedName("payment_method") val paymentMethod: String,
    @SerializedName("virtual_account") val virtualAccount: String,
    @SerializedName("amount") val amount: Double,
    @SerializedName("payment_status") var paymentStatus: String = "PENDING",
    @SerializedName("paid_at") var paidAt: String? = null
) : Serializable

data class Review(
    @SerializedName("id") val id: String? = null,
    @SerializedName("product_id") val productId: String,
    @SerializedName("user_id") val userId: String? = null,
    @SerializedName("user_name") val userName: String,
    @SerializedName("rating") val rating: Int,
    @SerializedName("review_text") val reviewText: String,
    @SerializedName("variant") val variant: String = "Soft Blue",
    @SerializedName("created_at") val createdAt: String? = null
) : Serializable

data class AuthUser(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String
)

data class AuthResponse(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("token_type") val tokenType: String,
    @SerializedName("expires_in") val expiresIn: Long,
    @SerializedName("user") val user: AuthUser
)
