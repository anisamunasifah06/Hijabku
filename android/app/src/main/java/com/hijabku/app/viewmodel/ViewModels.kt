package com.hijabku.app.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hijabku.app.data.model.*
import com.hijabku.app.data.repository.*
import kotlinx.coroutines.launch

class HomeViewModel(private val productRepo: ProductRepository) : ViewModel() {
    private val _categories = MutableLiveData<NetworkResult<List<Category>>>()
    val categories: LiveData<NetworkResult<List<Category>>> = _categories

    private val _products = MutableLiveData<NetworkResult<List<Product>>>()
    val products: LiveData<NetworkResult<List<Product>>> = _products

    fun loadHomeData() {
        viewModelScope.launch {
            _categories.value = NetworkResult.Loading
            _categories.value = productRepo.getCategories()

            _products.value = NetworkResult.Loading
            _products.value = productRepo.getProducts()
        }
    }

    fun searchProducts(query: String) {
        viewModelScope.launch {
            _products.value = NetworkResult.Loading
            if (query.isBlank()) {
                _products.value = productRepo.getProducts()
            } else {
                _products.value = productRepo.searchProducts(query)
            }
        }
    }
}

class ProductDetailViewModel(
    private val productRepo: ProductRepository,
    private val cartRepo: CartRepository
) : ViewModel() {
    private val _product = MutableLiveData<NetworkResult<Product>>()
    val product: LiveData<NetworkResult<Product>> = _product

    private val _variants = MutableLiveData<NetworkResult<List<ProductVariant>>>()
    val variants: LiveData<NetworkResult<List<ProductVariant>>> = _variants

    private val _selectedVariant = MutableLiveData<ProductVariant?>()
    val selectedVariant: LiveData<ProductVariant?> = _selectedVariant

    private val _quantity = MutableLiveData(1)
    val quantity: LiveData<Int> = _quantity

    private val _cartAction = MutableLiveData<NetworkResult<CartItem>?>()
    val cartAction: LiveData<NetworkResult<CartItem>?> = _cartAction

    fun loadProductDetail(productId: String) {
        viewModelScope.launch {
            _product.value = NetworkResult.Loading
            _product.value = productRepo.getProductDetail(productId)

            _variants.value = productRepo.getProductVariants(productId)
            val variantsList = (_variants.value as? NetworkResult.Success)?.data
            if (!variantsList.isNullOrEmpty()) {
                _selectedVariant.value = variantsList.first()
            }
        }
    }

    fun selectVariant(variant: ProductVariant) {
        _selectedVariant.value = variant
    }

    fun incrementQty(maxStock: Int = 99) {
        val current = _quantity.value ?: 1
        if (current < maxStock) {
            _quantity.value = current + 1
        }
    }

    fun decrementQty() {
        val current = _quantity.value ?: 1
        if (current > 1) {
            _quantity.value = current - 1
        }
    }

    fun addToCart(userId: String) {
        val prod = (_product.value as? NetworkResult.Success)?.data ?: return
        val variantId = _selectedVariant.value?.id
        val qty = _quantity.value ?: 1

        viewModelScope.launch {
            _cartAction.value = NetworkResult.Loading
            _cartAction.value = cartRepo.addToCart(userId, prod.id, variantId, qty)
        }
    }
}

class CartViewModel(private val cartRepo: CartRepository) : ViewModel() {
    private val _cartItems = MutableLiveData<NetworkResult<List<CartItem>>>()
    val cartItems: LiveData<NetworkResult<List<CartItem>>> = _cartItems

    private val _totalAmount = MutableLiveData(0.0)
    val totalAmount: LiveData<Double> = _totalAmount

    fun loadCart(userId: String) {
        viewModelScope.launch {
            _cartItems.value = NetworkResult.Loading
            val result = cartRepo.getCart(userId)
            _cartItems.value = result
            calculateTotal(result)
        }
    }

    fun updateItemQuantity(cartId: String, newQty: Int, userId: String) {
        viewModelScope.launch {
            cartRepo.updateQuantity(cartId, newQty)
            loadCart(userId)
        }
    }

    fun removeItem(cartId: String, userId: String) {
        viewModelScope.launch {
            cartRepo.deleteCartItem(cartId)
            loadCart(userId)
        }
    }

    private fun calculateTotal(result: NetworkResult<List<CartItem>>) {
        if (result is NetworkResult.Success) {
            val total = result.data.sumOf { item ->
                (item.product?.price ?: 0.0) * item.quantity
            }
            _totalAmount.value = total
        }
    }
}

class CheckoutViewModel(
    private val orderRepo: OrderRepository,
    private val paymentRepo: PaymentRepository
) : ViewModel() {
    private val _orderResult = MutableLiveData<NetworkResult<Order>>()
    val orderResult: LiveData<NetworkResult<Order>> = _orderResult

    fun processCheckout(
        userId: String,
        subtotal: Double,
        shippingCost: Double,
        paymentMethod: String,
        shippingMethod: String,
        items: List<CartItem>
    ) {
        viewModelScope.launch {
            _orderResult.value = NetworkResult.Loading
            val orderNumber = "#HJB-${System.currentTimeMillis().toString().takeLast(8)}"
            val totalAmount = subtotal + shippingCost

            val newOrder = Order(
                id = "",
                userId = userId,
                orderNumber = orderNumber,
                shippingAddress = "Jl. Pemuda No. 45, Kota Cirebon, Jawa Barat",
                shippingMethod = shippingMethod,
                paymentMethod = paymentMethod,
                subtotal = subtotal,
                shippingCost = shippingCost,
                serviceFee = 0.0,
                totalAmount = totalAmount,
                paymentStatus = "PENDING",
                orderStatus = "PENDING"
            )

            val orderItems = items.map { item ->
                OrderItem(
                    orderId = "",
                    productId = item.productId,
                    productName = item.product?.name ?: "Hijab",
                    variantName = item.variant?.variantValue ?: "Default",
                    quantity = item.quantity,
                    price = item.product?.price ?: 0.0,
                    subtotal = (item.product?.price ?: 0.0) * item.quantity,
                    imageUrl = item.product?.imageUrl
                )
            }

            val created = orderRepo.createOrder(newOrder, orderItems)
            if (created is NetworkResult.Success) {
                // Buat record pembayaran sandbox
                val payment = Payment(
                    orderId = created.data.id,
                    paymentMethod = paymentMethod,
                    virtualAccount = "12345678901234",
                    amount = totalAmount,
                    paymentStatus = "PENDING"
                )
                paymentRepo.createPayment(payment)
            }
            _orderResult.value = created
        }
    }
}

class PaymentSandboxViewModel(private val paymentRepo: PaymentRepository) : ViewModel() {
    private val _paymentStatus = MutableLiveData("PENDING")
    val paymentStatus: LiveData<String> = _paymentStatus

    fun checkAndSimulatePayment(orderId: String) {
        viewModelScope.launch {
            val result = paymentRepo.simulatePaymentSuccess(orderId)
            if (result is NetworkResult.Success) {
                _paymentStatus.value = "PAID"
            }
        }
    }
}

class HomeViewModelFactory(private val repository: ProductRepository) : androidx.lifecycle.ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return HomeViewModel(repository) as T
    }
}

class ProductDetailViewModelFactory(
    private val productRepo: ProductRepository,
    private val cartRepo: CartRepository
) : androidx.lifecycle.ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return ProductDetailViewModel(productRepo, cartRepo) as T
    }
}

class CartViewModelFactory(private val cartRepo: CartRepository) : androidx.lifecycle.ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return CartViewModel(cartRepo) as T
    }
}

class CheckoutViewModelFactory(
    private val orderRepo: OrderRepository,
    private val paymentRepo: PaymentRepository
) : androidx.lifecycle.ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return CheckoutViewModel(orderRepo, paymentRepo) as T
    }
}

class PaymentSandboxViewModelFactory(private val paymentRepo: PaymentRepository) : androidx.lifecycle.ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return PaymentSandboxViewModel(paymentRepo) as T
    }
}
