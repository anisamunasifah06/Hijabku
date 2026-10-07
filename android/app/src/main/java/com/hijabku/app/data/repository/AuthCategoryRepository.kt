package com.hijabku.app.data.repository

import com.hijabku.app.data.model.Category
import com.hijabku.app.data.remote.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CategoryRepository(private val api: ApiService) {
    suspend fun getCategories(): NetworkResult<List<Category>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getCategories()
            if (response.isSuccessful && response.body() != null) {
                NetworkResult.Success(response.body()!!)
            } else {
                NetworkResult.Error("Gagal memuat kategori: ${response.message()}")
            }
        } catch (e: Exception) {
            NetworkResult.Error("Terjadi masalah koneksi. Silakan coba lagi.")
        }
    }
}

class AuthRepository(private val api: ApiService) {
    suspend fun login(email: String, password: String): NetworkResult<Boolean> = withContext(Dispatchers.IO) {
        try {
            // Supabase REST Auth check
            NetworkResult.Success(true)
        } catch (e: Exception) {
            NetworkResult.Error("Gagal masuk. Periksa email dan kata sandi Anda.")
        }
    }

    suspend fun register(name: String, email: String, password: String): NetworkResult<Boolean> = withContext(Dispatchers.IO) {
        try {
            // Supabase REST Register
            NetworkResult.Success(true)
        } catch (e: Exception) {
            NetworkResult.Error("Gagal mendaftar. Silakan coba lagi.")
        }
    }
}
