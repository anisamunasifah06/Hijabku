package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class ProductVariant(
    @SerializedName("id") val id: String,
    @SerializedName("product_id") val productId: String,
    @SerializedName("variant_name") val variantName: String,
    @SerializedName("variant_value") val variantValue: String,
    @SerializedName("color_hex") val colorHex: String? = null,
    @SerializedName("stock") val stock: Int = 50
) : Serializable
