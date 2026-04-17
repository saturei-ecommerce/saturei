package com.saturei.backend.listing.application;

import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import com.saturei.backend.shared.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private static final int MAX_WIDTH = 1280;
    private static final int MAX_HEIGHT = 1280;
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Transactional
    public List<String> uploadToListing(UUID listingId, List<MultipartFile> files, UUID sellerId,
                                        JpaListingRepository listingRepository) {
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> ApiException.notFound("listing not found"));

        if (!listing.getSeller().getId().equals(sellerId)) {
            throw ApiException.forbidden("you do not own this listing");
        }

        List<String> urls = new ArrayList<>(listing.getImageUrls());

        for (MultipartFile file : files) {
            validateFile(file);
            String url = saveFile(file, listingId);
            urls.add(url);
        }

        listing.setImageUrls(urls);
        listingRepository.save(listing);

        return urls;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw ApiException.badRequest("file is empty");
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw ApiException.badRequest("unsupported file type: " + file.getContentType());
        }
    }

    private String saveFile(MultipartFile file, UUID listingId) {
        try {
            BufferedImage original = ImageIO.read(file.getInputStream());
            if (original == null) throw ApiException.badRequest("could not read image");

            BufferedImage resized = resize(original);

            String filename = listingId + "_" + UUID.randomUUID() + ".jpg";
            Path dir = Paths.get(uploadDir, "listings", listingId.toString());
            Files.createDirectories(dir);

            Path dest = dir.resolve(filename);
            ImageIO.write(resized, "jpg", dest.toFile());

            return "/uploads/listings/" + listingId + "/" + filename;
        } catch (IOException e) {
            throw ApiException.badRequest("failed to process image: " + e.getMessage());
        }
    }

    private BufferedImage resize(BufferedImage original) {
        int width = original.getWidth();
        int height = original.getHeight();

        if (width <= MAX_WIDTH && height <= MAX_HEIGHT) return original;

        double scale = Math.min((double) MAX_WIDTH / width, (double) MAX_HEIGHT / height);
        int newWidth = (int) (width * scale);
        int newHeight = (int) (height * scale);

        BufferedImage resized = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resized.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(original, 0, 0, newWidth, newHeight, null);
        g.dispose();

        return resized;
    }
}
