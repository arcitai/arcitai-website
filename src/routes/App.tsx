import { ArrowUpRight, Mail, Send } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { siteData, type InquiryField } from "../site-data";
import { Wordmark } from "../components/Wordmark";

type FormValues = Record<string, string>;

export function App() {
  useEffect(() => {
    document.title = siteData.seo.title;
    setMetaContent("description", siteData.seo.description);
    setMetaContent("theme-color", siteData.seo.themeColor);
    setMetaContent("twitter:card", "summary");
    setMetaContent("twitter:title", siteData.seo.title);
    setMetaContent("twitter:description", siteData.seo.description);
    setMetaProperty("og:title", siteData.seo.ogTitle);
    setMetaProperty("og:description", siteData.seo.ogDescription);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:url", siteData.seo.siteUrl);
    setMetaProperty("og:image", siteData.seo.ogImage);
    setCanonicalUrl(siteData.seo.siteUrl);
  }, []);

  return (
    <div className="page-shell">
      <Header />

      <main id="top" className="main-panel">
        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{siteData.hero.eyebrow}</p>
            <div className="hero-mark" aria-hidden="true">
              <Wordmark />
            </div>
            <h1 id="hero-title">{siteData.hero.title}</h1>
            <p>{siteData.hero.description}</p>
            <div className="hero-actions">
              <a className="primary-button" href={siteData.hero.primaryCta.href}>
                <Send size={15} />
                <span>{siteData.hero.primaryCta.label}</span>
              </a>
              <a className="text-link" href={siteData.hero.secondaryCta.href}>
                <span>{siteData.hero.secondaryCta.label}</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
            <ul className="signal-list" aria-label="Arcade AI signals">
              {siteData.hero.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>

          <section className="inquiry-card" id="inquiry" aria-labelledby="inquiry-title">
            <div className="inquiry-card-header">
              <p className="eyebrow">{siteData.inquiry.label}</p>
              <h2 id="inquiry-title">{siteData.inquiry.title}</h2>
              <p>{siteData.inquiry.description}</p>
            </div>
            <InquirySurface />
          </section>
        </section>

        <section className="testimonials-section" aria-labelledby="testimonials-title">
          <div className="section-heading">
            <p className="eyebrow">{siteData.testimonials.label}</p>
            <h2 id="testimonials-title">{siteData.testimonials.title}</h2>
            <p>{siteData.testimonials.description}</p>
          </div>
          <div className="testimonial-grid">
            {siteData.testimonials.items.map((item) => (
              <article className="testimonial-card" key={item.project}>
                <div>
                  <span>{item.type}</span>
                  <h3>{item.project}</h3>
                </div>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <span>{item.client}</span>
                  <strong>{item.outcome}</strong>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="method-strip" id="method" aria-labelledby="method-title">
          <div>
            <p className="eyebrow">{siteData.method.label}</p>
            <h2 id="method-title">{siteData.method.title}</h2>
          </div>
          <div>
            <p>{siteData.method.description}</p>
            <ul>
              {siteData.method.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ecosystem-section" aria-labelledby="ecosystem-title">
          <div className="section-heading section-heading-compact">
            <p className="eyebrow">{siteData.ecosystem.label}</p>
            <h2 id="ecosystem-title">{siteData.ecosystem.title}</h2>
          </div>
          <div className="ecosystem-links">
            {siteData.ecosystem.links.map((link) => (
              <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">
                <span>{link.label}</span>
                <p>{link.description}</p>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{siteData.footer.copyright}</span>
        <nav aria-label="Footer links">
          {siteData.footer.links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}

function InquirySurface() {
  if (siteData.inquiry.formUrl) {
    return (
      <iframe
        className="notion-form-frame"
        src={siteData.inquiry.formUrl}
        title={siteData.inquiry.embedTitle}
        loading="lazy"
      />
    );
  }

  return <InquiryForm />;
}

function InquiryForm() {
  const [values, setValues] = useState<FormValues>(() => createInitialValues(siteData.inquiry.fields));

  function updateValue(field: InquiryField, value: string) {
    setValues((current) => ({
      ...current,
      [field.id]: value,
    }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = [
      "Project inquiry",
      "",
      ...siteData.inquiry.fields.map((field) => `${field.label}: ${values[field.id] || "-"}`),
    ].join("\n");

    const href = `mailto:${siteData.inquiry.email}?subject=${encodeURIComponent(siteData.inquiry.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit}>
      {siteData.inquiry.fields.map((field) => (
        <label className={field.type === "textarea" ? "field field-wide" : "field"} key={field.id}>
          <span>{field.label}</span>
          {field.type === "textarea" ? (
            <textarea
              name={field.id}
              onChange={(event) => updateValue(field, event.target.value)}
              placeholder={field.placeholder}
              required
              rows={4}
              value={values[field.id]}
            />
          ) : field.type === "select" ? (
            <select name={field.id} onChange={(event) => updateValue(field, event.target.value)} required value={values[field.id]}>
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.id}
              onChange={(event) => updateValue(field, event.target.value)}
              placeholder={field.placeholder}
              required
              type={field.type}
              value={values[field.id]}
            />
          )}
        </label>
      ))}

      <div className="form-actions">
        <button className="primary-button form-submit" type="submit">
          <Send size={15} />
          <span>{siteData.inquiry.submitLabel}</span>
        </button>
        <a className="text-link" href={`mailto:${siteData.inquiry.email}`}>
          <Mail size={15} />
          <span>{siteData.inquiry.fallbackLabel}</span>
        </a>
      </div>
      <p className="form-note">{siteData.inquiry.note}</p>
    </form>
  );
}

function createInitialValues(fields: InquiryField[]) {
  return Object.fromEntries(fields.map((field) => [field.id, ""]));
}

function setMetaContent(name: string, content: string) {
  const meta = getOrCreateMeta("name", name);
  meta.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  const meta = getOrCreateMeta("property", property);
  meta.setAttribute("content", content);
}

function getOrCreateMeta(attribute: "name" | "property", value: string) {
  const selector = `meta[${attribute}="${value}"]`;
  const existingMeta = document.querySelector<HTMLMetaElement>(selector);
  if (existingMeta) return existingMeta;

  const meta = document.createElement("meta");
  meta.setAttribute(attribute, value);
  document.head.append(meta);
  return meta;
}

function setCanonicalUrl(url: string) {
  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.append(canonicalLink);
  }

  canonicalLink.setAttribute("href", url);
}
