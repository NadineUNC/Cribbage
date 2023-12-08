package com.cribbagegame.model;

import java.util.ArrayList;
import java.util.List;

public interface Hand {
    int getPoints(Card cut_card);
    int fifteens_pairs(Card cut_card);
    int same_suit(Card cut_card);
    int runs(Card cut_card);
}
