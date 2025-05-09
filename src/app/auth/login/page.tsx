"use client"
import React from "react"
import { PasswordInput, TextInput } from "@/components/input"
import { PrimaryButton } from "@/components/button"
import { redirect } from "next/navigation"

export default function Login() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData)
    redirect("/dashboard")
  }

  return (
    <div className="md:w-[560px] w-[90%] mx-auto md:mx-0 bg-white p-8 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="my-8">
          <TextInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-8 w-full">
          <PrimaryButton
            label="Login"
            type="submit"
            // disabled={!formData.email || !formData.password}
            disabled={false}
          />
        </div>
        <div className="text-center text-sm text-gray-500">
          Need to create an account?{"   "}
          <a href="/auth/register" className="text-grey-900 font-bold underline leading-2.5">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  )
}