package com.cribbagegame.model;

public class CardImpl implements Card {
  private int value;
  private int run_order;
  private String suit;
  private String name;
  public CardImpl(int value, int run_order, String suit, String name){
    if (name == null && !(suit == null
            || suit.equals("club")
            || suit.equals("diamond")
            || suit.equals("heart")
            || suit.equals("spade"))) {
      throw new IllegalArgumentException("Illegal Card Suit");
    }
    if (value < 1 || value > 10) {
      throw new IllegalArgumentException("Illegal Card Value");
    }
    this.value = value;
    this.run_order = run_order;
    this.suit = suit;
    this.name = name;
  }
  @Override
  public int getValue(){
    return this.value;
  }
  @Override
  public int getRun_order(){
    return this.run_order;
  }
  @Override
  public String getSuit(){
    return this.suit;
  }
  @Override
  public String getName(){
    return this.name;
  }
}
