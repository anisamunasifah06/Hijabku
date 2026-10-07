package com.hijabku.app.ui.order

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.hijabku.app.R
import com.hijabku.app.data.model.Order
import com.hijabku.app.ui.main.MainActivity
import com.hijabku.app.ui.review.ProductReviewActivity

class OrderTrackingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_tracking)

        val order = intent.getSerializableExtra("ORDER_DATA") as? Order

        val btnTrackingBack = findViewById<ImageView>(R.id.btnTrackingBack)
        val btnReturnHome = findViewById<Button>(R.id.btnReturnHome)
        val btnContactSeller = findViewById<Button>(R.id.btnContactSeller)
        val tvTrackingNumber = findViewById<TextView?>(R.id.tvTrackingNumber)

        order?.trackingNumber?.let { num ->
            tvTrackingNumber?.text = num
        }

        btnTrackingBack.setOnClickListener {
            finish()
        }

        btnReturnHome.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
        }

        btnContactSeller.setOnClickListener {
            // Also opens review for delivered items
            val intent = Intent(this, ProductReviewActivity::class.java).apply {
                putExtra("PRODUCT_ID", "p1")
            }
            startActivity(intent)
        }
    }
}
