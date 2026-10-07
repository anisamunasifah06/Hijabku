package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Payment(
    @SerializedName("id") val id: String? = null,
    @SerializedName("order_id") val orderId: String,
    @SerializedName("payment_method") val paymentMethod: String = "BCA Virtual Account",
    @SerializedName("virtual_account") val virtualAccount: String = "12345678901234",
    @SerializedName("amount") val amount: Double,
    @SerializedName("payment_status") var paymentStatus: String = "PENDING",
    @SerializedName("paid_at") var paidAt: String? = null
) : Serializable
