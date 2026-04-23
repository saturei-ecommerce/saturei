package com.saturei.backend.listing.infrastructure.web;

import com.saturei.backend.listing.application.ImageService;
import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import com.saturei.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<List<String>> upload(@AuthenticationPrincipal User user,
                                               @PathVariable UUID id,
                                               @RequestParam("files") List<MultipartFile> files) {
        List<String> urls = imageService.uploadToListing(id, files, user.getId(), listingRepository);
        return ResponseEntity.ok(urls);
    }
}
