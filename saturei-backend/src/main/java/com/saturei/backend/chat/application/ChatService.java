package com.saturei.backend.chat.application;

import com.saturei.backend.chat.infrastructure.persistence.JpaConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final JpaConversationRepository conversationRepository;

    // TODO: implement startConversation, sendMessage, getMessages, listConversations
}
