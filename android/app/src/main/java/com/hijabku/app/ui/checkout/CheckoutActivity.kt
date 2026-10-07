package com.hijabku.app.ui.checkout

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.model.CartItem
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.payment.PaymentInstructionActivity
import com.hijabku.app.viewmodel.CheckoutViewModel
import com.hijabku.app.viewmodel.CheckoutViewModelFactory
import java.text.NumberFormat
import java.util.Locale

class CheckoutActivity : AppCompatActivity() {

    private lateinit var checkoutViewModel: CheckoutViewModel
    private var cartItems: List<CartItem> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_checkout)

        val app = application as HijabKuApp
        val factory = CheckoutViewModelFactory(app.orderRepository, app.paymentRepository)
        checkoutViewModel = ViewModelProvider(this, factory)[CheckoutViewModel::class.java]

        @Suppress("UNCHECKED_CAST")
        cartItems = (intent.getSerializableExtra("CART_ITEMS") as? ArrayList<CartItem>) ?: emptyList()

        val btnCheckoutBack = findViewById<ImageView>(R.id.btnCheckoutBack)
        val btnPayNow = findViewById<Button>(R.id.btnPayNow)
        val tvTotalAmount = findViewById<TextView?>(R.id.tvTotalAmount)

        val subtotal = cartItems.sumOf { (it.product?.price ?: 0.0) * it.quantity }
        val shipping = 15000.0
        val grandTotal = subtotal + shipping

        val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
        tvTotalAmount?.text = format.format(grandTotal).replace(",00", "")

        btnCheckoutBack.setOnClickListener {
            finish()
        }

        checkoutViewModel.orderResult.observe(this) { result ->
            when (result) {
                is NetworkResult.Success -> {
                    Toast.makeText(this, "Pesanan berhasil dibuat!", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, PaymentInstructionActivity::class.java).apply {
                        putExtra("ORDER_DATA", result.data)
                        putExtra("TOTAL_AMOUNT", grandTotal)
                    }
                    startActivity(intent)
                    finish()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this, result.message, Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Loading -> {
                    Toast.makeText(this, "Memproses pesanan...", Toast.LENGTH_SHORT).show()
                }
            }
        }

        btnPayNow.setOnClickListener {
            checkoutViewModel.processCheckout(
                userId = "user-demo-1",
                subtotal = subtotal,
                shippingCost = shipping,
                paymentMethod = "BCA Virtual Account",
                shippingMethod = "Reguler (J&T Express)",
                items = cartItems
            )
        }
    }
}
