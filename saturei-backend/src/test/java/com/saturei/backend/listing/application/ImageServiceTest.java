package com.saturei.backend.listing.application;

import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.domain.ListingRepository;
import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.listing.domain.vo.ConservationState;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

    @Mock ListingRepository listingRepository;
    @InjectMocks ImageService imageService;

    @TempDir Path tempDir;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(imageService, "uploadDir", tempDir.toString());
    }

    private User seller(UUID id) {
        return User.builder().id(id).name("Seller").email("s@test.com").password("pass").build();
    }

    private Listing listing(UUID id, User seller) {
        return Listing.builder()
                .id(id)
                .seller(seller)
                .title("Item")
                .price(new BigDecimal("10"))
                .conservationState(ConservationState.NEW)
                .status(ListingStatus.ACTIVE)
                .imageUrls(new ArrayList<>())
                .build();
    }

    private byte[] jpeg(int width, int height) throws IOException {
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(img, "jpg", bos);
        return bos.toByteArray();
    }

    @Test
    void upload_whenListingNotFound_throwsNotFound() {
        UUID listingId = UUID.randomUUID();
        UUID sellerId = UUID.randomUUID();
        when(listingRepository.findById(listingId)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                imageService.uploadToListing(listingId, List.of(), sellerId, listingRepository))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("listing not found");
    }

    @Test
    void upload_whenNotOwner_throwsForbidden() {
        UUID listingId = UUID.randomUUID();
        UUID sellerId = UUID.randomUUID();
        Listing l = listing(listingId, seller(UUID.randomUUID()));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(l));

        assertThatThrownBy(() ->
                imageService.uploadToListing(listingId, List.of(), sellerId, listingRepository))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("you do not own this listing");
    }

    @Test
    void upload_whenFileIsEmpty_throwsBadRequest() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing l = listing(listingId, seller(sellerId));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(l));

        MockMultipartFile emptyFile = new MockMultipartFile("file", new byte[0]);

        assertThatThrownBy(() ->
                imageService.uploadToListing(listingId, List.of(emptyFile), sellerId, listingRepository))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("file is empty");
    }

    @Test
    void upload_whenInvalidContentType_throwsBadRequest() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing l = listing(listingId, seller(sellerId));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(l));

        MockMultipartFile file = new MockMultipartFile(
                "file", "doc.pdf", "application/pdf", new byte[]{1, 2, 3});

        assertThatThrownBy(() ->
                imageService.uploadToListing(listingId, List.of(file), sellerId, listingRepository))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("unsupported file type");
    }

    @Test
    void upload_whenValidJpeg_savesFileAndReturnsUrl() throws IOException {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing l = listing(listingId, seller(sellerId));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(l));
        when(listingRepository.save(any())).thenReturn(l);

        MockMultipartFile file = new MockMultipartFile(
                "file", "photo.jpg", "image/jpeg", jpeg(100, 100));

        List<String> urls = imageService.uploadToListing(listingId, List.of(file), sellerId, listingRepository);

        assertThat(urls).hasSize(1);
        assertThat(urls.get(0)).startsWith("/uploads/listings/" + listingId);
        assertThat(urls.get(0)).endsWith(".jpg");
    }

    @Test
    void upload_whenOversizedImage_resizesToMaxDimensions() throws IOException {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing l = listing(listingId, seller(sellerId));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(l));
        when(listingRepository.save(any())).thenReturn(l);

        MockMultipartFile file = new MockMultipartFile(
                "file", "large.jpg", "image/jpeg", jpeg(2000, 1500));

        List<String> urls = imageService.uploadToListing(listingId, List.of(file), sellerId, listingRepository);

        String filename = urls.get(0).substring(urls.get(0).lastIndexOf('/') + 1);
        Path savedFile = tempDir.resolve("listings").resolve(listingId.toString()).resolve(filename);
        BufferedImage saved = ImageIO.read(savedFile.toFile());
        assertThat(saved.getWidth()).isLessThanOrEqualTo(1280);
        assertThat(saved.getHeight()).isLessThanOrEqualTo(1280);
    }
}
