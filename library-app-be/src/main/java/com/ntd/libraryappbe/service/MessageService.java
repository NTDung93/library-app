package com.ntd.libraryappbe.service;

import com.ntd.libraryappbe.dao.MessageRepository;
import com.ntd.libraryappbe.entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MessageService {
    private MessageRepository messageRepository;
    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail) {
        Message newMessage = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        newMessage.setUserEmail(userEmail);
        messageRepository.save(newMessage);
    }
}
