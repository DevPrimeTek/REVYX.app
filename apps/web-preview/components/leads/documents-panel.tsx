'use client';

// M0.S7 · Lead documents panel — simulated file attachments persisted in localStorage.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import {
  addDocument,
  removeDocument,
  useLeadExtras,
  type DocumentType,
} from '@/lib/lead-extras-store';

const TYPES: DocumentType[] = [
  'identity_proof',
  'cadastre_extract',
  'contract_preliminary',
  'energy_certificate',
  'other',
];

function formatSize(bytes: number, t: (key: string, vars?: Record<string, string | number>) => string): string {
  if (bytes < 1024 * 1024) return t('leadExtras.documentSizeKb', { kb: Math.round(bytes / 1024) });
  return t('leadExtras.documentSizeMb', { mb: (bytes / (1024 * 1024)).toFixed(2) });
}

export function DocumentsPanel({ leadId, uploaderName }: { leadId: string; uploaderName: string }) {
  const { t } = useT();
  const { toast } = useToast();
  const extras = useLeadExtras(leadId);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<DocumentType>('contract_preliminary');
  const [filename, setFilename] = useState('');
  const [sizeKb, setSizeKb] = useState('256');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = filename.trim();
    if (!trimmed) return;
    addDocument(leadId, {
      filename: trimmed,
      documentType: type,
      sizeBytes: Math.max(1, Number(sizeKb)) * 1024,
      uploaderName,
    });
    toast({ variant: 'success', title: t('leadExtras.documentSavedToast') });
    setFilename('');
    setSizeKb('256');
    setType('contract_preliminary');
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-sp3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-text-secondary">{t('leadExtras.documentsDesc')}</p>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          {t('leadExtras.documentAddCta')}
        </Button>
      </div>

      <ul className="flex flex-col gap-sp2">
        {extras.documents.length === 0 && (
          <li className="text-text-muted text-[12px] py-sp2 border border-dashed border-border rounded-md px-sp3 text-center">
            {t('leadExtras.documentsEmpty')}
          </li>
        )}
        {extras.documents.map((doc) => (
          <li
            key={doc.id}
            className="border border-border rounded-md bg-navy-deep px-sp3 py-sp2 flex items-center justify-between gap-sp2"
          >
            <div className="flex items-center gap-sp2 min-w-0">
              <span aria-hidden className="text-[16px]">📎</span>
              <div className="min-w-0">
                <p className="text-[13px] text-text-h truncate">{doc.filename}</p>
                <p className="text-[11px] text-text-muted">
                  {formatSize(doc.sizeBytes, t)} · {doc.uploaderName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-sp2 flex-shrink-0">
              <Badge variant="info" size="xs">
                {t(`leadExtras.documentTypes.${doc.documentType}`)}
              </Badge>
              <button
                type="button"
                onClick={() => removeDocument(leadId, doc.id)}
                className="text-[11px] text-text-muted hover:text-status-red transition-colors duration-fast cursor-pointer"
              >
                {t('leadExtras.documentRemove')}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('leadExtras.documentModal.title')}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-sp1">
              {t('leadExtras.documentModal.typeLabel')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DocumentType)}
              className="w-full h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold"
            >
              {TYPES.map((tt) => (
                <option key={tt} value={tt}>
                  {t(`leadExtras.documentTypes.${tt}`)}
                </option>
              ))}
            </select>
          </div>
          <Input
            label={t('leadExtras.documentModal.filenameLabel')}
            name="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder={t('leadExtras.documentModal.filenamePlaceholder')}
            required
          />
          <Input
            label={t('leadExtras.documentModal.sizeLabel')}
            type="number"
            min={1}
            max={50000}
            value={sizeKb}
            onChange={(e) => setSizeKb(e.target.value)}
            required
          />
          <p className="text-[11px] text-text-muted">{t('leadExtras.documentModal.warning')}</p>
          <div className="flex items-center justify-end gap-sp2 pt-sp3 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!filename.trim()}>
              {t('leadExtras.documentModal.submit')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
