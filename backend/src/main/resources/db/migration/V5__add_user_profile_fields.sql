-- V5__add_user_profile_fields.sql
-- Add profile photo and personal info fields to users table

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'avatar_url')
BEGIN
    ALTER TABLE users ADD avatar_url NVARCHAR(MAX) NULL;
END;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'address')
BEGIN
    ALTER TABLE users ADD address NVARCHAR(500) NULL;
END;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'city')
BEGIN
    ALTER TABLE users ADD city NVARCHAR(100) NULL;
END;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'state')
BEGIN
    ALTER TABLE users ADD state NVARCHAR(100) NULL;
END;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'postal_code')
BEGIN
    ALTER TABLE users ADD postal_code NVARCHAR(20) NULL;
END;
GO

-- Seed default luxury avatar for existing demo_user
UPDATE users 
SET avatar_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe48OuaNKIDxBM4Q7nZU-R6bzdk39Vkd-n9epOo6zEkJOZwMGfgg1KvMBFnKyW3RSIZw24bZj_H-VKpNmGHm0U7nymWlalammN0ng0drgaPOnOJEbxNP7-tv-vPWkDTbAhd_BoSGKn2WbHjExryue2Dtg8dW41wsuzgD6oUA8OO_akzv80hQ0YOYrbLBPPZ3h0UlXJtDtGhQZijBMYI8CBjdfe1771QzxLPcRduRNDhLPb6lCWPultow',
    address = '42 Heritage Boulevard, Off MG Road',
    city = 'Bengaluru',
    state = 'Karnataka',
    postal_code = '560001'
WHERE username = 'demo_user';
GO
