package com.hijabku.app.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.hijabku.app.R
import com.hijabku.app.ui.main.MainActivity

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val btnRegisterBack = findViewById<ImageView>(R.id.btnRegisterBack)
        val etRegisterName = findViewById<EditText>(R.id.etRegisterName)
        val etRegisterEmail = findViewById<EditText>(R.id.etRegisterEmail)
        val etRegisterPassword = findViewById<EditText>(R.id.etRegisterPassword)
        val etRegisterConfirmPassword = findViewById<EditText>(R.id.etRegisterConfirmPassword)
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvToLogin = findViewById<TextView>(R.id.tvToLogin)

        btnRegisterBack.setOnClickListener {
            finish()
        }

        tvToLogin.setOnClickListener {
            finish()
        }

        btnRegister.setOnClickListener {
            val name = etRegisterName.text.toString().trim()
            val email = etRegisterEmail.text.toString().trim()
            val pass = etRegisterPassword.text.toString().trim()
            val confirm = etRegisterConfirmPassword.text.toString().trim()

            if (name.isEmpty()) {
                etRegisterName.error = "Nama lengkap wajib diisi"
                return@setOnClickListener
            }
            if (email.isEmpty()) {
                etRegisterEmail.error = "Email/No HP wajib diisi"
                return@setOnClickListener
            }
            if (pass.length < 6) {
                etRegisterPassword.error = "Kata sandi minimal 6 karakter"
                return@setOnClickListener
            }
            if (pass != confirm) {
                etRegisterConfirmPassword.error = "Konfirmasi kata sandi tidak cocok"
                return@setOnClickListener
            }

            Toast.makeText(this, "Pendaftaran berhasil! Selamat datang, $name", Toast.LENGTH_LONG).show()
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }
}
