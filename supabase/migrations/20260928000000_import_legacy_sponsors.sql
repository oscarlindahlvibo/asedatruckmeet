-- Import legacy sponsor content and make the shared schema usable through PostgREST.
-- Safe to apply once through the shared deployment migration runner.

GRANT USAGE ON SCHEMA truckmeet TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA truckmeet TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA truckmeet TO authenticated;
GRANT INSERT, UPDATE, DELETE ON truckmeet.sponsors TO authenticated;

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Uppvidinge Kommun', 'Vi kan stolt presentera att Uppvidinge Kommun går in som Platinapartner till årets evenemang! Uppvidinge Kommun har ett tätt samarbete med Truckmeet i syd ideell förening för att evenemanget ska kunna genomföras på ett tryggt och ordnat sätt!', '/imported-sponsors/uppvidinge-kommun.webp', 'http://dekaltrim.nu', 'platinum', 0, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Uppvidinge Kommun');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'JSC Koncernen', 'Vi kan stolt presentera JSC Koncernen som huvudpartner för Åseda Truckmeet även 2026. JSC Koncernen - Vi löser dina logistikproblem på ett enkelt sätt. Vi kan stolt presentera att Uppvidinge Kommun går in som Platinapartner till årets evenemang! Uppvidinge Kommun har ett tätt samarbete med Truckmeet i syd ideell förening för att evenemanget ska kunna genomföras på ett tryggt och ordnat sätt!', '/imported-sponsors/jsc-koncernen.png', 'https://vibofast.se', 'main', 1, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'JSC Koncernen');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Kompetensportalen.se', 'Kompetensportalen.se erbjuder kurser i Arbete på väg (APV 1.1-1.3) och har ett ständigt växande kursutbud till Sveriges vassaste priser.', '/imported-sponsors/kompetensportalen-se.webp', 'https://www.kompetensportalen.se', 'gold', 2, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Kompetensportalen.se');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'VIBO Fastigheter', 'Vibo Fastigheter erbjuder lägenheter i Hultsfreds kommun.', '/imported-sponsors/vibo-fastigheter.png', 'https://vibofast.se', 'gold', 3, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'VIBO Fastigheter');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Mias Butik - Frendo Åseda', 'Passerar du Åseda? Då är Mias Butik - Frendo det givna stoppet. Fyll på med en korv eller bulle samtidigt som lastbilen får lite diesel utanför.', '/imported-sponsors/mias-butik-frendo-a-seda.png', '', 'gold', 4, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Mias Butik - Frendo Åseda');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Kronqvists Åkeri', 'Kronqvists Lastbilsåkeri är ett familjeföretag inom entreprenad i 3:e generation.', '/imported-sponsors/kronqvists-a-keri.webp', 'http://www.kronqvists.se', 'gold', 5, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Kronqvists Åkeri');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Dekaltrim.nu', 'Vi ställer ut på Åseda Truckmeet med vårt rullande tryckeri och tillverkar skurna texter, logos och personliga dekaler på beställning!', '/imported-sponsors/dekaltrim-nu.webp', 'http://dekaltrim.nu', 'gold', 6, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Dekaltrim.nu');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'ProfilGruppen', 'ProfilGruppen är ett svenskt bolag som utvecklar och tillverkar kundanpassade profiler och komponenter i aluminium.', '/imported-sponsors/profilgruppen.png', 'http://www.profilgruppen.se', 'gold', 7, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'ProfilGruppen');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Högsby Sparbank', 'Lite skämtsamt brukar vi säga att en riktig bank har huvudkontoret på Storgatan. Det är förstås inte hela sanningen. Men som sparbank har vi med oss ett arv som är helt unikt: Vår verksamhet är verkligen lokal. Vårt huvudkontor finns på orten och den närhet vi har till våra kunder gör att vi känner dem bättre, och dom oss, än många andra aktörer i branschen.', '/imported-sponsors/ho-gsby-sparbank.webp', 'http://www.hogsbysparbank.se', 'gold', 8, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Högsby Sparbank');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'SLP AB', 'I våra produktionslokaler i Övertorneå tillverkas alla våra olika ekipage. På ca 7000 m3 tillverkas årligen cirka 100 enheter idag för leverans till Sverige, Norge och Finland. Vi tillverkar allt från chassier och hjälpramar till flak i våra manuella svetsstationer.', '/imported-sponsors/slp-ab.png', 'https://www.slpab.com/', 'gold', 9, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'SLP AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'RB Logistik', '', '/imported-sponsors/rb-logistik.png', 'https://www.facebook.com/RBLOGISTIK/', 'gold', 10, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'RB Logistik');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Holmsjö Bildemontering', '', '/imported-sponsors/holmsjo-bildemontering.png', 'https://www.holmsjobildemontering.se/', 'gold', 11, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Holmsjö Bildemontering');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Kronobärgaren - Rottne Motorverkstad', 'Vi ställer ut på Åseda Truckmeet och visar upp våra fordon! Transport och bärgning av lätta, tunga, svåra och unika fordon och saker.', '/imported-sponsors/kronoba-rgaren-rottne-motorverkstad.png', 'https://www.facebook.com/kronobargaren/?locale=sv_SE', 'gold', 12, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Kronobärgaren - Rottne Motorverkstad');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Däck Team - Åseda Gummiverkstad', 'Välkomna till Däckteam i Åseda. Vi säljer och byter däck och fälgar till din bil. Vi bedriver försäljning av däck och fälg mot såväl privatpersoner som företag med tjänstebilsflotta eller transportverksamhet.', '/imported-sponsors/da-ck-team-a-seda-gummiverkstad.png', 'https://www.dackteam.se/aseda-gummiverkstad', 'gold', 13, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Däck Team - Åseda Gummiverkstad');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Finnvedens Lastvagnar', '', '/imported-sponsors/finnvedens-lastvagnar.png', 'https://www.dealer.volvotrucks.se/finnvedenslast/sv-se/about-us1.html', 'gold', 14, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Finnvedens Lastvagnar');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Spaljisten', '', '/imported-sponsors/spaljisten.png', 'https://spaljisten.com/', 'gold', 15, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Spaljisten');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Sven Granflo Åkeri AB', '', '/imported-sponsors/sven-granflo-a-keri-ab.webp', 'https://www.granfloakeri.se/', 'gold', 16, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Sven Granflo Åkeri AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Runes Bensin', '', '/imported-sponsors/runes-bensin.png', 'https://runes.se/', 'gold', 17, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Runes Bensin');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Däckcenter I Vetlanda', '', '/imported-sponsors/da-ckcenter-i-vetlanda.png', 'https://dackcenter.eu/', 'gold', 18, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Däckcenter I Vetlanda');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Storms Inredningar', '', '/imported-sponsors/storms-inredningar.png', 'https://www.instagram.com/jimmy.storm95/', 'gold', 19, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Storms Inredningar');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'J-Son Schakt AB', '', '/imported-sponsors/j-son-schakt-ab.webp', '', 'gold', 20, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'J-Son Schakt AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Fagerhults Maskin', '', '/imported-sponsors/fagerhults-maskin.png', 'https://fagerhultsmaskin.se/', 'gold', 21, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Fagerhults Maskin');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Smartab', '', '/imported-sponsors/smartab.webp', 'https://www.smartab.com/', 'gold', 22, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Smartab');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'SverigeExpressen', '', '/imported-sponsors/sverigeexpressen.png', 'https://sverigeexpressen.se/', 'gold', 23, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'SverigeExpressen');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Åseda Bygg&Järn', '', '/imported-sponsors/a-seda-bygg-ja-rn.png', 'https://www.xn--sedabyggprodukter-7qb.se/', 'gold', 24, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Åseda Bygg&Järn');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'SL Trailer', '', '/imported-sponsors/sl-trailer.png', 'https://sltrailer.se/', 'gold', 25, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'SL Trailer');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'VALOSTORE', '', '/imported-sponsors/valostore.png', 'https://www.valostore.se/', 'gold', 26, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'VALOSTORE');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Truckstyle Sweden', '', '/imported-sponsors/truckstyle-sweden.png', 'https://truckstylesweden.com/', 'gold', 27, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Truckstyle Sweden');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'JLB Mark & Asfalt', '', '/imported-sponsors/jlb-mark-asfalt.png', 'https://jlbasfalt.se/', 'gold', 28, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'JLB Mark & Asfalt');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Bilservice i Åseda', '', '/imported-sponsors/bilservice-i-a-seda.png', 'https://bilserviceaseda.se/', 'gold', 29, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Bilservice i Åseda');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Granflo Bygg AB', '', '/imported-sponsors/granflo-bygg-ab.png', 'https://granflobygg.se/', 'gold', 30, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Granflo Bygg AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'VFG Utbildning', '', '/imported-sponsors/vfg-utbildning.png', 'https://vfg.se/', 'gold', 31, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'VFG Utbildning');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Swelash AB', '', '/imported-sponsors/swelash-ab.png', 'https://www.swelash.se/', 'gold', 32, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Swelash AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Jinert', '', '/imported-sponsors/jinert.png', 'https://jinert.se/', 'gold', 33, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Jinert');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'JSC Projekt', '', '/imported-sponsors/jsc-projekt.png', 'https://www.jscforvaltning.se/', 'gold', 34, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'JSC Projekt');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Maskin & Mekan i Växjö AB', '', '/imported-sponsors/maskin-mekan-i-va-xjo-ab.png', 'https://maskinomekan.se/', 'gold', 35, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Maskin & Mekan i Växjö AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Granflo Supply AB', '', '/imported-sponsors/granflo-supply-ab.png', 'https://granflobygg.se/', 'gold', 36, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Granflo Supply AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Bli en del av Åseda Truckmeet!', '', '/imported-sponsors/bli-en-del-av-a-seda-truckmeet.png', 'http://asedatruckmeet.se', 'gold', 37, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Bli en del av Åseda Truckmeet!');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'SVEA', 'Svea är en koncern med finansiell verksamhet i ett flertal europeiska länder. Med mer än fyrtio års erfarenhet av att hjälpa företag med deras likviditet är vi ett naturligt val för många företagare när de behöver en finansieringspartner. Sveas vision är att vara en ledande finansiell aktör i Europa.', '/imported-sponsors/svea.png', 'http://www.svea.com/sv-se', 'silver', 38, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'SVEA');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'B-Trans Norra Vi', 'B-Trans AB är ett svenskt åkeriföretag med säte i Ydre, Östergötland. Bolaget grundades 1988 och är verksamt inom vägtransport och godstransporter. Företaget har cirka 15 anställda och bedriver åkeriverksamhet med tillhörande transporttjänster.', '/imported-sponsors/b-trans-norra-vi.png', 'https://www.instagram.com/btransab/', 'silver', 39, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'B-Trans Norra Vi');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Värlebo Skogstransporter', 'Värlebo Skogstransporter AB är ett åkeriföretag i Högsby som specialiserar sig på timmer- och flistransporter inom skogsindustrin. Företaget grundades 2007 och bedriver skogstransporter med egna timmerbilar.', '/imported-sponsors/va-rlebo-skogstransporter.png', 'https://www.instagram.com/varleboskogstransporter/', 'silver', 40, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Värlebo Skogstransporter');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'BR. Israelsson', 'Br.Israelsson Kalmar AB är ett transportföretag med säte i Kalmar som bedriver lastbilstransporter och logistik. Bolaget startades 2023 och erbjuder transportlösningar med fokus på kvalitet, punktlighet och kundanpassade uppdrag.', '/imported-sponsors/br-israelsson.png', 'https://www.facebook.com/p/Br-Israelsson-Kalmar-AB-61561018386980/', 'silver', 41, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'BR. Israelsson');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Sjögrens Åkeri', 'Sjögrens Åkeri (Åkeri AB Bertil Sjögren) är ett transportföretag med säte i Lessebo. Bolaget grundades 1970 och bedriver åkeri- och entreprenadverksamhet inom godstransporter.', '/imported-sponsors/sjo-grens-a-keri.png', 'https://www.instagram.com/sjogrensakeri/', 'silver', 42, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Sjögrens Åkeri');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'CLEAR DEFEND', '', '/imported-sponsors/clear-defend.png', 'https://www.cleardefend.se', 'silver', 43, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'CLEAR DEFEND');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Jarls Åkeri', 'Jarls Åkeri är ett skogstransportföretag med bas i Broakulla. Företaget grundades 1949 och arbetar främst med transporter av rundvirke inom trädindustrin i södra Sverige. Verksamheten drivs idag av familjen Jarl och omfattar åtta timmerbilar samt egen verkstad.', '/imported-sponsors/jarls-a-keri.png', 'https://www.jarlsakeri.se/', 'silver', 44, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Jarls Åkeri');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'FT-Produktion', 'FT Produktion är ett småländskt företag verksamt inom tillverkning och industriell produktion. Företaget erbjuder tjänster inom produktion och bearbetning med fokus på kvalitet och kundanpassade lösningar.', '/imported-sponsors/ft-produktion.png', 'https://ft-produktion.se/', 'silver', 45, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'FT-Produktion');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'BE-GE', 'Transportbranschen handlar om förtroende. Med vår och Scanias långa tradition av att leverera exakt det som ditt företag behöver. Med en uppsjö av valmöjligheter och ett stort utbud modulära konfigurationer är möjligheterna oändliga. Be-Ge Lastbilar AB är auktoriserad återförsäljare för Scania lastbilar sedan 1941.', '/imported-sponsors/be-ge.png', 'http://www.be-ge.se', 'silver', 46, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'BE-GE');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Allt i plåt', 'Allt i Plåt är ett högteknologiskt företag med småländsk företagsamhet och entreprenörsanda. Vi tillverkar hytter till tunga fordon och utför fordonsanpassning av färdtjänst och specialfordon.', '/imported-sponsors/allt-i-pla-t.png', 'https://www.aip-cab.se/allt-i-plat/', 'silver', 47, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Allt i plåt');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Antes Lyft & Transport', '', '/imported-sponsors/antes-lyft-transport.png', 'https://anteskranbilar.se/', 'silver', 48, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Antes Lyft & Transport');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'OL Maskintjänst AB', 'OL Maskintjänst är ett entreprenadföretag verksamt inom mark- och maskintjänster. Företaget erbjuder flexibla lösningar inom anläggnings- och entreprenadarbeten med fokus på kvalitet och pålitligt utförande.', '/imported-sponsors/ol-maskintja-nst-ab.png', '', 'silver', 49, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'OL Maskintjänst AB');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'JT Wahlbergs Bygg', 'Vår vision är att förverkliga drömmar. Wahlbergs Bygg i Åseda hjälper dig med allt i och kring din fastighet! Takbyte, dörrbyte, altaner, trägolv, kök, flytta innerväggar med mera. Vi hjälper dig även med badrumsrenoveringen, tillbyggnader och nyproduktion! Allt helt enkelt!', '/imported-sponsors/jt-wahlbergs-bygg.png', 'https://jtwahlbergsbygg.se/', 'silver', 50, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'JT Wahlbergs Bygg');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Blomstermåla Åkeri', 'Blomstermåla Åkeri AB är ett familjeföretag i Mönsterås som erbjuder transporttjänster i Sverige, Norden och Västeuropa. Företaget arbetar bland annat med godstransporter, kranlyft och trucklogistik och samarbetar med Mönsterås LBC.', '/imported-sponsors/blomsterma-la-a-keri.png', 'https://www.blomstermalaakeriab.se/', 'silver', 51, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Blomstermåla Åkeri');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Alvinssons Mönsterås', 'Alvinssons AB är ett entreprenadföretag i Mönsterås som erbjuder maskin- och anläggningstjänster såsom grävarbeten, slamsugning, snöröjning och markarbeten. Företaget startades 1966 och arbetar främst mot företag, offentlig sektor och privatpersoner i Kalmar län.', '/imported-sponsors/alvinssons-mo-nstera-s.png', 'https://www.alvinssons.se/', 'silver', 52, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Alvinssons Mönsterås');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Tabergs', 'Tabergs Åkeri AB är ett transportföretag specialiserat på special-, maskin- och projekttransporter. Företaget erbjuder allt från enstaka transporter till kompletta logistiklösningar och arbetar med överdimensionerat och tungt gods i Sverige och övriga Europa.', '/imported-sponsors/tabergs.png', 'https://www.tabergsakeri.com/', 'silver', 53, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Tabergs');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'MT Eksjö', 'MT Eksjö (Eksjö Maskin & Truck AB) är en svensk tillverkare av påbyggnationer för lastbilar och släp, med särskilt fokus på flis- och skogstransporter. Företaget utvecklar och bygger specialanpassade lösningar för tung trafik i nära samarbete med sina kunder.', '/imported-sponsors/mt-eksjo.png', 'https://motab.se/', 'silver', 54, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'MT Eksjö');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Bennesveds Åkeri', 'Bennesveds Åkeri AB är ett åkeriföretag i Älghult som bedriver godstransporter med lastbil. Företaget erbjuder även service och reparation av tunga fordon samt teknisk service inom exempelvis AC och elektronik', '/imported-sponsors/bennesveds-a-keri.png', '', 'silver', 55, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Bennesveds Åkeri');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Tord Nilsson Åkeri', 'Tord Nilssons Åkeri är ett familjeföretag baserat i Asarum. Företaget arbetar med transporter av bland annat avfall, asfalt och jordbruksprodukter.', '/imported-sponsors/tord-nilsson-a-keri.png', 'https://www.tordnilsson.se/', 'bronze', 56, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Tord Nilsson Åkeri');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Hotell Olof', 'I centrala Åseda, ett stenkast från Glasriket, är vi belägna. Ett hotell under omvandling då vi som nya ägare ämnar renovera hela huset under kommande år.', '/imported-sponsors/hotell-olof.png', 'https://vibofast.se', 'bronze', 57, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Hotell Olof');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Medin''s', 'Medin’s Åkeri är ett fristående transportföretag som arbetar med transporter mellan Sverige och övriga Europa. Företaget erbjuder kyl-, frys- och värmetransporter och kör med svenska chaufförer.', '/imported-sponsors/medin-s.png', 'https://medinsakeri.se/tjanster/', 'bronze', 58, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Medin''s');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Tak & Montage', 'Tak & Montage i Åseda AB är ett lokalt företag som arbetar med takläggning och montagearbeten.', '/imported-sponsors/tak-montage.png', 'https://tak-montage.com/', 'bronze', 59, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Tak & Montage');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Näshults Schaktmaskiner', 'Näshults Schaktmaskiner AB är ett familjeföretag som arbetar med produktion och leverans av ballast såsom sand, grus och makadam samt sorterad matjord.', '/imported-sponsors/na-shults-schaktmaskiner.png', 'https://www.nashultsschaktmaskiner.se/', 'bronze', 60, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Näshults Schaktmaskiner');

INSERT INTO truckmeet.sponsors (name, description, logo_url, website_url, tier, display_order, is_active)
SELECT 'Lugna Rum Åseda', 'Lugna Rum är ett pensionat i centrala Åseda med boende i genuin sekelskiftesmiljö. Här erbjuds enkel- och dubbelrum för kortare eller längre vistelser.', '/imported-sponsors/lugna-rum-a-seda.png', 'https://bnb-lugnarum.se/', 'bronze', 61, true
WHERE NOT EXISTS (SELECT 1 FROM truckmeet.sponsors WHERE name = 'Lugna Rum Åseda');


