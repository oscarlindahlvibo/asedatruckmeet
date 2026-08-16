import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { TruckmeetEvent, SiteSettings } from '@/types';

const fallbackEvent: TruckmeetEvent = {
  id: 'preview-2027', name: 'Åseda Truckmeet 2027', year: 2027,
  start_date: '2027-07-02T15:00:00+02:00', end_date: '2027-07-03T23:59:00+02:00',
  location: 'Åseda Folkets park', status: 'announced', is_active: true,
  hero_title: 'UPPLEV MAGIN MED', hero_subtitle: 'Showtrucks, krom, fordonsljus, musik och gemenskap.',
  hero_badge: 'NÄSTA EVENT · 2027', hero_image_url: 'https://asedatruckmeet.se/web/image/3835-0e415e0c/DJI_0723.webp',
  hero_video_url: '', countdown_target: '2027-07-02T15:00:00+02:00', countdown_label: 'Åseda Truckmeet 2027 börjar om',
  primary_cta_text: 'Köp biljetter nu', primary_cta_link: '/biljetter', secondary_cta_text: 'Anmäl lastbil', secondary_cta_link: '/kontakt',
  stat_trucks_visible: true, stat_tickets_visible: true, stat_partners_visible: true, stat_days_visible: true,
  stat_trucks_value: 187, stat_tickets_value: 12480, stat_partners_value: 34, stat_days_value: 2,
  created_at: '', updated_at: '',
};

export function useActiveEvent() {
  const [event, setEvent] = useState<TruckmeetEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setEvent(fallbackEvent);
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false })
        .limit(1)
        .maybeSingle();
      setEvent((data as TruckmeetEvent | null) ?? fallbackEvent);
      setLoading(false);
    })().catch(() => { setEvent(fallbackEvent); setLoading(false); });
  }, []);

  return { event, loading };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      setSettings(data as SiteSettings | null);
      setLoading(false);
    })();
  }, []);

  return { settings, loading };
}

export function useAllEvents() {
  const [events, setEvents] = useState<TruckmeetEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('year', { ascending: false });
      setEvents((data ?? []) as TruckmeetEvent[]);
      setLoading(false);
    })();
  }, []);

  return { events, loading };
}
