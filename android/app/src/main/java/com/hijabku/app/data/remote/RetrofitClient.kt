package com.hijabku.app.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private var instance: ApiService? = null
    private var currentToken: String? = null

    // Default configuration placeholder
    private const val DEFAULT_SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co"
    private const val DEFAULT_SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"

    fun setToken(token: String?) {
        currentToken = token
        instance = null // recreate client with new auth token
    }

    fun getApiService(
        baseUrl: String = DEFAULT_SUPABASE_URL,
        anonKey: String = DEFAULT_SUPABASE_ANON_KEY
    ): ApiService {
        if (instance == null) {
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val request = chain.request().newBuilder()
                        .header("apikey", anonKey)
                        .header("Authorization", "Bearer ${currentToken ?: anonKey}")
                        .header("Content-Type", "application/json")
                        .header("Accept", "application/json")
                        .build()
                    chain.proceed(request)
                }
                .addInterceptor(loggingInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build()

            val formattedBaseUrl = if (baseUrl.endsWith("/")) baseUrl else "$baseUrl/"

            instance = Retrofit.Builder()
                .baseUrl(formattedBaseUrl)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
        return instance!!
    }
}
