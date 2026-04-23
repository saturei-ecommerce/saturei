package com.saturei.backend.listing.infrastructure.web;

import com.saturei.backend.listing.application.ListingService;
import com.saturei.backend.listing.application.dto.CreateListingRequest;
import com.saturei.backend.listing.application.dto.ListingResponse;
import com.saturei.backend.listing.application.dto.SearchListingRequest;
import com.saturei.backend.listing.application.dto.UpdateListingRequest;
import com.saturei.backend.listing.application.dto.UpdateStatusRequest;
import com.saturei.backend.user.domain.User;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    /**
     * Public search endpoint — no authentication required.
     * Supports: keyword, category, location, minPrice, maxPrice, page, size, sort.
     * Default sort: createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<ListingResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        // Parse sort param in format "field,direction"
        Pageable pageable = parsePageable(page, size, sort);
        var request = new SearchListingRequest(keyword, category, location, minPrice, maxPrice);
        return ResponseEntity.ok(listingService.search(request, pageable));
    }

    /**
     * Returns distinct categories of active listings — for populating the filter dropdown.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(listingService.getCategories());
    }

    /**
     * Returns distinct locations of active listings — for populating the filter dropdown.
     */
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getLocations() {
        return ResponseEntity.ok(listingService.getLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(listingService.getById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<ListingResponse>> listMine(@AuthenticationPrincipal User user, Pageable pageable) {
        return ResponseEntity.ok(listingService.listBySeller(user.getId(), pageable));
    }

    @PostMapping
    public ResponseEntity<ListingResponse> create(@AuthenticationPrincipal User user,
                                                  @Valid @RequestBody CreateListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.create(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> update(@AuthenticationPrincipal User user,
                                                  @PathVariable UUID id,
                                                  @Valid @RequestBody UpdateListingRequest request) {
        return ResponseEntity.ok(listingService.update(id, request, user.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ListingResponse> updateStatus(@AuthenticationPrincipal User user,
                                                        @PathVariable UUID id,
                                                        @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(listingService.updateStatus(id, request.status(), user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        listingService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    private Pageable parsePageable(int page, int size, String sort) {
        // Clamp size to avoid abuse
        int clampedSize = Math.min(Math.max(size, 1), 50);
        String[] parts = sort.split(",");
        if (parts.length == 2) {
            Sort.Direction dir = "asc".equalsIgnoreCase(parts[1]) ? Sort.Direction.ASC : Sort.Direction.DESC;
            return PageRequest.of(page, clampedSize, Sort.by(dir, parts[0]));
        }
        return PageRequest.of(page, clampedSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
