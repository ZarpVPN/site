import { useI18n } from "./i18n";
import { memo, useState } from "react";
import { Icon } from "./Icons";
import { faqs, github } from "./data";

type Question = (typeof faqs)[number];

const FAQAnswer = memo(function FAQAnswer({ faq }: { faq: Question }) {
  const { t } = useI18n();
  return (
    <div className="faq-answer-inner">
      <div className="faq-answer">
        <p>{t(faq.a)}</p>
        {faq.link && (
          <a className="text-link" href={faq.link} target="_blank" rel="noopener noreferrer">
            {t(faq.label!)} <Icon name="up-right" />
          </a>
        )}
      </div>
    </div>
  );
});

const FAQItem = memo(function FAQItem({ faq, index }: { faq: Question; index: number }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="faq-item">
      <h3>
        <button
          className="faq-question"
          aria-expanded={expanded}
          aria-controls={`faq-answer-${index}`}
          id={`faq-question-${index}`}
          onClick={() => setExpanded(current => !current)}
        >
          {t(faq.q)}
          <Icon name="plus" />
        </button>
      </h3>
      <div
        className={`faq-answer-shell ${expanded ? "is-open" : ""}`}
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <FAQAnswer faq={faq} />
      </div>
    </article>
  );
});

const FAQList = memo(function FAQList() {
  return (
    <div className="faq-list">
      {faqs.map((faq, index) => <FAQItem faq={faq} index={index} key={faq.q} />)}
    </div>
  );
});

export default function FAQ() {
  const { t } = useI18n();
  return (
    <section className="faq section-space container" id="faq">
      <div className="faq-heading">
        <p className="eyebrow">{t("faqEyebrow")}</p>
        <h2 className="section-heading">{t("faqTitle")} <br />{t("faqSubtitle")}</h2>
        <p>{t("faqDescription")} <br />{t("faqDescriptionSecond")}</p>
        <a className="text-link" href={github} target="_blank" rel="noopener noreferrer">
          {t("askGithub")} <Icon name="up-right" />
        </a>
      </div>
      <FAQList />
    </section>
  );
}
