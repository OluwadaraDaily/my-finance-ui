"use client"
import { PrimaryButton } from "@/components/button"
import { PasswordInput, TextInput } from "@/components/input"
import { authService } from "@/lib/api/services/authService"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function SignUp() {
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: () => {
      toast.success("Registration successful", {
        description: "Please check your email for verification",
      })
      reset()
      router.push("/auth/login")
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response: { data: { detail: string } } }).response?.data?.detail ?? "Registration failed"
      toast.error("Registration failed", {
        description: errorMessage,
      })
    },
  })

  // Form submission handler
  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-8 flex flex-col gap-4">
          <TextInput
            label="Username"
            type="text"
            {...register("username")}
            placeholder="Enter your username"
            error={errors.username?.message}
          />
          <TextInput
            label="Email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            error={errors.email?.message}
          />
          <div>
            <PasswordInput
              label="Create Password"
              {...register("password")}
              placeholder="Enter your password"
              error={errors.password?.message}
            />
          </div>
        </div>
        <div className="mb-8 w-full">
          <PrimaryButton
            label={registerMutation.isPending ? "Creating Account..." : "Create Account"}
            type="submit"
            disabled={!isValid || registerMutation.isPending}
          />
        </div>
        <div className="text-center text-sm text-gray-500">
          Already have an account?{"   "}
          <a href="/auth/login" className="font-bold underline leading-2.5">
            Login
          </a>
        </div>
      </form>
    </div>
  )
}