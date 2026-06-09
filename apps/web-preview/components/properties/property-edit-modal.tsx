'use client';

// Val 3.1 · Modal de editare a caracteristicilor proprietății. Salvează overrides în
// property-edits-store (localStorage). VISUAL SKELETON.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { setPropertyEdits, type PropertyEdits } from '@/lib/property-edits-store';
import type { Property, ListingType, PropertyClass } from '@/lib/mock';

const LISTING_TYPES: ListingType[] = ['sale', 'rent', 'both'];
const CLASSES: PropertyClass[] = ['soviet_era', 'post_soviet', 'new_build', 'premium'];

function numOrUndef(v: string): number | undefined {
  if (v === '') return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

export function PropertyEditModal({
  open,
  onClose,
  property,
}: {
  open: boolean;
  onClose: () => void;
  property: Property;
}) {
  const { t } = useT();
  const { toast } = useToast();

  const [addr, setAddr] = useState(property.addr);
  const [zone, setZone] = useState(property.zone);
  const [area, setArea] = useState(String(property.area));
  const [rooms, setRooms] = useState(String(property.rooms));
  const [listingType, setListingType] = useState<ListingType>(property.listingType);
  const [price, setPrice] = useState(property.priceEur > 0 ? String(property.priceEur) : '');
  const [rent, setRent] = useState(property.monthlyRentEur ? String(property.monthlyRentEur) : '');
  const [commission, setCommission] = useState(property.commissionPct != null ? String(property.commissionPct) : '');
  const [pClass, setPClass] = useState<PropertyClass>(property.propertyClass);

  const showSale = listingType === 'sale' || listingType === 'both';
  const showRent = listingType === 'rent' || listingType === 'both';

  function save(e: FormEvent) {
    e.preventDefault();
    const edits: PropertyEdits = {
      addr: addr.trim() || property.addr,
      zone: zone.trim() || property.zone,
      area: numOrUndef(area) ?? property.area,
      rooms: numOrUndef(rooms) ?? property.rooms,
      listingType,
      priceEur: showSale ? (numOrUndef(price) ?? 0) : 0,
      monthlyRentEur: showRent ? (numOrUndef(rent) ?? null) : null,
      commissionPct: showSale ? (numOrUndef(commission) ?? null) : null,
      propertyClass: pClass,
    };
    setPropertyEdits(property.id, edits);
    toast({ variant: 'success', title: t('property.edit.toastSaved') });
    onClose();
  }

  const selectClass =
    'w-full h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold';

  return (
    <Modal open={open} onClose={onClose} title={t('property.edit.title')} description={t('property.edit.desc')} size="lg">
      <form onSubmit={save} className="flex flex-col gap-sp3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3">
          <Input label={t('property.detail.addressLabel')} value={addr} onChange={(e) => setAddr(e.target.value)} />
          <Input label={t('property.detail.zoneLabel')} value={zone} onChange={(e) => setZone(e.target.value)} />
          <Input label={t('property.detail.areaLabel')} type="number" inputMode="numeric" value={area} onChange={(e) => setArea(e.target.value)} />
          <Input label={t('property.detail.roomsLabel')} type="number" inputMode="numeric" value={rooms} onChange={(e) => setRooms(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3">
          <label className="flex flex-col gap-sp1">
            <span className="text-[12px] text-text-secondary font-medium">{t('property.detail.listingTypeLabel')}</span>
            <select value={listingType} onChange={(e) => setListingType(e.target.value as ListingType)} className={selectClass}>
              {LISTING_TYPES.map((lt) => (
                <option key={lt} value={lt}>{t(`property.listingType.${lt}`)}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-sp1">
            <span className="text-[12px] text-text-secondary font-medium">{t('property.detail.propertyClassLabel')}</span>
            <select value={pClass} onChange={(e) => setPClass(e.target.value as PropertyClass)} className={selectClass}>
              {CLASSES.map((c) => (
                <option key={c} value={c}>{t(`property.propertyClass.${c}`)}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3">
          {showSale && (
            <Input label={t('property.detail.priceLabel') + ' (€)'} type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          )}
          {showRent && (
            <Input label={t('property.detail.monthlyRentLabel') + ' (€)'} type="number" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} />
          )}
          {showSale && (
            <Input label={t('property.detail.commissionLabel') + ' (%)'} type="number" inputMode="decimal" value={commission} onChange={(e) => setCommission(e.target.value)} hint={t('property.edit.commissionHint')} />
          )}
        </div>

        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit">{t('common.save')}</Button>
        </div>
      </form>
    </Modal>
  );
}
