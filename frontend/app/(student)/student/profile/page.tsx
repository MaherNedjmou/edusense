"use client";

import { useState, useRef } from "react";
import { User, Mail, School, Lock, Pencil, Camera, CheckCircle } from "lucide-react";
import Button from "@/components/UI/Button";

const MOCK_STUDENT = {
  firstName: "Amer",
  lastName: "Zitouni",
  email: "amer.zitouni@student.edu",
  school: "Université Constantine 2 - Abdelhamid Mehri",
};

export default function ProfilePage() {

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(MOCK_STUDENT.firstName);
  const [lastName, setLastName] = useState(MOCK_STUDENT.lastName);
  const [email, setEmail] = useState(MOCK_STUDENT.email);
  const [school, setSchool] = useState(MOCK_STUDENT.school);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    console.log("Avatar uploaded:", e.target.files[0]);
  };

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-background min-h-screen p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">My Profile</h1>
      </div>

      <div className="max-w-3xl mx-auto">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-primary/10">

          {/* Banner */}
          <div className="h-28 bg-primary relative overflow-hidden" />

          <div className="px-8 pb-8">

            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-6 flex-wrap gap-4">

              {/* Avatar */}
              <div
                onClick={handleAvatarClick}
                className="relative group w-24 h-24 rounded-full border-4 border-white bg-secondary flex items-center justify-center cursor-pointer overflow-hidden shadow-lg shrink-0"
              >
                <span className="text-white text-2xl font-bold tracking-wide">
                  {firstName[0]}{lastName[0]}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                  <Camera size={16} />
                  <span className="text-xs font-medium">Change</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              {/* Action buttons */}
              <div className="flex items-center gap-2 pb-1">
                <Button
                  variant="outline"
                  onClick={() => setEditMode(!editMode)}
                  className="text-xs"
                >
                  <Pencil size={14} />
                  {editMode ? "Cancel" : "Edit"}
                </Button>
              </div>
            </div>

            {/* Name + meta */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary">
                {firstName} {lastName}
              </h2>

              <p className="text-sm text-primary/50 mt-1">
                {email} · {school}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-primary/10 mb-6" />

            {/* Personal Info */}
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">
              Personal Information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputField
                label="First Name"
                icon={<User size={14} />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!editMode}
              />

              <InputField
                label="Last Name"
                icon={<User size={14} />}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!editMode}
              />

              <div className="md:col-span-2">
                <InputField
                  label="Email Address"
                  icon={<Mail size={14} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                />
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="School / Institution"
                  icon={<School size={14} />}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  disabled={!editMode}
                />
              </div>

              <div className="md:col-span-2">
                <InputField
                  label="Password"
                  icon={<Lock size={14} />}
                  value="**************"
                  onChange={() => {}}
                  disabled={!editMode}
                  type="password"
                />
              </div>

            </div>

            {/* Save bar */}
            {editMode && (
              <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-primary/10">
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            )}

            {/* Saved toast */}
            {saved && (
              <div className="flex items-center justify-end gap-2 mt-4 text-secondary text-sm font-semibold">
                <CheckCircle size={15} />
                Profile updated successfully
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-primary/40 uppercase tracking-widest">
        {label}
      </label>

      <div
        className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border transition-all ${
          disabled
            ? "bg-primary/5 border-primary/10"
            : "bg-white border-secondary/40 shadow-sm ring-2 ring-secondary/10"
        }`}
      >
        <span className={disabled ? "text-primary/30" : "text-secondary"}>
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm font-medium text-primary disabled:cursor-default placeholder:text-primary/30"
        />
      </div>
    </div>
  );
}