import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/store/authStore";
import {
    getUserProfile,
    updateUserProfile,
} from "@/services/firebase/firestore";
import { ErrorState, LoadingState } from "@/shared/components/feedback";
import { FormMessage, SubmitButton, TextareaInput, TextInput } from "@/shared/components/forms";

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
                <div className="mb-5 space-y-3">
                    <FormMessage>{message}</FormMessage>
                    <FormMessage type="error">{error}</FormMessage>
                </div>

                <div className="grid gap-5">
                    <TextInput
                        label="Display name"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Muhammad Auwal"
                    />

                    <TextInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="muhammad"
                        helpText="Your username will be used for your public profile later."
                    />

                    <TextareaInput
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell people a little about yourself..."
                        rows={5}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <SubmitButton loading={status === "saving"}>
                        Save changes
                    </SubmitButton>
                </div>
            </form>
        </section>
    );
}
