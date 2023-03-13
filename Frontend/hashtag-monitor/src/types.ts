/*Alias*/

export {};

export type Settings = {
    hashtag: string,
    tweetAmount: number,
    dateSince: string
  }
  
export type Update = {
    status: string,
    current_tweet: number
  }
  
 export type Node = {
    id: string;
    name: string,
    value: number
  }
  
export type Link = {
    source: string,
    target: string,
    color: string
  }
  
 export interface NetworkData {
      "nodes": Node [],
      "links": Link [],
  }

