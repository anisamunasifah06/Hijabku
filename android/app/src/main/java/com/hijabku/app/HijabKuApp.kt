package com.hijabku.app

import android.app.Application
import com.hijabku.app.data.remote.ApiClient
import com.hijabku.app.data.remote.SupabaseApiService
import com.hijabku.app.data.repository.CartRepository
import com.hijabku.app.data.repository.OrderRepository
import com.hijabku.app.data.repository.PaymentRepository
import com.hijabku.app.data.repository.ProductRepository
import com.hijabku.app.data.repository.ReviewRepository
import com.hijabku.app.data.repository.UserRepository

class HijabKuApp : Application() {

    lateinit var apiService: SupabaseApiService
        private set

    lateinit var productRepository: ProductRepository
        private set

    lateinit var cartRepository: CartRepository
        private set

    lateinit var orderRepository: OrderRepository
        private set

    lateinit var paymentRepository: PaymentRepository
        private set

    lateinit var reviewRepository: ReviewRepository
        private set

    lateinit var userRepository: UserRepository
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize Supabase REST Client
        val supabaseUrl = BuildConfig.SUPABASE_URL
        val supabaseAnonKey = BuildConfig.SUPABASE_ANON_KEY
        apiService = ApiClient.getClient(supabaseUrl, supabaseAnonKey)

        // Initialize Repositories
        productRepository = ProductRepository(apiService)
        cartRepository = CartRepository(apiService)
        orderRepository = OrderRepository(apiService)
        paymentRepository = PaymentRepository(apiService)
        reviewRepository = ReviewRepository(apiService)
        userRepository = UserRepository(apiService)
    }

    companion object {
        lateinit var instance: HijabKuApp
            private set
    }
}
