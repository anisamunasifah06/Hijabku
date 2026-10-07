package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Category(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String? = null,
    @SerializedName("product_count") val productCount: Int = 0,
    @SerializedName("tagline") val tagline: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null
) : Serializable
