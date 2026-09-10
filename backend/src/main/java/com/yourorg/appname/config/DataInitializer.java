package com.yourorg.appname.config;

import com.yourorg.appname.entity.*;
import com.yourorg.appname.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Initializes essential catalog seed data and default demo accounts
 * on application startup if tables are empty (especially useful for fresh cloud deployments like Render).
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final BoxOptionRepository boxOptionRepository;
    private final ProductRepository productRepository;
    private final HamperRepository hamperRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            BoxOptionRepository boxOptionRepository,
            ProductRepository productRepository,
            HamperRepository hamperRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.boxOptionRepository = boxOptionRepository;
        this.productRepository = productRepository;
        this.hamperRepository = hamperRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedBoxes();
        seedProducts();
        seedHampers();
        seedReviews();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            logger.info("Database empty: seeding default demo and administrator accounts...");

            User demoUser = new User(
                    "demo_user",
                    "demo@thegiftedit.com",
                    passwordEncoder.encode("password123"),
                    "Lady Eleanor Vance",
                    "+91 98765 43210",
                    "ROLE_USER"
            );
            demoUser.setAddress("42 Royal Palm Boulevard, Apt 7B");
            demoUser.setCity("Mumbai");
            demoUser.setState("Maharashtra");
            demoUser.setPostalCode("400001");
            demoUser.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80");
            userRepository.save(demoUser);

            User adminUser = new User(
                    "admin",
                    "concierge@thegiftedit.com",
                    passwordEncoder.encode("password123"),
                    "Atelier Concierge Lead",
                    "+91 98765 00000",
                    "ROLE_ADMIN"
            );
            adminUser.setAddress("Atelier House, 12 Kensington Crest");
            adminUser.setCity("New Delhi");
            adminUser.setState("Delhi");
            adminUser.setPostalCode("110001");
            adminUser.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80");
            userRepository.save(adminUser);

            logger.info("Demo users created: demo_user/password123, admin/password123");
        }
    }

    private void seedBoxes() {
        if (boxOptionRepository.count() == 0) {
            logger.info("Seeding luxury keepsake boxes...");
            BoxOption box1 = new BoxOption();
            box1.setName("Petite Keepsake");
            box1.setSubtitle("Ideal for intimate tokens of affection");
            box1.setDescription("Handcrafted rigid book-style gift box finished in midnight matte with gold foil embossing.");
            box1.setPrice(new BigDecimal("1200.00"));
            box1.setCapacity(3);
            box1.setImageUrl("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80");
            box1.setIsBestseller(false);
            box1.setIsActive(true);

            BoxOption box2 = new BoxOption();
            box2.setName("Heritage Classic Trunk");
            box2.setSubtitle("Our signature balance of timeless beauty & capacity");
            box2.setDescription("Rich forest green vegan leather chest with antique brass latches, gold corner protectors, and satin interior ribbon.");
            box2.setPrice(new BigDecimal("2200.00"));
            box2.setCapacity(5);
            box2.setImageUrl("https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80");
            box2.setIsBestseller(true);
            box2.setIsActive(true);

            BoxOption box3 = new BoxOption();
            box3.setName("Grand Luxury Trunk");
            box3.setSubtitle("An opulent statement for major milestones");
            box3.setDescription("Dual-tier midnight obsidian trunk with velvet tray insert, gold lock, and embroidered monogram band.");
            box3.setPrice(new BigDecimal("3500.00"));
            box3.setCapacity(8);
            box3.setImageUrl("https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80");
            box3.setIsBestseller(false);
            box3.setIsActive(true);

            BoxOption box4 = new BoxOption();
            box4.setName("Imperial Pine Casket");
            box4.setSubtitle("Rustic warmth with royal polish");
            box4.setDescription("Solid cedar wood box with slide lid, scorched brand crest, and plush linen cushioning.");
            box4.setPrice(new BigDecimal("2800.00"));
            box4.setCapacity(6);
            box4.setImageUrl("https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80");
            box4.setIsBestseller(false);
            box4.setIsActive(true);

            boxOptionRepository.saveAll(List.of(box1, box2, box3, box4));
        }
    }

    private Product createProduct(String name, String category, String description, BigDecimal price, String imageUrl, int stock, boolean isLuxury, String occasion) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setDescription(description);
        p.setPrice(price);
        p.setImageUrl(imageUrl);
        p.setStockQuantity(stock);
        p.setIsLuxury(isLuxury);
        p.setIsActive(true);
        p.setOccasion(occasion);
        return p;
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            logger.info("Seeding catalog gourmet delicacies & keepsakes...");
            Product p1 = createProduct("Belgian Dark Chocolate Truffles", "delicacy", "Decadent 72% cacao ganache dusted with Ecuadorian cocoa.", new BigDecimal("850.00"), "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80", 150, true, "Festive, Wedding, Birthday");
            Product p2 = createProduct("Single-Estate Darjeeling First Flush Tea", "delicacy", "Hand-plucked spring buds from the foothills of the Himalayas.", new BigDecimal("920.00"), "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80", 80, true, "Corporate, Wellness");
            Product p3 = createProduct("Hand-Poured Soy Candle - Sandalwood & Amber", "keepsake", "40-hour burn time with crackling wooden wick.", new BigDecimal("1150.00"), "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80", 120, false, "Festive, Anniversary, Housewarming");
            Product p4 = createProduct("French Lavender Aromatherapy Mist", "wellness", "Distilled organic lavender flowers from Grasse, France.", new BigDecimal("780.00"), "https://images.unsplash.com/photo-1608248597359-2503612711bd?w=600&auto=format&fit=crop&q=80", 95, false, "Wellness, Birthday");
            Product p5 = createProduct("24K Gold Stamped Brass Bookmark", "keepsake", "Heirloom floral filigree bookmark with silk tassel.", new BigDecimal("650.00"), "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80", 200, false, "Corporate, Graduation");
            Product p6 = createProduct("Artisanal Wildflower Raw Honey", "delicacy", "Pure mountain honey infused with Kashmiri saffron strands.", new BigDecimal("890.00"), "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80", 60, true, "Festive, Housewarming");
            Product p7 = createProduct("Moroccan Rose Mineral Bath Salts", "wellness", "Himalayan pink salt crystals steeped in Damascus rose petals.", new BigDecimal("740.00"), "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&auto=format&fit=crop&q=80", 110, false, "Wellness, Anniversary");
            Product p8 = createProduct("Pure Mulberry Silk Sleep Mask", "keepsake", "22 Momme grade 6A silk with gentle elasticated band.", new BigDecimal("1450.00"), "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80", 50, true, "Wedding, Wellness");

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8));
        }
    }

    private Hamper createHamper(String title, String subtitle, String description, String occasion, String category, BigDecimal price, BigDecimal originalPrice, BigDecimal rating, int reviewsCount, String imageUrl, String badge, String includedProducts) {
        Hamper h = new Hamper();
        h.setTitle(title);
        h.setSubtitle(subtitle);
        h.setDescription(description);
        h.setOccasion(occasion);
        h.setCategory(category);
        h.setPrice(price);
        h.setOriginalPrice(originalPrice);
        h.setRating(rating);
        h.setReviewsCount(reviewsCount);
        h.setImageUrl(imageUrl);
        h.setBadge(badge);
        h.setIsActive(true);
        h.setIncludedProducts(includedProducts);
        return h;
    }

    private void seedHampers() {
        if (hamperRepository.count() == 0) {
            logger.info("Seeding bestselling hampers...");
            Hamper h1 = createHamper("The Royal Opulence Hamper", "Celebration of Regal Indulgence",
                    "An unmatched symphony of single-estate teas, Belgian truffles, 24k gold bookmark, and French artisanal candle encased in our signature Heritage Trunk.",
                    "Wedding", "Wedding", new BigDecimal("5499.00"), new BigDecimal("6200.00"),
                    new BigDecimal("5.0"), 38,
                    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
                    "Atelier Choice",
                    "Heritage Classic Trunk, Belgian Dark Chocolate Truffles, First Flush Tea, Sandalwood Candle, 24K Brass Bookmark");

            Hamper h2 = createHamper("The Midnight Celestial Edit", "Quiet Luxury for Modern Connoisseurs",
                    "Handcrafted dark obsidian keepsake chest paired with soothing Moroccan bath salts, lavender sleep mist, and pure mulberry silk eye mask.",
                    "Wellness", "Wellness", new BigDecimal("4899.00"), new BigDecimal("5400.00"),
                    new BigDecimal("4.9"), 24,
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
                    "Bestseller",
                    "Grand Luxury Trunk, Moroccan Rose Salts, Lavender Mist, Mulberry Silk Sleep Mask");

            Hamper h3 = createHamper("The Heritage Botanical Chest", "Nature's Sweetest Nectar & Aromas",
                    "Artisanal Kashmiri saffron honey, Darjeeling loose leaf tea, and fragrant soy candle curated inside an earthy wooden presentation casket.",
                    "Festive", "Festive", new BigDecimal("3999.00"), new BigDecimal("4500.00"),
                    new BigDecimal("4.8"), 19,
                    "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80",
                    "Popular",
                    "Imperial Pine Casket, Artisanal Wildflower Honey, First Flush Tea, Sandalwood Candle");

            Hamper h4 = createHamper("The Executive Signature Trunk", "Distinctive Distinction for Corporate Leaders",
                    "Tailored for milestones and distinguished recognition. Features premium gourmet treats and executive keepsakes.",
                    "Corporate", "Corporate", new BigDecimal("6299.00"), new BigDecimal("7000.00"),
                    new BigDecimal("4.9"), 15,
                    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80",
                    "VIP Choice",
                    "Heritage Classic Trunk, 24K Brass Bookmark, Belgian Truffles, First Flush Tea, Lavender Mist");

            hamperRepository.saveAll(List.of(h1, h2, h3, h4));
        }
    }

    private void seedReviews() {
        if (reviewRepository.count() == 0) {
            logger.info("Seeding initial testimonials...");
            Review r1 = new Review();
            r1.setAuthorName("Lady Catherine Montrose");
            r1.setRating(5);
            r1.setTitle("Royal Wedding Gifting");
            r1.setContent("The craftsmanship of the Heritage Trunk took my breath away. Our wedding guests could not stop praising the unboxing experience.");
            r1.setLocation("London & Mumbai");
            r1.setVerifiedBuyer(true);

            Review r2 = new Review();
            r2.setAuthorName("Devraj Singhania");
            r2.setRating(5);
            r2.setTitle("Annual CXO Summit");
            r2.setContent("Flawless corporate gifting for our CXO conclave. The satin ribbon finish and personalized gold-foil stationery set a new standard.");
            r2.setLocation("Bangalore");
            r2.setVerifiedBuyer(true);

            reviewRepository.saveAll(List.of(r1, r2));
        }
    }
}