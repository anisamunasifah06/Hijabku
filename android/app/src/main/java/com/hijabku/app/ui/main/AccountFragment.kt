package com.hijabku.app.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.hijabku.app.R
import com.hijabku.app.ui.login.LoginActivity
import com.hijabku.app.ui.order.OrderTrackingActivity

class AccountFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_account, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val btnMenuOrders = view.findViewById<TextView>(R.id.btnMenuOrders)
        val btnMenuAddress = view.findViewById<TextView>(R.id.btnMenuAddress)
        val btnMenuPaymentMethod = view.findViewById<TextView>(R.id.btnMenuPaymentMethod)
        val btnMenuWishlist = view.findViewById<TextView>(R.id.btnMenuWishlist)
        val btnMenuLogout = view.findViewById<TextView>(R.id.btnMenuLogout)

        btnMenuOrders?.setOnClickListener {
            val intent = Intent(requireContext(), OrderTrackingActivity::class.java)
            startActivity(intent)
        }

        btnMenuAddress?.setOnClickListener {
            Toast.makeText(context, "Alamat utama: Jl. Pemuda No. 45, Cirebon", Toast.LENGTH_SHORT).show()
        }

        btnMenuPaymentMethod?.setOnClickListener {
            Toast.makeText(context, "Metode tersimpan: BCA Virtual Account", Toast.LENGTH_SHORT).show()
        }

        btnMenuWishlist?.setOnClickListener {
            Toast.makeText(context, "1 produk di Favorit", Toast.LENGTH_SHORT).show()
        }

        btnMenuLogout?.setOnClickListener {
            Toast.makeText(context, "Keluar berhasil", Toast.LENGTH_SHORT).show()
            val intent = Intent(requireContext(), LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
        }
    }
}
