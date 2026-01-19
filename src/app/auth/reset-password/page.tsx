"use client"

import { PrimaryButton, SecondaryButton } from "@/components/button"
import { PasswordInput, TextInput } from "@/components/input"
import { authService } from "@/lib/api/services/authService"
import { useSearchParams, useRouter } from "next/navigation"
import React, { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

type ResetState = "loading" | "request" | "form" | "success" | "expired" | "error"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [state, setState] = useState<ResetState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [email, setEmail] = useState("")
  const [showRequestForm, setShowRequestForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  })

  const validateTokenMutation = useMutation({
    mutationFn: (token: string) => authService.validateResetToken(token),
    onSuccess: () => {
      setState("form")
    },
    onError: (error: unknown) => {
      const response = (error as { response?: { data?: { detail?: string }, status?: number } }).response
      const errorDetail = response?.data?.detail ?? "Invalid token"

      if (errorDetail.toLowerCase().includes("expired") || response?.status === 410) {
        setState("expired")
        setErrorMessage("Your password reset link has expired. Please request a new one.")
      } else {
        setState("error")
        setErrorMessage(errorDetail)
      }
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      authService.resetPassword(data.token, data.password),
    onSuccess: () => {
      setState("success")
      toast.success("Password reset successful", {
        description: "You can now log in with your new password.",
      })
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Failed to reset password"
      toast.error("Password reset failed", {
        description: errorMessage,
      })
    },
  })

  const requestResetMutation = useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onSuccess: () => {
      toast.success("Password reset email sent", {
        description: "Please check your inbox for the reset link.",
      })
      setShowRequestForm(false)
      setEmail("")
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Failed to send email"
      toast.error("Failed to send email", {
        description: errorMessage,
      })
    },
  })

  useEffect(() => {
    if (token) {
      validateTokenMutation.mutate(token)
    } else {
      setState("request")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (token) {
      resetPasswordMutation.mutate({ token, password: data.password })
    }
  }

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      requestResetMutation.mutate(email)
    }
  }

  const navigateToLogin = () => {
    router.push("/auth/login")
  }

  return (
    <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
      {state === "loading" && (
        <div className="text-center py-8">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-grey-900 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Validating Reset Link</h1>
          <p className="text-gray-500">Please wait while we verify your reset link...</p>
        </div>
      )}

      {state === "request" && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          <p className="text-gray-500 mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <form onSubmit={handleRequestReset}>
            <div className="my-8">
              <TextInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-8 w-full">
              <PrimaryButton
                label={requestResetMutation.isPending ? "Sending..." : "Send Reset Link"}
                type="submit"
                disabled={!email.trim() || requestResetMutation.isPending}
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Remember your password?{"   "}
              <a href="/auth/login" className="font-bold underline leading-2.5">
                Back to Login
              </a>
            </div>
          </form>
        </div>
      )}

      {state === "form" && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
          <p className="text-gray-500 mb-6">Enter your new password below.</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-8 flex flex-col gap-4">
              <PasswordInput
                label="New Password"
                {...register("password")}
                placeholder="Enter new password"
                error={errors.password?.message}
              />
              <PasswordInput
                label="Confirm Password"
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                error={errors.confirmPassword?.message}
              />
            </div>
            <PrimaryButton
              label={resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              type="submit"
              disabled={!isValid || resetPasswordMutation.isPending}
            />
          </form>
        </div>
      )}

      {state === "success" && (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
          <p className="text-gray-500 mb-6">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <PrimaryButton
            label="Go to Login"
            onClick={navigateToLogin}
          />
        </div>
      )}

      {state === "expired" && (
        <div className="text-center py-8">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
          <p className="text-gray-500 mb-6">{errorMessage}</p>

          {!showRequestForm ? (
            <SecondaryButton
              label="Request New Reset Link"
              onClick={() => setShowRequestForm(true)}
            />
          ) : (
            <form onSubmit={handleRequestReset} className="mt-4">
              <div className="mb-4">
                <TextInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex gap-3">
                <SecondaryButton
                  label="Cancel"
                  onClick={() => {
                    setShowRequestForm(false)
                    setEmail("")
                  }}
                  type="button"
                />
                <PrimaryButton
                  label={requestResetMutation.isPending ? "Sending..." : "Send Email"}
                  type="submit"
                  disabled={!email.trim() || requestResetMutation.isPending}
                />
              </div>
            </form>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="text-center py-8">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
          <p className="text-gray-500 mb-6">{errorMessage}</p>
          <SecondaryButton
            label="Back to Login"
            onClick={navigateToLogin}
          />
        </div>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
        <div className="text-center py-8">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-grey-900 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <ResetPassword />
    </Suspense>
  )
}
