import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Sponsor, Artist, SponsorTier } from '@/types';
import legacySponsors from '../../data/legacy-sponsors.json';

const tierMap: Record<string, SponsorTier> = {
  Huvudpartner: 'main',
  Platinapartner: 'platinum',
  Guldpartner: 'gold',
  Silverpartner: 'silver',
  Bronspartner: 'bronze',
};

const importedSponsors: Sponsor[] = legacySponsors.sponsors.map((sponsor, index) => ({
  id: `legacy-${sponsor.slug}`,
  name: sponsor.name,
  description: sponsor.description,
  logo_url: sponsor.logoPath,
  website_url: sponsor.websiteUrl ?? '',
  tier: tierMap[sponsor.tier] ?? 'bronze',
  display_order: index,
  is_active: true,
  created_at: legacySponsors.importedAt,
  updated_at: legacySponsors.importedAt,
}));

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setSponsors(importedSponsors);
      setLoading(false);
      return () => { mounted = false; };
    }
    (async () => {
      const { data } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true })
        .order('display_order', { ascending: true });
      if (mounted) {
        setSponsors(data?.length ? data as Sponsor[] : importedSponsors);
        setLoading(false);
      }
    })().catch(() => {
      if (mounted) {
        setSponsors(importedSponsors);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return { sponsors, loading };
}

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setArtists([]);
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('artists')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      setArtists((data ?? []) as Artist[]);
      setLoading(false);
    })().catch(() => setLoading(false));
  }, []);

  return { artists, loading };
}

export function groupSponsorsByTier(sponsors: Sponsor[]) {
  const groups: Record<SponsorTier, Sponsor[]> = {
    main: [],
    platinum: [],
    gold: [],
    silver: [],
    bronze: [],
  };
  for (const s of sponsors) {
    groups[s.tier].push(s);
  }
  return groups;
}
