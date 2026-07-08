"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";

// Zod schema
const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [forgotPassword] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      const res = await forgotPassword(data).unwrap();
      toast.update(toastId, {
        render: res.message || "Reset link sent! Check your email.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err)
      toast.update(toastId, {
        render: err.data.errorMessage || "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-green-50">
      {/* Left Image */}
      <div className="hidden relative md:flex items-center justify-center bg-green-100">
        <Image
          src="/img/login-page.jpg"
          alt="Reset Password"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Forgot Password
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            {/* Back to login */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-black hover:underline font-medium"
              >
                Back to Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
