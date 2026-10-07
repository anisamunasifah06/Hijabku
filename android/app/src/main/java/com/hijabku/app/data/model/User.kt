package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class User(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("phone") val phone: String?,
    @SerializedName("email") val email: String,
    @SerializedName("address") val address: String? = "Jl. Pemuda No. 45, Kota Cirebon, Jawa Barat",
    @SerializedName("member_level") val memberLevel: String = "Silver Member HijabKu",
    @SerializedName("points") val points: Int = 450,
    @SerializedName("voucher_count") val voucherCount: Int = 4,
    @SerializedName("avatar_url") val avatarUrl: String? = null
) : Serializable
