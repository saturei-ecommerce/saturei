package com.saturei.backend.listing.infrastructure.web;

import com.saturei.backend.listing.application.ListingService;
import com.saturei.backend.listing.application.dto.CreateListingRequest;
import com.saturei.backend.listing.application.dto.ListingResponse;
import com.saturei.backend.listing.application.dto.SearchListingRequest;
import com.saturei.backend.listing.application.dto.UpdateListingRequest;
import com.saturei.backend.listing.application.dto.UpdateStatusRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public ResponseEntity<Page<ListingResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {
        var request = new SearchListingRequest(keyword, category, location, minPrice, maxPrice);
        return ResponseEntity.ok(listingService.search(request, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(listingService.getById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<ListingResponse>> listMine(Pageable pageable) {
        // TODO: replace hardcoded UUID with authenticated user from SecurityContext
        UUID sellerId = UUID.randomUUID();
        return ResponseEntity.ok(listingService.listBySeller(sellerId, pageable));
    }

    @PostMapping
    public ResponseEntity<ListingResponse> create(@Valid @RequestBody CreateListingRequest request) {
        // TODO: replace hardcoded UUID with authenticated user from SecurityContext
        UUID sellerId = UUID.randomUUID();
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.create(request, sellerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> update(@PathVariable UUID id,
                                                  @Valid @RequestBody UpdateListingRequest request) {
        UUID sellerId = UUID.randomUUID();
        return ResponseEntity.ok(listingService.update(id, request, sellerId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ListingResponse> updateStatus(@PathVariable UUID id,
                                                        @Valid @RequestBody UpdateStatusRequest request) {
        UUID sellerId = UUID.randomUUID();
        return ResponseEntity.ok(listingService.updateStatus(id, request.status(), sellerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        UUID sellerId = UUID.randomUUID();
        listingService.delete(id, sellerId);
        return ResponseEntity.noContent().build();
    }
}
