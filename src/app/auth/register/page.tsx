"use client"
import { PrimaryButton } from "@/components/button"
import { PasswordInput, TextInput } from "@/components/input"
import { redirect } from "next/navigation"
import React from "react"

export default function SignUp() {
  const [formData, setFormData] = React.useState({
    name: "",
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
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="my-8">
          <TextInput
            label="Name"
            type="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
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