package com.hijabku.app.ui.product

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.model.CartItem
import com.hijabku.app.data.model.Product
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.checkout.CheckoutActivity
import com.hijabku.app.ui.review.ProductReviewActivity
import com.hijabku.app.viewmodel.ProductDetailViewModel
import com.hijabku.app.viewmodel.ProductDetailViewModelFactory
import java.text.NumberFormat
import java.util.Locale

class ProductDetailActivity : AppCompatActivity() {

    private lateinit var viewModel: ProductDetailViewModel
    private var productData: Product? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_detail)

        val app = application as HijabKuApp
        val factory = ProductDetailViewModelFactory(app.productRepository, app.cartRepository)
        viewModel = ViewModelProvider(this, factory)[ProductDetailViewModel::class.java]

        val productId = intent.getStringExtra("PRODUCT_ID") ?: "p1"
        productData = intent.getSerializableExtra("PRODUCT_DATA") as? Product

        val btnDetailBack = findViewById<ImageView>(R.id.btnDetailBack)
        val ivProductImage = findViewById<ImageView?>(R.id.ivProductMain)
        val tvDetailTitle = findViewById<TextView?>(R.id.tvDetailTitle)
        val tvDetailPrice = findViewById<TextView?>(R.id.tvDetailPrice)
        val tvDetailDescription = findViewById<TextView?>(R.id.tvDetailDescription)
        val btnAddToCart = findViewById<Button>(R.id.btnAddToCart)
        val btnBuyNow = findViewById<Button>(R.id.btnBuyNow)
        val btnViewReviews = findViewById<TextView?>(R.id.btnViewAllReviews)

        btnDetailBack.setOnClickListener {
            finish()
        }

        productData?.let { prod ->
            tvDetailTitle?.text = prod.name
            val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
            tvDetailPrice?.text = format.format(prod.price).replace(",00", "")
            tvDetailDescription?.text = prod.description ?: "Bahan berkualitas premium dengan sentuhan anggun dan elegan."

            ivProductImage?.let { iv ->
                Glide.with(this)
                    .load(prod.imageUrl)
                    .placeholder(R.drawable.ic_hijabku_logo)
                    .into(iv)
            }
        }

        viewModel.loadProductDetail(productId)

        viewModel.product.observe(this) { result ->
            if (result is NetworkResult.Success) {
                productData = result.data
                tvDetailTitle?.text = result.data.name
                val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
                tvDetailPrice?.text = format.format(result.data.price).replace(",00", "")
            }
        }

        viewModel.cartAction.observe(this) { result ->
            when (result) {
                is NetworkResult.Success -> {
                    Toast.makeText(this, "Berhasil ditambahkan ke keranjang!", Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Error -> {
                    Toast.makeText(this, result.message, Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Loading -> {}
                null -> {}
            }
        }

        btnAddToCart.setOnClickListener {
            viewModel.addToCart("user-demo-1")
        }

        btnBuyNow.setOnClickListener {
            val prod = productData ?: return@setOnClickListener
            val singleItem = CartItem(
                id = "direct-${System.currentTimeMillis()}",
                userId = "user-demo-1",
                productId = prod.id,
                variantId = null,
                quantity = 1,
                product = prod,
                variant = null
            )
            val intent = Intent(this, CheckoutActivity::class.java).apply {
                putExtra("CART_ITEMS", arrayListOf(singleItem))
            }
            startActivity(intent)
        }

        btnViewReviews?.setOnClickListener {
            val intent = Intent(this, ProductReviewActivity::class.java).apply {
                putExtra("PRODUCT_ID", productId)
            }
            startActivity(intent)
        }
    }
}
