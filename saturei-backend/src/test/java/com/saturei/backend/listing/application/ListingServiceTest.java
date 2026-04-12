package com.saturei.backend.listing.application;

import com.saturei.backend.listing.application.dto.CreateListingRequest;
import com.saturei.backend.listing.application.dto.ListingResponse;
import com.saturei.backend.listing.application.dto.SearchListingRequest;
import com.saturei.backend.listing.application.dto.UpdateListingRequest;
import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.domain.ListingRepository;
import com.saturei.backend.listing.domain.ListingStatus;
import com.saturei.backend.listing.domain.vo.ConservationState;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ListingServiceTest {

    @Mock ListingRepository listingRepository;
    @Mock UserRepository userRepository;
    @InjectMocks ListingService listingService;

    private User seller(UUID id) {
        return User.builder().id(id).name("Seller").email("s@test.com").password("pass").build();
    }

    private Listing listing(UUID id, User seller) {
        return Listing.builder()
                .id(id)
                .seller(seller)
                .title("Item")
                .description("Desc")
                .price(new BigDecimal("99.99"))
                .conservationState(ConservationState.USED)
                .status(ListingStatus.ACTIVE)
                .build();
    }

    @Test
    void create_whenSellerExists_savesAndReturnsResponse() {
        UUID sellerId = UUID.randomUUID();
        User seller = seller(sellerId);
        Listing saved = listing(UUID.randomUUID(), seller);

        when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
        when(listingRepository.save(any())).thenReturn(saved);

        CreateListingRequest req = new CreateListingRequest(
                "Item", "Desc", new BigDecimal("99.99"), ConservationState.USED, "Electronics", "SP");

        ListingResponse response = listingService.create(req, sellerId);

        assertThat(response.sellerId()).isEqualTo(sellerId);
        assertThat(response.title()).isEqualTo("Item");
        verify(listingRepository).save(any());
    }

    @Test
    void create_whenSellerNotFound_throwsNotFound() {
        UUID sellerId = UUID.randomUUID();
        when(userRepository.findById(sellerId)).thenReturn(Optional.empty());

        CreateListingRequest req = new CreateListingRequest(
                "Item", "Desc", new BigDecimal("99.99"), ConservationState.USED, null, null);

        assertThatThrownBy(() -> listingService.create(req, sellerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("user not found");
    }

    @Test
    void update_whenOwned_updatesNonNullFields() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        User seller = seller(sellerId);
        Listing existing = listing(listingId, seller);

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));
        when(listingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        UpdateListingRequest req = new UpdateListingRequest(
                "New Title", null, new BigDecimal("150.00"), null, null, "RJ");

        ListingResponse response = listingService.update(listingId, req, sellerId);

        assertThat(response.title()).isEqualTo("New Title");
        assertThat(response.price()).isEqualTo(new BigDecimal("150.00"));
        assertThat(response.location()).isEqualTo("RJ");
        assertThat(response.description()).isEqualTo("Desc");
    }

    @Test
    void update_whenListingNotFound_throwsNotFound() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        when(listingRepository.findById(listingId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> listingService.update(
                listingId, new UpdateListingRequest(null, null, null, null, null, null), sellerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("listing not found");
    }

    @Test
    void update_whenNotOwner_throwsForbidden() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing existing = listing(listingId, seller(UUID.randomUUID()));

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> listingService.update(
                listingId, new UpdateListingRequest(null, null, null, null, null, null), sellerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("you do not own this listing");
    }

    @Test
    void updateStatus_whenOwned_updatesStatus() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing existing = listing(listingId, seller(sellerId));

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));
        when(listingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ListingResponse response = listingService.updateStatus(listingId, ListingStatus.PAUSED, sellerId);

        assertThat(response.status()).isEqualTo(ListingStatus.PAUSED);
    }

    @Test
    void updateStatus_whenNotOwner_throwsForbidden() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing existing = listing(listingId, seller(UUID.randomUUID()));

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> listingService.updateStatus(listingId, ListingStatus.PAUSED, sellerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("you do not own this listing");
    }

    @Test
    void delete_whenOwned_deletesListing() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing existing = listing(listingId, seller(sellerId));

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));

        listingService.delete(listingId, sellerId);

        verify(listingRepository).delete(existing);
    }

    @Test
    void delete_whenNotOwner_throwsForbidden() {
        UUID sellerId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        Listing existing = listing(listingId, seller(UUID.randomUUID()));

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> listingService.delete(listingId, sellerId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("you do not own this listing");
        verify(listingRepository, never()).delete(any());
    }

    @Test
    void getById_whenFound_returnsResponse() {
        UUID listingId = UUID.randomUUID();
        UUID sellerId = UUID.randomUUID();
        Listing existing = listing(listingId, seller(sellerId));

        when(listingRepository.findById(listingId)).thenReturn(Optional.of(existing));

        ListingResponse response = listingService.getById(listingId);

        assertThat(response.id()).isEqualTo(listingId);
    }

    @Test
    void getById_whenNotFound_throwsNotFound() {
        UUID listingId = UUID.randomUUID();
        when(listingRepository.findById(listingId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> listingService.getById(listingId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("listing not found");
    }

    @Test
    void listBySeller_delegatesToRepository() {
        UUID sellerId = UUID.randomUUID();
        Listing l = listing(UUID.randomUUID(), seller(sellerId));
        Pageable pageable = Pageable.unpaged();

        when(listingRepository.findBySellerId(sellerId, pageable))
                .thenReturn(new PageImpl<>(List.of(l)));

        Page<ListingResponse> result = listingService.listBySeller(sellerId, pageable);

        assertThat(result).hasSize(1);
        verify(listingRepository).findBySellerId(sellerId, pageable);
    }

    @Test
    void search_delegatesToRepositoryWithAllParams() {
        UUID sellerId = UUID.randomUUID();
        Listing l = listing(UUID.randomUUID(), seller(sellerId));
        Pageable pageable = Pageable.unpaged();
        SearchListingRequest req = new SearchListingRequest(
                "bike", "Sports", "SP", new BigDecimal("50"), new BigDecimal("200"));

        when(listingRepository.search("bike", "Sports", "SP",
                new BigDecimal("50"), new BigDecimal("200"), pageable))
                .thenReturn(new PageImpl<>(List.of(l)));

        Page<ListingResponse> result = listingService.search(req, pageable);

        assertThat(result).hasSize(1);
        verify(listingRepository).search(
                "bike", "Sports", "SP", new BigDecimal("50"), new BigDecimal("200"), pageable);
    }
}
