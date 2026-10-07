package com.hijabku.app.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.hijabku.app.R
import com.hijabku.app.data.model.Review

class ReviewAdapter(
    private var reviews: List<Review> = emptyList()
) : RecyclerView.Adapter<ReviewAdapter.ReviewViewHolder>() {

    fun submitList(newList: List<Review>) {
        reviews = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_review, parent, false)
        return ReviewViewHolder(view)
    }

    override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
        holder.bind(reviews[position])
    }

    override fun getItemCount(): Int = reviews.size

    inner class ReviewViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvUserName: TextView = itemView.findViewById(R.id.tvUserName)
        private val tvRatingStars: TextView = itemView.findViewById(R.id.tvRatingStars)
        private val tvVariantInfo: TextView = itemView.findViewById(R.id.tvVariantInfo)
        private val tvReviewComment: TextView = itemView.findViewById(R.id.tvReviewComment)
        private val tvReviewDate: TextView = itemView.findViewById(R.id.tvReviewDate)

        fun bind(review: Review) {
            tvUserName.text = review.userName
            tvRatingStars.text = "★".repeat(review.rating.coerceIn(1, 5))
            tvVariantInfo.text = "Variasi: ${review.variant}"
            tvReviewComment.text = review.reviewText
            tvReviewDate.text = review.createdAt ?: "Baru saja"
        }
    }
}
