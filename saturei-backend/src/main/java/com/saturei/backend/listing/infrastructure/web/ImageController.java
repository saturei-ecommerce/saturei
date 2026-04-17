package com.saturei.backend.listing.infrastructure.web;

import com.saturei.backend.listing.application.ImageService;
import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/listings/{id}/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final JpaListingRepository listingRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<List<String>> upload(@PathVariable UUID id,
                                               @RequestParam("files") List<MultipartFile> files) {
        // TODO: replace hardcoded UUID with authenticated user from SecurityContext
        UUID sellerId = UUID.randomUUID();
        List<String> urls = imageService.uploadToListing(id, files, sellerId, listingRepository);
        return ResponseEntity.ok(urls);
    }
}
