package com.cribbagegame.model;

import java.util.ArrayList;

public class HandImpl implements Hand{
    private ArrayList<Card> cards;
    public HandImpl(ArrayList<Card> cards){

        this.cards = cards;
    }
    @Override
    public int getPoints(Card cut_card){
        int points = 0;
        points += this.fifteens_pairs(cut_card);
        points += this.same_suit(cut_card);
        return points;
    }
    @Override
    public int fifteens_pairs(Card cut_card){
        int points = 0;
        for(int i = 0; i < this.cards.size(); i++){
            for(int j = i + 1; j < this.cards.size(); j++){
                if(this.cards.get(i).getValue() + this.cards.get(j).getValue() == 15){
                    points += 2;
                }
                if(this.cards.get(i).getName() == this.cards.get(j).getName()){
                    points += 2;
                }
            }
            if(cut_card.getValue() + this.cards.get(i).getValue() == 15){
                points += 2;
            }
            if(this.cards.get(i).getName() == cut_card.getName()){
                points += 2;
            }
        }
        return points;
    }
    @Override
    public int same_suit(Card cut_card){
        String suit = this.cards.get(0).getSuit();
        boolean same_suit = true;
        for(int i = 1; i < this.cards.size(); i++){
            if(this.cards.get(i).getSuit() != suit){
                same_suit = false;
            }
        }
        if(same_suit){
            if(suit == cut_card.getSuit()){
                return 5;
            }
            return 4;
        }
        return 0;
    }
    @Override
    public int runs(Card cut_card){
        return 0;
    }
}
