import { ShieldCheck, Wifi, EyeOff, Lock, Check, ArrowRight } from 'lucide-react';

import { WindowsIcon, AppleIcon, AndroidIcon, LinuxIcon } from '@/shared/ui/platform-icons';

import { useTranslation } from '@/shared/lib/i18n';
import { useLocalePath } from '@/shared/lib/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/shared/ui/animate-on-scroll';

export const FeaturesPage = () => {
  return (
    <>
      <FeaturesHero />
      <ProtocolsDeepDive />
      <PrivacySection />
      <PlatformsSection />
      <FeaturesCta />
    </>
  );
};

function FeaturesHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EDF4FC] to-transparent dark:from-[#0C1222] dark:to-transparent" />
      <AnimateOnScroll id="features-hero" preset="fade-up" duration={0.7} className="relative mx-auto max-w-3xl px-6 pb-8 pt-24 text-center md:pt-32">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {t('features.heroTitle')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('features.heroSubtitle')}
        </p>
      </AnimateOnScroll>
    </section>
  );
}

function ProtocolsDeepDive() {
  const { t } = useTranslation();

  const protocols = [
    {
      name: t('protocols.wireguard'),
      desc: t('protocols.wireguardDesc'),
      tag: null,
      icon: Wifi,
      highlight: false,
      details: t('features.wireguardDetails'),
    },
    {
      name: t('protocols.amnezia'),
      desc: t('protocols.amneziaDesc'),
      tag: t('protocols.amneziaTag'),
      icon: ShieldCheck,
      highlight: true,
      details: t('features.amneziaDetails'),
    },
    {
      name: t('protocols.vless'),
      desc: t('protocols.vlessDesc'),
      tag: t('protocols.vlessTag'),
      icon: EyeOff,
      highlight: false,
      details: t('features.vlessDetails'),
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll id="features-protocols-title" preset="fade-up" className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('protocols.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('protocols.subtitle')}</p>
        </AnimateOnScroll>
        <StaggerContainer id="features-protocols" className="grid gap-8 md:grid-cols-3" stagger={0.12}>
          {protocols.map(({ name, desc, tag, icon: Icon, highlight, details }) => (
            <StaggerItem key={name} preset="fade-up">
              <Card
                className={`flex h-full flex-col border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  highlight ? 'border-primary/30 shadow-md shadow-primary/5' : 'border-border/50 shadow-sm'
                }`}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${highlight ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-6 w-6 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    {tag && (
                      <Badge variant={highlight ? 'default' : 'secondary'} className="rounded-full text-xs">
                        {tag}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{desc}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{details}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function PrivacySection() {
  const { t } = useTranslation();

  const items = [
    { icon: Lock, text: t('features.noLogs') },
    { icon: ShieldCheck, text: t('features.encryption') },
    { icon: EyeOff, text: t('features.openSource') },
  ];

  return (
    <section className="bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <AnimateOnScroll id="features-privacy-title" preset="fade-up">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t('features.privacyTitle')}
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            {t('features.privacySubtitle')}
          </p>
        </AnimateOnScroll>
        <StaggerContainer id="features-privacy" className="grid gap-6 sm:grid-cols-3" stagger={0.1}>
          {items.map(({ icon: Icon, text }) => (
            <StaggerItem key={text} preset="scale-in">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-primary/10 rounded-xl p-4">
                  <Icon className="text-primary h-8 w-8" />
                </div>
                <span className="font-medium">{text}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function PlatformsSection() {
  const { t } = useTranslation();

  const platforms = [
    { name: 'Windows', icon: WindowsIcon },
    { name: 'Android', icon: AndroidIcon },
    { name: 'iOS', icon: AppleIcon },
    { name: 'Linux', icon: LinuxIcon },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <AnimateOnScroll id="features-platforms-title" preset="fade-up">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t('features.platformsTitle')}
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            {t('features.platformsSubtitle')}
          </p>
        </AnimateOnScroll>
        <StaggerContainer id="features-platforms" className="grid grid-cols-2 gap-6 md:grid-cols-4" stagger={0.1}>
          {platforms.map(({ name, icon: Icon }) => (
            <StaggerItem key={name} preset="scale-in">
              <div className="bg-card border-border/50 flex flex-col items-center gap-3 rounded-2xl border p-6 shadow-sm">
                <Icon className="text-primary h-10 w-10" />
                <span className="font-medium">{name}</span>
                <Check className="text-primary h-5 w-5" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function FeaturesCta() {
  const { t } = useTranslation();
  const lp = useLocalePath();

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#EDF4FC] to-transparent dark:via-[#152033]" />
      <AnimateOnScroll id="features-cta" preset="fade-up" duration={0.7} className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">{t('finalCta.title')}</h2>
        <p className="text-muted-foreground mb-10 text-lg">{t('finalCta.subtitle')}</p>
        <Button size="lg" className="h-14 rounded-2xl px-10 text-lg shadow-lg shadow-primary/20" asChild>
          <a href={lp('/pricing')}>
            {t('pricingTeaser.cta')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </AnimateOnScroll>
    </section>
  );
}
