package com.hijabku.app.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Order(
    @SerializedName("id") val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("order_number") val orderNumber: String,
    @SerializedName("shipping_address") val shippingAddress: String = "Jl. Pemuda No. 45, Kota Cirebon, Jawa Barat",
    @SerializedName("shipping_method") val shippingMethod: String = "Reguler (2-3 hari)",
    @SerializedName("payment_method") val paymentMethod: String = "BCA Virtual Account",
    @SerializedName("subtotal") val subtotal: Double,
    @SerializedName("shipping_cost") val shippingCost: Double = 15000.0,
    @SerializedName("service_fee") val serviceFee: Double = 0.0,
    @SerializedName("total_amount") val totalAmount: Double,
    @SerializedName("payment_status") var paymentStatus: String = "PENDING",
    @SerializedName("order_status") var orderStatus: String = "PENDING",
    @SerializedName("courier") val courier: String? = "J&T Express",
    @SerializedName("tracking_number") val trackingNumber: String? = "JP9876543210",
    @SerializedName("estimated_arrival") val estimatedArrival: String? = "Besok, 19 Okt 2023",
    @SerializedName("created_at") val createdAt: String? = null
) : Serializable
