package com.saturei.backend.listing.application;

import com.saturei.backend.listing.application.dto.CreateListingRequest;
import com.saturei.backend.listing.application.dto.ListingResponse;
import com.saturei.backend.listing.application.dto.SearchListingRequest;
import com.saturei.backend.listing.application.dto.UpdateListingRequest;
import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.domain.ListingRepository;
import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ListingResponse create(CreateListingRequest request, UUID sellerId) {
        var seller = userRepository.findById(sellerId)
                .orElseThrow(() -> ApiException.notFound("user not found"));

        var listing = Listing.builder()
                .seller(seller)
                .title(request.title())
                .description(request.description())
                .price(request.price())
                .conservationState(request.conservationState())
                .category(request.category())
                .location(request.location())
                .build();

        return ListingResponse.from(listingRepository.save(listing));
    }

    @Transactional
    public ListingResponse update(UUID id, UpdateListingRequest request, UUID sellerId) {
        var listing = getOwnedListing(id, sellerId);

        if (request.title() != null) listing.setTitle(request.title());
        if (request.description() != null) listing.setDescription(request.description());
        if (request.price() != null) listing.setPrice(request.price());
        if (request.conservationState() != null) listing.setConservationState(request.conservationState());
        if (request.category() != null) listing.setCategory(request.category());
        if (request.location() != null) listing.setLocation(request.location());

        return ListingResponse.from(listingRepository.save(listing));
    }

    @Transactional
    public ListingResponse updateStatus(UUID id, ListingStatus status, UUID sellerId) {
        var listing = getOwnedListing(id, sellerId);
        listing.setStatus(status);
        return ListingResponse.from(listingRepository.save(listing));
    }

    @Transactional
    public void delete(UUID id, UUID sellerId) {
        var listing = getOwnedListing(id, sellerId);
        listingRepository.delete(listing);
    }

    @Transactional(readOnly = true)
    public ListingResponse getById(UUID id) {
        return listingRepository.findById(id)
                .map(ListingResponse::from)
                .orElseThrow(() -> ApiException.notFound("listing not found"));
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> listBySeller(UUID sellerId, Pageable pageable) {
        return listingRepository.findBySellerId(sellerId, pageable)
                .map(ListingResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ListingResponse> search(SearchListingRequest request, Pageable pageable) {
        // Normalize blank strings to null so JPQL (:param IS NULL) works correctly
        String keyword  = blankToNull(request.keyword());
        String category = blankToNull(request.category());
        String location = blankToNull(request.location());

        return listingRepository.search(
                keyword,
                category,
                location,
                request.minPrice(),
                request.maxPrice(),
                pageable
        ).map(ListingResponse::from);
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return listingRepository.findDistinctCategories();
    }

    @Transactional(readOnly = true)
    public List<String> getLocations() {
        return listingRepository.findDistinctLocations();
    }

    private Listing getOwnedListing(UUID id, UUID sellerId) {
        var listing = listingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("listing not found"));
        if (!listing.getSeller().getId().equals(sellerId)) {
            throw ApiException.forbidden("you do not own this listing");
        }
        return listing;
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
