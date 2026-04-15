package com.saturei.backend.listing.domain;

import com.saturei.backend.listing.domain.vo.ConservationState;
import com.saturei.backend.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ListingRepositoryTest {

    @Autowired
    TestEntityManager em;

    @Autowired
    ListingRepository listingRepository;

    private User seller;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        seller = em.persist(User.builder()
                .email("seller@test.com")
                .password("hash")
                .name("Seller")
                .createdAt(LocalDateTime.now())
                .build());

        pageable = PageRequest.of(0, 10);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────────────────────────────

    private Listing persist(String title, String category, String location,
                            BigDecimal price, ListingStatus status) {
        return em.persist(Listing.builder()
                .seller(seller)
                .title(title)
                .description("Description of " + title)
                .price(price)
                .conservationState(ConservationState.USED)
                .status(status)
                .category(category)
                .location(location)
                .createdAt(LocalDateTime.now())
                .build());
    }

    // ────────────────────────────────────────────────────────────────────────
    // findBySellerId
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void findBySellerId_returnsOnlyListingsOwnedBySeller() {
        User otherSeller = em.persist(User.builder()
                .email("other@test.com")
                .password("hash")
                .name("Other")
                .createdAt(LocalDateTime.now())
                .build());

        persist("My Listing", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        em.persist(Listing.builder()
                .seller(otherSeller)
                .title("Other's Listing")
                .price(new BigDecimal("50.00"))
                .conservationState(ConservationState.NEW)
                .status(ListingStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build());

        em.flush();

        Page<Listing> result = listingRepository.findBySellerId(seller.getId(), pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("My Listing");
    }

    @Test
    void findBySellerId_whenSellerHasNoListings_returnsEmpty() {
        em.flush();

        Page<Listing> result = listingRepository.findBySellerId(seller.getId(), pageable);

        assertThat(result.getContent()).isEmpty();
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — keyword
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_withKeyword_returnsMatchingTitleOrDescription() {
        persist("Mountain Bike", "Sports", "SP", new BigDecimal("500.00"), ListingStatus.ACTIVE);
        persist("City Bike", "Sports", "RJ", new BigDecimal("300.00"), ListingStatus.ACTIVE);
        persist("Laptop", "Electronics", "SP", new BigDecimal("2000.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search("bike", null, null, null, null, pageable);

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).extracting(Listing::getTitle)
                .containsExactlyInAnyOrder("Mountain Bike", "City Bike");
    }

    @Test
    void search_isCaseInsensitive() {
        persist("Mountain Bike", "Sports", "SP", new BigDecimal("500.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> upper = listingRepository.search("BIKE", null, null, null, null, pageable);
        Page<Listing> lower = listingRepository.search("bike", null, null, null, null, pageable);

        assertThat(upper.getTotalElements()).isEqualTo(lower.getTotalElements()).isEqualTo(1);
    }

    @Test
    void search_withNullKeyword_returnsAllActiveListings() {
        persist("Item A", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Item B", "Sports", "RJ", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        persist("Item C", "Books", "MG", new BigDecimal("50.00"), ListingStatus.PAUSED);
        em.flush();

        Page<Listing> result = listingRepository.search(null, null, null, null, null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(2);
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — status filter (only ACTIVE listings)
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_excludesNonActiveListings() {
        persist("Active Item", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Paused Item", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.PAUSED);
        persist("Sold Item", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.SOLD);
        em.flush();

        Page<Listing> result = listingRepository.search(null, null, null, null, null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Active Item");
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — category filter
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_withCategory_returnsOnlyMatchingCategory() {
        persist("Bike", "Sports", "SP", new BigDecimal("300.00"), ListingStatus.ACTIVE);
        persist("Laptop", "Electronics", "SP", new BigDecimal("2000.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search(null, "Sports", null, null, null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Bike");
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — location filter
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_withLocation_returnsOnlyMatchingLocation() {
        persist("Item SP", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Item RJ", "Electronics", "RJ", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search(null, null, "SP", null, null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getLocation()).isEqualTo("SP");
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — price filters
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_withMinPrice_returnsListingsAtOrAboveMinPrice() {
        persist("Cheap Item", "Electronics", "SP", new BigDecimal("50.00"), ListingStatus.ACTIVE);
        persist("Mid Item", "Electronics", "SP", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        persist("Expensive Item", "Electronics", "SP", new BigDecimal("1000.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search(null, null, null, new BigDecimal("200.00"), null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent()).extracting(Listing::getTitle)
                .containsExactlyInAnyOrder("Mid Item", "Expensive Item");
    }

    @Test
    void search_withMaxPrice_returnsListingsAtOrBelowMaxPrice() {
        persist("Cheap Item", "Electronics", "SP", new BigDecimal("50.00"), ListingStatus.ACTIVE);
        persist("Mid Item", "Electronics", "SP", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        persist("Expensive Item", "Electronics", "SP", new BigDecimal("1000.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search(null, null, null, null, new BigDecimal("200.00"), pageable);

        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent()).extracting(Listing::getTitle)
                .containsExactlyInAnyOrder("Cheap Item", "Mid Item");
    }

    @Test
    void search_withPriceRange_returnsListingsWithinRange() {
        persist("Cheap Item", "Electronics", "SP", new BigDecimal("50.00"), ListingStatus.ACTIVE);
        persist("Mid Item", "Electronics", "SP", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        persist("Expensive Item", "Electronics", "SP", new BigDecimal("1000.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search(
                null, null, null, new BigDecimal("100.00"), new BigDecimal("500.00"), pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Mid Item");
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — combined filters
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_withAllFilters_returnsOnlyMatchingListing() {
        persist("Mountain Bike", "Sports", "SP", new BigDecimal("500.00"), ListingStatus.ACTIVE);
        persist("City Bike", "Sports", "RJ", new BigDecimal("300.00"), ListingStatus.ACTIVE);
        persist("Road Bike", "Sports", "SP", new BigDecimal("1500.00"), ListingStatus.ACTIVE);
        persist("Laptop", "Electronics", "SP", new BigDecimal("500.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search(
                "bike", "Sports", "SP", new BigDecimal("100.00"), new BigDecimal("800.00"), pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Mountain Bike");
    }

    @Test
    void search_withNoMatchingFilters_returnsEmpty() {
        persist("Laptop", "Electronics", "SP", new BigDecimal("2000.00"), ListingStatus.ACTIVE);
        em.flush();

        Page<Listing> result = listingRepository.search("bike", null, null, null, null, pageable);

        assertThat(result.getContent()).isEmpty();
    }

    // ────────────────────────────────────────────────────────────────────────
    // search — pagination
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void search_returnsPaginatedResults() {
        for (int i = 1; i <= 5; i++) {
            persist("Item " + i, "Electronics", "SP",
                    new BigDecimal(String.valueOf(i * 100)), ListingStatus.ACTIVE);
        }
        em.flush();

        Page<Listing> firstPage = listingRepository.search(null, null, null, null, null, PageRequest.of(0, 2));
        Page<Listing> secondPage = listingRepository.search(null, null, null, null, null, PageRequest.of(1, 2));

        assertThat(firstPage.getTotalElements()).isEqualTo(5);
        assertThat(firstPage.getContent()).hasSize(2);
        assertThat(secondPage.getContent()).hasSize(2);
        assertThat(firstPage.getContent()).doesNotContainAnyElementsOf(secondPage.getContent());
    }

    // ────────────────────────────────────────────────────────────────────────
    // findDistinctCategories
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void findDistinctCategories_returnsOnlyActiveListingCategories() {
        persist("Item A", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Item B", "Sports", "RJ", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        persist("Item C", "Books", "MG", new BigDecimal("50.00"), ListingStatus.PAUSED);
        em.flush();

        List<String> categories = listingRepository.findDistinctCategories();

        assertThat(categories).containsExactly("Electronics", "Sports");
        assertThat(categories).doesNotContain("Books");
    }

    @Test
    void findDistinctCategories_returnsNoDuplicates() {
        persist("Item A", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Item B", "Electronics", "RJ", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        em.flush();

        List<String> categories = listingRepository.findDistinctCategories();

        assertThat(categories).hasSize(1).containsExactly("Electronics");
    }

    @Test
    void findDistinctCategories_excludesNullCategories() {
        persist("Item A", null, "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        em.flush();

        List<String> categories = listingRepository.findDistinctCategories();

        assertThat(categories).isEmpty();
    }

    // ────────────────────────────────────────────────────────────────────────
    // findDistinctLocations
    // ────────────────────────────────────────────────────────────────────────

    @Test
    void findDistinctLocations_returnsOnlyActiveListingLocations() {
        persist("Item A", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Item B", "Sports", "RJ", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        persist("Item C", "Books", "MG", new BigDecimal("50.00"), ListingStatus.PAUSED);
        em.flush();

        List<String> locations = listingRepository.findDistinctLocations();

        assertThat(locations).containsExactly("RJ", "SP");
        assertThat(locations).doesNotContain("MG");
    }

    @Test
    void findDistinctLocations_returnsNoDuplicates() {
        persist("Item A", "Electronics", "SP", new BigDecimal("100.00"), ListingStatus.ACTIVE);
        persist("Item B", "Sports", "SP", new BigDecimal("200.00"), ListingStatus.ACTIVE);
        em.flush();

        List<String> locations = listingRepository.findDistinctLocations();

        assertThat(locations).hasSize(1).containsExactly("SP");
    }

    @Test
    void findDistinctLocations_excludesNullLocations() {
        persist("Item A", "Electronics", null, new BigDecimal("100.00"), ListingStatus.ACTIVE);
        em.flush();

        List<String> locations = listingRepository.findDistinctLocations();

        assertThat(locations).isEmpty();
    }
}
