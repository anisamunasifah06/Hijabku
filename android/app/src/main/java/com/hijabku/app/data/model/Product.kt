package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Product(
    @SerializedName("id") val id: String,
    @SerializedName("category_id") val categoryId: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String? = null,
    @SerializedName("price") val price: Double,
    @SerializedName("original_price") val originalPrice: Double? = null,
    @SerializedName("discount") val discount: Int = 0,
    @SerializedName("rating") val rating: Double = 5.0,
    @SerializedName("sold_count") val soldCount: Int = 0,
    @SerializedName("stock") val stock: Int = 100,
    @SerializedName("material") val material: String? = null,
    @SerializedName("image_url") val imageUrl: String
) : Serializable
