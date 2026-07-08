"use client";
import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { useOauthLoginMutation } from "@/redux/features/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/redux/features/auth/authSlice";
import { config } from "@/config/config";

const FacebookLoginButton = () => {
  const [oAuthLogin, { isLoading }] = useOauthLoginMutation();
  const dispatch = useAppDispatch();

  return (
    <FacebookLogin
      appId={config.facebookAppId as string}
      onSuccess={async (res) => {
        const response = await oAuthLogin({
          accessToken: res.accessToken,
          method: "facebook",
        }).unwrap();

        const user = jwtDecode(response.data.accessToken);
        dispatch(setUser({ token: response.data.accessToken, user }));

        toast.success("Logged in successfully", { position: "top-center" });
      }}
      onFail={(error) => {
        toast.error(error.status || "Login Failed!", {
          position: "top-center",
        });
      }}
      render={({ onClick }) => (
        <Button
          disabled={isLoading}
          onClick={onClick}
          variant="outline"
          className="w-full mt-4 flex items-center justify-center space-x-2"
        >
          <Image
            src="/img/facebook-logo.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span>Continue with Facebook</span>
        </Button>
      )}
    />
  );
};

export default FacebookLoginButton;
