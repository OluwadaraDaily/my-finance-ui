"use client"

import { PrimaryButton, SecondaryButton } from "@/components/button"
import { TextInput } from "@/components/input"
import { authService } from "@/lib/api/services/authService"
import { useSearchParams, useRouter } from "next/navigation"
import React, { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

type ActivationState = "loading" | "success" | "expired" | "error"

function ActivateAccount() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [state, setState] = useState<ActivationState>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [email, setEmail] = useState("")
  const [showResendForm, setShowResendForm] = useState(false)

  const activateMutation = useMutation({
    mutationFn: (token: string) => authService.activateAccount(token),
    onSuccess: () => {
      setState("success")
    },
    onError: (error: unknown) => {
      const response = (error as { response?: { data?: { detail?: string }, status?: number } }).response
      const errorDetail = response?.data?.detail ?? "Activation failed"

      if (errorDetail.toLowerCase().includes("expired") || response?.status === 410) {
        setState("expired")
        setErrorMessage("Your activation link has expired. Please request a new one.")
      } else {
        setState("error")
        setErrorMessage(errorDetail)
      }
    },
  })

  const resendMutation = useMutation({
    mutationFn: (email: string) => authService.resendActivationEmail(email),
    onSuccess: () => {
      toast.success("Activation email sent", {
        description: "Please check your inbox for the new activation link.",
      })
      setShowResendForm(false)
      setEmail("")
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Failed to resend email"
      toast.error("Failed to send email", {
        description: errorMessage,
      })
    },
  })

  useEffect(() => {
    if (token) {
      activateMutation.mutate(token)
    } else {
      setState("error")
      setErrorMessage("No activation token provided.")
    }
  }, [token])

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      resendMutation.mutate(email)
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
          <h1 className="text-2xl font-bold mb-2">Activating Your Account</h1>
          <p className="text-gray-500">Please wait while we verify your account...</p>
        </div>
      )}

      {state === "success" && (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold mb-2">Account Activated!</h1>
          <p className="text-gray-500 mb-6">
            Your account has been successfully activated. You can now log in to access your account.
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

          {!showResendForm ? (
            <SecondaryButton
              label="Resend Activation Email"
              onClick={() => setShowResendForm(true)}
            />
          ) : (
            <form onSubmit={handleResend} className="mt-4">
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
                    setShowResendForm(false)
                    setEmail("")
                  }}
                  type="button"
                />
                <PrimaryButton
                  label={resendMutation.isPending ? "Sending..." : "Send Email"}
                  type="submit"
                  disabled={!email.trim() || resendMutation.isPending}
                />
              </div>
            </form>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="text-center py-8">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Activation Failed</h1>
          <p className="text-gray-500 mb-6">{errorMessage}</p>
          <div className="flex gap-3 justify-center">
            <SecondaryButton
              label="Back to Login"
              onClick={navigateToLogin}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
        <div className="text-center py-8">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-grey-900 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <ActivateAccount />
    </Suspense>
  )
}
