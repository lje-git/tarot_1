import { TarotCard } from './types';

export const TAROT_DECK: TarotCard[] = [
  // Major Arcana
  { id: 1, name: "The Fool" }, { id: 2, name: "The Magician" }, { id: 3, name: "The High Priestess" },
  { id: 4, name: "The Empress" }, { id: 5, name: "The Emperor" }, { id: 6, name: "The Hierophant" },
  { id: 7, name: "The Lovers" }, { id: 8, name: "The Chariot" }, { id: 9, name: "Strength" },
  { id: 10, name: "The Hermit" }, { id: 11, name: "Wheel of Fortune" }, { id: 12, name: "Justice" },
  { id: 13, name: "The Hanged Man" }, { id: 14, name: "Death" }, { id: 15, name: "Temperance" },
  { id: 16, name: "The Devil" }, { id: 17, name: "The Tower" }, { id: 18, name: "The Star" },
  { id: 19, name: "The Moon" }, { id: 20, name: "The Sun" }, { id: 21, name: "Judgement" },
  { id: 22, name: "The World" },
  // Wands
  { id: 23, name: "Ace of Wands" }, { id: 24, name: "Two of Wands" }, { id: 25, name: "Three of Wands" },
  { id: 26, name: "Four of Wands" }, { id: 27, name: "Five of Wands" }, { id: 28, name: "Six of Wands" },
  { id: 29, name: "Seven of Wands" }, { id: 30, name: "Eight of Wands" }, { id: 31, name: "Nine of Wands" },
  { id: 32, name: "Ten of Wands" }, { id: 33, name: "Page of Wands" }, { id: 34, name: "Knight of Wands" },
  { id: 35, name: "Queen of Wands" }, { id: 36, name: "King of Wands" },
  // Cups
  { id: 37, name: "Ace of Cups" }, { id: 38, name: "Two of Cups" }, { id: 39, name: "Three of Cups" },
  { id: 40, name: "Four of Cups" }, { id: 41, name: "Five of Cups" }, { id: 42, name: "Six of Cups" },
  { id: 43, name: "Seven of Cups" }, { id: 44, name: "Eight of Cups" }, { id: 45, name: "Nine of Cups" },
  { id: 46, name: "Ten of Cups" }, { id: 47, name: "Page of Cups" }, { id: 48, name: "Knight of Cups" },
  { id: 49, name: "Queen of Cups" }, { id: 50, name: "King of Cups" },
  // Swords
  { id: 51, name: "Ace of Swords" }, { id: 52, name: "Two of Swords" }, { id: 53, name: "Three of Swords" },
  { id: 54, name: "Four of Swords" }, { id: 55, name: "Five of Swords" }, { id: 56, name: "Six of Swords" },
  { id: 57, name: "Seven of Swords" }, { id: 58, name: "Eight of Swords" }, { id: 59, name: "Nine of Swords" },
  { id: 60, name: "Ten of Swords" }, { id: 61, name: "Page of Swords" }, { id: 62, name: "Knight of Swords" },
  { id: 63, name: "Queen of Swords" }, { id: 64, name: "King of Swords" },
  // Pentacles
  { id: 65, name: "Ace of Pentacles" }, { id: 66, name: "Two of Pentacles" }, { id: 67, name: "Three of Pentacles" },
  { id: 68, name: "Four of Pentacles" }, { id: 69, name: "Five of Pentacles" }, { id: 70, name: "Six of Pentacles" },
  { id: 71, name: "Seven of Pentacles" }, { id: 72, name: "Eight of Pentacles" }, { id: 73, name: "Nine of Pentacles" },
  { id: 74, name: "Ten of Pentacles" }, { id: 75, name: "Page of Pentacles" }, { id: 76, name: "Knight of Pentacles" },
  { id: 77, name: "Queen of Pentacles" }, { id: 78, name: "King of Pentacles" }
];

export const CELTIC_CROSS_POSITIONS: string[] = [
  "Present Situation",
  "Challenge/Cross",
  "Distant Past/Root",
  "Recent Past",
  "Possible Outcome",
  "Immediate Future",
  "Your Approach",
  "External Influences",
  "Hopes & Fears",
  "Final Outcome"
];
