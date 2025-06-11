"use client"
import { PrimaryButton } from "@/components/button"
import { PasswordInput, TextInput } from "@/components/input"
import { authService } from "@/lib/api/services/authService"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('from') || '/dashboard'
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data.email, data.password),
    onSuccess: () => {
      toast.success("Login successful", {
        description: "Welcome back!",
      })
      router.push(redirectTo)
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response: { data: { detail: string } } }).response?.data?.detail ?? "Login failed"
      toast.error("Login failed", {
        description: errorMessage,
      })
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-8 flex flex-col gap-4">
          <TextInput
            label="Email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            error={errors.email?.message}
          />
          <div>
            <PasswordInput
              label="Password"
              {...register("password")}
              placeholder="Enter your password"
              error={errors.password?.message}
            />
          </div>
        </div>
        <div className="mb-8 w-full">
          <PrimaryButton
            label={loginMutation.isPending ? "Logging in..." : "Login"}
            type="submit"
            disabled={!isValid || loginMutation.isPending}
          />
        </div>
        <div className="text-center text-sm text-gray-500">
          Need to create an account?{"   "}
          <a href="/auth/register" className="font-bold underline leading-2.5">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}