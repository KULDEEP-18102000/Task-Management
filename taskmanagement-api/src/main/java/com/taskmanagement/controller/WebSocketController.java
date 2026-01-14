package com.taskmanagement.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/user/status")
    @SendTo("/topic/user/status")
    public Map<String, Object> userStatus(Map<String, Object> status) {
        log.info("User status update: {}", status);
        return status;
    }
    
    @MessageMapping("/typing")
    public void typing(Map<String, Object> message) {
        Long taskId = ((Number) message.get("taskId")).longValue();
        messagingTemplate.convertAndSend("/topic/task/" + taskId + "/typing", message);
    }
}
