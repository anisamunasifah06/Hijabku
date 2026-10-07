package com.hijabku.app.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hijabku.app.R
import com.hijabku.app.data.model.Product
import java.text.NumberFormat
import java.util.Locale

class ProductAdapter(
    private var products: List<Product> = emptyList(),
    private val onItemClick: (Product) -> Unit
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    fun submitList(newList: List<Product>) {
        products = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_product_card, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        holder.bind(products[position])
    }

    override fun getItemCount(): Int = products.size

    inner class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val ivProduct: ImageView = itemView.findViewById(R.id.ivProduct)
        private val tvProductName: TextView = itemView.findViewById(R.id.tvProductName)
        private val tvPrice: TextView = itemView.findViewById(R.id.tvPrice)
        private val tvRating: TextView? = itemView.findViewById(R.id.tvRating)
        private val tvSoldCount: TextView? = itemView.findViewById(R.id.tvSoldCount)

        fun bind(product: Product) {
            tvProductName.text = product.name

            val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
            tvPrice.text = format.format(product.price).replace(",00", "")

            tvRating?.text = String.format(Locale.US, "%.1f", product.rating)
            tvSoldCount?.text = "Terjual ${product.soldCount}"

            Glide.with(itemView.context)
                .load(product.imageUrl)
                .placeholder(R.drawable.ic_hijabku_logo)
                .into(ivProduct)

            itemView.setOnClickListener {
                onItemClick(product)
            }
        }
    }
}
