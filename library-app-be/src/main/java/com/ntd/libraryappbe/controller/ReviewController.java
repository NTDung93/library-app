package com.ntd.libraryappbe.controller;

import com.ntd.libraryappbe.requestmodels.ReviewRequest;
import com.ntd.libraryappbe.service.ReviewService;
import com.ntd.libraryappbe.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://localhost:3000")
@RestController
@RequestMapping(path = "api/reviews")
public class ReviewController {
    private ReviewService reviewService;
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/user/book")
    public boolean reviewBookByUser(@RequestHeader(value = "Authorization") String token,
                                    @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, bookId);
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }
}
