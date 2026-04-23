package com.saturei.backend.chat.application;

import com.saturei.backend.chat.application.dto.ConversationResponse;
import com.saturei.backend.chat.application.dto.MessageResponse;
import com.saturei.backend.chat.application.dto.SendMessageRequest;
import com.saturei.backend.chat.application.dto.StartConversationRequest;
import com.saturei.backend.chat.domain.Conversation;
import com.saturei.backend.chat.infrastructure.persistence.JpaConversationRepository;
import com.saturei.backend.listing.domain.Listing;
import com.saturei.backend.listing.infrastructure.persistence.JpaListingRepository;
import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private JpaConversationRepository conversationRepository;

    @Mock
    private JpaUserRepository userRepository;

    @Mock
    private JpaListingRepository listingRepository;

    @InjectMocks
    private ChatService chatService;

    private User buyer;
    private User seller;
    private Listing listing;
    private UUID listingId;
    private UUID buyerId;
    private UUID sellerId;

    @BeforeEach
    void setUp() {
        buyerId = UUID.randomUUID();
        sellerId = UUID.randomUUID();
        listingId = UUID.randomUUID();

        buyer = mock(User.class);
        lenient().when(buyer.getId()).thenReturn(buyerId);

        seller = mock(User.class);
        lenient().when(seller.getId()).thenReturn(sellerId);

        listing = mock(Listing.class);
        lenient().when(listing.getId()).thenReturn(listingId);
        lenient().when(listing.getSeller()).thenReturn(seller);
        lenient().when(listing.getTitle()).thenReturn("Test Listing");
    }

    @Test
    void startConversation_shouldCreateNewConversation_whenNotExists() {
        StartConversationRequest request = new StartConversationRequest(listingId, "Hello");

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(buyer));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(listing));
        when(conversationRepository.findByBuyerIdAndSellerIdAndListingId(buyerId, sellerId, listingId))
                .thenReturn(Optional.empty());

        when(conversationRepository.save(any(Conversation.class))).thenAnswer(i -> {
            Conversation saved = i.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        ConversationResponse response = chatService.startConversation(request, buyerId);

        assertNotNull(response);
        assertEquals(buyerId, response.buyerId());
        assertEquals(sellerId, response.sellerId());
        assertEquals(listingId, response.listingId());
        verify(conversationRepository).save(any(Conversation.class));
    }

    @Test
    void startConversation_shouldReturnExistingConversation_whenAlreadyExists() {
        StartConversationRequest request = new StartConversationRequest(listingId, "Hello again");
        Conversation existingConversation = Conversation.builder()
                .id(UUID.randomUUID())
                .buyer(buyer)
                .seller(seller)
                .listing(listing)
                .messages(new ArrayList<>())
                .build();

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(buyer));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(listing));
        when(conversationRepository.findByBuyerIdAndSellerIdAndListingId(buyerId, sellerId, listingId))
                .thenReturn(Optional.of(existingConversation));

        ConversationResponse response = chatService.startConversation(request, buyerId);

        assertNotNull(response);
        assertEquals(existingConversation.getId(), response.id());
        verify(conversationRepository, never()).save(any(Conversation.class));
    }

    @Test
    void startConversation_shouldThrowException_whenBuyerIsSeller() {
        StartConversationRequest request = new StartConversationRequest(listingId, "Hello");

        when(userRepository.findById(sellerId)).thenReturn(Optional.of(seller));
        when(listingRepository.findById(listingId)).thenReturn(Optional.of(listing));

        ApiException exception = assertThrows(ApiException.class, () -> chatService.startConversation(request, sellerId));
        assertEquals("You cannot start a conversation with yourself", exception.getMessage());
    }

    @Test
    void sendMessage_shouldAddMessage_whenUserIsParticipant() {
        UUID convId = UUID.randomUUID();
        SendMessageRequest request = new SendMessageRequest(convId, "New message");

        Conversation conversation = Conversation.builder()
                .id(convId)
                .buyer(buyer)
                .seller(seller)
                .listing(listing)
                .messages(new ArrayList<>())
                .build();

        when(userRepository.findById(buyerId)).thenReturn(Optional.of(buyer));
        when(conversationRepository.findById(convId)).thenReturn(Optional.of(conversation));

        MessageResponse response = chatService.sendMessage(request, buyerId);

        assertNotNull(response);
        assertEquals("New message", response.content());
        assertEquals(1, conversation.getMessages().size());
        verify(conversationRepository).save(conversation);
    }

    @Test
    void sendMessage_shouldThrowException_whenUserIsNotParticipant() {
        UUID convId = UUID.randomUUID();
        UUID otherUserId = UUID.randomUUID();
        User otherUser = mock(User.class);

        SendMessageRequest request = new SendMessageRequest(convId, "Nosy message");

        Conversation conversation = Conversation.builder()
                .id(convId)
                .buyer(buyer)
                .seller(seller)
                .listing(listing)
                .messages(new ArrayList<>())
                .build();

        when(userRepository.findById(otherUserId)).thenReturn(Optional.of(otherUser));
        when(conversationRepository.findById(convId)).thenReturn(Optional.of(conversation));

        ApiException exception = assertThrows(ApiException.class, () -> chatService.sendMessage(request, otherUserId));
        assertTrue(exception.getMessage().contains("you are not part of this conversation"));
    }
}
