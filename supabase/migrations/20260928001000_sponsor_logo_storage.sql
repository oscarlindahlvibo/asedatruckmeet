-- Storage for sponsor logos uploaded through the admin CMS.
INSERT INTO storage.buckets (id, name, public)
VALUES ('truckmeet-media', 'truckmeet-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "truckmeet sponsor media public read" ON storage.objects;
CREATE POLICY "truckmeet sponsor media public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'truckmeet-media');

DROP POLICY IF EXISTS "truckmeet sponsor media authenticated upload" ON storage.objects;
CREATE POLICY "truckmeet sponsor media authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'truckmeet-media');

DROP POLICY IF EXISTS "truckmeet sponsor media authenticated update" ON storage.objects;
CREATE POLICY "truckmeet sponsor media authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'truckmeet-media')
WITH CHECK (bucket_id = 'truckmeet-media');

DROP POLICY IF EXISTS "truckmeet sponsor media authenticated delete" ON storage.objects;
CREATE POLICY "truckmeet sponsor media authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'truckmeet-media');
