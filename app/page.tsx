"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (values: { email: string; password: string }) => {
    // Aqui você deve implementar a lógica de autenticação
    console.log("Login", values)
    // Simulating a successful login
    localStorage.setItem("isLoggedIn", "true")
    toast({
      title: "Login bem-sucedido",
      description: "Redirecionando para o dashboard...",
    })
    router.push("/dashboard")
  }

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    // Aqui você deve implementar a lógica de registro
    console.log("Register", values)
    toast({
      title: "Registro bem-sucedido",
      description: "Agora você pode fazer login.",
    })
    setIsLogin(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Cadastro"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Entre com suas credenciais para acessar o sistema."
              : "Crie uma nova conta para acessar o sistema."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? <LoginForm onSubmit={handleLogin} /> : <RegisterForm onSubmit={handleRegister} />}
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

