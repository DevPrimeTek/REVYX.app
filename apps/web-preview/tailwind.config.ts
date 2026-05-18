import type { Config } from 'tailwindcss';
import tokens from '../../design/tokens.json';

const color = tokens.color;
const typography = tokens.typography;
const spacing = tokens.spacing.scale;
const radius = tokens.radius;
const shadow = tokens.shadow;
const motion = tokens.motion;

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: color.navy.base.hex,
          base: color.navy.base.hex,
          deep: color.navy.deep.hex,
          mid: color.navy.mid.hex,
          card: color.navy.card.hex,
          hover: color.navy.hover.hex,
        },
        gold: {
          DEFAULT: color.gold.base.hex,
          base: color.gold.base.hex,
          light: color.gold.light.hex,
          bright: color.gold.bright.hex,
          dark: color.gold.dark.hex,
        },
        border: {
          DEFAULT: color.border.base.hex,
          base: color.border.base.hex,
          light: color.border.light.hex,
          gold: color.border.gold.hex,
          'gold-pale': color.border.goldPale.hex,
        },
        text: {
          h: color.text.h.hex,
          primary: color.text.primary.hex,
          secondary: color.text.secondary.hex,
          muted: color.text.muted.hex,
        },
        status: {
          green: color.status.green.hex,
          amber: color.status.amber.hex,
          red: color.status.red.hex,
          blue: color.status.blue.hex,
        },
        actor: {
          seller: color.actor.seller.hex,
          agent: color.actor.agent.hex,
          ai: color.actor.ai.hex,
          buyer: color.actor.buyer.hex,
          manager: color.actor.manager.hex,
          bank: color.actor.bank.hex,
          notary: color.actor.notary.hex,
          social: color.actor.social.hex,
        },
        lead: {
          cold: color.leadTemperature.cold.hex,
          warm: color.leadTemperature.warm.hex,
          qualified: color.leadTemperature.qualified.hex,
          hot: color.leadTemperature.hot.hex,
        },
      },
      fontFamily: {
        display: typography.family.display.stack.split(',').map((s) => s.trim()),
        body: typography.family.body.stack.split(',').map((s) => s.trim()),
        mono: typography.family.mono.stack.split(',').map((s) => s.trim()),
        sans: typography.family.body.stack.split(',').map((s) => s.trim()),
      },
      spacing: {
        sp1: spacing.sp1,
        sp2: spacing.sp2,
        sp3: spacing.sp3,
        sp4: spacing.sp4,
        sp5: spacing.sp5,
        sp6: spacing.sp6,
        sp8: spacing.sp8,
        sp10: spacing.sp10,
        sp12: spacing.sp12,
        sp16: spacing.sp16,
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        pill: radius.pill,
      },
      boxShadow: {
        sm: shadow.sm,
        md: shadow.md,
        lg: shadow.lg,
        gold: shadow.gold,
        'gold-glow': shadow.goldGlow,
      },
      transitionDuration: {
        instant: motion.duration.instant,
        fast: motion.duration.fast,
        normal: motion.duration.normal,
        slow: motion.duration.slow,
      },
      transitionTimingFunction: {
        standard: motion.easing.standard,
        decel: motion.easing.decel,
        accel: motion.easing.accel,
      },
      letterSpacing: {
        label: '0.25em',
        badge: '0.15em',
      },
    },
  },
  plugins: [],
};

export default config;
