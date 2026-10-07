package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class CartItem(
    @SerializedName("id") val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("product_id") val productId: String,
    @SerializedName("variant_id") val variantId: String? = null,
    @SerializedName("quantity") var quantity: Int = 1,
    @SerializedName("products") val product: Product? = null,
    @SerializedName("product_variants") val variant: ProductVariant? = null,
    var isChecked: Boolean = true
) : Serializable

data class CartRequest(
    @SerializedName("user_id") val userId: String,
    @SerializedName("product_id") val productId: String,
    @SerializedName("variant_id") val variantId: String? = null,
    @SerializedName("quantity") val quantity: Int = 1
)

data class CartUpdateQuantityRequest(
    @SerializedName("quantity") val quantity: Int
)
