import { Nav } from '@/components/sections/nav';
import { Hero } from '@/components/sections/hero';
import { Problem } from '@/components/sections/problem';
import { What } from '@/components/sections/what';
import { AiTrust } from '@/components/sections/ai-trust';
import { Pillars } from '@/components/sections/pillars';
import { How } from '@/components/sections/how';
import { Demo } from '@/components/sections/demo';
import { Bonus } from '@/components/sections/bonus';
import { FeedbackForm } from '@/components/sections/feedback-form';
import { Footer } from '@/components/sections/footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <What />
        <AiTrust />
        <Pillars />
        <How />
        <Demo />
        <Bonus />
        <FeedbackForm />
      </main>
      <Footer />
    </>
  );
}
