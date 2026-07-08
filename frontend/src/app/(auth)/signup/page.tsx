/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useSignupUserMutation, useVerfiyEmailMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    image: z.string().optional(),
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof formSchema>;

const Signup = () => {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const dispatch = useAppDispatch();
   const router = useRouter();

  const [signup, { isLoading }] = useSignupUserMutation();
  const [verifyEmail] = useVerfiyEmailMutation();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...codeDigits];
    updated[index] = value.slice(-1); // Only 1 digit
    setCodeDigits(updated);

    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = codeDigits.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits", { position: "top-center" });
      return;
    }

    const toastId = toast.loading("Verifying code...");
    try {
      
      const data = {email: emailForVerification, code: code }
        
      const response = await verifyEmail(data).unwrap();
       
       const user = jwtDecode(response.data.accessToken);
       dispatch(setUser({ token: response.data.accessToken, user }));

      toast.update(toastId, {
        render: "🎉 Verification successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // rederect route
      router.push('/shop')
    } catch {
      toast.update(toastId, {
        render: "❌ Invalid or expired code",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Please wait for response…");
    try {
      data.image = "https://avatars.githubusercontent.com/u/124599?v=4";
      await signup(data).unwrap();
      toast.update(toastId, {
        render: "Check your email for the verification code",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setEmailForVerification(data.email);
      setStep("verify");
    } catch (err: any) {
      console.log(err)
      toast.update(toastId, {
        render:
          err?.data?.errorMessage ??
          "Signup failed — please check your credentials",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-green-50">
      {/* Left image */}
      <div className="hidden md:flex items-center justify-center bg-green-100 relative">
        <Image
          src="/img/login-page.jpg"
          alt="Signup Illustration"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
          {step === "signup" ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-2">
                Create an Account
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Start your journey with us
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    disabled={isLoading}
                    {...register("name")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 disabled:opacity-50"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled={isLoading}
                    {...register("email")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    {...register("password")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={isLoading}
                    {...register("confirmPassword")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                We sent a 6-digit code to <span className="font-medium">{emailForVerification}</span>
              </p>

              {/* 6-digit input */}
              <div className="flex justify-between gap-2 mb-4">
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, idx)}
                    ref={(el) => {inputsRef.current[idx] = el}}
                    className="w-10 h-12 text-center border rounded text-lg"
                  />
                ))}
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full"
              >
                Verify Code
              </Button>
            </>
          )}

          {/* Link to login */}
          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-black hover:underline font-medium">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
