package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Review(
    @SerializedName("id") val id: String? = null,
    @SerializedName("product_id") val productId: String,
    @SerializedName("user_id") val userId: String? = null,
    @SerializedName("user_name") val userName: String,
    @SerializedName("rating") val rating: Int = 5,
    @SerializedName("review_text") val reviewText: String,
    @SerializedName("variant") val variant: String = "Soft Blue",
    @SerializedName("created_at") val createdAt: String? = null
) : Serializable
