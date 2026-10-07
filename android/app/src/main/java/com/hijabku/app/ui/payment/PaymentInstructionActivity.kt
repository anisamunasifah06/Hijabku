package com.hijabku.app.ui.payment

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.CountDownTimer
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.hijabku.app.HijabKuApp
import com.hijabku.app.R
import com.hijabku.app.data.model.Order
import com.hijabku.app.ui.order.OrderTrackingActivity
import com.hijabku.app.viewmodel.PaymentSandboxViewModel
import com.hijabku.app.viewmodel.PaymentSandboxViewModelFactory
import java.text.NumberFormat
import java.util.Locale

class PaymentInstructionActivity : AppCompatActivity() {

    private lateinit var viewModel: PaymentSandboxViewModel
    private var orderData: Order? = null
    private var countDownTimer: CountDownTimer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_payment_instruction)

        val app = application as HijabKuApp
        val factory = PaymentSandboxViewModelFactory(app.paymentRepository)
        viewModel = ViewModelProvider(this, factory)[PaymentSandboxViewModel::class.java]

        orderData = intent.getSerializableExtra("ORDER_DATA") as? Order
        val totalAmount = intent.getDoubleExtra("TOTAL_AMOUNT", 114000.0)

        val btnPaymentBack = findViewById<ImageView>(R.id.btnPaymentBack)
        val tvPaymentCountdown = findViewById<TextView?>(R.id.tvPaymentCountdown)
        val tvVaNumber = findViewById<TextView?>(R.id.tvVaNumber)
        val btnCopyVa = findViewById<Button?>(R.id.btnCopyVa)
        val tvTotalTagihan = findViewById<TextView?>(R.id.tvTotalTagihan)
        val btnCheckPaymentStatus = findViewById<Button>(R.id.btnCheckPaymentStatus)

        val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
        tvTotalTagihan?.text = format.format(totalAmount).replace(",00", "")

        btnPaymentBack.setOnClickListener {
            finish()
        }

        btnCopyVa?.setOnClickListener {
            val va = tvVaNumber?.text?.toString() ?: "12345678901234"
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("VA Number", va)
            clipboard.setPrimaryClip(clip)
            Toast.makeText(this, "Nomor Virtual Account disalin!", Toast.LENGTH_SHORT).show()
        }

        // 24-Hour Countdown simulation
        countDownTimer = object : CountDownTimer(86355000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val totalSeconds = millisUntilFinished / 1000
                val hours = totalSeconds / 3600
                val minutes = (totalSeconds % 3600) / 60
                val seconds = totalSeconds % 60
                tvPaymentCountdown?.text = String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds)
            }

            override fun onFinish() {
                tvPaymentCountdown?.text = "00:00:00"
            }
        }.start()

        viewModel.paymentStatus.observe(this) { status ->
            if (status == "PAID") {
                Toast.makeText(this, "Pembayaran berhasil diverifikasi!", Toast.LENGTH_LONG).show()
                val intent = Intent(this, OrderTrackingActivity::class.java).apply {
                    putExtra("ORDER_ID", orderData?.id)
                    putExtra("ORDER_DATA", orderData)
                }
                startActivity(intent)
                finish()
            }
        }

        btnCheckPaymentStatus.setOnClickListener {
            Toast.makeText(this, "Memeriksa pembayaran sandbox...", Toast.LENGTH_SHORT).show()
            viewModel.checkAndSimulatePayment(orderData?.id ?: "demo-order")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        countDownTimer?.cancel()
    }
}
