package com.hijabku.app.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hijabku.app.R
import com.hijabku.app.data.model.CartItem
import java.text.NumberFormat
import java.util.Locale

class CartAdapter(
    private var cartItems: List<CartItem> = emptyList(),
    private val onQuantityChanged: (CartItem, Int) -> Unit,
    private val onDeleteItem: (CartItem) -> Unit,
    private val onCheckChanged: (CartItem, Boolean) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    fun submitList(newList: List<CartItem>) {
        cartItems = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_cart, parent, false)
        return CartViewHolder(view)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        holder.bind(cartItems[position])
    }

    override fun getItemCount(): Int = cartItems.size

    inner class CartViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val cbItem: CheckBox? = itemView.findViewById(R.id.cbItem)
        private val ivProduct: ImageView = itemView.findViewById(R.id.ivProduct)
        private val tvProductName: TextView = itemView.findViewById(R.id.tvProductName)
        private val tvVariantName: TextView = itemView.findViewById(R.id.tvVariantName)
        private val tvPrice: TextView = itemView.findViewById(R.id.tvPrice)
        private val tvQuantity: TextView = itemView.findViewById(R.id.tvQuantity)
        private val btnMinus: View = itemView.findViewById(R.id.btnMinus)
        private val btnPlus: View = itemView.findViewById(R.id.btnPlus)
        private val btnDelete: View = itemView.findViewById(R.id.btnDelete)

        fun bind(item: CartItem) {
            val product = item.product
            tvProductName.text = product?.name ?: "Produk HijabKu"
            tvVariantName.text = item.variant?.variantValue ?: "Default"

            val price = product?.price ?: 0.0
            val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
            tvPrice.text = format.format(price).replace(",00", "")

            tvQuantity.text = item.quantity.toString()

            cbItem?.isChecked = true
            cbItem?.setOnCheckedChangeListener { _, isChecked ->
                onCheckChanged(item, isChecked)
            }

            product?.imageUrl?.let { url ->
                Glide.with(itemView.context)
                    .load(url)
                    .placeholder(R.drawable.ic_hijabku_logo)
                    .into(ivProduct)
            }

            btnMinus.setOnClickListener {
                if (item.quantity > 1) {
                    onQuantityChanged(item, item.quantity - 1)
                }
            }

            btnPlus.setOnClickListener {
                onQuantityChanged(item, item.quantity + 1)
            }

            btnDelete.setOnClickListener {
                onDeleteItem(item)
            }
        }
    }
}
