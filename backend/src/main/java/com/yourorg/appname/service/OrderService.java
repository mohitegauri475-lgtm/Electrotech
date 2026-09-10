package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.OrderRequest;
import com.yourorg.appname.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request, String username);
    List<OrderResponse> getUserOrders(String username);
    OrderResponse getOrderByNumber(String orderNumber, String username);
}
