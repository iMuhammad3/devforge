import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import {
    getUserProfile,
    updateUserProfile,
} from "@/services/firebase/firestore";
import { ErrorState, LoadingState } from "@/shared/components/feedback";

export default function SettingsPage() {
    const authUser = useAuthStore(state => state.user);
    const setProfile = useAuthStore(state => state.setProfile);

    const [formData, setFormData] = useState({
        displayName: "",
        username: "",
        bio: "",
    });

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setStatus("loading");
                setError("");

                const profile = await getUserProfile(authUser.uid);

                setFormData({
                    displayName:
                        profile?.displayName || authUser.displayName || "",
                    username: profile?.username || "",
                    bio: profile?.bio || "",
                });

                setStatus("idle");
            } catch (err) {
                console.error(err);
                setError("Failed to load profile settings.");
                setStatus("error");
            }
        };

        if (authUser?.uid) {
            loadProfile();
        }
    }, [authUser]);

    const handleChange = event => {
        const { name, value } = event.target;

        setFormData(currentData => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setStatus("saving");
            setMessage("");
            setError("");

            const updatedProfile = {
                displayName: formData.displayName.trim(),
                username: formData.username.trim().toLowerCase(),
                bio: formData.bio.trim(),
            };

            await updateUserProfile(authUser.uid, updatedProfile);

            setProfile(currentProfile => ({
                ...currentProfile,
                ...updatedProfile,
            }));

            setMessage("Profile updated successfully.");
            setStatus("idle");
        } catch (err) {
            console.error(err);
            setError("Failed to update profile.");
            setStatus("idle");
        }
    };

    if (status === "loading") {
  return (
    <LoadingState
      title="Loading settings"
      description="Fetching your profile settings."
    />
  );
}

if (status === "error") {
  return <ErrorState description={error} />;
}

    return (
        <section className="mx-auto max-w-3xl">
            <div className="mb-8">
                <p className="text-sm font-medium text-primary">Settings</p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Account settings
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Manage your basic DevForge profile information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6"
            >
                {message && (
                    <div className="mb-5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="grid gap-5">
                    <div>
                        <label
                            htmlFor="displayName"
                            className="mb-2 block text-sm font-medium"
                        >
                            Display name
                        </label>

                        <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Muhammad Auwal"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="muhammad"
                        />

                        <p className="mt-2 text-xs text-muted-foreground">
                            Your username will be used for your public profile
                            later.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="bio"
                            className="mb-2 block text-sm font-medium"
                        >
                            Bio
                        </label>

                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="5"
                            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Tell people a little about yourself..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        {status === "saving" ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </form>
        </section>
    );
}
