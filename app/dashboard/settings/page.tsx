import { getPrivacySettings, getProfile } from "./actions";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const [privacySettings, profile] = await Promise.all([
    getPrivacySettings(),
    getProfile(),
  ]);

  return (
    <SettingsClient
      initialPrivacySettings={privacySettings}
      initialDisplayName={profile?.display_name || "Anonymous"}
    />
  );
}
