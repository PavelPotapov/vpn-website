import {
  Zap,
  Shield,
  MousePointerClick,
  Eye,
  Monitor,
  MessageCircle,
  ShieldCheck,
  Wifi,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

import { VpnFlowDiagram } from '@/widgets/vpn-flow';

import { DotGrid } from '@/shared/.core/dotGrid';
import { useTranslation } from '@/shared/lib/i18n';
import { useLocalePath } from '@/shared/lib/navigation';
import { AccordionItem } from '@/shared/ui/accordion';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/shared/ui/animate-on-scroll';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { NeonCard } from '@/shared/ui/neon-card';

export const LandingPage = () => {
  const lp = useLocalePath();
  const pricingPath = lp('/pricing');

  return (
    <>
      <HeroBenefitsBlock />
      <ProtocolsSection />
      <FlowSection />
      <PricingTeaser pricingPath={pricingPath} />
      <FaqSection />
      <FinalCta />
    </>
  );
};

/* в”Ђв”Ђ Hero + Benefits (shared grid canvas) в”Ђв”Ђ */
function HeroBenefitsBlock() {
  const { t } = useTranslation();

  const stats = [
    { value: '99.9%', label: t('trust.uptime'), icon: ShieldCheck },
    { value: '50+', label: t('trust.servers'), icon: Wifi },
    { value: '5', label: t('trust.protocols'), icon: Shield },
    { value: '24/7', label: t('trust.support'), icon: MessageCircle },
  ];

  const benefits = [
    { icon: Zap, title: t('benefits.speed'), desc: t('benefits.speedDesc'), glow: '#3B9BF5' },
    {
      icon: ShieldCheck,
      title: t('benefits.stability'),
      desc: t('benefits.stabilityDesc'),
      glow: '#5AC8D8',
    },
    {
      icon: MousePointerClick,
      title: t('benefits.simplicity'),
      desc: t('benefits.simplicityDesc'),
      glow: '#3B9BF5',
    },
    { icon: Eye, title: t('benefits.privacy'), desc: t('benefits.privacyDesc'), glow: '#5AC8D8' },
    {
      icon: Monitor,
      title: t('benefits.platforms'),
      desc: t('benefits.platformsDesc'),
      glow: '#3B9BF5',
    },
    {
      icon: MessageCircle,
      title: t('benefits.telegram'),
      desc: t('benefits.telegramDesc'),
      glow: '#5AC8D8',
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <DotGrid
        className="opacity-50 dark:opacity-80"
        grid={{ gap: 28, perspective: true }}
        sparks={{ targetCount: 1 }}
        physics={{ enabled: true }}
      />

      <div className="bg-primary/5 dark:bg-primary/10 pointer-events-none absolute top-[15%] left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />

      {/* Hero */}
      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <AnimateOnScroll
          preset="fade-up"
          duration={0.7}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/5 text-primary mb-5 rounded-full border px-4 py-1.5 text-sm font-medium"
          >
            {t('hero.badge')}
          </Badge>
          <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="text-muted-foreground mb-8 text-lg md:text-xl">{t('hero.subtitle')}</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="glow-shadow h-12 rounded-2xl px-8 text-base transition-all duration-300 md:h-14 md:text-lg"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/50 h-12 rounded-2xl px-8 text-base backdrop-blur-sm md:h-14 md:text-lg"
            >
              {t('hero.secondary')}
            </Button>
          </div>
        </AnimateOnScroll>

        <StaggerContainer
          className="relative mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          stagger={0.1}
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <StaggerItem key={label} preset="scale-in">
              <NeonCard glowColor="#5AC8D8" className="rounded-xl">
                <div className="flex flex-col items-center gap-1.5 p-4 backdrop-blur-md">
                  <Icon className="text-primary mb-1 h-5 w-5" />
                  <span className="text-xl font-bold md:text-2xl">{value}</span>
                  <span className="text-muted-foreground text-xs">{label}</span>
                </div>
              </NeonCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Benefits */}
      <div className="relative mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <AnimateOnScroll preset="fade-up" className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t('benefits.title')}</h2>
        </AnimateOnScroll>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {benefits.map(({ icon: Icon, title, desc, glow }) => (
            <StaggerItem key={title} preset="fade-up">
              <NeonCard glowColor={glow}>
                <div className="p-6 md:p-8">
                  <div className="bg-primary/10 mb-4 inline-flex rounded-xl p-3">
                    <Icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </NeonCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* в”Ђв”Ђ Protocols в”Ђв”Ђ */
function ProtocolsSection() {
  const { t } = useTranslation();
  const protocols = [
    {
      name: t('protocols.wireguard'),
      desc: t('protocols.wireguardDesc'),
      tag: null,
      icon: Wifi,
      highlight: false,
    },
    {
      name: t('protocols.amnezia'),
      desc: t('protocols.amneziaDesc'),
      tag: t('protocols.amneziaTag'),
      icon: ShieldCheck,
      highlight: true,
    },
    {
      name: t('protocols.vless'),
      desc: t('protocols.vlessDesc'),
      tag: t('protocols.vlessTag'),
      icon: EyeOff,
      highlight: false,
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-5xl px-6">
        <AnimateOnScroll preset="fade-up" className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('protocols.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('protocols.subtitle')}</p>
        </AnimateOnScroll>
        <StaggerContainer className="grid gap-6 md:grid-cols-3" stagger={0.12}>
          {protocols.map(({ name, desc, tag, icon: Icon, highlight }) => (
            <StaggerItem key={name} preset="fade-up">
              <NeonCard glowColor={highlight ? '#3B9BF5' : '#5AC8D8'}>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${highlight ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon
                        className={`h-6 w-6 ${highlight ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                    </div>
                    {tag && (
                      <Badge
                        variant={highlight ? 'default' : 'secondary'}
                        className="rounded-full text-xs"
                      >
                        {tag}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </NeonCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* в”Ђв”Ђ How It Works (VPN Flow) в”Ђв”Ђ */
function FlowSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll preset="fade-up" className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('flow.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('flow.subtitle')}</p>
        </AnimateOnScroll>
        <VpnFlowDiagram />
      </div>
    </section>
  );
}

/* в”Ђв”Ђ Pricing Teaser в”Ђв”Ђ */
function PricingTeaser({ pricingPath }: { pricingPath: string }) {
  const { t } = useTranslation();
  const plans = [
    {
      name: t('pricingTeaser.starter'),
      period: t('pricingTeaser.starterPeriod'),
      price: '$9.99',
      devices: t('pricingTeaser.starterDevices'),
      tag: null,
      highlight: false,
    },
    {
      name: t('pricingTeaser.standard'),
      period: t('pricingTeaser.standardPeriod'),
      price: '$6.99',
      devices: t('pricingTeaser.standardDevices'),
      tag: t('pricingTeaser.standardTag'),
      highlight: true,
    },
    {
      name: t('pricingTeaser.pro'),
      period: t('pricingTeaser.proPeriod'),
      price: '$4.99',
      devices: t('pricingTeaser.proDevices'),
      tag: t('pricingTeaser.proTag'),
      highlight: false,
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll preset="fade-up" className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('pricingTeaser.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('pricingTeaser.subtitle')}</p>
        </AnimateOnScroll>
        <StaggerContainer className="grid gap-6 md:grid-cols-3" stagger={0.12}>
          {plans.map(({ name, period, price, devices, tag, highlight }) => (
            <StaggerItem key={name} preset="scale-in">
              <NeonCard glowColor={highlight ? '#3B9BF5' : '#5AC8D8'}>
                <div className="p-6 text-center">
                  {tag ? (
                    <Badge
                      variant={highlight ? 'default' : 'secondary'}
                      className="mb-4 rounded-full"
                    >
                      {tag}
                    </Badge>
                  ) : (
                    <div className="mb-4 h-[22px]" />
                  )}
                  <h3 className="mb-1 text-lg font-semibold">{name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{period}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{price}</span>
                    <span className="text-muted-foreground text-sm">
                      {t('pricingTeaser.perMonth')}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6 text-sm">{devices}</p>
                  <Button
                    variant={highlight ? 'default' : 'outline'}
                    className={`w-full rounded-xl ${highlight ? 'glow-shadow' : ''}`}
                    asChild
                  >
                    <a href={pricingPath}>{t('hero.cta')}</a>
                  </Button>
                </div>
              </NeonCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <AnimateOnScroll preset="fade-in" delay={0.4} className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <a href={pricingPath}>
              {t('pricingTeaser.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

/* в”Ђв”Ђ FAQ в”Ђв”Ђ */
function FaqSection() {
  const { t } = useTranslation();
  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <AnimateOnScroll preset="fade-up" className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t('faq.title')}</h2>
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
function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <DotGrid
        className="opacity-25 dark:opacity-50"
        grid={{ gap: 28, perspective: true }}
        glow={{ pulseSpeed: 0.2 }}
        sparks={{ targetCount: 1 }}
        physics={{ enabled: true }}
      />

      <div className="bg-primary/8 dark:bg-primary/15 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      <AnimateOnScroll
        preset="fade-up"
        duration={0.7}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">{t('finalCta.title')}</h2>
        <p className="text-muted-foreground mb-10 text-lg">{t('finalCta.subtitle')}</p>
        <Button
          size="lg"
          className="glow-shadow h-14 rounded-2xl px-10 text-lg transition-all duration-300"
        >
          {t('finalCta.cta')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </AnimateOnScroll>
    </section>
  );
}
