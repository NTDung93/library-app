package com.ntd.libraryappbe.dao;

import com.ntd.libraryappbe.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
