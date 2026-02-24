// app/settings/page.tsx
"use client";

import {
  Camera,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Avatar from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsViewModel } from "@/view-models/settings/useSettignsViewModel";

export default function SettingsPage() {
  const {
    avatarPreview,
    isLoading,
    isUpdating,
    profileForm,
    passwordForm,
    privacyForm,
    sessions,
    privacyDefaults,
    onProfileSubmit,
    onPasswordSubmit,
    onPrivacySubmit,
    onSessionDelete,
    handleAvatarChange,
    removeAllOtherSessions,
  } = useSettingsViewModel();

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account, security, and privacy preferences
          </p>
        </div>
        <div id="wefwefw" className="rounded-md">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                className="bg-gray-300 cursor-pointer rounded-t-md"
                value="profile"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                className="bg-gray-300 cursor-pointer rounded-t-md"
                value="security"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                className="bg-gray-300 cursor-pointer rounded-t-md"
                value="privacy"
              >
                Privacy
              </TabsTrigger>
            </TabsList>
            {/* ── PROFILE TAB ── */}
            <TabsContent value="profile">
              <Card
                className="text-black border-t-0 rounded-b-md"
                header={
                  <div className="flex flex-col gap-2 pt-4">
                    <h3>Profile Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your public profile information
                    </p>
                  </div>
                }
                footer={
                  <div className="flex justify-end items-center py-4 pr-4">
                    <Button
                      variant="outline"
                      type="submit"
                      className="cursor-pointer"
                      disabled={isUpdating}
                      onClick={profileForm.handleSubmit(onProfileSubmit)}
                    >
                      {isUpdating ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                }
              >
                <Form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <Avatar
                        className="h-24 w-24 border-4 border-background shadow-xl"
                        src={avatarPreview}
                        alt="Profile"
                        fallbackSrc={"/generic-prof-pic.webp"}
                      />
                      <div>
                        <Label htmlFor="avatar" className="cursor-pointer">
                          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                            <Camera className="h-4 w-4" />
                            Change Avatar
                          </div>
                          <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPG, PNG or GIF • Max 2MB
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between space-x-4">
                      {/* First Name */}
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }: { field: any }) => (
                          <FormItem className="w-full">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="John" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* LastName */}
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }: { field: any }) => (
                          <FormItem className="w-full">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Smith" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Username */}
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="jordydev" />
                          </FormControl>
                          <FormDescription>
                            Used in profile links and mentions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="jordan@example.com"
                            />
                          </FormControl>
                          <FormDescription>
                            Used for account recovery and notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </Card>
            </TabsContent>

            {/* ── SECURITY TAB ── */}
            <TabsContent value="security">
              <div className="space-y-6">
                {/* Change Password */}
                <Card
                  className="text-black border-t-0"
                  header={
                    <div className="flex flex-col items-center justify-center gap-2 pt-4">
                      <h3>Change Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password for better security
                      </p>
                    </div>
                  }
                  footer={
                    <div className="flex justify-end py-4 pr-4">
                      <Button
                        type="submit"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isUpdating}
                        onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                      >
                        {isUpdating ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  }
                >
                  <Form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <input
                      type="text"
                      autoComplete="username"
                      readOnly
                      className="hidden"
                    />
                    <div className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                autoComplete="current-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum 10 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </Card>

                {/* Two-Factor Authentication */}
                <Card
                  className="text-black"
                  header={
                    <div className="flex flex-col items-center justify-center gap-2 pt-4">
                      <h3>Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                  }
                >
                  <div className="flex justify-between items-center px-4 pb-4">
                    <p className="text-sm text-muted-foreground">
                      Protect your account with 2FA using an authenticator app
                      (TOTP).
                    </p>
                    <Switch className="bg-gray-400" defaultChecked={false} />
                    {/* QR Code & setup flow would go here when enabled */}
                  </div>
                </Card>

                {/* Active Sessions */}
                <Card
                  className="text-black rounded-b-md"
                  header={
                    <div className="flex flex-col items-center justify-center gap-2 pt-4">
                      <h3>Active Sessions</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage devices logged into your account
                      </p>
                    </div>
                  }
                  footer={
                    <div className="flex justify-end py-4 pr-4">
                      <Button
                        variant="outline"
                        className="cursor-pointer text-destructive hover:bg-destructive/10"
                        onClick={removeAllOtherSessions}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Remove all inactive sessions
                      </Button>
                    </div>
                  }
                >
                  <div>
                    <div className="space-y-4 px-4">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between bg-gray-200 rounded-lg border p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-muted p-2">
                              {session.isCurrent ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{session.device}</p>
                              <p className="text-sm text-muted-foreground">
                                {`${session.city ? `${session.city}, ` : ""} ${session.region ? `${session.region}, ` : ""} ${session.country ? `${session.country}` : ""}`}{" "}
                                • {session.lastActiveAt.toTimeString()}
                                {session.isCurrent && (
                                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Current
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {!session.isCurrent && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive cursor-pointer"
                              onClick={() => onSessionDelete(session.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* ── PRIVACY TAB ── */}
            <TabsContent value="privacy">
              <Card
                className="text-black border-t-0 rounded-b-md"
                header={
                  <div className="flex flex-col gap-2 pt-4">
                    <h3>Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your activity and information
                    </p>
                  </div>
                }
                footer={
                  <div className="flex justify-end py-4 pr-4">
                    <Button
                      type="submit"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={isUpdating}
                      onClick={privacyForm.handleSubmit(onPrivacySubmit)}
                    >
                      {isUpdating ? "Saving..." : "Save Privacy Settings"}
                    </Button>
                  </div>
                }
              >
                <Form
                  onSubmit={privacyForm.handleSubmit(onPrivacySubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    {privacyDefaults && (
                      <FormField
                        control={privacyForm.control}
                        name="profileVisibility"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Profile Visibility</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              key={privacyDefaults?.profileVisibility}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">
                                  Public – Anyone can see
                                </SelectItem>
                                <SelectItem value="users">
                                  Users - Anyone with account
                                </SelectItem>
                                <SelectItem value="private">
                                  Private – Only me
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Who can see your profile, posts, and activity
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Activity Visibility */}
                    <FormField
                      control={privacyForm.control}
                      name="activityVisible"
                      render={({ field }: { field: any }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Activity Status
                            </FormLabel>
                            <FormDescription>
                              Allow others to see when you're online or recently
                              active
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              className="bg-gray-400"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
