package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.CustomHamperItemRequest;
import com.yourorg.appname.dto.request.CustomHamperRequest;
import com.yourorg.appname.dto.response.CustomHamperResponse;
import com.yourorg.appname.entity.*;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.BoxOptionRepository;
import com.yourorg.appname.repository.CustomHamperRepository;
import com.yourorg.appname.repository.ProductRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.CustomHamperService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomHamperServiceImpl implements CustomHamperService {

    private final CustomHamperRepository customHamperRepository;
    private final BoxOptionRepository boxOptionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public CustomHamperServiceImpl(CustomHamperRepository customHamperRepository,
                                  BoxOptionRepository boxOptionRepository,
                                  ProductRepository productRepository,
                                  UserRepository userRepository,
                                  EntityMapper mapper) {
        this.customHamperRepository = customHamperRepository;
        this.boxOptionRepository = boxOptionRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public CustomHamperResponse createCustomHamper(CustomHamperRequest request, String username) {
        BoxOption box = boxOptionRepository.findById(request.getBoxOptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Box option not found with id: " + request.getBoxOptionId()));

        User user = null;
        if (username != null && !username.trim().isEmpty() && !username.equalsIgnoreCase("anonymousUser")) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        CustomHamper customHamper = new CustomHamper();
        customHamper.setUser(user);
        customHamper.setBoxOption(box);
        customHamper.setRibbonColor(request.getRibbonColor());
        customHamper.setOccasionTheme(request.getOccasionTheme());
        customHamper.setCardStyle(request.getCardStyle());
        customHamper.setRecipientName(request.getRecipientName());
        customHamper.setSenderName(request.getSenderName());
        customHamper.setGiftMessage(request.getGiftMessage());
        customHamper.setPolaroidPhotoUrl(request.getPolaroidPhotoUrl());
        customHamper.setHasPolaroid(Boolean.TRUE.equals(request.getHasPolaroid()));

        customHamper.setBoxPrice(box.getPrice());

        BigDecimal itemsPrice = BigDecimal.ZERO;
        int totalQuantity = 0;
        List<CustomHamperItem> hamperItems = new ArrayList<>();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CustomHamperItemRequest itemReq : request.getItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

                int qty = itemReq.getQuantity() != null ? itemReq.getQuantity() : 1;
                totalQuantity += qty;

                BigDecimal linePrice = product.getPrice().multiply(BigDecimal.valueOf(qty));
                itemsPrice = itemsPrice.add(linePrice);

                CustomHamperItem item = new CustomHamperItem(customHamper, product, qty, product.getPrice());
                hamperItems.add(item);
            }
        }

        if (totalQuantity > box.getCapacity()) {
            throw new BadRequestException("Selected items (" + totalQuantity + ") exceed box capacity of " + box.getCapacity());
        }

        customHamper.setItemsPrice(itemsPrice);

        BigDecimal addonsPrice = Boolean.TRUE.equals(request.getHasPolaroid()) ? new BigDecimal("99.00") : BigDecimal.ZERO;
        customHamper.setAddonsPrice(addonsPrice);

        BigDecimal totalPrice = box.getPrice().add(itemsPrice).add(addonsPrice);
        customHamper.setTotalPrice(totalPrice);
        customHamper.setItems(hamperItems);

        CustomHamper saved = customHamperRepository.save(customHamper);
        return mapper.toCustomHamperResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomHamperResponse getCustomHamperById(Long id) {
        CustomHamper customHamper = customHamperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custom hamper not found with id: " + id));
        return mapper.toCustomHamperResponse(customHamper);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomHamperResponse> getUserCustomHampers(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return customHamperRepository.findByUserId(user.getId()).stream()
                .map(mapper::toCustomHamperResponse)
                .collect(Collectors.toList());
    }
}
