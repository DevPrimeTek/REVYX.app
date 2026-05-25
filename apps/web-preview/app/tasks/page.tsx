'use client';

// M0.S7 · /tasks · full-page agent to-do list with filters + add modal.

import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useT } from '@/components/i18n/provider';
import { TaskList } from '@/components/tasks/task-list';
import { TaskModal } from '@/components/tasks/task-modal';
import { agents } from '@/lib/mock';

type Filter = 'today' | 'active' | 'completed' | 'all';

export default function TasksPage() {
  const { t } = useT();
  const me = agents[0];
  const [filter, setFilter] = useState<Filter>('today');
  const [open, setOpen] = useState(false);

  const FILTERS: Filter[] = ['today', 'active', 'completed', 'all'];

  return (
    <>
      <SiteNav active="/tasks" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-5xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('task.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('task.title')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">{t('task.subtitle')}</p>
          </div>
          <Button onClick={() => setOpen(true)}>{t('task.addCta')}</Button>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-sp3 flex-wrap">
              <div>
                <CardTitle>{t('task.title')}</CardTitle>
                <CardDescription>{t('task.subtitle')}</CardDescription>
              </div>
              <div
                role="tablist"
                aria-label={t('common.filter')}
                className="flex items-center gap-1 rounded-md border border-border-light p-1 bg-navy-deep"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    role="tab"
                    type="button"
                    aria-selected={filter === f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                      filter === f
                        ? f === 'today'
                          ? 'bg-gold text-navy-deep font-semibold'
                          : 'bg-gold/10 text-gold'
                        : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
                    )}
                  >
                    {t(`task.filters.${f}`)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TaskList
              agentId={me.id}
              filter={filter}
              emptyMessage={filter === 'today' ? t('task.emptyToday') : t('task.emptyAll')}
            />
          </CardContent>
        </Card>
      </main>

      <TaskModal open={open} onClose={() => setOpen(false)} agentId={me.id} />
    </>
  );
}
