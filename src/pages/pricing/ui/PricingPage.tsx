import { Check, ArrowRight } from 'lucide-react';

import { useTranslation } from '@/shared/lib/i18n';
import { AccordionItem } from '@/shared/ui/accordion';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/shared/ui/animate-on-scroll';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { NeonCard } from '@/shared/ui/neon-card';

export const PricingPage = () => {
  return (
    <>
      <PricingHero />
      <PlanCards />
      <WhatsIncluded />
      <PricingFaq />
      <PricingCta />
    </>
  );
};

/* в”Ђв”Ђ Hero в”Ђв”Ђ */
function PricingHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EDF4FC] to-transparent dark:from-[#0C1222] dark:to-transparent" />
      <AnimateOnScroll
        preset="fade-up"
        duration={0.7}
        className="relative mx-auto max-w-3xl px-6 pt-24 pb-8 text-center md:pt-32"
      >
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{t('pricing.title')}</h1>
        <p className="text-muted-foreground text-lg">{t('pricing.subtitle')}</p>
      </AnimateOnScroll>
    </section>
  );
}

/* в”Ђв”Ђ Plan Cards в”Ђв”Ђ */
function PlanCards() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('pricing.starter'),
      period: t('pricing.starterPeriod'),
      price: t('pricing.starterPrice'),
      devices: t('pricing.starterDevices'),
      total: null,
      tag: null,
      highlight: false,
    },
    {
      name: t('pricing.standard'),
      period: t('pricing.standardPeriod'),
      price: t('pricing.standardPrice'),
      devices: t('pricing.standardDevices'),
      total: t('pricing.standardTotal'),
      tag: t('pricing.standardTag'),
      highlight: true,
    },
    {
      name: t('pricing.pro'),
      period: t('pricing.proPeriod'),
      price: t('pricing.proPrice'),
      devices: t('pricing.proDevices'),
      total: t('pricing.proTotal'),
      tag: t('pricing.proTag'),
      highlight: false,
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <StaggerContainer className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-3" stagger={0.12}>
        {plans.map(({ name, period, price, devices, total, tag, highlight }) => (
          <StaggerItem key={name} preset="scale-in" className="h-full">
            <NeonCard glowColor={highlight ? '#3B9BF5' : '#5AC8D8'} className="rounded-2xl">
              <div className="flex h-full flex-col p-6 md:p-8">
                {tag && (
                  <Badge
                    variant={highlight ? 'default' : 'secondary'}
                    className="mb-4 w-fit rounded-full"
                  >
                    {tag}
                  </Badge>
                )}
                {!tag && <div className="mb-4 h-[22px]" />}

                <h3 className="mb-1 text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{period}</p>

                <div className="mb-2">
                  <span className="text-4xl font-bold">{price}</span>
                  <span className="text-muted-foreground text-sm">{t('pricing.perMonth')}</span>
                </div>
                {total && <p className="text-muted-foreground mb-6 text-xs">{total}</p>}
                {!total && <div className="mb-6" />}

                <p className="text-muted-foreground mb-6 text-sm">{devices}</p>

                <ul className="mb-8 space-y-2">
                  <IncludedItem text={t('pricing.allProtocols')} />
                  <IncludedItem text={t('pricing.unlimited')} />
                  <IncludedItem text={t('pricing.noLogs')} />
                  <IncludedItem text={t('pricing.telegramSupport')} />
                </ul>

                <Button
                  variant={highlight ? 'default' : 'outline'}
                  className="mt-auto w-full rounded-xl"
                >
                  {t('pricing.choosePlan')}
                </Button>
              </div>
            </NeonCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function IncludedItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

/* в”Ђв”Ђ What's Included в”Ђв”Ђ */
function WhatsIncluded() {
  const { t } = useTranslation();
  const items = [
    t('pricing.allProtocols'),
    t('pricing.allPlatforms'),
    t('pricing.telegramSupport'),
    t('pricing.unlimited'),
    t('pricing.noLogs'),
    t('pricing.autoSwitch'),
  ];

  return (
    <section className="bg-muted/50 py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <AnimateOnScroll preset="fade-up">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">{t('pricing.included')}</h2>
        </AnimateOnScroll>
        <StaggerContainer
          className="grid gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3"
          stagger={0.06}
        >
          {items.map((item) => (
            <StaggerItem key={item} preset="fade-up">
              <div className="flex items-center gap-2 text-left">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* в”Ђв”Ђ FAQ в”Ђв”Ђ */
function PricingFaq() {
  const { t } = useTranslation();
  const faqs = [
    { q: t('pricing.faqQ1'), a: t('pricing.faqA1') },
    { q: t('pricing.faqQ2'), a: t('pricing.faqA2') },
    { q: t('pricing.faqQ3'), a: t('pricing.faqA3') },
    { q: t('pricing.faqQ4'), a: t('pricing.faqA4') },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <AnimateOnScroll preset="fade-up" className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{t('pricing.faqTitle')}</h2>
        </AnimateOnScroll>
        <StaggerContainer stagger={0.06}>
          {faqs.map(({ q, a }) => (
            <StaggerItem key={q} preset="fade-up">
              <AccordionItem trigger={q}>{a}</AccordionItem>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* в”Ђв”Ђ Final CTA в”Ђв”Ђ */
function PricingCta() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#EDF4FC] to-transparent dark:via-[#152033]" />
      <AnimateOnScroll
        preset="fade-up"
        duration={0.7}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold">{t('finalCta.title')}</h2>
        <p className="text-muted-foreground mb-8 text-lg">{t('finalCta.subtitle')}</p>
        <Button size="lg" className="shadow-primary/20 h-14 rounded-2xl px-10 text-lg shadow-lg">
          {t('finalCta.cta')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </AnimateOnScroll>
    </section>
  );
}
