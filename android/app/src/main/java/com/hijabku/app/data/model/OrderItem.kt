package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class OrderItem(
    @SerializedName("id") val id: String? = null,
    @SerializedName("order_id") val orderId: String,
    @SerializedName("product_id") val productId: String? = null,
    @SerializedName("product_name") val productName: String,
    @SerializedName("variant_name") val variantName: String? = null,
    @SerializedName("quantity") val quantity: Int = 1,
    @SerializedName("price") val price: Double,
    @SerializedName("subtotal") val subtotal: Double,
    @SerializedName("image_url") val imageUrl: String? = null
) : Serializable
