-- V2__seed_data.sql
-- Seed initial catalog, boxes, products, hampers, reviews, and test accounts

-- Seed Users (password is 'password123' hashed with BCrypt)
-- Hash: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
IF NOT EXISTS (SELECT * FROM users WHERE username = 'demo_user')
BEGIN
    INSERT INTO users (username, email, password_hash, full_name, phone, role, created_at, updated_at)
    VALUES 
    ('demo_user', 'demo@giftedit.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ananya Sharma', '+91 9876543210', 'ROLE_USER', GETDATE(), GETDATE()),
    ('admin', 'admin@giftedit.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Atelier Curator', '+91 9876543211', 'ROLE_ADMIN', GETDATE(), GETDATE());
END;

-- Seed Keepsake Boxes
IF NOT EXISTS (SELECT * FROM box_options WHERE name = 'The Petite Keepsake')
BEGIN
    INSERT INTO box_options (name, subtitle, description, price, capacity, image_url, is_bestseller, is_active)
    VALUES
    ('The Petite Keepsake', 'Blush Pink Millboard', 'Rigid Blush Pink, satin inner cord, gold wax monogram seal.', 599.00, 4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuApFFCHMUXeUv2B9rmBKwG2Oz_cHOlSyfSswXs8Zyx-olAlqOKm1VlgZHtHG3GCcJFCXop7urYmVAuhvt7VkEsgdbtj1toNx7G62snGiij4SlevIb7qexCJIsfT5-dZYEAhqVrAXr96pxUa1DRRNXGqKFkHuzdVGjIBz1VHd5101IRcADCzimuA7S1gefsocfZJwR45spHkAtymZ9nhPCn-NDTmENBnFbptFiEfWX0uFF_Xyoi6QiSgCQ', 0, 1),
    ('The Heritage Classic', 'Ivory Woven Linen', 'Ivory textured woven linen with magnetic lid closure.', 899.00, 6, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv7d6piS698GlB4RnK3Lqee7pxK7jrnV1GZoLwzj39hKY9dJ6bASRwLGehomkrSdJ0unrdDuJA_aRYWaC-spZrQRBn-_SVwRDimeqz5ivN-ZRmZhGZpeTMgYDZIjDXo1oXBwxdqi8C9KoWIaTXkulckQeBkQBpBnB3TJ132RNsIhkaByM9dUKdOguQWxQWPRvqteQxapr_ac43nzIYEoXn3N1TepV7kqAudFSbzZ3lPKtISIR7_Qnt7A', 0, 1),
    ('The Grand Luxury Trunk', 'Wine Velvet & Brass Lock', 'Deep wine velvet touch finish with antiqued brass latch & corner guards.', 1299.00, 8, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8rYyuBgkt3NzqvI09voYrR9rIWfAJkuxC6zC0U3dhemQfyPGqyss5xeEEbsGB_Z626be4Pd5A7HEVSzWdZa10gNhE3fbxq9IuEWNe-eob1_bYqAVd32cIONXeH3vnXEDQRIe6HCa4cZ2aXGvoZ03y1AoGaRqSqS78tJVT0pAQw_4Kh2W0E_BeUFUOTZ9GNNwaWxwkwl2M28X_3NOQU12l9ZREXQV5nhkayJ2z7HHiIJyQvbXxHaWz3g', 1, 1),
    ('The Imperial Hamper Casket', 'Solid Reclaimed Pine Wood', 'Handcrafted reclaimed pine wood with royal gold-foil monogram.', 1799.00, 12, 'https://lh3.googleusercontent.com/aida-public/AB6AXuADhih6ec4Z-9axIBoZGzdCBt8qNdYBXERSODdB6zbEaLcrTOXMD_dUlo5ocVBFvFKMzGaxV_Wirg_P_BiCPbPDumMmOncwiaadzBKe9geXkPl6Lk4MHhiQL-80gHA63QCXOPCpMot-7xxwNT7tb11a3ET7Ig_1qwmIIDG4Rrq2vj5y1mynr7rwcC0dv3S6TiIgmtrNpIY0BXheWGY2kfI7wfiuuWutA5Dh-PWHIkLkNzGwD30DCDLmmQ', 0, 1);
END;

-- Seed Products (Delicacies & Keepsakes)
IF NOT EXISTS (SELECT * FROM products WHERE name = 'Single-Origin Dark Chocolate Bar')
BEGIN
    INSERT INTO products (name, category, description, price, image_url, stock_quantity, is_luxury, is_active)
    VALUES
    ('Single-Origin Dark Chocolate Bar', 'Chocolates', '70% Idukki Cacao with candied orange peel.', 350.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj5YJvAIXwj6cJX_oaPI2IwAZP1akuuEewMWZZF3H-A5pNAepct1Cpv6c_16wez4agBz38x7QwBfAt2ru7UTLvEzzcLKJXUwaEPB6mTZB9EkjjgHZ4CLKMKiVs6ORI_Y71II_rpMKVwQJH4Y6UYjouzISEtIlh0YOtmE99j4t70VrUJMH2pNqku-d4KC5VkzXArJdbYnubmt-hvkPdaZTOs2TsvkK0ht4Az7Y9AfC4I_ZptHCKkthNtQ', 150, 0, 1),
    ('Amber Frosted Soy Wax Candle', 'Candles', 'Smoked oud, cedarwood & warm tonka bean.', 599.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5OfCrJc3ThpMxMKDmtDWXGZqAnzrsQEinCy301b7UZqppy1_mLTPe2_2RDoHwnqilVGuz1n0Bmgai-W_fEXAaTOW5NC2g364ODPWH3EAkglkdaBB3yK7rICJPleaW9wm7ImiJ9U7kwL3zFIFGr38MDFSgrKPOsfMAQaGzF9I8nZ-voq1JF4rCi8W9L1snEA2T_H7A6KmLO8JXgwkT7VYeg1u5O8IsRsY44REVmUngVX99W64vyvSv6g', 80, 0, 1),
    ('Brass Infuser Tea Tin', 'Coffee & Tea', 'Kashmiri Kahwa blend with saffron threads.', 450.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4AuDsd4ivo6rlNSRq-TJOHEwXJt-L5Un0_bzIoPqY8oWhDSPY2C6RDvq1wxZJHmNtahUd4LmQyVwa_m7qvYpESc-Khj_inIMh8bZeFDD2MPUMHG0NMcDi5fKsA1DXeAfRWr_muKo4_-m6ApUx-cEt5YVxPqJJmk3LSkWMszbvCgnhuCFRjAXlxsbhIy-XphIop5ZfFlFvuZtTxegV3cWwyXvuF2AWQEAd1glTHw9n4qMjxuGOwVQRUg', 95, 0, 1),
    ('Rose Water & Botanical Mist', 'Skincare', 'Steam-distilled Kannauj damask rose water.', 420.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhNGjOUJYRQEY_hNDZOLvn30zZXuVvdGSq_d-SiiwtLJuzvWlldB2D3zGIFDb0N7-XcdJvtD3fEfeFBbruCtKlnTlqyl_VURQafGCKHldIIMqJit7tKooijL0KwTUyLY_axOGQnvkgEUVwhUlFilGO85tp3RhOaan7vFjAQZjzMnQU8mARw7zWm9y902EiGJlbxJUEkqAofgFdzBwExNos9zfMTPB_7G81XgXElqfjKTka-Hb0F0GAUw', 110, 0, 1),
    ('Artisanal Almond Brittle', 'Chocolates', 'Slow-roasted Californian almonds in butter toffee.', 380.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8HGyqJeU_CgZT2BLDAKgqW2DFH9fSCyHWz6YeNXtI4B8tiLqO4FycNhLkKu1KlEPKbuWDgMSL-ANX0IBLpauq71UNGozQ8O5PJgNCJCBcgP06kp7YuTSqCtPeTZqyNwe3zhru3S6f00aik-lHVU2DidEVuFYct7D3fSCREpf3macBf0F7NW10p3bawagtr8bQs5azk3TRZbdKUTdparQkKnF1A3NHRZEZsthvXlPDs_su2beqySRK7Q', 70, 0, 1),
    ('French Roast Ground Coffee', 'Coffee & Tea', 'Chikmagalur estate micro-lot 100% Arabica.', 490.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW4anQcH1oVDOaAJxgF4u-qSmaNbUudNi7lztZW_LHfWno47MviuXSx5u1Pv4YxPiPz-BLboSoE-77XTKTjokFOuZvNDvwmAA-8wrU8hoj40f12IcpPGFBVfHWua0ucb_ArGUSWEFEg8lfoDaeiSCVcs1fABh8H77JrQPYCkWqF5ytsvcx5F7NS9HlI7FEIj3qQUIWOjR4gJuvbO0SkbtE2BTJIAnIFEEYxX_u1NYX4ZsdrrSn_EiCWg', 60, 0, 1),
    ('Ceramic Stoneware Mug', 'Mugs & Glassware', 'Wheel-thrown studio pottery with ribbed handle.', 520.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8HDe0J3J8S4luK6sCN0YdjI0DvRIzKnzPT6XEDWe8bUHmKxm8H3XgJjOHj2Tm_wFYv38jFJ5KMVBWnKpHmSzJm6AenY4g1_-ejxaTwk9-pgC9uqwZndcBPXNudg69jGfTPd6gM2nl51ZR0BdHgRf_Yq-7Y8vjL9uYWX_qSScqmhCAc9zZIsOcFvC4C3yHeNrsNLzlHiRpAKeezD_PhdtkZPeSpao07_ZJpl2Am57W0ANQoBhXEqk7fA', 45, 0, 1),
    ('24k Gold Flaked Truffles', 'Chocolates', 'Belgian ganache infused with saffron & cardamom.', 650.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgyxU7NBJkbtxy2PYe04bErM9QybpQ7G7DaU6SzSgO202MCn6Y0_EnKx24holZUWlVvX-5Zcjl5dZzZpcx-SED2lzMqCt_3HmfkorGu4hCURfZ66dZg_7-GQnO96fJ_y5ikfJwaDzR45VwKkNUaa3wQVnNzgF2qDsAEQPgxRKNMmaz85Me7Ci3YBfvsNl4zQkFvbHIBetvtai5oLdgUxJaaQ3vcHeVATT2O8xzGpMySliEMb7LG-gSzQ', 50, 1, 1),
    ('Handcrafted Brass Bookmark', 'Accessories & Trinkets', 'Etched royal motif with pure silk wine tassel.', 280.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2yzWPv5z5A4HxEpZ-_9MAYKtbGMEB5nTn3WnDspdtNhBOptpRi5T0wlfbLdsofbgV9oHpbDIDRJGce13OBI0Wv2ksF76ts88WXy13S_9AF-w3uAFvW1lyPA6uJb2MaRgR7-GnD75Cn4sg_D4Woh3NsCDaVbjmV7_olLgkceB1pqeAFaTdSAH6ZrmPBP-qNrgIy0nyi3fkPs1oHUhwmjdQ67q-z0wjAp3QOW6JcWOOyS735Pz3UytWHw', 120, 0, 1);
END;

-- Seed Ready-Made Bestselling Hampers
IF NOT EXISTS (SELECT * FROM hampers WHERE title = 'The Royal Marwar Hamper')
BEGIN
    INSERT INTO hampers (title, subtitle, description, occasion, category, price, original_price, rating, reviews_count, image_url, badge, is_active)
    VALUES
    ('The Royal Marwar Hamper', 'Saffron & Heritage Confections', 'A magnificent velvet trunk containing single-origin Kashmiri saffron, roasted dry fruits, brass tea tins, and hand-poured candle.', 'festive', 'Festive Edit', 4299.00, 4899.00, 4.95, 128, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMAdJy-oni6PRYsnCmUCJT3HJOgWPZLRCAWibrT2HaDasVWD6QwNxvVG_ofuPJFQg-r4SW7TA9BGhT4AI0FLJeBqrxJ1Kit3bUh6jpJqzgJFv9YBMfpr6Nv1_DzbjagiWfmyF-xU2x5LiCqZVuY_dPViaGrBfZb_tUe-adxRKOJS5HXL7nsogPpJWmKtsS0grMmOfd9Mr9Cuaqo62keiR9S0Y7drMAKQJiAccElKxKPU79EjCQunO3DA', 'Bestseller', 1),
    ('The Gulab & Saffron Trousseau', 'Royal Wedding Keepsake', 'Opulent Indian royal wedding trousseau hamper presented in an embroidered raw silk box with brass incense burners and scented mists.', 'wedding', 'Wedding Edit', 5499.00, 6200.00, 4.98, 86, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWUDi_b-RY8q7SOJlGpQ6NThqBYb6zN3w8xzrC2ZJbe-HlA0kBZrL82NNDKqf-QFdg9VjLcLwcQiiD7Hyd9ZIKbILQ87wyCM252-koPWv9Ow036zpHK7HWIBgORwsDPAcdPf3tV1AUKy9mnJgfpjPAAwAVcVIjZ4GsXW7oGoVXfRa040nFiheHXTJ9A9Q0CEKyXzv-k6CJ4yDEzPtZfaqIJ3EGgnS1JaW5qOpBFEipy9qqIVMVGo7mFQ', 'Trending', 1),
    ('The Connoisseur''s Coffee Trunk', 'Artisanal Single-Estate Roast', 'Curated for the coffee purist: Chikmagalur micro-lot beans, artisan French press, chocolate bark, and stone-washed mug.', 'corporate', 'Corporate Honors', 3699.00, 4199.00, 4.88, 64, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW4anQcH1oVDOaAJxgF4u-qSmaNbUudNi7lztZW_LHfWno47MviuXSx5u1Pv4YxPiPz-BLboSoE-77XTKTjokFOuZvNDvwmAA-8wrU8hoj40f12IcpPGFBVfHWua0ucb_ArGUSWEFEg8lfoDaeiSCVcs1fABh8H77JrQPYCkWqF5ytsvcx5F7NS9HlI7FEIj3qQUIWOjR4gJuvbO0SkbtE2BTJIAnIFEEYxX_u1NYX4ZsdrrSn_EiCWg', 'Popular', 1),
    ('The Festivity & Diya Edit', 'Handcrafted Brass & Dryfruits', 'Pure brass handcrafted diyas, artisanal Mamra almonds, Iranian pistachios, and Belgian dark chocolate gold pralines.', 'festive', 'Diwali Special', 3899.00, 4499.00, 4.92, 114, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgyxU7NBJkbtxy2PYe04bErM9QybpQ7G7DaU6SzSgO202MCn6Y0_EnKx24holZUWlVvX-5Zcjl5dZzZpcx-SED2lzMqCt_3HmfkorGu4hCURfZ66dZg_7-GQnO96fJ_y5ikfJwaDzR45VwKkNUaa3wQVnNzgF2qDsAEQPgxRKNMmaz85Me7Ci3YBfvsNl4zQkFvbHIBetvtai5oLdgUxJaaQ3vcHeVATT2O8xzGpMySliEMb7LG-gSzQ', 'Limited Edition', 1),
    ('The Ivory Wellness Oasis', 'Holistic Ayurvedic Spa Set', 'Steam-distilled rose water, calming bath salts, sandalwood body butter, and a soothing brass meditation bell.', 'wellness', 'Self-Care Ritual', 2999.00, 3499.00, 4.90, 72, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhNGjOUJYRQEY_hNDZOLvn30zZXuVvdGSq_d-SiiwtLJuzvWlldB2D3zGIFDb0N7-XcdJvtD3fEfeFBbruCtKlnTlqyl_VURQafGCKHldIIMqJit7tKooijL0KwTUyLY_axOGQnvkgEUVwhUlFilGO85tp3RhOaan7vFjAQZjzMnQU8mARw7zWm9y902EiGJlbxJUEkqAofgFdzBwExNos9zfMTPB_7G81XgXElqfjKTka-Hb0F0GAUw', 'Top Rated', 1),
    ('The Executive Suite Chest', 'Distinguished Gifting', 'Italian leather desk accessory, 24k gold leaf bookmark, single-origin dark chocolate, and monogrammed notebook.', 'corporate', 'Corporate Honors', 4899.00, 5499.00, 4.96, 91, 'https://lh3.googleusercontent.com/aida-public/AB6AXuADhih6ec4Z-9axIBoZGzdCBt8qNdYBXERSODdB6zbEaLcrTOXMD_dUlo5ocVBFvFKMzGaxV_Wirg_P_BiCPbPDumMmOncwiaadzBKe9geXkPl6Lk4MHhiQL-80gHA63QCXOPCpMot-7xxwNT7tb11a3ET7Ig_1qwmIIDG4Rrq2vj5y1mynr7rwcC0dv3S6TiIgmtrNpIY0BXheWGY2kfI7wfiuuWutA5Dh-PWHIkLkNzGwD30DCDLmmQ', 'Bespoke', 1);
END;

-- Seed Customer Reviews
IF NOT EXISTS (SELECT * FROM reviews WHERE author_name = 'Radhika Singhania')
BEGIN
    INSERT INTO reviews (author_name, rating, title, content, location, verified_buyer, created_at)
    VALUES
    ('Radhika Singhania', 5, 'Exceptional craftsmanship and royal presentation', 'Ordered three customized trunks for our leadership retreat. The attention to detail from the wax-sealed greeting cards to the velvet lining was nothing short of regal.', 'Mumbai', 1, GETDATE()),
    ('Devendra Rathore', 5, 'Unmatched luxury gifting experience', 'The interactive builder let me customize every single confectionery and ribbon. My sister was spellbound when she unboxed the grand wine trunk on her wedding day.', 'Jaipur', 1, GETDATE()),
    ('Meera Venkatesh', 5, 'Pristine transit and timeless aroma', 'Shipped all the way to Bengaluru without a single scratch. The amber candle aroma greeted me the moment I lifted the lid. The Gift Edit is our forever gifting partner.', 'Bengaluru', 1, GETDATE());
END;
