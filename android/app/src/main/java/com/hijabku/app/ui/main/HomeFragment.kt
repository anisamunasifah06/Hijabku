package com.hijabku.app.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.adapter.ProductAdapter
import com.hijabku.app.ui.product.ProductDetailActivity
import com.hijabku.app.ui.product.ProductListActivity
import com.hijabku.app.viewmodel.HomeViewModel
import com.hijabku.app.viewmodel.HomeViewModelFactory

class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    private lateinit var productAdapter: ProductAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val app = requireActivity().application as HijabKuApp
        val factory = HomeViewModelFactory(app.productRepository)
        homeViewModel = ViewModelProvider(this, factory)[HomeViewModel::class.java]

        val rvProducts = view.findViewById<RecyclerView>(R.id.rvProducts)
        val etHomeSearch = view.findViewById<EditText>(R.id.etHomeSearch)
        val catPashmina = view.findViewById<View>(R.id.catPashmina)
        val catSegiEmpat = view.findViewById<View>(R.id.catSegiEmpat)
        val catBergo = view.findViewById<View>(R.id.catBergo)
        val catInstan = view.findViewById<View>(R.id.catInstan)
        val tvSeeAllProducts = view.findViewById<TextView>(R.id.tvSeeAllProducts)
        val tvExploreAllCategory = view.findViewById<TextView>(R.id.tvExploreAllCategory)

        productAdapter = ProductAdapter { product ->
            val intent = Intent(requireContext(), ProductDetailActivity::class.java).apply {
                putExtra("PRODUCT_ID", product.id)
                putExtra("PRODUCT_DATA", product)
            }
            startActivity(intent)
        }

        rvProducts.layoutManager = GridLayoutManager(requireContext(), 2)
        rvProducts.adapter = productAdapter

        homeViewModel.products.observe(viewLifecycleOwner) { result ->
            when (result) {
                is NetworkResult.Success -> {
                    productAdapter.submitList(result.data)
                }
                is NetworkResult.Error -> {
                    Toast.makeText(context, result.message, Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Loading -> {
                    // Loading state
                }
            }
        }

        etHomeSearch.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                val query = etHomeSearch.text.toString().trim()
                homeViewModel.searchProducts(query)
                true
            } else {
                false
            }
        }

        catPashmina?.setOnClickListener {
            val intent = Intent(requireContext(), ProductListActivity::class.java).apply {
                putExtra("CATEGORY_ID", "cat-1")
                putExtra("CATEGORY_NAME", "Pashmina")
            }
            startActivity(intent)
        }

        catSegiEmpat?.setOnClickListener {
            val intent = Intent(requireContext(), ProductListActivity::class.java).apply {
                putExtra("CATEGORY_ID", "cat-2")
                putExtra("CATEGORY_NAME", "Segi Empat")
            }
            startActivity(intent)
        }

        catBergo?.setOnClickListener {
            val intent = Intent(requireContext(), ProductListActivity::class.java).apply {
                putExtra("CATEGORY_ID", "cat-3")
                putExtra("CATEGORY_NAME", "Bergo")
            }
            startActivity(intent)
        }

        catInstan?.setOnClickListener {
            val intent = Intent(requireContext(), ProductListActivity::class.java).apply {
                putExtra("CATEGORY_ID", "cat-4")
                putExtra("CATEGORY_NAME", "Hijab Instan")
            }
            startActivity(intent)
        }

        tvSeeAllProducts?.setOnClickListener {
            val intent = Intent(requireContext(), ProductListActivity::class.java).apply {
                putExtra("CATEGORY_ID", "all")
                putExtra("CATEGORY_NAME", "Semua Produk")
            }
            startActivity(intent)
        }

        tvExploreAllCategory?.setOnClickListener {
            (activity as? MainActivity)?.selectTab(R.id.nav_category)
        }

        homeViewModel.loadHomeData()
    }
}
