"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  PasswordFormValues,
  passwordSchema,
  PrivacyFormValues,
  privacySchema,
  ProfileFormValues,
  profileSchema,
} from "@/schemas/settings";
import { User } from "next-auth";
import { UserSession } from "@/models/userSession";
import {
  deleteAllOtherSessions,
  deleteSession,
  getMe,
  updateUserPassword,
  updateUserPrivacy,
  updateUserProfile,
  uploadAvatar,
} from "@/lib/db/queries";
import { getImmichAsset } from "@/lib/services/immich-service";

export function useSettingsViewModel() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined,
  );
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [privacyDefaults, setPrivacyDefaults] =
    useState<PrivacyFormValues | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
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
    values: {
      profileVisibility:
        (user?.profileVisibility as "public" | "users" | "private") ??
        "friends",
      activityVisible: user?.activityVisible ?? true,
    },
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userData: User | { error: string } = await getMe();

        if ("error" in userData) throw new Error(userData.error);

        setUser(userData);
        setSessions(userData.sessions);
        setAvatarPreview(
          userData.image
            ? await getImmichAsset({ type: "thumbnail", id: userData.image })
            : undefined,
        );
        setPrivacyDefaults({
          profileVisibility: userData.profileVisibility,
          activityVisible: userData.activityVisible,
        });
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (
      user?.firstName === data.firstName &&
      user.lastName === data.lastName &&
      user.username === data.username &&
      user.email === data.email &&
      !avatarFile
    ) {
      toast("No data has changed");
      return;
    }

    setIsUpdating(true);
    const validated = profileSchema.parse({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
    });
    toast.promise(
      Promise.all([
        avatarFile ? uploadAvatar(avatarFile) : Promise.resolve(),
        updateUserProfile(validated),
      ]).finally(() => setIsUpdating(false)),
      {
        loading: "Updating profile...",
        success: "Saved!",
        error: (err) => err.message ?? "Something went wrong",
      },
    );
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    const validated = passwordSchema.parse({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    toast.promise(
      updateUserPassword(validated)
        .then(() => passwordForm.reset())
        .finally(() => setIsUpdating(false)),
      {
        loading: "Changing password...",
        success: "Password updated!",
        error: (err) => err.message ?? "Something went wrong",
      },
    );
  };

  const onSessionDelete = async (id: string) => {
    toast.promise(deleteSession(id), {
      loading: "Deleting session...",
      success: "Deleted!",
      error: (err) => err.message ?? "Something went wrong",
    });
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const removeAllOtherSessions = async () => {
    const currSession = sessions.filter((session) => session.isCurrent);
    toast.promise(deleteAllOtherSessions(currSession[0].id), {
      loading: "Removing all other sessions...",
      success: "All non-active sessions removed!",
      error: (err) => err.message ?? "Something went wrong",
    });
    setSessions(currSession);
  };

  const onPrivacySubmit = async (data: PrivacyFormValues) => {
    if (
      data.activityVisible === user?.activityVisible &&
      data.profileVisibility === user.profileVisibility
    ) {
      toast.error("No data was changed. Aborting save.");
      return;
    }
    setIsUpdating(true);
    toast.promise(
      updateUserPrivacy(data).finally(() => setIsUpdating(false)),
      {
        loading: "Updating privacy...",
        success: "Saved!",
        error: (err) => err.message ?? "Something went wrong",
      },
    );
  };

  return {
    user,
    avatarPreview,
    isLoading,
    isUpdating,

    profileForm,
    passwordForm,
    privacyForm,
    privacyDefaults,

    onProfileSubmit,
    onPasswordSubmit,
    onPrivacySubmit,
    onSessionDelete,
    handleAvatarChange,
    removeAllOtherSessions,

    sessions,
  };
}
