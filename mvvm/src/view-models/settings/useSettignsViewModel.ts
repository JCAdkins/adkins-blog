"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  PasswordFormValues,
  passwordSchema,
  PrivacyFormValues,
  privacySchema,
  ProfileFormValues,
  profileSchema,
} from "@/schemas/settings";

const mockUser = {
  firstName: "Jordan",
  lastName: "Adkins",
  username: "jordydev",
  email: "jordan@example.com",
  avatar: "/avatar.png",
};

const mockSessions = [
  {
    id: "1",
    device: "MacBook Pro • Chrome",
    location: "East Highland Park, VA",
    lastActive: "Just now",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15 • Safari",
    location: "Virginia, US",
    lastActive: "2 hours ago",
  },
  {
    id: "3",
    device: "Windows PC • Edge",
    location: "Unknown",
    lastActive: "3 days ago",
  },
];

export function useSettingsViewModel() {
  const [avatarPreview, setAvatarPreview] = useState(mockUser.avatar);
  const [isUpdating, setIsUpdating] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockUser,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const privacyForm = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: "friends",
      activityVisible: true,
      connectionsVisible: true,
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const fakeApi = (data: unknown, message: string) => {
    setIsUpdating(true);

    toast.promise(
      new Promise((resolve) =>
        setTimeout(() => {
          resolve(data);
          setIsUpdating(false);
        }, 1500),
      ),
      {
        loading: message,
        success: "Saved!",
        error: "Something went wrong",
      },
    );
  };

  const onProfileSubmit = (data: ProfileFormValues) =>
    fakeApi(data, "Updating profile...");

  const onPasswordSubmit = (data: PasswordFormValues) => {
    fakeApi(data, "Changing password...");
    passwordForm.reset();
  };

  const onPrivacySubmit = (data: PrivacyFormValues) =>
    fakeApi(data, "Updating privacy...");

  return {
    avatarPreview,
    isUpdating,

    profileForm,
    passwordForm,
    privacyForm,

    onProfileSubmit,
    onPasswordSubmit,
    onPrivacySubmit,
    handleAvatarChange,

    sessions: mockSessions,
  };
}
