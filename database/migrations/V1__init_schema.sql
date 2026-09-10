-- V1__init_schema.sql
-- Initial schema for THE GIFT EDIT e-commerce platform
-- Compatible with Microsoft SQL Server

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(100) NOT NULL,
        phone NVARCHAR(20),
        role NVARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'box_options')
BEGIN
    CREATE TABLE box_options (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        subtitle NVARCHAR(150),
        description NVARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        capacity INT NOT NULL,
        image_url NVARCHAR(1000) NOT NULL,
        is_bestseller BIT NOT NULL DEFAULT 0,
        is_active BIT NOT NULL DEFAULT 1
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        description NVARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        image_url NVARCHAR(1000) NOT NULL,
        stock_quantity INT NOT NULL DEFAULT 100,
        is_luxury BIT NOT NULL DEFAULT 0,
        is_active BIT NOT NULL DEFAULT 1
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'hampers')
BEGIN
    CREATE TABLE hampers (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(150) NOT NULL,
        subtitle NVARCHAR(255),
        description NVARCHAR(1000),
        occasion NVARCHAR(50) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        rating DECIMAL(3,2) NOT NULL DEFAULT 5.0,
        reviews_count INT NOT NULL DEFAULT 0,
        image_url NVARCHAR(1000) NOT NULL,
        badge NVARCHAR(50),
        is_active BIT NOT NULL DEFAULT 1
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'custom_hampers')
BEGIN
    CREATE TABLE custom_hampers (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NULL FOREIGN KEY REFERENCES users(id) ON DELETE SET NULL,
        box_option_id BIGINT NOT NULL FOREIGN KEY REFERENCES box_options(id),
        ribbon_color NVARCHAR(50) NOT NULL,
        occasion_theme NVARCHAR(50) NOT NULL,
        card_style NVARCHAR(100) NOT NULL,
        recipient_name NVARCHAR(100),
        sender_name NVARCHAR(100),
        gift_message NVARCHAR(1000),
        polaroid_photo_url NVARCHAR(1000),
        has_polaroid BIT NOT NULL DEFAULT 0,
        box_price DECIMAL(10,2) NOT NULL,
        items_price DECIMAL(10,2) NOT NULL DEFAULT 0,
        addons_price DECIMAL(10,2) NOT NULL DEFAULT 0,
        total_price DECIMAL(10,2) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'custom_hamper_items')
BEGIN
    CREATE TABLE custom_hamper_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        custom_hamper_id BIGINT NOT NULL FOREIGN KEY REFERENCES custom_hampers(id) ON DELETE CASCADE,
        product_id BIGINT NOT NULL FOREIGN KEY REFERENCES products(id),
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cart_items')
BEGIN
    CREATE TABLE cart_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
        hamper_id BIGINT NULL FOREIGN KEY REFERENCES hampers(id) ON DELETE SET NULL,
        custom_hamper_id BIGINT NULL FOREIGN KEY REFERENCES custom_hampers(id) ON DELETE SET NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE orders (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        order_number NVARCHAR(50) NOT NULL UNIQUE,
        user_id BIGINT NOT NULL FOREIGN KEY REFERENCES users(id),
        recipient_name NVARCHAR(100) NOT NULL,
        shipping_address NVARCHAR(255) NOT NULL,
        city NVARCHAR(100) NOT NULL,
        state NVARCHAR(100) NOT NULL,
        postal_code NVARCHAR(20) NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        order_status NVARCHAR(30) NOT NULL DEFAULT 'PROCESSING',
        payment_method NVARCHAR(50) NOT NULL DEFAULT 'ONLINE',
        payment_status NVARCHAR(30) NOT NULL DEFAULT 'PAID',
        subtotal DECIMAL(10,2) NOT NULL,
        shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
        addons_total DECIMAL(10,2) NOT NULL DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        tracking_number NVARCHAR(100),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE order_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        order_id BIGINT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
        item_type NVARCHAR(30) NOT NULL, -- 'READY_MADE' or 'CUSTOM_BESPOKE'
        hamper_id BIGINT NULL FOREIGN KEY REFERENCES hampers(id) ON DELETE SET NULL,
        custom_hamper_id BIGINT NULL FOREIGN KEY REFERENCES custom_hampers(id) ON DELETE SET NULL,
        item_title NVARCHAR(200) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reviews')
BEGIN
    CREATE TABLE reviews (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        hamper_id BIGINT NULL FOREIGN KEY REFERENCES hampers(id) ON DELETE SET NULL,
        author_name NVARCHAR(100) NOT NULL,
        rating INT NOT NULL DEFAULT 5,
        title NVARCHAR(200) NOT NULL,
        content NVARCHAR(1000) NOT NULL,
        location NVARCHAR(100),
        verified_buyer BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
