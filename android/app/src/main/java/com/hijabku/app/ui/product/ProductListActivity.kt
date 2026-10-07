package com.hijabku.app.ui.product

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.adapter.ProductAdapter
import com.hijabku.app.viewmodel.HomeViewModel
import com.hijabku.app.viewmodel.HomeViewModelFactory

class ProductListActivity : AppCompatActivity() {

    private lateinit var homeViewModel: HomeViewModel
    private lateinit var productAdapter: ProductAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_list)

        val app = application as HijabKuApp
        val factory = HomeViewModelFactory(app.productRepository)
        homeViewModel = ViewModelProvider(this, factory)[HomeViewModel::class.java]

        val btnBack = findViewById<ImageView>(R.id.btnBack)
        val rvPashminaProducts = findViewById<RecyclerView>(R.id.rvPashminaProducts)
        val tvHeaderTitle = findViewById<TextView?>(R.id.tvHeaderTitle)

        val categoryName = intent.getStringExtra("CATEGORY_NAME") ?: "Pashmina"
        tvHeaderTitle?.text = categoryName

        btnBack.setOnClickListener {
            finish()
        }

        productAdapter = ProductAdapter { product ->
            val intent = Intent(this, ProductDetailActivity::class.java).apply {
                putExtra("PRODUCT_ID", product.id)
                putExtra("PRODUCT_DATA", product)
            }
            startActivity(intent)
        }

        rvPashminaProducts.layoutManager = GridLayoutManager(this, 2)
        rvPashminaProducts.adapter = productAdapter

        homeViewModel.products.observe(this) { result ->
            if (result is NetworkResult.Success) {
                productAdapter.submitList(result.data)
            }
        }

        homeViewModel.loadHomeData()
    }
}
