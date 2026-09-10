-- V3__add_products_and_occasions.sql
-- Add occasion tagging to products, included_products to hampers, and seed rich occasion-specific gifts

-- 1. Alter products table if column doesn't exist
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('products') AND name = 'occasion'
)
BEGIN
    ALTER TABLE products ADD occasion NVARCHAR(255) NULL;
END;
GO

-- 2. Alter hampers table if column doesn't exist
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('hampers') AND name = 'included_products'
)
BEGIN
    ALTER TABLE hampers ADD included_products NVARCHAR(1000) NULL;
END;
GO

-- 3. Update existing products with occasion tags
UPDATE products SET occasion = 'corporate,birthday,anniversary' WHERE name = 'Single-Origin Dark Chocolate Bar';
UPDATE products SET occasion = 'festive,wellness,anniversary' WHERE name = 'Amber Frosted Soy Wax Candle';
UPDATE products SET occasion = 'festive,wedding,wellness' WHERE name = 'Brass Infuser Tea Tin';
UPDATE products SET occasion = 'wedding,wellness,anniversary' WHERE name = 'Rose Water & Botanical Mist';
UPDATE products SET occasion = 'festive,birthday,corporate' WHERE name = 'Artisanal Almond Brittle';
UPDATE products SET occasion = 'corporate,birthday' WHERE name = 'French Roast Ground Coffee';
UPDATE products SET occasion = 'corporate,birthday,wellness' WHERE name = 'Ceramic Stoneware Mug';
UPDATE products SET occasion = 'wedding,festive,birthday,anniversary' WHERE name = '24k Gold Flaked Truffles';
UPDATE products SET occasion = 'corporate,wedding,anniversary' WHERE name = 'Handcrafted Brass Bookmark';
GO

-- 4. Update existing hampers with detailed included_products descriptions
UPDATE hampers SET included_products = 'Single-Origin Kashmiri Saffron (5g), Roasted Dry Fruits Trio, Brass Infuser Tea Tin, Amber Soy Wax Candle' WHERE title = 'The Royal Marwar Hamper';
UPDATE hampers SET included_products = '24k Gold Flaked Truffles, Steam-Distilled Rose Water Mist, Handcrafted Brass Incense Diya, Silk Ribbon Keepsake' WHERE title = 'The Gulab & Saffron Trousseau';
UPDATE hampers SET included_products = 'French Roast Ground Coffee, Ceramic Stoneware Mug, Single-Origin Dark Chocolate Bar, Handcrafted Brass Bookmark' WHERE title = 'The Connoisseur''s Coffee Trunk';
UPDATE hampers SET included_products = 'Handcrafted Peacock Brass Diya, Roasted Mamra Almonds & Pistachios, 24k Gold Flaked Truffles, Amber Soy Candle' WHERE title = 'The Festivity & Diya Edit';
UPDATE hampers SET included_products = 'Rose Water & Botanical Mist, Amber Frosted Soy Wax Candle, Ayurvedic Sandalwood Bath Salts, Brass Meditation Bell' WHERE title = 'The Ivory Wellness Oasis';
UPDATE hampers SET included_products = 'Full-Grain Leather Executive Desk Journal, 24k Gold Flaked Truffles, French Roast Ground Coffee, Ceramic Mug' WHERE title = 'The Executive Suite Chest';
GO

-- 5. Seed New Occasion-Specific Delicacies & Keepsakes
IF NOT EXISTS (SELECT * FROM products WHERE name = 'Royal Meenakari Silver Keepsake Coin')
BEGIN
    INSERT INTO products (name, category, description, price, image_url, stock_quantity, is_luxury, is_active, occasion)
    VALUES
    -- Wedding Gifts
    ('Royal Meenakari Silver Keepsake Coin', 'Accessories & Trinkets', 'Pure 999 silver 10g coin with hand-painted royal peacocks and blessings.', 1450.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8rYyuBgkt3NzqvI09voYrR9rIWfAJkuxC6zC0U3dhemQfyPGqyss5xeEEbsGB_Z626be4Pd5A7HEVSzWdZa10gNhE3fbxq9IuEWNe-eob1_bYqAVd32cIONXeH3vnXEDQRIe6HCa4cZ2aXGvoZ03y1AoGaRqSqS78tJVT0pAQw_4Kh2W0E_BeUFUOTZ9GNNwaWxwkwl2M28X_3NOQU12l9ZREXQV5nhkayJ2z7HHiIJyQvbXxHaWz3g', 50, 1, 1, 'wedding,anniversary'),
    ('Pure Kashmiri Mogra Saffron (5g)', 'Coffee & Tea', 'Grade-A royal red stigma threads from Pampore valley in a carved brass vial.', 1850.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4AuDsd4ivo6rlNSRq-TJOHEwXJt-L5Un0_bzIoPqY8oWhDSPY2C6RDvq1wxZJHmNtahUd4LmQyVwa_m7qvYpESc-Khj_inIMh8bZeFDD2MPUMHG0NMcDi5fKsA1DXeAfRWr_muKo4_-m6ApUx-cEt5YVxPqJJmk3LSkWMszbvCgnhuCFRjAXlxsbhIy-XphIop5ZfFlFvuZtTxegV3cWwyXvuF2AWQEAd1glTHw9n4qMjxuGOwVQRUg', 40, 1, 1, 'wedding,festive'),
    ('Sandalwood & Jasmine Incense Cones', 'Candles', 'Slow-burning natural dhoop cones with Mysore sandalwood essence.', 480.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5OfCrJc3ThpMxMKDmtDWXGZqAnzrsQEinCy301b7UZqppy1_mLTPe2_2RDoHwnqilVGuz1n0Bmgai-W_fEXAaTOW5NC2g364ODPWH3EAkglkdaBB3yK7rICJPleaW9wm7ImiJ9U7kwL3zFIFGr38MDFSgrKPOsfMAQaGzF9I8nZ-voq1JF4rCi8W9L1snEA2T_H7A6KmLO8JXgwkT7VYeg1u5O8IsRsY44REVmUngVX99W64vyvSv6g', 90, 0, 1, 'wedding,festive,wellness'),

    -- Festive Gifts
    ('Handcrafted Brass Peacock Diya', 'Accessories & Trinkets', 'Traditional solid bell-metal oil lamp carved by Moradabad artisans.', 850.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2yzWPv5z5A4HxEpZ-_9MAYKtbGMEB5nTn3WnDspdtNhBOptpRi5T0wlfbLdsofbgV9oHpbDIDRJGce13OBI0Wv2ksF76ts88WXy13S_9AF-w3uAFvW1lyPA6uJb2MaRgR7-GnD75Cn4sg_D4Woh3NsCDaVbjmV7_olLgkceB1pqeAFaTdSAH6ZrmPBP-qNrgIy0nyi3fkPs1oHUhwmjdQ67q-z0wjAp3QOW6JcWOOyS735Pz3UytWHw', 65, 1, 1, 'festive,wedding'),
    ('Roasted Mamra Almonds & Pistachios', 'Chocolates', 'Gently tossed in Himalayan pink salt and pure A2 cow ghee.', 790.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8HGyqJeU_CgZT2BLDAKgqW2DFH9fSCyHWz6YeNXtI4B8tiLqO4FycNhLkKu1KlEPKbuWDgMSL-ANX0IBLpauq71UNGozQ8O5PJgNCJCBcgP06kp7YuTSqCtPeTZqyNwe3zhru3S6f00aik-lHVU2DidEVuFYct7D3fSCREpf3macBf0F7NW10p3bawagtr8bQs5azk3TRZbdKUTdparQkKnF1A3NHRZEZsthvXlPDs_su2beqySRK7Q', 85, 0, 1, 'festive,corporate,birthday'),
    ('Silver Foil Royal Kaju Katli', 'Chocolates', 'Hand-cut cashewnut fudge layered with edible silver leaf and green cardamom.', 650.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj5YJvAIXwj6cJX_oaPI2IwAZP1akuuEewMWZZF3H-A5pNAepct1Cpv6c_16wez4agBz38x7QwBfAt2ru7UTLvEzzcLKJXUwaEPB6mTZB9EkjjgHZ4CLKMKiVs6ORI_Y71II_rpMKVwQJH4Y6UYjouzISEtIlh0YOtmE99j4t70VrUJMH2pNqku-d4KC5VkzXArJdbYnubmt-hvkPdaZTOs2TsvkK0ht4Az7Y9AfC4I_ZptHCKkthNtQ', 75, 1, 1, 'festive,wedding'),

    -- Corporate Honors
    ('Full-Grain Leather Executive Desk Journal', 'Accessories & Trinkets', 'Hand-stitched vintage tan leather binding with 200 GSM handmade paper.', 890.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuADhih6ec4Z-9axIBoZGzdCBt8qNdYBXERSODdB6zbEaLcrTOXMD_dUlo5ocVBFvFKMzGaxV_Wirg_P_BiCPbPDumMmOncwiaadzBKe9geXkPl6Lk4MHhiQL-80gHA63QCXOPCpMot-7xxwNT7tb11a3ET7Ig_1qwmIIDG4Rrq2vj5y1mynr7rwcC0dv3S6TiIgmtrNpIY0BXheWGY2kfI7wfiuuWutA5Dh-PWHIkLkNzGwD30DCDLmmQ', 70, 1, 1, 'corporate'),
    ('Matte Black Stainless Steel Thermos Flask', 'Mugs & Glassware', 'Double-wall vacuum insulated flask keeping beverages hot for 18 hours.', 950.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8HDe0J3J8S4luK6sCN0YdjI0DvRIzKnzPT6XEDWe8bUHmKxm8H3XgJjOHj2Tm_wFYv38jFJ5KMVBWnKpHmSzJm6AenY4g1_-ejxaTwk9-pgC9uqwZndcBPXNudg69jGfTPd6gM2nl51ZR0BdHgRf_Yq-7Y8vjL9uYWX_qSScqmhCAc9zZIsOcFvC4C3yHeNrsNLzlHiRpAKeezD_PhdtkZPeSpao07_ZJpl2Am57W0ANQoBhXEqk7fA', 55, 0, 1, 'corporate,wellness'),

    -- Birthday & Anniversary Delicacies
    ('Celebration Gourmet Macaron Box (Assorted 6)', 'Chocolates', 'French almond shells with pistachio, salted caramel, and raspberry ganache.', 620.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgyxU7NBJkbtxy2PYe04bErM9QybpQ7G7DaU6SzSgO202MCn6Y0_EnKx24holZUWlVvX-5Zcjl5dZzZpcx-SED2lzMqCt_3HmfkorGu4hCURfZ66dZg_7-GQnO96fJ_y5ikfJwaDzR45VwKkNUaa3wQVnNzgF2qDsAEQPgxRKNMmaz85Me7Ci3YBfvsNl4zQkFvbHIBetvtai5oLdgUxJaaQ3vcHeVATT2O8xzGpMySliEMb7LG-gSzQ', 60, 1, 1, 'birthday,anniversary'),
    ('Hand-Etched Champagne Flute Pair', 'Mugs & Glassware', 'Lead-free crystal flutes with delicate 24k gold gilded rims.', 1150.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8HDe0J3J8S4luK6sCN0YdjI0DvRIzKnzPT6XEDWe8bUHmKxm8H3XgJjOHj2Tm_wFYv38jFJ5KMVBWnKpHmSzJm6AenY4g1_-ejxaTwk9-pgC9uqwZndcBPXNudg69jGfTPd6gM2nl51ZR0BdHgRf_Yq-7Y8vjL9uYWX_qSScqmhCAc9zZIsOcFvC4C3yHeNrsNLzlHiRpAKeezD_PhdtkZPeSpao07_ZJpl2Am57W0ANQoBhXEqk7fA', 35, 1, 1, 'wedding,anniversary')
    ;
END;
GO
