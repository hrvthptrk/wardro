// Wardro beépített termékkatalógus
// ---------------------------------------------------------------------------
// Népszerű márkák ismert termékei, hogy a ruhákat fotó nélkül is hozzá
// lehessen adni: a "Ruhák hozzáadása" oldalon a "Keresés márkák között" fülön
// lehet keresni bennük. Valódi termékfotó nincs, helyette a márka színeivel
// rajzolt kártya kerül a ruhára (a saját fotó később is feltölthető).
//
// Bővítés: új márka = új blokk; új termék = új ["Név", "Típus"] sor.
// Típusok: Cipő, Póló, Ing, Felső, Pulóver, Kabát, Nadrág, Rövidnadrág,
//          Szoknya, Ruha, Táska, Sapka, Öv, Óra, Napszemüveg, Sál,
//          Pénztárca, Kiegészítő, Top, Body, Blúz, Overál, Kardigán,
//          Leggings, Kendő, Ékszer, Női cipő (a női alapdarabok a fájl végén)
// bg / fg: a márkakártya háttér- és szövegszíne.
// ---------------------------------------------------------------------------

window.WARDRO_KATALOGUS = [
  { marka: "Nike", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Air Force 1 '07", "Cipő"], ["Air Max 90", "Cipő"], ["Air Max 95", "Cipő"], ["Air Max 97", "Cipő"],
    ["Air Max Plus TN", "Cipő"], ["Dunk Low", "Cipő"], ["Dunk High", "Cipő"], ["Blazer Mid '77", "Cipő"],
    ["Cortez", "Cipő"], ["Air Vapormax Plus", "Cipő"], ["Pegasus 41", "Cipő"], ["Vomero 5", "Cipő"],
    ["P-6000", "Cipő"], ["Killshot 2", "Cipő"], ["Tech Fleece kapucnis pulóver", "Pulóver"],
    ["Tech Fleece melegítőnadrág", "Nadrág"], ["Club Fleece kapucnis pulóver", "Pulóver"],
    ["Club Fleece melegítőnadrág", "Nadrág"], ["Sportswear Club póló", "Póló"], ["Dri-FIT edzőpóló", "Póló"],
    ["Windrunner széldzseki", "Kabát"], ["Sportswear puffer kabát", "Kabát"], ["Dri-FIT rövidnadrág", "Rövidnadrág"],
    ["Heritage86 baseballsapka", "Sapka"], ["Heritage oldaltáska", "Táska"], ["Brasilia hátizsák", "Táska"],
    ["Everyday zokni (3 pár)", "Kiegészítő"]
  ] },
  { marka: "Jordan", bg: "#B4121B", fg: "#FFFFFF", termekek: [
    ["Air Jordan 1 Retro High OG", "Cipő"], ["Air Jordan 1 Mid", "Cipő"], ["Air Jordan 1 Low", "Cipő"],
    ["Air Jordan 3 Retro", "Cipő"], ["Air Jordan 4 Retro", "Cipő"], ["Air Jordan 5 Retro", "Cipő"],
    ["Air Jordan 11 Retro", "Cipő"], ["Jumpman póló", "Póló"], ["Essentials kapucnis pulóver", "Pulóver"],
    ["Brooklyn fleece nadrág", "Nadrág"], ["Jumpman baseballsapka", "Sapka"]
  ] },
  { marka: "Adidas", bg: "#000000", fg: "#FFFFFF", termekek: [
    ["Samba OG", "Cipő"], ["Gazelle", "Cipő"], ["Gazelle Indoor", "Cipő"], ["Superstar", "Cipő"],
    ["Stan Smith", "Cipő"], ["Campus 00s", "Cipő"], ["Spezial", "Cipő"], ["Forum Low", "Cipő"],
    ["Handball Spezial", "Cipő"], ["SL 72", "Cipő"], ["Ultraboost Light", "Cipő"], ["NMD_R1", "Cipő"],
    ["Adilette papucs", "Cipő"], ["Adicolor Firebird melegítőfelső", "Pulóver"],
    ["Adicolor Firebird melegítőnadrág", "Nadrág"], ["Adicolor Trefoil póló", "Póló"],
    ["Adicolor Trefoil kapucnis pulóver", "Pulóver"], ["Tiro 24 melegítőnadrág", "Nadrág"],
    ["Essentials 3-csíkos rövidnadrág", "Rövidnadrág"], ["Beckenbauer melegítőfelső", "Pulóver"],
    ["Padded puffer kabát", "Kabát"], ["Trefoil baseballsapka", "Sapka"], ["Adicolor hátizsák", "Táska"]
  ] },
  { marka: "Yeezy", bg: "#8B8378", fg: "#F5F2EC", termekek: [
    ["Yeezy Boost 350 V2", "Cipő"], ["Yeezy Boost 700", "Cipő"], ["Yeezy Slide", "Cipő"],
    ["Yeezy Foam Runner", "Cipő"], ["Yeezy 500", "Cipő"]
  ] },
  { marka: "Puma", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Suede Classic", "Cipő"], ["Palermo", "Cipő"], ["Speedcat OG", "Cipő"], ["Clyde", "Cipő"],
    ["RS-X", "Cipő"], ["Essentials logós póló", "Póló"], ["T7 melegítőfelső", "Pulóver"],
    ["T7 melegítőnadrág", "Nadrág"], ["Essentials kapucnis pulóver", "Pulóver"]
  ] },
  { marka: "New Balance", bg: "#C8C9C7", fg: "#1A1A1A", termekek: [
    ["550", "Cipő"], ["530", "Cipő"], ["574", "Cipő"], ["9060", "Cipő"], ["2002R", "Cipő"],
    ["990v6", "Cipő"], ["1906R", "Cipő"], ["327", "Cipő"], ["Athletics kapucnis pulóver", "Pulóver"],
    ["Essentials póló", "Póló"]
  ] },
  { marka: "Asics", bg: "#001E62", fg: "#FFFFFF", termekek: [
    ["Gel-Kayano 14", "Cipő"], ["Gel-1130", "Cipő"], ["Gel-NYC", "Cipő"], ["Gel-Lyte III", "Cipő"],
    ["Gel-Nimbus 26", "Cipő"], ["Japan S", "Cipő"]
  ] },
  { marka: "Converse", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Chuck Taylor All Star High", "Cipő"], ["Chuck Taylor All Star Low", "Cipő"], ["Chuck 70 High", "Cipő"],
    ["Chuck 70 Low", "Cipő"], ["Run Star Hike", "Cipő"], ["One Star", "Cipő"]
  ] },
  { marka: "Vans", bg: "#C8102E", fg: "#FFFFFF", termekek: [
    ["Old Skool", "Cipő"], ["Sk8-Hi", "Cipő"], ["Authentic", "Cipő"], ["Slip-On", "Cipő"], ["Knu Skool", "Cipő"],
    ["Classic logós póló", "Póló"], ["Old Skool hátizsák", "Táska"]
  ] },
  { marka: "Reebok", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Club C 85", "Cipő"], ["Classic Leather", "Cipő"], ["Club C Revenge", "Cipő"], ["Workout Plus", "Cipő"]
  ] },
  { marka: "Salomon", bg: "#0D0D0D", fg: "#FFFFFF", termekek: [
    ["XT-6", "Cipő"], ["XT-4 OG", "Cipő"], ["Speedcross 6", "Cipő"], ["ACS Pro", "Cipő"]
  ] },
  { marka: "Timberland", bg: "#E0A526", fg: "#1A1A1A", termekek: [
    ["6-Inch Premium bakancs", "Cipő"], ["3-Eye Classic Lug hajócipő", "Cipő"], ["Euro Hiker", "Cipő"]
  ] },
  { marka: "Dr. Martens", bg: "#1A1A1A", fg: "#F2D21B", termekek: [
    ["1460 bakancs", "Cipő"], ["1461 cipő", "Cipő"], ["2976 Chelsea csizma", "Cipő"], ["Jadon platformbakancs", "Cipő"],
    ["Adrian loafer", "Cipő"]
  ] },
  { marka: "Birkenstock", bg: "#4A3B2A", fg: "#F2E8D8", termekek: [
    ["Arizona papucs", "Cipő"], ["Boston klumpa", "Cipő"], ["Gizeh papucs", "Cipő"], ["Milano szandál", "Cipő"]
  ] },
  { marka: "UGG", bg: "#B08A60", fg: "#FFFFFF", termekek: [
    ["Classic Mini csizma", "Cipő"], ["Classic Ultra Mini", "Cipő"], ["Tasman papucs", "Cipő"], ["Tazz platform", "Cipő"]
  ] },
  { marka: "Louis Vuitton", bg: "#5B3A29", fg: "#E9D6B4", termekek: [
    ["Neverfull MM táska", "Táska"], ["Speedy Bandoulière 25", "Táska"], ["Keepall Bandoulière 50", "Táska"],
    ["Pochette Métis", "Táska"], ["Alma BB", "Táska"], ["Christopher hátizsák", "Táska"],
    ["Multiple pénztárca", "Pénztárca"], ["Zippy pénztárca", "Pénztárca"], ["LV Initiales öv", "Öv"],
    ["LV Trainer sneaker", "Cipő"], ["LV Skate sneaker", "Cipő"], ["LV Archlight sneaker", "Cipő"],
    ["Monogram sál", "Sál"], ["Monogram pulóver", "Pulóver"], ["Damier póló", "Póló"],
    ["Monogram denim dzseki", "Kabát"], ["LV Millionaire napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Gucci", bg: "#0F3B2E", fg: "#E8D5A6", termekek: [
    ["Ace sneaker", "Cipő"], ["Rhyton sneaker", "Cipő"], ["Horsebit loafer", "Cipő"], ["Screener sneaker", "Cipő"],
    ["GG Marmont öv", "Öv"], ["GG Marmont táska", "Táska"], ["Jackie 1961 táska", "Táska"],
    ["Dionysus táska", "Táska"], ["Ophidia GG oldaltáska", "Táska"], ["GG Supreme hátizsák", "Táska"],
    ["GG Marmont pénztárca", "Pénztárca"], ["Interlocking G póló", "Póló"], ["GG jacquard pulóver", "Pulóver"],
    ["Web csíkos melegítőfelső", "Pulóver"], ["GG baseballsapka", "Sapka"], ["GG gyapjú sál", "Sál"],
    ["Négyzetes napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Prada", bg: "#0A0A0A", fg: "#FFFFFF", termekek: [
    ["Re-Edition 2005 Re-Nylon táska", "Táska"], ["Re-Nylon hátizsák", "Táska"], ["Cleo táska", "Táska"],
    ["Monolith bőr loafer", "Cipő"], ["America's Cup sneaker", "Cipő"], ["Re-Nylon kapucnis dzseki", "Kabát"],
    ["Háromszög-logós póló", "Póló"], ["Re-Nylon bucket kalap", "Sapka"], ["Symbole napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Balenciaga", bg: "#1C1C1C", fg: "#FFFFFF", termekek: [
    ["Triple S sneaker", "Cipő"], ["Track sneaker", "Cipő"], ["Speed sneaker", "Cipő"], ["Defender sneaker", "Cipő"],
    ["3XL sneaker", "Cipő"], ["Le Cagole táska", "Táska"], ["Hourglass táska", "Táska"],
    ["Political Campaign póló", "Póló"], ["Oversized logós kapucnis pulóver", "Pulóver"], ["BB baseballsapka", "Sapka"]
  ] },
  { marka: "Dior", bg: "#2B2B2B", fg: "#EDE7DC", termekek: [
    ["B23 High sneaker", "Cipő"], ["B27 sneaker", "Cipő"], ["B30 sneaker", "Cipő"], ["Saddle táska", "Táska"],
    ["Lady Dior táska", "Táska"], ["Book Tote", "Táska"], ["Oblique póló", "Póló"], ["CD Icon kapucnis pulóver", "Pulóver"],
    ["DiorSoLight napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Chanel", bg: "#000000", fg: "#FFFFFF", termekek: [
    ["Classic Flap táska", "Táska"], ["Boy Bag", "Táska"], ["2.55 táska", "Táska"], ["Chanel 22 táska", "Táska"],
    ["Kéttónusú balerina", "Cipő"], ["Tweed kosztümkabát", "Kabát"], ["CC napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Hermès", bg: "#E8711D", fg: "#FFFFFF", termekek: [
    ["Birkin 30 táska", "Táska"], ["Kelly 28 táska", "Táska"], ["Picotin Lock táska", "Táska"],
    ["Constance öv", "Öv"], ["Oran papucs", "Cipő"], ["Bouncing sneaker", "Cipő"], ["Selyemkendő 90", "Sál"]
  ] },
  { marka: "Saint Laurent", bg: "#0B0B0B", fg: "#FFFFFF", termekek: [
    ["Le 5 à 7 táska", "Táska"], ["Loulou táska", "Táska"], ["Kate táska", "Táska"], ["Wyatt Chelsea csizma", "Cipő"],
    ["Court Classic sneaker", "Cipő"], ["Teddy bomberdzseki", "Kabát"], ["SL 276 Mica napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Versace", bg: "#111111", fg: "#D4AF37", termekek: [
    ["Medusa póló", "Póló"], ["Barocco selyeming", "Ing"], ["Chain Reaction sneaker", "Cipő"], ["Medusa öv", "Öv"],
    ["La Medusa táska", "Táska"], ["Medusa napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Fendi", bg: "#C9A96E", fg: "#1A1A1A", termekek: [
    ["Baguette táska", "Táska"], ["Peekaboo táska", "Táska"], ["FF logós öv", "Öv"], ["Flow sneaker", "Cipő"],
    ["FF jacquard pulóver", "Pulóver"]
  ] },
  { marka: "Bottega Veneta", bg: "#2F5D3A", fg: "#F2EEE4", termekek: [
    ["Jodie táska", "Táska"], ["Cassette táska", "Táska"], ["Andiamo táska", "Táska"], ["Puddle csizma", "Cipő"],
    ["Intrecciato pénztárca", "Pénztárca"]
  ] },
  { marka: "Valentino", bg: "#B5121B", fg: "#FFFFFF", termekek: [
    ["Rockstud sneaker", "Cipő"], ["Open sneaker", "Cipő"], ["VLogo öv", "Öv"], ["Rockstud táska", "Táska"]
  ] },
  { marka: "Givenchy", bg: "#161616", fg: "#FFFFFF", termekek: [
    ["4G logós kapucnis pulóver", "Pulóver"], ["Antigona táska", "Táska"], ["City Sport sneaker", "Cipő"]
  ] },
  { marka: "Alexander McQueen", bg: "#1B1B1B", fg: "#FFFFFF", termekek: [
    ["Oversized sneaker", "Cipő"], ["Koponyás sál", "Sál"], ["Logós póló", "Póló"]
  ] },
  { marka: "Burberry", bg: "#8A6D3B", fg: "#F7F1E6", termekek: [
    ["Kensington trench kabát", "Kabát"], ["Chelsea trench kabát", "Kabát"], ["Kockás kasmírsál", "Sál"],
    ["Kockás ing", "Ing"], ["Lovas logós póló", "Póló"], ["Kockás baseballsapka", "Sapka"]
  ] },
  { marka: "Moncler", bg: "#0B2A4A", fg: "#FFFFFF", termekek: [
    ["Maya pehelykabát", "Kabát"], ["Montclar pehelykabát", "Kabát"], ["Grenoble síkabát", "Kabát"],
    ["Pehelymellény", "Kabát"], ["Logós póló", "Póló"], ["Logós sapka", "Sapka"]
  ] },
  { marka: "Stone Island", bg: "#2E2E2E", fg: "#F2C200", termekek: [
    ["Crewneck pulóver", "Pulóver"], ["Kapucnis pulóver", "Pulóver"], ["Overshirt", "Ing"],
    ["Cargo nadrág", "Nadrág"], ["Garment dyed dzseki", "Kabát"], ["Logós póló", "Póló"]
  ] },
  { marka: "Off-White", bg: "#F2F2F2", fg: "#111111", termekek: [
    ["Out Of Office sneaker", "Cipő"], ["Arrow póló", "Póló"], ["Diag kapucnis pulóver", "Pulóver"],
    ["Industrial öv", "Öv"]
  ] },
  { marka: "Supreme", bg: "#DA291C", fg: "#FFFFFF", termekek: [
    ["Box Logo póló", "Póló"], ["Box Logo kapucnis pulóver", "Pulóver"], ["Box Logo beanie", "Sapka"],
    ["Camp Cap", "Sapka"], ["Övtáska", "Táska"]
  ] },
  { marka: "Stüssy", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Basic Stüssy póló", "Póló"], ["8 Ball kapucnis pulóver", "Pulóver"], ["Big Basic bucket kalap", "Sapka"]
  ] },
  { marka: "Carhartt WIP", bg: "#A86B2D", fg: "#FFFFFF", termekek: [
    ["Detroit dzseki", "Kabát"], ["OG Active dzseki", "Kabát"], ["Double Knee nadrág", "Nadrág"],
    ["Single Knee nadrág", "Nadrág"], ["Chase kapucnis pulóver", "Pulóver"], ["Acrylic Watch beanie", "Sapka"],
    ["Pocket póló", "Póló"]
  ] },
  { marka: "The North Face", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["1996 Retro Nuptse pehelykabát", "Kabát"], ["Denali fleece dzseki", "Kabát"], ["McMurdo parka", "Kabát"],
    ["Himalayan Parka", "Kabát"], ["Box NSE póló", "Póló"], ["Drew Peak kapucnis pulóver", "Pulóver"],
    ["Borealis hátizsák", "Táska"], ["Jester hátizsák", "Táska"]
  ] },
  { marka: "Arc'teryx", bg: "#1E1E1E", fg: "#FFFFFF", termekek: [
    ["Beta AR dzseki", "Kabát"], ["Atom kapucnis dzseki", "Kabát"], ["Alpha SV dzseki", "Kabát"],
    ["Mantis 2 övtáska", "Táska"], ["Bird Word beanie", "Sapka"]
  ] },
  { marka: "Patagonia", bg: "#1F3A5F", fg: "#FFFFFF", termekek: [
    ["Retro-X fleece dzseki", "Kabát"], ["Better Sweater pulóver", "Pulóver"], ["Down Sweater pehelykabát", "Kabát"],
    ["P-6 Logo póló", "Póló"], ["Baggies rövidnadrág", "Rövidnadrág"]
  ] },
  { marka: "Columbia", bg: "#1F4E79", fg: "#FFFFFF", termekek: [
    ["Steens Mountain fleece", "Pulóver"], ["Bugaboo síkabát", "Kabát"], ["Newton Ridge túrabakancs", "Cipő"]
  ] },
  { marka: "Ralph Lauren", bg: "#0A2240", fg: "#FFFFFF", termekek: [
    ["Custom Fit piké póló", "Póló"], ["Oxford ing", "Ing"], ["Kábelkötött pulóver", "Pulóver"],
    ["Polo Bear pulóver", "Pulóver"], ["Chino nadrág", "Nadrág"], ["Klasszikus baseballsapka", "Sapka"]
  ] },
  { marka: "Tommy Hilfiger", bg: "#0B2A5B", fg: "#FFFFFF", termekek: [
    ["Flag logós póló", "Póló"], ["Piké póló", "Póló"], ["Oxford ing", "Ing"], ["Flag kapucnis pulóver", "Pulóver"],
    ["Steppelt dzseki", "Kabát"], ["Chino nadrág", "Nadrág"]
  ] },
  { marka: "Lacoste", bg: "#0B5D3B", fg: "#FFFFFF", termekek: [
    ["L.12.12 piké póló", "Póló"], ["Krokodil-logós póló", "Póló"], ["Kapucnis pulóver", "Pulóver"],
    ["Carnaby sneaker", "Cipő"], ["Melegítőnadrág", "Nadrág"]
  ] },
  { marka: "Calvin Klein", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Monogram póló", "Póló"], ["Monogram kapucnis pulóver", "Pulóver"], ["Slim farmer", "Nadrág"],
    ["Bőröv", "Öv"], ["Boxer (3 db)", "Kiegészítő"]
  ] },
  { marka: "Hugo Boss", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Slim fit öltönyzakó", "Kabát"], ["Slim fit ing", "Ing"], ["Logós póló", "Póló"], ["Bőröv", "Öv"],
    ["Gyapjúkabát", "Kabát"]
  ] },
  { marka: "Levi's", bg: "#C41230", fg: "#FFFFFF", termekek: [
    ["501 Original farmer", "Nadrág"], ["511 Slim farmer", "Nadrág"], ["502 Taper farmer", "Nadrág"],
    ["Ribcage farmer", "Nadrág"], ["Trucker farmerdzseki", "Kabát"], ["Housemark logós póló", "Póló"],
    ["Farmer rövidnadrág", "Rövidnadrág"]
  ] },
  { marka: "Zara", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Oversized blézer", "Kabát"], ["Wide leg farmer", "Nadrág"], ["Basic póló", "Póló"], ["Kötött pulóver", "Pulóver"],
    ["Bőrhatású dzseki", "Kabát"], ["Midi ruha", "Ruha"], ["Szatén szoknya", "Szoknya"], ["Lenvászon ing", "Ing"]
  ] },
  { marka: "H&M", bg: "#CC071E", fg: "#FFFFFF", termekek: [
    ["Regular fit póló", "Póló"], ["Relaxed fit kapucnis pulóver", "Pulóver"], ["Slim farmer", "Nadrág"],
    ["Pufidzseki", "Kabát"], ["Kötött ruha", "Ruha"], ["Lenvászon nadrág", "Nadrág"]
  ] },
  { marka: "Uniqlo", bg: "#E60012", fg: "#FFFFFF", termekek: [
    ["Ultra Light Down pehelykabát", "Kabát"], ["Supima pamut póló", "Póló"], ["Heattech aláöltözet", "Felső"],
    ["Oxford ing", "Ing"], ["Kasmír pulóver", "Pulóver"], ["Wide fit farmer", "Nadrág"], ["Félkör táska", "Táska"]
  ] },
  { marka: "Mango", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Gyapjúkabát", "Kabát"], ["Trench kabát", "Kabát"], ["Midi ruha", "Ruha"], ["Straight farmer", "Nadrág"]
  ] },
  { marka: "Massimo Dutti", bg: "#3B3631", fg: "#F2EEE6", termekek: [
    ["Gyapjúkeverék kabát", "Kabát"], ["Lenvászon ing", "Ing"], ["Merinó pulóver", "Pulóver"], ["Chino nadrág", "Nadrág"],
    ["Bőr loafer", "Cipő"]
  ] },
  { marka: "COS", bg: "#E8E4DC", fg: "#1A1A1A", termekek: [
    ["Oversized póló", "Póló"], ["Gyapjú kabát", "Kabát"], ["Wide leg nadrág", "Nadrág"], ["Félkör táska", "Táska"]
  ] },
  { marka: "Pull&Bear", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Baggy farmer", "Nadrág"], ["Grafikás póló", "Póló"], ["Kapucnis pulóver", "Pulóver"]
  ] },
  { marka: "Bershka", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Skater farmer", "Nadrág"], ["Crop top", "Felső"], ["Műbőr dzseki", "Kabát"]
  ] },
  { marka: "Champion", bg: "#0A2342", fg: "#FFFFFF", termekek: [
    ["Reverse Weave kapucnis pulóver", "Pulóver"], ["Script logós póló", "Póló"], ["Melegítőnadrág", "Nadrág"]
  ] },
  { marka: "Fila", bg: "#002D62", fg: "#FFFFFF", termekek: [
    ["Disruptor II", "Cipő"], ["Logós póló", "Póló"], ["Melegítőfelső", "Pulóver"]
  ] },
  { marka: "Ray-Ban", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Wayfarer napszemüveg", "Napszemüveg"], ["Aviator napszemüveg", "Napszemüveg"],
    ["Clubmaster napszemüveg", "Napszemüveg"], ["Round Metal napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Oakley", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Holbrook napszemüveg", "Napszemüveg"], ["Frogskins napszemüveg", "Napszemüveg"], ["Radar EV napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Rolex", bg: "#0B4D2C", fg: "#D8C36A", termekek: [
    ["Submariner", "Óra"], ["Datejust 41", "Óra"], ["Daytona", "Óra"], ["GMT-Master II", "Óra"], ["Oyster Perpetual 41", "Óra"]
  ] },
  { marka: "Omega", bg: "#14213D", fg: "#FFFFFF", termekek: [
    ["Speedmaster Moonwatch", "Óra"], ["Seamaster Diver 300M", "Óra"], ["Constellation", "Óra"]
  ] },
  { marka: "Casio", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["G-Shock GA-2100", "Óra"], ["G-Shock DW-5600", "Óra"], ["F-91W", "Óra"], ["A168 Vintage", "Óra"]
  ] },
  { marka: "Seiko", bg: "#1C2A39", fg: "#FFFFFF", termekek: [
    ["Seiko 5 Sports", "Óra"], ["Prospex búváróra", "Óra"], ["Presage koktélóra", "Óra"]
  ] }
];

// ---------------------------------------------------------------------------
// Bővítés: további márkák. (Új márkát bárhová lehet tenni; a meglévő márkák
// listájának VÉGÉRE kerüljenek az új termékek, hogy a sorszámok ne csússzanak el.)
// ---------------------------------------------------------------------------
window.WARDRO_KATALOGUS = window.WARDRO_KATALOGUS.concat([
  { marka: "Hoka", bg: "#1D3B8B", fg: "#FFFFFF", termekek: [
    ["Clifton 9", "Cipő"], ["Bondi 8", "Cipő"], ["Mafate Speed 2", "Cipő"], ["Speedgoat 6", "Cipő"], ["Ora Recovery papucs", "Cipő"]
  ] },
  { marka: "On", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Cloud 5", "Cipő"], ["Cloudmonster", "Cipő"], ["Cloudnova", "Cipő"], ["Cloudtilt", "Cipő"], ["Cloudswift 3", "Cipő"],
    ["Core póló", "Póló"], ["Weather dzseki", "Kabát"]
  ] },
  { marka: "Saucony", bg: "#E0301E", fg: "#FFFFFF", termekek: [
    ["Shadow 6000", "Cipő"], ["Jazz Original", "Cipő"], ["ProGrid Omni 9", "Cipő"], ["Endorphin Speed 4", "Cipő"]
  ] },
  { marka: "Onitsuka Tiger", bg: "#C8102E", fg: "#F2E3C6", termekek: [
    ["Mexico 66", "Cipő"], ["Mexico 66 SD", "Cipő"], ["Tokuten", "Cipő"], ["Serrano", "Cipő"]
  ] },
  { marka: "Mizuno", bg: "#001E50", fg: "#FFFFFF", termekek: [
    ["Wave Rider 10", "Cipő"], ["Contender", "Cipő"], ["Wave Prophecy", "Cipő"]
  ] },
  { marka: "Skechers", bg: "#00337F", fg: "#FFFFFF", termekek: [
    ["D'Lites", "Cipő"], ["Go Walk 7", "Cipő"], ["Uno", "Cipő"], ["Arch Fit", "Cipő"]
  ] },
  { marka: "Crocs", bg: "#3BAA35", fg: "#FFFFFF", termekek: [
    ["Classic Clog", "Cipő"], ["Classic Lined Clog", "Cipő"], ["Echo Clog", "Cipő"], ["Mega Crush Clog", "Cipő"]
  ] },
  { marka: "Clarks", bg: "#2B2B2B", fg: "#F2E6D0", termekek: [
    ["Wallabee", "Cipő"], ["Desert Boot", "Cipő"], ["Desert Trek", "Cipő"]
  ] },
  { marka: "Red Wing", bg: "#8B1A1A", fg: "#FFFFFF", termekek: [
    ["Iron Ranger bakancs", "Cipő"], ["Classic Moc 875", "Cipő"], ["Blacksmith bakancs", "Cipő"]
  ] },
  { marka: "Under Armour", bg: "#1D1D1D", fg: "#FFFFFF", termekek: [
    ["Tech 2.0 póló", "Póló"], ["Rival fleece kapucnis pulóver", "Pulóver"], ["HeatGear kompressziós felső", "Felső"],
    ["Unstoppable melegítőnadrág", "Nadrág"], ["Charged Assert 10", "Cipő"]
  ] },
  { marka: "Lululemon", bg: "#D31E25", fg: "#FFFFFF", termekek: [
    ["Align leggings", "Nadrág"], ["Define dzseki", "Kabát"], ["Scuba kapucnis pulóver", "Pulóver"], ["ABC nadrág", "Nadrág"],
    ["Everywhere övtáska", "Táska"], ["Metal Vent Tech póló", "Póló"]
  ] },
  { marka: "Gymshark", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Vital Seamless leggings", "Nadrág"], ["Crest póló", "Póló"], ["Crest kapucnis pulóver", "Pulóver"], ["Arrival rövidnadrág", "Rövidnadrág"]
  ] },
  { marka: "Alo Yoga", bg: "#2A2A2A", fg: "#F2EEE6", termekek: [
    ["Airlift leggings", "Nadrág"], ["Accolade kapucnis pulóver", "Pulóver"], ["Airbrush sportmelltartó", "Felső"]
  ] },
  { marka: "Kappa", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Banda melegítőnadrág", "Nadrág"], ["Banda melegítőfelső", "Pulóver"], ["Logós póló", "Póló"]
  ] },
  { marka: "Umbro", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Diamond logós póló", "Póló"], ["Melegítőfelső", "Pulóver"]
  ] },
  { marka: "Canada Goose", bg: "#1C1C1C", fg: "#F2F2F2", termekek: [
    ["Expedition parka", "Kabát"], ["Chilliwack bomber", "Kabát"], ["Crofton pehelykabát", "Kabát"], ["Langford parka", "Kabát"],
    ["Logós beanie", "Sapka"]
  ] },
  { marka: "Barbour", bg: "#2F3B2C", fg: "#E9E1CC", termekek: [
    ["Bedale viaszolt dzseki", "Kabát"], ["Beaufort viaszolt dzseki", "Kabát"], ["Liddesdale steppelt dzseki", "Kabát"]
  ] },
  { marka: "Napapijri", bg: "#0B2C5A", fg: "#FFFFFF", termekek: [
    ["Rainforest anorák", "Kabát"], ["Skidoo anorák", "Kabát"], ["Logós póló", "Póló"]
  ] },
  { marka: "Fred Perry", bg: "#0B3D2E", fg: "#F2E3C6", termekek: [
    ["M12 piké póló", "Póló"], ["M3600 piké póló", "Póló"], ["Harrington dzseki", "Kabát"], ["B721 sneaker", "Cipő"]
  ] },
  { marka: "Diesel", bg: "#C8102E", fg: "#FFFFFF", termekek: [
    ["1DR táska", "Táska"], ["D-Strukt farmer", "Nadrág"], ["Oval D logós póló", "Póló"], ["Oval D öv", "Öv"]
  ] },
  { marka: "G-Star Raw", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["3301 Slim farmer", "Nadrág"], ["Rovic cargo nadrág", "Nadrág"], ["Logós póló", "Póló"]
  ] },
  { marka: "Wrangler", bg: "#003A70", fg: "#FFFFFF", termekek: [
    ["Texas farmer", "Nadrág"], ["Western ing", "Ing"], ["Farmerdzseki", "Kabát"]
  ] },
  { marka: "Lee", bg: "#1E2F5A", fg: "#FFFFFF", termekek: [
    ["Rider farmer", "Nadrág"], ["West farmer", "Nadrág"], ["Farmerdzseki", "Kabát"]
  ] },
  { marka: "Guess", bg: "#111111", fg: "#E9D6B4", termekek: [
    ["Logós póló", "Póló"], ["Noelle táska", "Táska"], ["Logós óra", "Óra"], ["Slim farmer", "Nadrág"]
  ] },
  { marka: "Michael Kors", bg: "#2B2B2B", fg: "#D8C3A5", termekek: [
    ["Jet Set táska", "Táska"], ["Mercer táska", "Táska"], ["Bradshaw óra", "Óra"], ["Jet Set pénztárca", "Pénztárca"]
  ] },
  { marka: "Coach", bg: "#3C2A1E", fg: "#F2E6D0", termekek: [
    ["Tabby táska", "Táska"], ["Brooklyn táska", "Táska"], ["Signature pénztárca", "Pénztárca"], ["C201 sneaker", "Cipő"]
  ] },
  { marka: "Kate Spade", bg: "#111111", fg: "#F7C6CF", termekek: [
    ["Knott táska", "Táska"], ["Spade Flower pénztárca", "Pénztárca"]
  ] },
  { marka: "Tory Burch", bg: "#C9562B", fg: "#FFFFFF", termekek: [
    ["Kira táska", "Táska"], ["Fleming táska", "Táska"], ["Miller szandál", "Cipő"], ["Ballet balerina", "Cipő"]
  ] },
  { marka: "Longchamp", bg: "#1E3A2B", fg: "#F2E6D0", termekek: [
    ["Le Pliage Original táska", "Táska"], ["Le Pliage hátizsák", "Táska"], ["Roseau táska", "Táska"]
  ] },
  { marka: "Marc Jacobs", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["The Tote Bag", "Táska"], ["The Snapshot táska", "Táska"]
  ] },
  { marka: "Goyard", bg: "#2B2B2B", fg: "#E9D6B4", termekek: [
    ["Saint Louis táska", "Táska"], ["Artois táska", "Táska"], ["Saint Sulpice kártyatartó", "Pénztárca"]
  ] },
  { marka: "Celine", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Triomphe táska", "Táska"], ["Luggage táska", "Táska"], ["Triomphe öv", "Öv"], ["Triomphe napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Loewe", bg: "#5A4632", fg: "#F2E6D0", termekek: [
    ["Puzzle táska", "Táska"], ["Flamenco táska", "Táska"], ["Anagram póló", "Póló"], ["Ballet Runner sneaker", "Cipő"]
  ] },
  { marka: "Miu Miu", bg: "#1F2A44", fg: "#F2E6D0", termekek: [
    ["Wander táska", "Táska"], ["Arcadie táska", "Táska"], ["Szatén balerina", "Cipő"], ["Logós baseballsapka", "Sapka"]
  ] },
  { marka: "Jacquemus", bg: "#E9DCC6", fg: "#1A1A1A", termekek: [
    ["Le Chiquito táska", "Táska"], ["Le Bambino táska", "Táska"], ["Le Chapeau Bob", "Sapka"]
  ] },
  { marka: "Acne Studios", bg: "#F2C7D0", fg: "#1A1A1A", termekek: [
    ["Face logós beanie", "Sapka"], ["Rojo farmer", "Nadrág"], ["Gyapjúsál", "Sál"]
  ] },
  { marka: "Ami Paris", bg: "#C8102E", fg: "#FFFFFF", termekek: [
    ["Ami de Coeur póló", "Póló"], ["Ami de Coeur pulóver", "Pulóver"]
  ] },
  { marka: "Maison Margiela", bg: "#F2F2F2", fg: "#1A1A1A", termekek: [
    ["Tabi bakancs", "Cipő"], ["Replica sneaker", "Cipő"], ["5AC táska", "Táska"]
  ] },
  { marka: "Rick Owens", bg: "#111111", fg: "#E6E6E6", termekek: [
    ["Geobasket sneaker", "Cipő"], ["Ramones sneaker", "Cipő"]
  ] },
  { marka: "Amiri", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["MX1 farmer", "Nadrág"], ["Skel Top sneaker", "Cipő"], ["Logós póló", "Póló"]
  ] },
  { marka: "Palm Angels", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Track melegítőfelső", "Pulóver"], ["Track melegítőnadrág", "Nadrág"], ["Logós póló", "Póló"]
  ] },
  { marka: "Essentials", bg: "#C9BBA6", fg: "#1A1A1A", termekek: [
    ["Fear of God Essentials kapucnis pulóver", "Pulóver"], ["Fear of God Essentials melegítőnadrág", "Nadrág"],
    ["Fear of God Essentials póló", "Póló"]
  ] },
  { marka: "Represent", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Owners Club kapucnis pulóver", "Pulóver"], ["Owners Club póló", "Póló"]
  ] },
  { marka: "Corteiz", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Alcatraz kapucnis pulóver", "Pulóver"], ["Alcatraz cargo nadrág", "Nadrág"], ["Alcatraz póló", "Póló"]
  ] },
  { marka: "Trapstar", bg: "#111111", fg: "#E0E0E0", termekek: [
    ["Irongate dzseki", "Kabát"], ["Irongate melegítő szett", "Pulóver"]
  ] },
  { marka: "Palace", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Tri-Ferg póló", "Póló"], ["Tri-Ferg kapucnis pulóver", "Pulóver"]
  ] },
  { marka: "Bape", bg: "#4A5D3A", fg: "#FFFFFF", termekek: [
    ["Shark Full Zip kapucnis pulóver", "Pulóver"], ["Bapesta sneaker", "Cipő"], ["Ape Head póló", "Póló"], ["1st Camo póló", "Póló"]
  ] },
  { marka: "Kith", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Williams kapucnis pulóver", "Pulóver"], ["Box logós póló", "Póló"]
  ] },
  { marka: "Abercrombie & Fitch", bg: "#1B2A3A", fg: "#FFFFFF", termekek: [
    ["Essential póló", "Póló"], ["Curve Love farmer", "Nadrág"], ["Steppelt dzseki", "Kabát"]
  ] },
  { marka: "Hollister", bg: "#1B3A5B", fg: "#FFFFFF", termekek: [
    ["Logós kapucnis pulóver", "Pulóver"], ["Logós póló", "Póló"]
  ] },
  { marka: "Gap", bg: "#002A5C", fg: "#FFFFFF", termekek: [
    ["Logós kapucnis pulóver", "Pulóver"], ["Vintage soft póló", "Póló"], ["Farmerdzseki", "Kabát"]
  ] },
  { marka: "Superdry", bg: "#E05A1E", fg: "#FFFFFF", termekek: [
    ["Vintage logós póló", "Póló"], ["Everest parka", "Kabát"], ["Windcheater dzseki", "Kabát"]
  ] },
  { marka: "Jack & Jones", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Glenn slim farmer", "Nadrág"], ["Basic póló", "Póló"], ["Puffer dzseki", "Kabát"]
  ] },
  { marka: "Weekday", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Galaxy loose farmer", "Nadrág"], ["Oversized póló", "Póló"]
  ] },
  { marka: "Cartier", bg: "#8B0A1A", fg: "#E9D6B4", termekek: [
    ["Tank Must óra", "Óra"], ["Santos de Cartier óra", "Óra"], ["Love karkötő", "Kiegészítő"], ["Juste un Clou karkötő", "Kiegészítő"]
  ] },
  { marka: "TAG Heuer", bg: "#111111", fg: "#E6E6E6", termekek: [
    ["Carrera óra", "Óra"], ["Aquaracer óra", "Óra"], ["Monaco óra", "Óra"]
  ] },
  { marka: "Tissot", bg: "#14213D", fg: "#FFFFFF", termekek: [
    ["PRX óra", "Óra"], ["Le Locle óra", "Óra"], ["Seastar 1000 óra", "Óra"]
  ] },
  { marka: "Swatch", bg: "#E30613", fg: "#FFFFFF", termekek: [
    ["MoonSwatch", "Óra"], ["Big Bold óra", "Óra"]
  ] },
  { marka: "Citizen", bg: "#1A1A1A", fg: "#FFFFFF", termekek: [
    ["Promaster Diver óra", "Óra"], ["Tsuyosa óra", "Óra"]
  ] },
  { marka: "Patek Philippe", bg: "#0E2A47", fg: "#D8C36A", termekek: [
    ["Nautilus óra", "Óra"], ["Calatrava óra", "Óra"]
  ] },
  { marka: "Audemars Piguet", bg: "#1A1A1A", fg: "#D8C36A", termekek: [
    ["Royal Oak óra", "Óra"], ["Royal Oak Offshore óra", "Óra"]
  ] },
  { marka: "Pandora", bg: "#1A1A1A", fg: "#F2D5DC", termekek: [
    ["Moments karkötő", "Kiegészítő"], ["Moments charm", "Kiegészítő"], ["Ezüst gyűrű", "Kiegészítő"]
  ] },
  { marka: "Swarovski", bg: "#14213D", fg: "#FFFFFF", termekek: [
    ["Millenia nyaklánc", "Kiegészítő"], ["Tennis karkötő", "Kiegészítő"]
  ] },
  { marka: "Tiffany & Co.", bg: "#81D8D0", fg: "#1A1A1A", termekek: [
    ["Return to Tiffany karkötő", "Kiegészítő"], ["Tiffany T gyűrű", "Kiegészítő"]
  ] },
  { marka: "Persol", bg: "#2B2B2B", fg: "#E9D6B4", termekek: [
    ["PO0714 napszemüveg", "Napszemüveg"], ["PO3019S napszemüveg", "Napszemüveg"]
  ] },
  { marka: "Gentle Monster", bg: "#111111", fg: "#FFFFFF", termekek: [
    ["Lang napszemüveg", "Napszemüveg"], ["Jennie Kuku napszemüveg", "Napszemüveg"]
  ] }
]);

// meglévő márkák újabb termékei (a listák végére kerülnek)
[
  ["Nike", [["Air Max 1", "Cipő"], ["Air Max Dn", "Cipő"], ["Air Max Plus", "Cipő"], ["Zoom Vomero 5", "Cipő"], ["Air Huarache", "Cipő"],
    ["Air Rift", "Cipő"], ["Calm papucs", "Cipő"], ["ACG Lungs fleece kapucnis pulóver", "Pulóver"], ["Solo Swoosh kapucnis pulóver", "Pulóver"],
    ["Sportswear Phoenix leggings", "Nadrág"], ["Swoosh sportmelltartó", "Felső"], ["Utility edzőtáska", "Táska"]]],
  ["Adidas", [["Adizero SL", "Cipő"], ["Taekwondo", "Cipő"], ["Superstar 82", "Cipő"], ["Campus 80s", "Cipő"], ["Response CL", "Cipő"],
    ["Adilette 22 papucs", "Cipő"], ["Adicolor Classics SST melegítőfelső", "Pulóver"], ["Firebird melegítőfelső", "Pulóver"]]],
  ["New Balance", [["740", "Cipő"], ["1000", "Cipő"], ["204L", "Cipő"], ["480", "Cipő"]]],
  ["Asics", [["Gel-Kayano 30", "Cipő"], ["GT-2160", "Cipő"], ["Gel-Quantum 360", "Cipő"]]],
  ["Puma", [["Mostro", "Cipő"], ["Speedcat Ballet", "Cipő"], ["Avanti", "Cipő"]]],
  ["Jordan", [["Air Jordan 6 Retro", "Cipő"], ["Air Jordan 12 Retro", "Cipő"], ["Air Jordan 1 Low OG", "Cipő"]]],
  ["Louis Vuitton", [["Twist táska", "Táska"], ["Capucines táska", "Táska"], ["Discovery hátizsák", "Táska"], ["Avenue Sling táska", "Táska"]]],
  ["Gucci", [["Horsebit 1955 táska", "Táska"], ["Bamboo 1947 táska", "Táska"], ["Jordaan loafer", "Cipő"], ["Princetown papucs", "Cipő"]]],
  ["Prada", [["Galleria táska", "Táska"], ["Re-Nylon Brique táska", "Táska"], ["Chocolate bőr loafer", "Cipő"]]],
  ["Balenciaga", [["Runner sneaker", "Cipő"], ["Cargo sneaker", "Cipő"], ["City táska", "Táska"]]],
  ["Dior", [["Dior Oblique Saddle övtáska", "Táska"], ["Lady D-Joy táska", "Táska"]]],
  ["Moncler", [["Maire pehelykabát", "Kabát"], ["Cardere pehelykabát", "Kabát"]]],
  ["The North Face", [["Nuptse pehelymellény", "Kabát"], ["Base Camp Duffel táska", "Táska"], ["Glacier fleece", "Pulóver"]]],
  ["Zara", [["Gyapjú kabát", "Kabát"], ["Kötött kardigán", "Pulóver"], ["Bőrhatású nadrág", "Nadrág"]]],
  ["Uniqlo", [["Fleece dzseki", "Kabát"], ["Airism póló", "Póló"]]],
  ["Ralph Lauren", [["Harrington dzseki", "Kabát"], ["Rugby póló", "Póló"]]],
  ["Rolex", [["Explorer", "Óra"], ["Sea-Dweller", "Óra"]]],
  ["Casio", [["G-Shock GA-B2100", "Óra"], ["Vintage A1000", "Óra"]]],
].forEach(([marka, uj]) => {
  const b = window.WARDRO_KATALOGUS.find((x) => x.marka === marka);
  if (b) b.termekek.push(...uj);
});

// ---------------------------------------------------------------------------
// Női alapdarabok: márka nélküli darabok típusonként (legalább 220 / típus).
// Szín × anyag × fazon kombinációiból áll össze, determinisztikusan (mindig
// ugyanabban a sorrendben), így a sorszámok – és a "Hozzáadva" jelölések –
// nem csúsznak el. A kártya háttere a darab saját színe.
// ---------------------------------------------------------------------------
(function () {
  const SZINEK = [
    ['Fekete', '#1C1C1E', '#F4F4F5'], ['Fehér', '#F3F1EC', '#1C1C1E'], ['Krémszínű', '#EDE3D1', '#2A2520'], ['Bézs', '#D9C3A5', '#2A2520'],
    ['Teveszínű', '#B98A5A', '#FFFFFF'], ['Csokibarna', '#5A3A28', '#F5EDE6'], ['Szürke', '#8E9096', '#FFFFFF'], ['Grafit', '#3B3D42', '#F1F1F2'],
    ['Sötétkék', '#1F2B4A', '#EEF2FA'], ['Égkék', '#8CB9E3', '#16263A'], ['Púder', '#E8BFC0', '#3A2023'], ['Rózsaszín', '#E58FAE', '#2E1220'],
    ['Piros', '#C8243A', '#FFFFFF'], ['Bordó', '#6E1E2E', '#F8E8EB'], ['Olívazöld', '#6B6B3A', '#FFFFFF'], ['Smaragdzöld', '#1F7A5A', '#FFFFFF'],
    ['Mentazöld', '#9ED9C3', '#123328'], ['Levendula', '#B9A6E0', '#22183A'], ['Mustársárga', '#D9A62B', '#2A1F05'], ['Terrakotta', '#C1643F', '#FFFFFF'],
  ];
  // típus → [főnév, anyagok, fazonok]
  const TIPUSOK = [
    ['Top', 'top', ['pamut', 'szatén', 'bordázott', 'kötött', 'csipkés', 'selyemhatású', 'vászon', 'hálós', 'flitteres', 'muszlin', 'lyocell'],
      ['crop', 'pántos', 'spagettipántos', 'korzett', 'egyvállas', 'halter', 'vállra ejtett', 'drapírozott', 'masnis', 'fodros', 'bandeau', 'peplum']],
    ['Body', 'body', ['bordázott', 'pamut', 'csipke', 'szatén', 'hálós', 'modál', 'kötött', 'bársony', 'mikroszálas', 'jersey', 'viszkóz'],
      ['hosszú ujjú', 'rövid ujjú', 'ujjatlan', 'garbós', 'kivágott hátú', 'V-nyakú', 'karéjnyakú', 'egyvállas', 'átlapolt', 'pántos', 'magas nyakú', 'szögletes nyakú']],
    ['Blúz', 'blúz', ['selyem', 'sifon', 'pamut', 'viszkóz', 'len', 'krepp', 'szatén', 'muszlin', 'popelin', 'csipke', 'organza'],
      ['masnis nyakú', 'puffos ujjú', 'fodros', 'átlapolt', 'ingblúz', 'kimonó ujjú', 'gallérnélküli', 'magas gallérú', 'hímzett', 'pöttyös', 'csíkos', 'virágmintás']],
    ['Szoknya', 'szoknya', ['szatén', 'pamut', 'vászon', 'kötött', 'bőrhatású', 'farmer', 'tweed', 'csipke', 'sifon', 'kord', 'gyapjú', 'viszkóz'],
      ['midi', 'mini', 'maxi', 'A-vonalú', 'ceruza', 'rakott', 'pliszírozott', 'harang', 'slip', 'átlapolt', 'sellő', 'gombos', 'tüll', 'aszimmetrikus']],
    ['Ruha', 'ruha', ['szatén', 'pamut', 'len', 'kötött', 'sifon', 'viszkóz', 'krepp', 'csipke', 'bársony', 'muszlin', 'jersey'],
      ['midi', 'maxi', 'mini', 'kombiné', 'ingruha', 'átlapolt', 'pántos', 'kisestélyi', 'koktél', 'nyári', 'garbóruha', 'pulóverruha', 'A-vonalú', 'testhezálló']],
    ['Overál', 'overál', ['len', 'pamut', 'farmer', 'krepp', 'szatén', 'viszkóz', 'vászon', 'jersey', 'kord', 'sifon', 'lyocell'],
      ['széles szárú', 'pántos', 'ujjatlan', 'átlapolt', 'övvel kötős', 'rövid', 'elegáns', 'cargo', 'kantáros', 'egyvállas', 'gombos', 'nyári']],
    ['Kardigán', 'kardigán', ['kasmír', 'gyapjú', 'merinó', 'pamut', 'moher', 'alpaka', 'bordázott', 'csavart kötésű', 'angóra', 'viszkóz', 'akril'],
      ['crop', 'hosszú', 'oversize', 'gombos', 'V-nyakú', 'övvel kötős', 'kapucnis', 'zsebes', 'rövid', 'karcsúsított', 'nagy kötésű', 'cipzáras']],
    ['Leggings', 'leggings', ['bordázott', 'bőrhatású', 'pamut', 'sport', 'termó', 'bársony', 'szatén', 'csillogó', 'mikroszálas', 'modál', 'kompressziós'],
      ['magas derekú', 'bokáig érő', '7/8-os', 'talpas', 'trapéz', 'push-up', 'zsebes', 'varrás nélküli', 'hasított', 'flare', 'jóga', 'rövid']],
    ['Sál', 'sál', ['kasmír', 'gyapjú', 'selyem', 'pamut', 'len', 'moher', 'merinó', 'viszkóz', 'sifon', 'alpaka', 'bordázott'],
      ['kockás', 'csíkos', 'rojtos', 'oversize', 'végtelenített', 'hosszú', 'kötött', 'egyszínű', 'pléd', 'pöttyös', 'mintás', 'vékony']],
    ['Kendő', 'kendő', ['selyem', 'szatén', 'pamut', 'sifon', 'viszkóz', 'len', 'muszlin', 'kasmír', 'modál', 'gyapjú', 'bambusz'],
      ['nyakba köthető', 'hajkendő', 'négyzet alakú', 'láncmintás', 'paisley mintás', 'pöttyös', 'virágmintás', 'csíkos', 'kockás', 'geometrikus mintás', 'rojtos', 'bandana']],
    ['Ékszer', 'ékszer', ['arany', 'ezüst', 'rozéarany', 'gyöngy', 'acél', 'aranyozott', 'zománcos', 'kristály', 'gyöngyház', 'bőr', 'fa'],
      ['karika fülbevaló', 'beszúrós fülbevaló', 'lógó fülbevaló', 'vékony nyaklánc', 'medálos nyaklánc', 'karkötő', 'karperec', 'gyűrű', 'pecsétgyűrű', 'bokalánc', 'brosstű', 'hajcsat']],
    ['Női cipő', 'cipő', ['bőr', 'velúr', 'lakk', 'szatén', 'vászon', 'műbőr', 'kötött', 'nubuk', 'parafa', 'bársony', 'gumi'],
      ['balerina', 'magassarkú', 'tűsarkú', 'blokksarkú', 'slingback', 'Mary Jane', 'papucs', 'szandál', 'bokacsizma', 'térdcsizma', 'platform', 'loafer', 'espadrille']],
  ];
  // az ékszereknél szín helyett díszítő jelző áll, a kártya színe a fémhez igazodik
  const DISZEK = [
    ['Minimalista', '#C9A24A', '#1E1606'], ['Cirkóniaköves', '#B8BCC6', '#14161B'], ['Gyöngyös', '#EDE6DA', '#2A2520'], ['Csavart', '#C9A24A', '#1E1606'],
    ['Kalapált', '#B98A5A', '#FFFFFF'], ['Vastag', '#C9A24A', '#1E1606'], ['Vékony', '#D8D3CA', '#2A2520'], ['Geometrikus', '#8E9096', '#FFFFFF'],
    ['Szív alakú', '#E8BFC0', '#3A2023'], ['Csillagos', '#2B2F45', '#F4E7B5'], ['Virágos', '#E58FAE', '#2E1220'], ['Holdas', '#1F2B4A', '#EEF2FA'],
    ['Kristályos', '#9ED9C3', '#123328'], ['Vintage', '#8A6A3A', '#FFFFFF'], ['Bohém', '#C1643F', '#FFFFFF'], ['Elegáns', '#1C1C1E', '#E9D9A6'],
    ['Láncos', '#B8BCC6', '#14161B'], ['Kagylós', '#F3F1EC', '#1C1C1E'], ['Medálos', '#C9A24A', '#1E1606'], ['Ikonikus', '#6E1E2E', '#F8E8EB'],
  ];
  const KESZ_NEV = /fülbevaló|nyaklánc|karkötő|karperec|gyűrű|bokalánc|brosstű|hajcsat|ingruha|garbóruha|pulóverruha|hajkendő|bandana|ingblúz|szandál|papucs|bokacsizma|térdcsizma|espadrille|loafer/;
  const DB = 220;
  const ujMarka = { marka: 'Női alapdarabok', bg: '#3A2A33', fg: '#FFFFFF', generikus: true, termekek: [] };
  TIPUSOK.forEach(([tipus, fonev, anyagok, fazonok]) => {
    const latott = new Set();
    let k = 0;
    while (latott.size < DB && k < 20000) {
      const fz = fazonok[k % fazonok.length];
      const an = anyagok[(k * 3 + Math.floor(k / fazonok.length)) % anyagok.length];
      const jelzok = tipus === 'Ékszer' ? DISZEK : SZINEK;
      const sz = jelzok[(k * 7 + Math.floor(k / (fazonok.length * anyagok.length))) % jelzok.length];
      k++;
      // pl. "Fekete szatén midi szoknya"; ha a fazon már tartalmazza a főnevet, nem ismételjük
      const vege = fz.split(' ').pop();
      const nev = sz[0] + ' ' + an + ' ' + fz + (vege === fonev || KESZ_NEV.test(fz) ? '' : ' ' + fonev);
      if (latott.has(nev)) continue;
      latott.add(nev);
      ujMarka.termekek.push([nev, tipus, sz[1], sz[2]]);
    }
  });
  window.WARDRO_KATALOGUS.push(ujMarka);
})();
