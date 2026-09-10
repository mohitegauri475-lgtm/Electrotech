package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.OrderRequest;
import com.yourorg.appname.dto.response.OrderResponse;
import com.yourorg.appname.entity.*;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.exception.UnauthorizedException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.*;
import com.yourorg.appname.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final CustomHamperRepository customHamperRepository;
    private final HamperRepository hamperRepository;
    private final EntityMapper mapper;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartItemRepository cartItemRepository,
                            UserRepository userRepository,
                            CustomHamperRepository customHamperRepository,
                            HamperRepository hamperRepository,
                            EntityMapper mapper) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.customHamperRepository = customHamperRepository;
        this.hamperRepository = hamperRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Order order = new Order();
        order.setOrderNumber("GE-" + System.currentTimeMillis() % 10000000);
        order.setUser(user);
        order.setRecipientName(request.getRecipientName());
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPostalCode(request.getPostalCode());
        order.setPhone(request.getPhone());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "ONLINE");
        order.setOrderStatus("PROCESSING");
        order.setPaymentStatus("PAID");
        order.setTrackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal addonsTotal = BigDecimal.ZERO;

        // Check if direct buy
        if (request.getDirectCustomHamperId() != null) {
            CustomHamper ch = customHamperRepository.findById(request.getDirectCustomHamperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Custom hamper not found"));

            int qty = request.getDirectQuantity() != null ? request.getDirectQuantity() : 1;
            BigDecimal lineTotal = ch.getTotalPrice().multiply(BigDecimal.valueOf(qty));
            subtotal = subtotal.add(lineTotal);
            addonsTotal = addonsTotal.add(ch.getAddonsPrice().multiply(BigDecimal.valueOf(qty)));

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setItemType("CUSTOM_BESPOKE");
            oi.setCustomHamper(ch);
            oi.setItemTitle("Bespoke Hamper: " + ch.getBoxOption().getName());
            oi.setQuantity(qty);
            oi.setUnitPrice(ch.getTotalPrice());
            oi.setTotalPrice(lineTotal);
            orderItems.add(oi);
        } else if (request.getDirectHamperId() != null) {
            Hamper h = hamperRepository.findById(request.getDirectHamperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hamper not found"));

            int qty = request.getDirectQuantity() != null ? request.getDirectQuantity() : 1;
            BigDecimal lineTotal = h.getPrice().multiply(BigDecimal.valueOf(qty));
            subtotal = subtotal.add(lineTotal);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setItemType("READY_MADE");
            oi.setHamper(h);
            oi.setItemTitle(h.getTitle());
            oi.setQuantity(qty);
            oi.setUnitPrice(h.getPrice());
            oi.setTotalPrice(lineTotal);
            orderItems.add(oi);
        } else {
            // Populate from Cart
            List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
            if (cartItems.isEmpty()) {
                throw new BadRequestException("Cart is empty. Cannot checkout.");
            }

            for (CartItem ci : cartItems) {
                OrderItem oi = new OrderItem();
                oi.setOrder(order);
                oi.setQuantity(ci.getQuantity());

                if (ci.getHamper() != null) {
                    oi.setItemType("READY_MADE");
                    oi.setHamper(ci.getHamper());
                    oi.setItemTitle(ci.getHamper().getTitle());
                    oi.setUnitPrice(ci.getHamper().getPrice());
                    BigDecimal lineTotal = ci.getHamper().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
                    oi.setTotalPrice(lineTotal);
                    subtotal = subtotal.add(lineTotal);
                } else if (ci.getCustomHamper() != null) {
                    oi.setItemType("CUSTOM_BESPOKE");
                    oi.setCustomHamper(ci.getCustomHamper());
                    oi.setItemTitle("Bespoke Hamper: " + ci.getCustomHamper().getBoxOption().getName());
                    oi.setUnitPrice(ci.getCustomHamper().getTotalPrice());
                    BigDecimal lineTotal = ci.getCustomHamper().getTotalPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
                    oi.setTotalPrice(lineTotal);
                    subtotal = subtotal.add(lineTotal);
                    addonsTotal = addonsTotal.add(ci.getCustomHamper().getAddonsPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
                }

                orderItems.add(oi);
            }

            // Clear Cart after checkout
            cartItemRepository.deleteByUserId(user.getId());
        }

        boolean freeShipping = subtotal.compareTo(new BigDecimal("2999.00")) >= 0;
        BigDecimal shippingFee = freeShipping ? BigDecimal.ZERO : new BigDecimal("199.00");

        order.setSubtotal(subtotal);
        order.setAddonsTotal(addonsTotal);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(subtotal.add(shippingFee));
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return mapper.toOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new UnauthorizedException("Cannot access another user's order");
        }

        return mapper.toOrderResponse(order);
    }
}
