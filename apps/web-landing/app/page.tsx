import { Nav } from '@/components/sections/nav';
import { Hero } from '@/components/sections/hero';
import { Problem } from '@/components/sections/problem';
import { What } from '@/components/sections/what';
import { Benefits } from '@/components/sections/benefits';
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
        <Benefits />
        <How />
        <Demo />
        <Bonus />
        <FeedbackForm />
      </main>
      <Footer />
    </>
  );
}
