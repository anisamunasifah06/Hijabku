package com.hijabku.app.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.model.CartItem
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.adapter.CartAdapter
import com.hijabku.app.ui.checkout.CheckoutActivity
import com.hijabku.app.viewmodel.CartViewModel
import com.hijabku.app.viewmodel.CartViewModelFactory
import java.text.NumberFormat
import java.util.Locale

class CartFragment : Fragment() {

    private lateinit var cartViewModel: CartViewModel
    private lateinit var cartAdapter: CartAdapter
    private var currentCartList: List<CartItem> = emptyList()
    private val userId = "user-demo-1"

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_cart, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val app = requireActivity().application as HijabKuApp
        val factory = CartViewModelFactory(app.cartRepository)
        cartViewModel = ViewModelProvider(this, factory)[CartViewModel::class.java]

        val rvCartItems = view.findViewById<RecyclerView>(R.id.rvCartItems)
        val tvCartProductCountBadge = view.findViewById<TextView>(R.id.tvCartProductCountBadge)
        val tvCartGrandTotal = view.findViewById<TextView>(R.id.tvCartGrandTotal)
        val btnCheckout = view.findViewById<Button>(R.id.btnCheckout)
        val cbSelectAll = view.findViewById<CheckBox>(R.id.cbSelectAll)

        cartAdapter = CartAdapter(
            onQuantityChanged = { item, newQty ->
                cartViewModel.updateItemQuantity(item.id, newQty, userId)
            },
            onDeleteItem = { item ->
                cartViewModel.removeItem(item.id, userId)
                Toast.makeText(context, "Item dihapus dari keranjang", Toast.LENGTH_SHORT).show()
            },
            onCheckChanged = { _, _ ->
                // Recalculate
            }
        )

        rvCartItems.layoutManager = LinearLayoutManager(requireContext())
        rvCartItems.adapter = cartAdapter

        cartViewModel.cartItems.observe(viewLifecycleOwner) { result ->
            when (result) {
                is NetworkResult.Success -> {
                    currentCartList = result.data
                    cartAdapter.submitList(result.data)
                    tvCartProductCountBadge.text = "${result.data.size} produk"
                    val totalQty = result.data.sumOf { it.quantity }
                    btnCheckout.text = "Checkout ($totalQty)"
                }
                is NetworkResult.Error -> {
                    Toast.makeText(context, result.message, Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Loading -> {}
            }
        }

        cartViewModel.totalAmount.observe(viewLifecycleOwner) { total ->
            val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
            tvCartGrandTotal.text = format.format(total).replace(",00", "")
        }

        btnCheckout.setOnClickListener {
            if (currentCartList.isEmpty()) {
                Toast.makeText(context, "Keranjang belanja kosong", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val intent = Intent(requireContext(), CheckoutActivity::class.java).apply {
                putExtra("CART_ITEMS", ArrayList(currentCartList))
            }
            startActivity(intent)
        }

        cbSelectAll?.setOnCheckedChangeListener { _, isChecked ->
            // Update selection
        }

        cartViewModel.loadCart(userId)
    }

    override fun onResume() {
        super.onResume()
        cartViewModel.loadCart(userId)
    }
}
