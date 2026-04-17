package com.saturei.backend.chat.domain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository {

    @Query("SELECT c FROM Conversation c WHERE c.buyer.id = :userId OR c.seller.id = :userId")
    List<Conversation> findAllByUserId(@Param("userId") UUID userId);

    Optional<Conversation> findByBuyerIdAndSellerIdAndListingId(UUID buyerId, UUID sellerId, UUID listingId);
}
