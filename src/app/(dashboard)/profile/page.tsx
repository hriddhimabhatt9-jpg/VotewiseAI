"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, User, MapPin, Calendar, Phone, CheckCircle, ShieldAlert } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore, useLangStore } from "@/store";
import { translations } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Avatar, Badge } from "@/components/ui/Badge";

export default function ProfilePage() {
  const router = useRouter();
  const { user: storeUser, loading } = useAuthStore();
  const { lang } = useLangStore();
  const t = translations[lang];
  const { updateUserProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      mobile: "",
      address: "",
      constituency: "",
      voterId: "",
      isRegistered: false,
      language: "en",
    },
  });

  useEffect(() => {
    if (!loading && !storeUser) {
      router.push("/login");
    } else if (storeUser) {
      setValue("fullName", storeUser.fullName || "");
      setValue("dob", storeUser.dob || "");
      setValue("mobile", storeUser.mobile || "");
      setValue("address", storeUser.address || "");
      setValue("constituency", storeUser.constituency || "");
      setValue("voterId", storeUser.voterId || "");
      setValue("isRegistered", storeUser.isRegistered || false);
      setValue("language", storeUser.language || "en");
    }
  }, [storeUser, loading, router, setValue]);

  const onSubmit = async (data: ProfileInput) => {
    try {
      setIsSaving(true);
      await updateUserProfile(data);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !storeUser) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">{t.profile}</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information and voting status.</p>
        </div>
        <Avatar src={storeUser.photoURL} name={storeUser.fullName || "User"} size="xl" className="shadow-xl" />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card glass className="md:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register("fullName")}
                error={errors.fullName?.message}
              />
              <Input
                label="Date of Birth"
                type="date"
                {...register("dob")}
                error={errors.dob?.message}
              />
              <Input
                label="Mobile Number"
                placeholder="9876543210"
                {...register("mobile")}
                error={errors.mobile?.message}
              />
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Preferred Language
                </label>
                <select
                  {...register("language")}
                  className="w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-3 text-sm transition-all duration-200 border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                  <option value="te">Telugu</option>
                  <option value="mr">Marathi</option>
                  <option value="ta">Tamil</option>
                  <option value="ur">Urdu</option>
                  <option value="gu">Gujarati</option>
                  <option value="kn">Kannada</option>
                  <option value="or">Odia</option>
                  <option value="ml">Malayalam</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card glass className="md:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-semibold">Voting Details</h2>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Textarea
                  label="Residential Address"
                  placeholder="Enter your full address (used to find your polling booth)"
                  rows={3}
                  {...register("address")}
                  error={errors.address?.message}
                />
              </div>
              <Input
                label="Constituency"
                placeholder="e.g., New Delhi"
                {...register("constituency")}
                error={errors.constituency?.message}
              />
              <Input
                label="Voter ID (EPIC Number)"
                placeholder="ABC1234567"
                {...register("voterId")}
                error={errors.voterId?.message}
              />
              
              <div className="md:col-span-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-start gap-4">
                <input
                  type="checkbox"
                  id="isRegistered"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register("isRegistered")}
                />
                <div>
                  <label htmlFor="isRegistered" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                    I am a registered voter
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Check this box if you have successfully registered to vote and possess a valid Voter ID.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty || isSaving}
            isLoading={isSaving}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
