package com.saturei.backend.chat.infrastructure.web;

import com.saturei.backend.chat.application.ChatService;
import com.saturei.backend.chat.application.dto.ConversationResponse;
import com.saturei.backend.chat.application.dto.MessageResponse;
import com.saturei.backend.chat.application.dto.SendMessageRequest;
import com.saturei.backend.chat.application.dto.StartConversationRequest;
import com.saturei.backend.user.application.UserService;
import com.saturei.backend.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> startConversation(@AuthenticationPrincipal User user,
                                                                   @Valid @RequestBody StartConversationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.startConversation(request, user.getId()));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> listConversations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.listConversations(user.getId()));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageResponse> sendMessage(@AuthenticationPrincipal User user,
                                                       @Valid @RequestBody SendMessageRequest request) {
        MessageResponse response = chatService.sendMessage(request, user.getId());
        messagingTemplate.convertAndSend("/topic/conversations/" + request.conversationId(), response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessageWebSocket(@Payload @Valid SendMessageRequest request, Principal principal) {
        User user = userService.getProfileByEmail(principal.getName());
        MessageResponse response = chatService.sendMessage(request, user.getId());
        messagingTemplate.convertAndSend("/topic/conversations/" + request.conversationId(), response);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(@AuthenticationPrincipal User user,
                                                              @PathVariable UUID conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId, user.getId()));
    }
}
