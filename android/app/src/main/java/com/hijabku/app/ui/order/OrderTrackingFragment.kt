package com.hijabku.app.ui.order

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import androidx.fragment.app.Fragment
import com.hijabku.app.R
import com.hijabku.app.ui.main.MainActivity
import com.hijabku.app.ui.review.ProductReviewActivity

class OrderTrackingFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.activity_order_tracking, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val btnTrackingBack = view.findViewById<ImageView>(R.id.btnTrackingBack)
        val btnReturnHome = view.findViewById<Button>(R.id.btnReturnHome)
        val btnContactSeller = view.findViewById<Button>(R.id.btnContactSeller)

        btnTrackingBack?.visibility = View.GONE

        btnReturnHome?.setOnClickListener {
            (activity as? MainActivity)?.selectTab(R.id.nav_home)
        }

        btnContactSeller?.setOnClickListener {
            val intent = Intent(requireContext(), ProductReviewActivity::class.java).apply {
                putExtra("PRODUCT_ID", "p1")
            }
            startActivity(intent)
        }
    }
}
