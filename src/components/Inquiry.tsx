import { useState, type FormEvent } from "react";

import {
  InquirySubmissionError,
  inquiryPayloadFromForm,
  submitProjectInquiry,
  type InquiryFailure,
} from "../inquiry";
import { siteData } from "../site-data";
import { isLocalReview, localReview, previewSubmission } from "../family/preview";

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
      if (isLocalReview(true, window.location.hostname) && !localReview) {
        throw new InquirySubmissionError("configuration");
      }
      const payload = inquiryPayloadFromForm(new FormData(form));
      if (localReview) await previewSubmission();
      else
        await submitProjectInquiry(payload, {
          endpoint: siteData.inquiry.endpoint,
          signal: controller.signal,
        });
      form.reset();
      setSubmission({
        kind: "success",
        message: localReview
          ? "Preview complete — no inquiry was sent."
          : "Inquiry received. You will hear back at the email you provided.",
      });
    } catch (error) {
      const failure = error instanceof InquirySubmissionError ? error.kind : "network";
      setSubmission({ kind: "error", failure, message: failureMessages[failure] });
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <section className="inquiry" id="project" aria-labelledby="project-title">
      <div className="section-shell inquiry-grid">
        <div className="inquiry-copy">
          <div className="inquiry-intro">
            <h1 id="project-title">Project inquiry</h1>
            {localReview && (
              <p className="review-notice">Local preview — the form does not send data.</p>
            )}
            <p className="inquiry-description">
              Describe the software, who uses it and the work you need help with. I’ll review the
              context and respond with a proposed next step.
            </p>
          </div>
          <div className="faqs">
            <details className="faq" open>
              <summary>Do I need another platform?</summary>
              <p>
                Usually we can work with the tools you already use. I add new ones only when they
                solve a specific need in your project.
              </p>
            </details>
            <details className="faq" open>
              <summary>What do you check?</summary>
              <p>
                We agree what production-ready means for your use case, then review the code, data
                access, integrations and deployment. I fix the agreed issues and test the changes.
                Instructions don’t enforce permissions, and a review can’t guarantee that nothing
                will go wrong.
              </p>
            </details>
            <details className="faq" open>
              <summary>Can you keep looking after it?</summary>
              <p>
                Yes. I can handle agreed updates, fixes and ongoing development. We define my
                responsibilities, the review process and response times. You keep control of
                business decisions and approvals.
              </p>
            </details>
            <details className="faq" open>
              <summary>Prefer to build it yourself?</summary>
              <p>
                <a href={siteData.links.onlinesourdough} target="_blank" rel="noopener noreferrer">
                  onlinesourdough
                </a>{" "}
                offers the method, resources and hands-on guidance. With Arc’IT AI, I take care of
                the agreed delivery and ongoing work.
              </p>
            </details>
          </div>
        </div>

        <form
          className="inquiry-form"
          id="project-form"
          aria-label="Project inquiry"
          aria-describedby="privacy-note"
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

          <label className="field field-wide project-field">
            <span>What have you built, and what would you like help with?</span>
            <textarea
              name="project"
              rows={4}
              maxLength={2000}
              aria-describedby="privacy-note"
              required
            />
          </label>

          <p className="privacy-note" id="privacy-note">
            Please don’t include passwords or confidential business or customer data.
          </p>
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
