package com.hijabku.app.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hijabku.app.R
import com.hijabku.app.data.model.Category

class CategoryAdapter(
    private var categories: List<Category> = emptyList(),
    private val onItemClick: (Category) -> Unit
) : RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder>() {

    fun submitList(newList: List<Category>) {
        categories = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CategoryViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_category_card, parent, false)
        return CategoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: CategoryViewHolder, position: Int) {
        holder.bind(categories[position])
    }

    override fun getItemCount(): Int = categories.size

    inner class CategoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val ivCategory: ImageView = itemView.findViewById(R.id.ivCategory)
        private val tvCategoryName: TextView = itemView.findViewById(R.id.tvCategoryName)
        private val tvProductCount: TextView? = itemView.findViewById(R.id.tvProductCount)

        fun bind(category: Category) {
            tvCategoryName.text = category.name
            tvProductCount?.text = "${category.productCount} Produk"

            category.imageUrl?.let { url ->
                Glide.with(itemView.context)
                    .load(url)
                    .placeholder(R.drawable.ic_hijabku_logo)
                    .into(ivCategory)
            }

            itemView.setOnClickListener {
                onItemClick(category)
            }
        }
    }
}
