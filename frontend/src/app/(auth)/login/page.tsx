"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MoveRight } from "lucide-react";
import Image from "next/image";
import {
  useOauthLoginMutation,
  useLoginUserMutation,
  useVerfiyEmailMutation,
} from "@/redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { jwtDecode } from "jwt-decode";
import { setUser, useCurrentUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLoginButton from "@/components/auth/FacebookLoginButton";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [step, setStep] = useState<"login" | "verify">("login");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [oAuthLogin] = useOauthLoginMutation();
  const dispatch = useAppDispatch();
  const [verifyEmail] = useVerfiyEmailMutation();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const user = useAppSelector(useCurrentUser);
  const [codeDigits, setCodeDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  // email password login
  const onSubmit = async (data: FormData) => {
    // show a loading toast
    const toastId = toast.loading("Logging in…");

    try {
      const response = await loginUser(data).unwrap();

      const user = jwtDecode(response.data.accessToken);
      dispatch(setUser({ token: response.data.accessToken, user }));

      // update the existing loading toast into success
      toast.update(toastId, {
        render: "Logged in successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });

    } catch (err: any) {
      if (
        err?.data?.errorMessage ===
        "You are not verified, please check your email!"
      ) {
        setEmailForVerification(data.email);
        setStep("verify");
      }
      // update the existing loading toast into error
      toast.update(toastId, {
        render:
          err?.data?.errorMessage ??
          "Login failed — please check your credentials",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        position: "top-center",
      });
    }
  };

  // handle google login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (TokenRes) => {
      const toastId = toast.loading("Logging in…");
      try {
        const response = await oAuthLogin({
          accessToken: TokenRes.access_token,
          method: "google",
        }).unwrap();

        const user = jwtDecode(response.data.accessToken);
        dispatch(setUser({ token: response.data.accessToken, user }));

        toast.update(toastId, {
          render: "Logged in successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          position: "top-center",
        });
      } catch (error: any) {
        console.log(error);
        toast.update(toastId, {
          render:
            error?.data?.errorMessage ??
            "Login failed — please check your credentials",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          position: "top-center",
        });
      }
    },
  });

  // handle code change
  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...codeDigits];
    updated[index] = value.slice(-1); // Only 1 digit
    setCodeDigits(updated);

    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // handle verify code
  const handleVerifyCode = async () => {
    const code = codeDigits.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits", { position: "top-center" });
      return;
    }

    const toastId = toast.loading("Verifying code...");
    try {
      const data = { email: emailForVerification, code: code };

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
      router.push("/profile");
    } catch (error : any) {
      toast.update(toastId, {
        render: error.data.errorMessage || "❌ Invalid or expired code",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // rederect user
  useEffect(() => {
    if (user?.email) {
      if (typeof redirectTo === "string") {
        router.push(redirectTo);
      } else {
        router.push("/shop");
      }
    }
  }, [user, redirectTo]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-green-50">
      {/* Left Image */}
      <div className="hidden relative md:flex items-center justify-center bg-green-100">
        <Image
          src="/img/login-page.jpg"
          alt="Fresh Grocery"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
          </CardHeader>
          {step === "login" ? (
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled={isLoading}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      disabled={isLoading}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? "Logging in…" : "Login"}
                </Button>
              </form>

              {/* OR Divider */}
              <div className="my-4 text-center">
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <div className="h-px w-full bg-gray-300" />
                  <p className="text-sm text-gray-500">OR</p>
                  <div className="h-px w-full bg-gray-300" />
                </div>
                <Button
                  disabled={isLoading}
                  onClick={() => handleGoogleLogin()}
                  variant="outline"
                  className="w-full mt-4 flex items-center justify-center space-x-2"
                >
                  <Image
                    src="/img/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Continue with Google</span>
                </Button>
                <FacebookLoginButton />
              </div>

              {/* Links */}
              <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
                <a
                  href="/forgot-password"
                  className="hover:underline text-black"
                >
                  Forgot Password?
                </a>
                <div>
                  Don’t have an account?{" "}
                  <a
                    href="/signup"
                    className=" hover:underline inline-flex items-center text-black"
                  >
                    Sign up <MoveRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                We sent a 6-digit code to{" "}
                <span className="font-medium">{emailForVerification}</span>
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
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
                    className="w-10 h-12 text-center border rounded text-lg focus:ring-2 focus:ring-black"
                  />
                ))}
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full font-semibold py-2 rounded-lg"
              >
                Verify Code
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
