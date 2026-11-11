"use client";

import { useEffect, useState, type FormEvent } from "react";
import { siteConfig } from "@/site.config";

export function ContributionForm({ kind }: { kind: "cfp" | "volunteer" }) {
  const isTalk = kind === "cfp";
  const storageKey = `devfest-madurai-draft-${kind}`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [talkTitle, setTalkTitle] = useState("");
  const [track, setTrack] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [level, setLevel] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [bio, setBio] = useState("");
  const [team, setTeam] = useState("");
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        const d = JSON.parse(raw) as Record<string, string>;
        if (d.name) setName(d.name);
        if (d.email) setEmail(d.email);
        if (d.talkTitle) setTalkTitle(d.talkTitle);
        if (d.track) setTrack(d.track);
        if (d.sessionType) setSessionType(d.sessionType);
        if (d.level) setLevel(d.level);
        if (d.abstractText) setAbstractText(d.abstractText);
        if (d.bio) setBio(d.bio);
        if (d.team) setTeam(d.team);
        if (d.motivation) setMotivation(d.motivation);
        if (d.experience) setExperience(d.experience);
      } catch {
        // Ignore storage error
      }
    });
  }, [storageKey]);

  const draftFields: Record<string, string> = isTalk
    ? {
        Name: name,
        Email: email,
        "Talk title": talkTitle,
        Track: track,
        "Session type": sessionType,
        "Audience level": level,
        Abstract: abstractText,
        "Speaker bio": bio,
      }
    : {
        Name: name,
        Email: email,
        "Preferred team": team,
        "Why would you like to volunteer?": motivation,
        "Relevant experience or interests": experience,
      };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isTalk && (!track || !sessionType || !level)) {
      setError("Please complete all required track, session type and audience level selections.");
      return;
    }
    if (!isTalk && !team) {
      setError("Please choose a preferred volunteer team.");
      return;
    }
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          name,
          email,
          talkTitle,
          track,
          sessionType,
          level,
          abstractText,
          bio,
          team,
          motivation,
          experience,
        }),
      );
      setSavedNotice("Draft saved in your browser.");
    } catch {
      // Ignore storage error
    }
    setError("");
    setReady(true);
  };

  const handleDownload = () => {
    const lines = [
      isTalk ? "DevFest Madurai 2026 — Proposal Draft" : "DevFest Madurai 2026 — Volunteer Draft",
      "Status: Draft prepared locally. Official application portal link will open soon.",
      "",
      ...Object.entries(draftFields).map(([k, v]) => `${k}: ${v}`),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n\n")], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = isTalk ? "DevFest-Madurai-Proposal-Draft.txt" : "DevFest-Madurai-Volunteer-Draft.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const guidelines = isTalk
    ? [
        "Keep it practical and specific.",
        "Tell us what attendees will take away.",
        "First-time speakers are welcome.",
        "Share your own work and experience.",
      ]
    : [
        "Registration & hospitality",
        "Stage & speaker support",
        "Design & media",
        "Technical & community support",
      ];

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue">
          {isTalk ? "The stage starts with an idea" : "Community is something we build"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-paper sm:text-5xl">
          {isTalk ? "Share what you know." : "Build DevFest with us."}
        </h1>
        <p className="mt-3 text-base text-paper/70 sm:text-lg">
          {isTalk
            ? "A hard-earned lesson. A clever experiment. A story only you can tell at DevFest Madurai 2026."
            : "Bring your energy, your ideas, and your own kind of magic to the GDG Madurai volunteer crew."}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <aside className="space-y-6 rounded-3xl border border-paper/15 bg-ink/85 p-6 backdrop-blur-md lg:col-span-5 sm:p-8">
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-black ${
              isTalk ? "bg-blue text-white" : "bg-green"
            }`}
          >
            {isTalk ? "🎙️" : "🤝"}
          </span>

          <h2 className="text-xl font-bold text-paper">
            {isTalk ? "Your perspective matters." : "Behind every great day, great people."}
          </h2>
          <p className="text-sm leading-relaxed text-paper/70">
            {isTalk
              ? "You don't need a perfect track record to have something worth sharing. We're interested in practical lessons, thoughtful experiments, and ideas that help people build."
              : "Help create a warm, welcoming day for the developer community in Madurai. There's room for different skills, backgrounds, and levels of experience."}
          </p>

          <ol className="space-y-3 border-t border-paper/10 pt-5">
            {guidelines.map((item, idx) => (
              <li key={item} className="flex items-center gap-3 text-sm text-paper/85">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-paper/20 text-xs font-semibold text-paper/70">
                  0{idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>

          <p className="border-t border-paper/10 pt-4 text-xs text-paper/50">
            Official application dates and selection timelines will be announced by {siteConfig.chapter}.
          </p>
        </aside>

        <div className="rounded-3xl border border-paper/15 bg-ink/90 p-6 backdrop-blur-md lg:col-span-7 sm:p-8">
          <div className="mb-6 rounded-2xl border border-yellow/30 bg-yellow/10 px-4 py-3 text-xs leading-relaxed text-paper/85">
            External submissions aren&apos;t connected yet. You can prepare, save, and download your{" "}
            {isTalk ? "CFP proposal" : "volunteer application"} draft here so it&apos;s ready the moment the portal opens.
          </div>

          {ready ? (
            <div className="space-y-6">
              <div>
                <span className="inline-block rounded-full bg-green/20 px-3 py-1 text-xs font-semibold text-green">
                  Draft Ready
                </span>
                <h2 className="mt-2 text-2xl font-bold text-paper">Your draft is ready.</h2>
                <p className="mt-1 text-sm text-paper/70">
                  Review it, download a copy, and keep it handy for when official submissions open.
                </p>
              </div>

              <dl className="divide-y divide-paper/10 rounded-2xl border border-paper/15 bg-ink p-4">
                {Object.entries(draftFields).map(([k, v]) => (
                  <div key={k} className="py-2.5 first:pt-0 last:pb-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-paper/50">{k}</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm text-paper">{v}</dd>
                  </div>
                ))}
              </dl>

              {savedNotice && <p className="text-xs text-green">{savedNotice}</p>}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Download draft (.txt)
                </button>
                <button
                  type="button"
                  onClick={() => setReady(false)}
                  className="rounded-full border border-paper/20 px-5 py-2.5 text-sm font-semibold text-paper/80 hover:border-paper/40 hover:text-paper"
                >
                  Edit draft
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cfp-name" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                    Name *
                  </label>
                  <input
                    id="cfp-name"
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="cfp-email" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                    Email *
                  </label>
                  <input
                    id="cfp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                  />
                </div>
              </div>

              {isTalk ? (
                <>
                  <div>
                    <label htmlFor="cfp-title" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                      Talk title *
                    </label>
                    <input
                      id="cfp-title"
                      type="text"
                      required
                      minLength={5}
                      value={talkTitle}
                      onChange={(e) => setTalkTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="cfp-track" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                        Track *
                      </label>
                      <select
                        id="cfp-track"
                        required
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                      >
                        <option value="">Select track</option>
                        {siteConfig.tracks.map((t) => (
                          <option key={t.slug} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="cfp-type" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                        Session type *
                      </label>
                      <select
                        id="cfp-type"
                        required
                        value={sessionType}
                        onChange={(e) => setSessionType(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                      >
                        <option value="">Select type</option>
                        <option value="Talk">Talk</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Lightning talk">Lightning talk</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="cfp-level" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                        Audience level *
                      </label>
                      <select
                        id="cfp-level"
                        required
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                      >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All levels">All levels</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cfp-abstract" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                      Abstract *
                    </label>
                    <textarea
                      id="cfp-abstract"
                      required
                      rows={4}
                      minLength={20}
                      value={abstractText}
                      onChange={(e) => setAbstractText(e.target.value)}
                      placeholder="What will people learn from your session?"
                      className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 focus:border-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cfp-bio" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                      Speaker bio *
                    </label>
                    <textarea
                      id="cfp-bio"
                      required
                      rows={3}
                      minLength={15}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="vol-team" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                      Preferred team *
                    </label>
                    <select
                      id="vol-team"
                      required
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                    >
                      <option value="">Select team</option>
                      {[
                        "Registration",
                        "Stage Management",
                        "Speaker Support",
                        "Design",
                        "Media",
                        "Technical",
                        "Hospitality",
                        "Community",
                      ].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="vol-why" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                      Why would you like to volunteer? *
                    </label>
                    <textarea
                      id="vol-why"
                      required
                      rows={4}
                      minLength={20}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="vol-exp" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
                      Relevant experience or interests *
                    </label>
                    <textarea
                      id="vol-exp"
                      required
                      rows={3}
                      minLength={10}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper focus:border-blue focus:outline-none"
                    />
                  </div>
                </>
              )}

              <label className="flex items-center gap-2.5 text-xs text-paper/70">
                <input type="checkbox" required className="h-4 w-4 accent-blue" />
                <span>I understand this prepares a local draft while official submissions are being finalised.</span>
              </label>

              {error && (
                <p role="alert" className="text-xs font-medium text-red">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-blue py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Review my draft →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
