import { useState, type FormEvent } from "react";

import {
  InquirySubmissionError,
  inquiryPayloadFromForm,
  submitProjectInquiry,
  type InquiryFailure,
} from "../inquiry";
import { siteData } from "../site-data";

type SubmissionState =
  | { kind: "idle" | "pending" | "success"; message: string }
  | { kind: "error"; message: string; failure: InquiryFailure };

const failureMessages: Record<InquiryFailure, string> = {
  configuration: "The inquiry connection is unavailable.",
  network: "Your inquiry was not sent. Check your connection and try again.",
  protocol: "The inquiry service returned an unexpected response. Please try again.",
  server: "Your inquiry was not saved. Please try again.",
  timeout: "The inquiry took too long and was not confirmed. Please try again.",
  validation: "The form was not accepted. Check the fields and try again.",
};

export function Inquiry() {
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle", message: "" });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submission.kind === "pending" || !event.currentTarget.reportValidity()) return;

    const form = event.currentTarget;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    setSubmission({ kind: "pending", message: "Sending your inquiry…" });

    try {
      const payload = inquiryPayloadFromForm(new FormData(form));
      await submitProjectInquiry(payload, {
        endpoint: siteData.inquiry.endpoint,
        signal: controller.signal,
      });
      form.reset();
      setSubmission({
        kind: "success",
        message: "Inquiry received. You will hear back at the email you provided.",
      });
    } catch (error) {
      const failure = error instanceof InquirySubmissionError ? error.kind : "network";
      setSubmission({ kind: "error", failure, message: failureMessages[failure] });
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <section className="inquiry-section paper-section" id="project" aria-labelledby="project-title">
      <div className="inquiry-layout">
        <p className="section-kicker inquiry-kicker">START</p>
        <header className="inquiry-intro">
          <h2 id="project-title">Start with the problem. Not the prompt</h2>
          <p>
            Describe what should work better, who it affects, and what a useful result looks like.
            No prompt engineering. No proposed technical spec. No polished pitch.
          </p>
          <dl className="inquiry-expectations">
            <div>
              <dt>Problem</dt>
              <dd>What should work better</dd>
            </div>
            <div>
              <dt>Context</dt>
              <dd>Who, where, and what the work depends on</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>What success looks like and how it will be judged</dd>
            </div>
          </dl>
        </header>

        <form
          className="inquiry-form"
          id="project-form"
          aria-busy={submission.kind === "pending"}
          onSubmit={submit}
        >
          <div className="field-grid">
            <label className="field">
              <span>First name</span>
              <input name="firstName" autoComplete="given-name" maxLength={80} required />
            </label>
            <label className="field">
              <span>Last name</span>
              <input name="lastName" autoComplete="family-name" maxLength={80} required />
            </label>
            <label className="field">
              <span>Work email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                placeholder="you@company.com"
                required
              />
            </label>
            <label className="field">
              <span>Company</span>
              <input name="company" autoComplete="organization" maxLength={120} required />
            </label>
            <label className="field field-wide">
              <span>
                Company website <i>(optional)</i>
              </span>
              <input
                type="url"
                name="website"
                autoComplete="url"
                maxLength={300}
                placeholder="https://company.com"
              />
            </label>
            <label className="field">
              <span>Your role</span>
              <select name="role" defaultValue="" required>
                <option value="" disabled>
                  Select your role
                </option>
                {siteData.inquiry.roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Company size</span>
              <select name="companySize" defaultValue="" required>
                <option value="" disabled>
                  Number of people
                </option>
                {siteData.inquiry.companySizes.map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="budget-fieldset">
            <legend>Monthly business revenue</legend>
            <div className="budget-options">
              {siteData.inquiry.revenue.map((range, index) => (
                <label key={range.value}>
                  <input
                    type="radio"
                    name="businessRevenue"
                    value={range.value}
                    required={index === 0}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field field-wide project-field">
            <span>Describe the problem and result</span>
            <textarea
              name="project"
              rows={4}
              maxLength={2000}
              placeholder="What should work better? Who does it affect? What happens today? What would a useful result look like?"
              required
            />
          </label>

          <button
            className="button submit-action"
            type="submit"
            disabled={submission.kind === "pending"}
          >
            <span>
              {submission.kind === "pending" ? "Sending inquiry…" : "Send project inquiry"}
            </span>
            <span aria-hidden="true">↗</span>
          </button>
          <p
            className={`form-status${submission.kind !== "idle" ? ` is-${submission.kind}` : ""}`}
            role={submission.kind === "error" ? "alert" : "status"}
            aria-live={submission.kind === "error" ? "assertive" : "polite"}
          >
            {submission.message}
            {submission.kind === "error" && (
              <>
                {" "}
                <a href={siteData.links.email}>Email hello@arcitai.com</a> if the problem continues.
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
