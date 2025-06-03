export interface TarotCard {
  id: number;
  name: string;
}

export enum ReadingStep {
  PreDraw,
  Drawing, // User draws cards one by one
  QuestionTime, // All cards drawn, user enters question
  InterpretationReady,
}
