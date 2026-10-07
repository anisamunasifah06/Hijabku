package com.hijabku.app.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.repository.NetworkResult
import com.hijabku.app.ui.adapter.CategoryAdapter
import com.hijabku.app.ui.product.ProductListActivity
import com.hijabku.app.viewmodel.HomeViewModel
import com.hijabku.app.viewmodel.HomeViewModelFactory

class CategoryFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    private lateinit var categoryAdapter: CategoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_category, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val app = requireActivity().application as HijabKuApp
        val factory = HomeViewModelFactory(app.productRepository)
        homeViewModel = ViewModelProvider(this, factory)[HomeViewModel::class.java]

        val rvCategoryList = view.findViewById<RecyclerView>(R.id.rvCategoryList)

        categoryAdapter = CategoryAdapter { category ->
            val intent = Intent(requireContext(), ProductListActivity::class.java).apply {
                putExtra("CATEGORY_ID", category.id)
                putExtra("CATEGORY_NAME", category.name)
            }
            startActivity(intent)
        }

        rvCategoryList.layoutManager = LinearLayoutManager(requireContext())
        rvCategoryList.adapter = categoryAdapter

        homeViewModel.categories.observe(viewLifecycleOwner) { result ->
            when (result) {
                is NetworkResult.Success -> {
                    categoryAdapter.submitList(result.data)
                }
                is NetworkResult.Error -> {
                    Toast.makeText(context, result.message, Toast.LENGTH_SHORT).show()
                }
                is NetworkResult.Loading -> {}
            }
        }

        homeViewModel.loadHomeData()
    }
}
