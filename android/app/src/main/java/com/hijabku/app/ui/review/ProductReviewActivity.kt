package com.hijabku.app.ui.review

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.model.Review
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.adapter.ReviewAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ProductReviewActivity : AppCompatActivity() {

    private lateinit var reviewAdapter: ReviewAdapter
    private val scope = CoroutineScope(Dispatchers.Main)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_review)

        val app = application as HijabKuApp
        val reviewRepo = app.reviewRepository
        val productId = intent.getStringExtra("PRODUCT_ID") ?: "p1"

        val btnReviewBack = findViewById<ImageView>(R.id.btnReviewBack)
        val rvReviews = findViewById<RecyclerView>(R.id.rvReviews)
        val btnWriteReview = findViewById<Button>(R.id.btnWriteReview)

        btnReviewBack.setOnClickListener {
            finish()
        }

        reviewAdapter = ReviewAdapter()
        rvReviews.layoutManager = LinearLayoutManager(this)
        rvReviews.adapter = reviewAdapter

        fun loadReviews() {
            scope.launch {
                val result = reviewRepo.getProductReviews(productId)
                if (result is NetworkResult.Success) {
                    reviewAdapter.submitList(result.data)
                }
            }
        }

        loadReviews()

        btnWriteReview.setOnClickListener {
            val input = EditText(this).apply {
                hint = "Tulis pengalaman Anda berbelanja hijab ini..."
                setPadding(32, 24, 32, 24)
            }

            AlertDialog.Builder(this)
                .setTitle("Beri Ulasan HijabKu")
                .setMessage("Bagaimana kualitas produk yang Anda terima?")
                .setView(input)
                .setPositiveButton("Kirim") { _, _ ->
                    val text = input.text.toString().trim()
                    if (text.isNotEmpty()) {
                        val review = Review(
                            productId = productId,
                            userName = "Anisa Rahmawati",
                            rating = 5,
                            reviewText = text,
                            variant = "Soft Blue"
                        )
                        scope.launch {
                            val res = reviewRepo.createReview(review)
                            withContext(Dispatchers.Main) {
                                if (res is NetworkResult.Success) {
                                    Toast.makeText(this@ProductReviewActivity, "Ulasan Anda terkirim!", Toast.LENGTH_SHORT).show()
                                    loadReviews()
                                } else {
                                    Toast.makeText(this@ProductReviewActivity, "Gagal mengirim ulasan", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    }
                }
                .setNegativeButton("Batal", null)
                .show()
        }
    }
}
