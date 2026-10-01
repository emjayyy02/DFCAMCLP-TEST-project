"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IdentitySummary } from "@/components/ui/identity";
import { DemoProfilePhotoPicker } from "@/components/ui/demo-profile-photo";
import { useAccountPresentation } from "./demo-presentation-provider";
import { SignOutButton } from "./sign-out-button";

type ProfileIdentity = {
  id: string;
  name: string;
  email: string;
  status: string;
};
type Membership = {
  portal: string;
  label: string;
  path: string;
  roleLabels: string[];
};

export function AccountProfile({
  user,
  memberships,
}: {
  user: ProfileIdentity;
  memberships: Membership[];
}) {
  const { photo, setPhoto, bio, setBio } = useAccountPresentation(user.id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const editor = useRef<HTMLTextAreaElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  useEffect(() => {
    if (editing) editor.current?.focus();
    else if (wasEditing.current) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);
  return (
    <div className="account-profile-content">
      <section
        className="account-profile-identity"
        aria-label="Signed-in identity"
      >
        <IdentitySummary
          name={user.name}
          detail={user.email}
          size="large"
          avatar={
            <DemoProfilePhotoPicker
              id="account-photo"
              name={user.name}
              src={photo}
              onSelect={setPhoto}
            />
          }
        />
        <div className="account-profile-state">
          <span>Account status</span>
          <Badge tone={user.status === "ACTIVE" ? "success" : "neutral"}>
            {user.status === "ACTIVE" ? "Active" : user.status}
          </Badge>
        </div>
      </section>
      <div className="account-profile-columns">
        <section className="account-profile-bio" aria-labelledby="bio-title">
          <div className="account-profile-section-heading">
            <h2 id="bio-title">Bio</h2>
            {!editing ? (
              <Button
                ref={editButton}
                variant="tertiary"
                onClick={() => {
                  setDraft(bio);
                  setEditing(true);
                  setMessage("");
                }}
              >
                Edit bio
              </Button>
            ) : null}
          </div>
          <p className="account-profile-help">
            Photo and bio are temporary in this tab. They reset on reload or
            sign-out.
          </p>
          {editing ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setBio(draft.trim());
                setEditing(false);
                setMessage("Demo bio updated in this tab.");
              }}
            >
              <label htmlFor="account-bio">Your demo bio</label>
              <textarea
                ref={editor}
                id="account-bio"
                name="bio"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={240}
                rows={5}
                aria-describedby="bio-limit"
              />
              <p id="bio-limit" className="account-profile-help">
                {draft.length} / 240 characters · Plain text only.
              </p>
              <div className="account-profile-actions">
                <Button type="submit">Apply demo bio</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setMessage("Bio changes discarded.");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className={bio ? "account-bio-text" : "account-bio-empty"}>
              {bio || "No demo bio added."}
            </p>
          )}
          <p role="status" className="account-profile-feedback">
            {message}
          </p>
        </section>
        <section
          className="account-memberships"
          aria-labelledby="memberships-title"
        >
          <h2 id="memberships-title">Portal memberships</h2>
          <p className="account-profile-help">
            Your assigned portals and roles. Opening a portal still checks your
            access.
          </p>
          {memberships.length ? (
            <ul>
              {memberships.map((membership) => (
                <li key={membership.portal}>
                  <h3>{membership.label}</h3>
                  <p>
                    {membership.roleLabels.join(", ") || "No role assigned"}
                  </p>
                  <Link href={membership.path}>Open {membership.label}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active portal access is assigned.</p>
          )}
        </section>
      </div>
      <section className="account-profile-session" aria-label="Account session">
        <div>
          <h2>Your sign-in</h2>
          <p>
            Present and server-verified. School-domain profiles remain separate
            from this account profile.
          </p>
        </div>
        <SignOutButton />
      </section>
    </div>
  );
}
