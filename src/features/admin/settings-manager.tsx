"use client";
import { useState } from "react";
import { settingsTabs, documentFields } from "@/lib/admin/config";
import { useDemo } from "@/components/admin/demo-provider";
import { ContentEditor } from "@/components/admin/content-editor";
import { PageTitle, AdminDialog } from "@/components/admin/primitives";
import { AdminTabs } from "@/components/admin/tabs";
export function SettingsManager() {
  const [tab, setTab] = useState("General");
  const { data, saveDocument } = useDemo();
  return (
    <>
      <PageTitle
        eyebrow="ADMINISTRATION"
        title="Website settings"
        description="The details that make your website yours. All settings below are local demonstrations."
      />
      <AdminTabs
        tabs={Object.keys(settingsTabs)}
        value={tab}
        onChange={setTab}
        label="Website settings sections"
        panelId="settings-panel"
      />
      <section
        className="ad-panel ad-editor-panel"
        role="tabpanel"
        id="settings-panel"
        aria-labelledby={"tab-" + tab.replaceAll(" ", "-")}
      >
        <ContentEditor
          key={tab}
          fields={settingsTabs[tab]}
          initialValues={data.documents["settings-" + tab] || {}}
          onSave={(values) =>
            saveDocument(
              "settings-" + tab,
              values,
              "Saved " + tab.toLowerCase() + " demo settings",
            )
          }
          submitLabel="Save demo settings"
        />
      </section>
    </>
  );
}
export function ProfileManager() {
  const { data, saveDocument } = useDemo();
  const [security, setSecurity] = useState(false);
  return (
    <>
      <PageTitle
        eyebrow="YOUR ACCOUNT"
        title="Your profile"
        description="A demonstration profile for exploring your future administrator experience."
      />
      <section className="ad-panel ad-editor-panel">
        <ContentEditor
          fields={documentFields.profile}
          initialValues={data.documents.profile || {}}
          onSave={(values) =>
            saveDocument("profile", values, "Saved demo profile")
          }
          submitLabel="Save demo profile"
        />
      </section>
      <section className="ad-panel ad-profile-security">
        <h2>Account security</h2>
        <p>
          There is no authenticated account in Phase 2. Password changes,
          multifactor authentication, and session management will be connected
          in Phase 3.
        </p>
        <button className="ad-btn secondary" onClick={() => setSecurity(true)}>
          View security settings
        </button>
      </section>
      <AdminDialog
        open={security}
        onOpenChange={setSecurity}
        title="Security settings preview"
        description="No credentials are collected or changed in this development preview."
      >
        <div className="ad-detail-grid">
          <div>
            <h3>Password change</h3>
            <p>
              Requires authenticated identity and a secure backend in Phase 3.
            </p>
            <button className="ad-btn secondary small" disabled>
              Change password — Phase 3
            </button>
          </div>
          <div>
            <h3>Multifactor authentication</h3>
            <p>
              Not configured. Real enrollment will be available after
              authentication integration.
            </p>
          </div>
          <div>
            <h3>Active sessions</h3>
            <p>
              No production sessions exist. Exit preview returns to the public
              website.
            </p>
          </div>
        </div>
      </AdminDialog>
    </>
  );
}
