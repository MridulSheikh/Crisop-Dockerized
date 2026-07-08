"use client";

import ImgUpload from "@/components/shared/imgUpload/ImgUpload";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  setUser,
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import {
  useChangeMyPasswordMutation,
  useUpdateMyProfileMutation,
} from "@/redux/features/user/userApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { KeyRound, Mail, Save, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  currentPassword: z.string().optional(),
  image: z.array(z.custom<File>()).default([]),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.input<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const dispatch = useAppDispatch();
  const isLocalAccount = user?.authProvider
    ? user.authProvider === "local"
    : true;
  const profileImage = user?.image || user?.img || "";
  const [updateMyProfile, { isLoading: isProfileUpdating }] =
    useUpdateMyProfileMutation();
  const [changeMyPassword, { isLoading: isPasswordChanging }] =
    useChangeMyPasswordMutation();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    control,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      image: [],
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    resetProfile({
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      image: [],
    });
  }, [resetProfile, user]);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    if (isLocalAccount && data.email !== user?.email && !data.currentPassword) {
      toast.error("Current password is required to change email");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);

    if (isLocalAccount) {
      formData.append("email", data.email);
      if (data.currentPassword) {
        formData.append("currentPassword", data.currentPassword);
      }
    }

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    const toastId = toast.loading("Updating profile...");

    try {
      const response = await updateMyProfile(formData).unwrap();
      const accessToken = response?.data?.accessToken;

      if (accessToken) {
        dispatch(setUser({ token: accessToken, user: jwtDecode(accessToken) }));
      }

      toast.update(toastId, {
        render: "Profile updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      resetProfile({
        name: data.name,
        email: isLocalAccount ? data.email : user?.email || "",
        currentPassword: "",
        image: [],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.update(toastId, {
        render:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Failed to update profile",
        type: "error",
        isLoading: false,
        autoClose: 3500,
      });
    }
  };

  const handlePasswordChange = async (data: PasswordFormValues) => {
    const toastId = toast.loading("Changing password...");

    try {
      await changeMyPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.update(toastId, {
        render: "Password changed successfully",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      resetPassword();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.update(toastId, {
        render:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Failed to change password",
        type: "error",
        isLoading: false,
        autoClose: 3500,
      });
    }
  };

  return (
    <main className="min-h-[80vh] bg-[#f6f6f6] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-screen-xl space-y-6">
        <section className="flex flex-col gap-4 rounded-md border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className={cn("size-20 cursor-pointer")}>
              <AvatarImage
                className="object-cover"
                src={user?.image || "/img/user_placeholder.png"}
                alt={user?.name}
              />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user?.name || "User"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                {user?.role}{" "}
                {user?.authProvider ? `- ${user.authProvider}` : ""}
              </p>
            </div>
          </div>
          {token && (
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              <UserRound size={16} />
              Active account
            </span>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Mail size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Profile details
              </h2>
            </div>

            <form
              onSubmit={handleProfileSubmit(handleProfileUpdate)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" {...registerProfile("name")} />
                {profileErrors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {profileErrors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  disabled={!isLocalAccount}
                  readOnly={!isLocalAccount}
                  {...registerProfile("email")}
                />
                {!isLocalAccount && (
                  <p className="mt-1 text-xs text-gray-500">
                    Email is managed by your OAuth provider.
                  </p>
                )}
              </div>

              {isLocalAccount && (
                <div>
                  <Label htmlFor="profile-current-password">
                    Current password
                  </Label>
                  <Input
                    id="profile-current-password"
                    type="password"
                    placeholder="Required when changing email"
                    {...registerProfile("currentPassword")}
                  />
                </div>
              )}

              <div>
                <Label>Profile image</Label>
                {profileImage && (
                  <div className="mb-3 flex items-center gap-3 rounded-md border p-2">
                    <div className="relative size-14 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={profileImage}
                        alt={user?.name || "Profile image"}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      Current image. Upload a new file to replace it.
                    </span>
                  </div>
                )}
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <ImgUpload
                      value={field.value}
                      onChange={field.onChange}
                      max_file={1}
                    />
                  )}
                />
              </div>

              <Button disabled={isProfileUpdating} type="submit">
                <Save size={16} />
                {isProfileUpdating ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </section>

          {isLocalAccount && (
            <section className="rounded-md border bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <KeyRound size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Change password
                </h2>
              </div>

              <form
                onSubmit={handlePasswordSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    {...registerPassword("currentPassword")}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...registerPassword("newPassword")}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...registerPassword("confirmPassword")}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button disabled={isPasswordChanging} type="submit">
                  <KeyRound size={16} />
                  {isPasswordChanging ? "Changing..." : "Change password"}
                </Button>
              </form>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
