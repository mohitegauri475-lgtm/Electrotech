-- V4__add_more_hampers.sql
-- Add 8 new distinct signature hampers for online shopping across birthdays, anniversaries, weddings, festive, and corporate occasions

IF NOT EXISTS (SELECT * FROM hampers WHERE title = 'The Midnight Truffle & Gold Trunk')
BEGIN
    INSERT INTO hampers (title, subtitle, description, occasion, category, price, original_price, rating, reviews_count, image_url, badge, is_active, included_products)
    VALUES
    (
        'The Midnight Truffle & Gold Trunk', 
        'Artisanal Belgian Truffles & Single-Origin Cacao', 
        'An exquisite celebratory trunk crafted for birthday milestones and decadent chocolate connoisseurs, packed with gold leaf truffles, dark chocolates, and amber candle.', 
        'birthday', 
        'Birthday Edit', 
        3499.00, 
        3999.00, 
        4.96, 
        78, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBj5YJvAIXwj6cJX_oaPI2IwAZP1akuuEewMWZZF3H-A5pNAepct1Cpv6c_16wez4agBz38x7QwBfAt2ru7UTLvEzzcLKJXUwaEPB6mTZB9EkjjgHZ4CLKMKiVs6ORI_Y71II_rpMKVwQJH4Y6UYjouzISEtIlh0YOtmE99j4t70VrUJMH2pNqku-d4KC5VkzXArJdbYnubmt-hvkPdaZTOs2TsvkK0ht4Az7Y9AfC4I_ZptHCKkthNtQ', 
        'Bestseller', 
        1, 
        '24k Gold Flaked Truffles, Celebration Gourmet Macaron Box (Assorted 6), Single-Origin Dark Chocolate Bar, Amber Frosted Soy Wax Candle'
    ),
    (
        'The Eternal Romance & Silk Casket', 
        'Hand-Etched Crystal & Champagne Keepsakes', 
        'Designed to commemorate cherished anniversaries and proposals. Featuring gold-gilded crystal flutes, damask rose water mist, and silk ribbon presentation.', 
        'anniversary', 
        'Anniversary Edit', 
        4599.00, 
        5200.00, 
        4.99, 
        112, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGgr-b4WYN-DTWE0lOdM5HaJDOY0iGK7MF1djgJ-IUp4N8c6PkeQSmRbN0yxaNrwuV0ycv2kB0DFfig8003xNmap3UV2Yro11zGytbyEM_Fy32sqa9CeyCdfZYC5FPNNOp91MhdjnYFvHtl06UMmCwK3CqDuatp8f4OOfIo4KFdQKgARy4-Iwy_rJgvjjvQR6IDhUsaL6joMx7yFZwwU6zhjZQlLYMUkHhNxDaZb3gKLeGs5clMfdOA', 
        'Limited Edition', 
        1, 
        'Hand-Etched Champagne Flute Pair, 24k Gold Flaked Truffles, Rose Water & Botanical Mist, Amber Soy Candle, Handcrafted Brass Bookmark'
    ),
    (
        'The Grand Imperial Diwali Casket', 
        'Royal Rajputana Heritage Festive Hamper', 
        'The epitome of royal Indian festive hospitality. Solid pine wood casket containing solid brass peacock diya, Kashmiri saffron, silver katli, and Mamra almonds.', 
        'festive', 
        'Diwali Special', 
        6299.00, 
        6999.00, 
        4.97, 
        145, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuADhih6ec4Z-9axIBoZGzdCBt8qNdYBXERSODdB6zbEaLcrTOXMD_dUlo5ocVBFvFKMzGaxV_Wirg_P_BiCPbPDumMmOncwiaadzBKe9geXkPl6Lk4MHhiQL-80gHA63QCXOPCpMot-7xxwNT7tb11a3ET7Ig_1qwmIIDG4Rrq2vj5y1mynr7rwcC0dv3S6TiIgmtrNpIY0BXheWGY2kfI7wfiuuWutA5Dh-PWHIkLkNzGwD30DCDLmmQ', 
        'Royal Edition', 
        1, 
        'Handcrafted Brass Peacock Diya, Pure Kashmiri Mogra Saffron (5g), Roasted Mamra Almonds & Pistachios, Silver Foil Royal Kaju Katli, Sandalwood & Jasmine Incense Cones'
    ),
    (
        'The Viceroy Leadership Retreat Crate', 
        'Executive Distinction & Artisanal Coffee', 
        'Tailored for board members, keynote speakers, and corporate dignitaries. Features full-grain leather desk journal, vacuum thermos, and single-estate roast.', 
        'corporate', 
        'Corporate Honors', 
        5199.00, 
        5800.00, 
        4.92, 
        67, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA8rYyuBgkt3NzqvI09voYrR9rIWfAJkuxC6zC0U3dhemQfyPGqyss5xeEEbsGB_Z626be4Pd5A7HEVSzWdZa10gNhE3fbxq9IuEWNe-eob1_bYqAVd32cIONXeH3vnXEDQRIe6HCa4cZ2aXGvoZ03y1AoGaRqSqS78tJVT0pAQw_4Kh2W0E_BeUFUOTZ9GNNwaWxwkwl2M28X_3NOQU12l9ZREXQV5nhkayJ2z7HHiIJyQvbXxHaWz3g', 
        'Executive Choice', 
        1, 
        'Full-Grain Leather Executive Desk Journal, Matte Black Stainless Steel Thermos Flask, French Roast Ground Coffee, Artisanal Almond Brittle, Handcrafted Brass Bookmark'
    ),
    (
        'The Shubh Vivah Bridal Trunk', 
        'Heirloom Meenakari Silver & Saffron Trousseau', 
        'A magnificent trousseau presented in blush velvet millboard with an authentic 999 silver keepsake coin, Kashmiri saffron, and handcrafted brass diya.', 
        'wedding', 
        'Wedding Edit', 
        7499.00, 
        8200.00, 
        5.00, 
        89, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAWUDi_b-RY8q7SOJlGpQ6NThqBYb6zN3w8xzrC2ZJbe-HlA0kBZrL82NNDKqf-QFdg9VjLcLwcQiiD7Hyd9ZIKbILQ87wyCM252-koPWv9Ow036zpHK7HWIBgORwsDPAcdPf3tV1AUKy9mnJgfpjPAAwAVcVIjZ4GsXW7oGoVXfRa040nFiheHXTJ9A9Q0CEKyXzv-k6CJ4yDEzPtZfaqIJ3EGgnS1JaW5qOpBFEipy9qqIVMVGo7mFQ', 
        'Royal Trousseau', 
        1, 
        'Royal Meenakari Silver Keepsake Coin, Pure Kashmiri Mogra Saffron (5g), 24k Gold Flaked Truffles, Steam-Distilled Rose Water Mist, Handcrafted Brass Peacock Diya'
    ),
    (
        'The Joyous Birthday Celebration Box', 
        'Gourmet Macarons & Scented Confections', 
        'Bright, celebratory, and delightful. A handcrafted pastel gift box overflowing with Parisian macarons, artisan toffee brittle, and rich cocoa.', 
        'birthday', 
        'Birthday Joy', 
        2799.00, 
        3199.00, 
        4.89, 
        94, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZZMvGBE4czW6CaHom6MkqAK8AZiUvzXOU63R0ownyNOPupLFhe7L0qmrxqZPsjqORHRUOWKtG5ACUapHVzzY3lWm3XR5nBg9xcaBeE_rcTaP2h_6Sf98pI8mPyfSigNhlEB9WJ3U0BFuUirZLu7yXP7ifaq29XKpHyesgq_KRlYj80Ai9WiWTxDLFkDi6UC1nX5Zy2H9g_x89SgKfXig6VmHiVRLtyXgJ1jyUwm3WrZdFy_GcpNYnVg', 
        'Trending', 
        1, 
        'Celebration Gourmet Macaron Box, Artisanal Almond Brittle, Single-Origin Dark Chocolate Bar, Amber Frosted Soy Wax Candle'
    ),
    (
        'The Griha Pravesh Blessing Chest', 
        'Auspicious Housewarming Keepsakes', 
        'Bless a new home with sacred aromas, glowing brass lamps, royal silver coins, and gourmet dry fruits presented in raw ivory linen.', 
        'festive', 
        'Housewarming Blessing', 
        4699.00, 
        5199.00, 
        4.94, 
        56, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDv7d6piS698GlB4RnK3Lqee7pxK7jrnV1GZoLwzj39hKY9dJ6bASRwLGehomkrSdJ0unrdDuJA_aRYWaC-spZrQRBn-_SVwRDimeqz5ivN-ZRmZhGZpeTMgYDZIjDXo1oXBwxdqi8C9KoWIaTXkulckQeBkQBpBnB3TJ132RNsIhkaByM9dUKdOguQWxQWPRvqteQxapr_ac43nzIYEoXn3N1TepV7kqAudFSbzZ3lPKtISIR7_Qnt7A', 
        'Auspicious', 
        1, 
        'Handcrafted Brass Peacock Diya, Royal Meenakari Silver Keepsake Coin, Pure Kashmiri Mogra Saffron (5g), Roasted Mamra Almonds & Pistachios'
    ),
    (
        'The Himalayan Sanctuary Spa Box', 
        'Ayurvedic Aromatherapy & Saffron Kahwa', 
        'A sanctuary of peace. Natural sandalwood cones, pure damask rose water, Kashmiri saffron kahwa tea, and studio pottery mug.', 
        'wellness', 
        'Self-Care Ritual', 
        3299.00, 
        3799.00, 
        4.91, 
        83, 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBhNGjOUJYRQEY_hNDZOLvn30zZXuVvdGSq_d-SiiwtLJuzvWlldB2D3zGIFDb0N7-XcdJvtD3fEfeFBbruCtKlnTlqyl_VURQafGCKHldIIMqJit7tKooijL0KwTUyLY_axOGQnvkgEUVwhUlFilGO85tp3RhOaan7vFjAQZjzMnQU8mARw7zWm9y902EiGJlbxJUEkqAofgFdzBwExNos9zfMTPB_7G81XgXElqfjKTka-Hb0F0GAUw', 
        'Top Rated', 
        1, 
        'Rose Water & Botanical Mist, Sandalwood & Jasmine Incense Cones, Brass Infuser Tea Tin with Kashmiri Kahwa, Ceramic Stoneware Mug'
    );
END;
GO
