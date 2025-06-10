"use client"
import { PrimaryButton } from "@/components/button"
import { PasswordInput, TextInput } from "@/components/input"
import { authService } from "@/lib/api/services/authService"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await authService.register(formData)
      console.log("REGISTER RESPONSE =>", response)
      toast.success("Registration successful", {
        description: "Please check your email for verification",
      })
      setFormData({
        username: "",
        email: "",
        password: "",
      })
      router.push("/auth/login")
    } catch (error: unknown) {
      const errorMessage = (error as { response: { data: { detail: string } } }).response?.data?.detail
      toast.error(errorMessage)
    }
  }
  return (
    <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="my-8 flex flex-col gap-4">
          <TextInput
            label="Username"
            type="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <div>
            <PasswordInput
              label="Create Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              Password must be at least 8 characters
            </p>
          </div>
        </div>
        <div className="mb-8 w-full">
          <PrimaryButton
            label="Create Account"
            type="submit"
            // disabled={!formData.name || !formData.email || !formData.password }
            disabled={false}
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